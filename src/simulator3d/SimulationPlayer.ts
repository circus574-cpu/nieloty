/**
 * Kontroler odtwarzania symulacji CNC (SimulationPlayer):
 * - Obsługuje odtwarzanie ciągłe (Play / Pauza),
 * - Wykonywanie krokowe po liniach kodu ("Następna linia" / "Poprzednia linia"),
 * - Przewijanie suwakiem (Scrubbing 0..100%),
 * - Regulację prędkości symulacji (0.25x .. 10x),
 * - Przyrostową aktualizację modelu materiału (HeightmapMaterialModel) w czasie rzeczywistym.
 */

import { sampleAnalyticalArcSegment } from '../core/gcode/arcs';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';
import type {
  InterpreterResult,
  ModalState,
  MotionSegment,
} from '../core/types/interpreter';
import type {
  MachineConfig,
  PrismaticStock,
  Vector5D,
} from '../core/types/machine';

export interface PlayerFrameState {
  isPlaying: boolean;
  speedMultiplier: number;
  currentSegmentIndex: number;
  segmentProgressT: number; // 0..1 wewnątrz bieżącego odcinka
  overallProgress: number;  // 0..1 całego programu
  activeLineNumber: number | null;
  currentPositionWcs: Vector5D;
  currentModalState: ModalState;
  elapsedTimeSeconds: number;
  totalTimeSeconds: number;
  heightmapModel: HeightmapMaterialModel;
}

export type PlayerUpdateListener = (state: PlayerFrameState) => void;

export class SimulationPlayer {
  private machineConfig: MachineConfig;
  private interpreterResult: InterpreterResult | null = null;
  private liveHeightmap: HeightmapMaterialModel;
  private appliedSegmentCount = 0;

  private isPlaying = false;
  private speedMultiplier = 1.0;
  private currentSegmentIndex = 0;
  private segmentProgressT = 0;
  private rafId: number | null = null;
  private lastFrameTimestamp = 0;
  private listeners: PlayerUpdateListener[] = [];

  constructor(machineConfig: MachineConfig, stock: PrismaticStock) {
    this.machineConfig = machineConfig;
    this.liveHeightmap = new HeightmapMaterialModel(stock);
  }

  public onUpdate(listener: PlayerUpdateListener): void {
    this.listeners.push(listener);
  }

  public loadProgramResult(
    result: InterpreterResult,
    machineConfig: MachineConfig,
    stock: PrismaticStock
  ): void {
    this.pause();
    this.interpreterResult = result;
    this.machineConfig = machineConfig;
    this.liveHeightmap = new HeightmapMaterialModel(stock);
    this.appliedSegmentCount = 0;
    this.currentSegmentIndex = 0;
    this.segmentProgressT = 0;
    this.notifyListeners();
  }

  public play(): void {
    if (!this.interpreterResult || this.interpreterResult.segments.length === 0) {
      return;
    }
    // Jeśli jesteśmy na samym końcu, zacznij od początku
    if (
      this.currentSegmentIndex >= this.interpreterResult.segments.length - 1 &&
      this.segmentProgressT >= 0.999
    ) {
      this.reset();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.lastFrameTimestamp = performance.now();
    this.scheduleNextFrame();
    this.notifyListeners();
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notifyListeners();
  }

  public reset(): void {
    this.pause();
    this.liveHeightmap.reset();
    this.appliedSegmentCount = 0;
    this.currentSegmentIndex = 0;
    this.segmentProgressT = 0;
    this.notifyListeners();
  }

  public setSpeedMultiplier(speed: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(20, speed));
    this.notifyListeners();
  }

  /**
   * Przechodzi natychmiast do końca całego programu (pokazuje końcowy efekt obróbki).
   */
  public jumpToEnd(): void {
    this.pause();
    const segs = this.interpreterResult?.segments ?? [];
    if (segs.length === 0) {
      this.notifyListeners();
      return;
    }
    this.syncHeightmapUpToSegment(segs.length);
    this.currentSegmentIndex = segs.length - 1;
    this.segmentProgressT = 1.0;
    this.notifyListeners();
  }

  /**
   * Wykonanie krokowe: przechodzi do końca następnej linii programu G-code zawierającej ruch.
   */
  public stepNextLine(): void {
    this.pause();
    const segs = this.interpreterResult?.segments ?? [];
    if (segs.length === 0) return;

    // Jeśli bieżący odcinek nie jest jeszcze ukończony, dokończ wszystkie odcinki z tej samej linii
    let targetIdx = this.currentSegmentIndex;

    if (this.segmentProgressT >= 0.999) {
      if (targetIdx < segs.length - 1) {
        targetIdx++;
      } else {
        return;
      }
    }

    const targetLine = segs[targetIdx]!.lineNumber;
    while (
      targetIdx + 1 < segs.length &&
      segs[targetIdx + 1]!.lineNumber === targetLine
    ) {
      targetIdx++;
    }

    this.syncHeightmapUpToSegment(targetIdx + 1);
    this.currentSegmentIndex = targetIdx;
    this.segmentProgressT = 1.0;
    this.notifyListeners();
  }

  /**
   * Cofa wykonanie o jeden krok (jedną linię ruchu wstecz).
   */
  public stepPrevLine(): void {
    this.pause();
    const segs = this.interpreterResult?.segments ?? [];
    if (segs.length === 0) return;

    let targetIdx = this.currentSegmentIndex;
    const currentLine = segs[targetIdx]!.lineNumber;

    // Cofnij się przed wszystkie odcinki bieżącej linii
    while (targetIdx > 0 && segs[targetIdx]!.lineNumber === currentLine) {
      targetIdx--;
    }

    if (targetIdx === 0 && segs[0]!.lineNumber === currentLine) {
      this.reset();
      return;
    }

    this.syncHeightmapUpToSegment(targetIdx + 1);
    this.currentSegmentIndex = targetIdx;
    this.segmentProgressT = 1.0;
    this.notifyListeners();
  }

  /**
   * Przewija symulację do zadanego ułamka (0..1) liczby odcinków.
   */
  public seekToOverallProgress(progress01: number): void {
    this.pause();
    const segs = this.interpreterResult?.segments ?? [];
    if (segs.length === 0) return;

    const clamped = Math.max(0, Math.min(1, progress01));
    const exactFloatIdx = clamped * segs.length;
    const targetCompletedCount = Math.floor(exactFloatIdx);

    this.syncHeightmapUpToSegment(targetCompletedCount);
    if (targetCompletedCount >= segs.length) {
      this.currentSegmentIndex = segs.length - 1;
      this.segmentProgressT = 1.0;
    } else {
      this.currentSegmentIndex = targetCompletedCount;
      this.segmentProgressT = exactFloatIdx - targetCompletedCount;
    }
    this.notifyListeners();
  }

  private scheduleNextFrame(): void {
    this.rafId = requestAnimationFrame((now) => this.tick(now));
  }

  private tick(now: number): void {
    if (!this.isPlaying || !this.interpreterResult) return;

    const dtReal = Math.min(0.1, (now - this.lastFrameTimestamp) / 1000);
    this.lastFrameTimestamp = now;

    const segs = this.interpreterResult.segments;
    if (segs.length === 0) {
      this.pause();
      return;
    }

    let remainingSimSeconds = dtReal * this.speedMultiplier;

    while (remainingSimSeconds > 0 && this.currentSegmentIndex < segs.length) {
      const seg = segs[this.currentSegmentIndex]!;
      // Minimalny wizualny czas odcinka 0.15 s, by nawet bardzo krótkie ruchy G0 były widoczne w animacji
      const segVisualDuration = Math.max(0.15, Math.min(seg.durationSeconds, 2.5));
      const timeLeftInSeg = segVisualDuration * (1 - this.segmentProgressT);

      if (remainingSimSeconds >= timeLeftInSeg) {
        remainingSimSeconds -= timeLeftInSeg;
        this.syncHeightmapUpToSegment(this.currentSegmentIndex + 1);
        if (this.currentSegmentIndex < segs.length - 1) {
          this.currentSegmentIndex++;
          this.segmentProgressT = 0;
        } else {
          this.segmentProgressT = 1.0;
          this.isPlaying = false;
          break;
        }
      } else {
        this.segmentProgressT += remainingSimSeconds / segVisualDuration;
        remainingSimSeconds = 0;
      }
    }

    this.notifyListeners();
    if (this.isPlaying) {
      this.scheduleNextFrame();
    }
  }

  private syncHeightmapUpToSegment(completedCount: number): void {
    const segs = this.interpreterResult?.segments ?? [];
    const target = Math.max(0, Math.min(segs.length, completedCount));

    if (target < this.appliedSegmentCount) {
      this.liveHeightmap.reset();
      this.appliedSegmentCount = 0;
    }

    while (this.appliedSegmentCount < target) {
      const seg = segs[this.appliedSegmentCount]!;
      const tool = this.machineConfig.tools.find(
        (t) => t.pocketNumber === seg.toolPocket
      );
      this.liveHeightmap.applySegment(seg, tool);
      this.appliedSegmentCount++;
    }
  }

  private interpolateSegmentPosition(
    seg: MotionSegment,
    t: number
  ): Vector5D {
    const clampedT = Math.max(0, Math.min(1, t));
    if (
      (seg.type === 'ARC_CW' || seg.type === 'ARC_CCW') &&
      seg.arcGeometry
    ) {
      const samples = sampleAnalyticalArcSegment(seg, 0.5);
      const floatIdx = clampedT * (samples.length - 1);
      const idx = Math.min(samples.length - 1, Math.floor(floatIdx));
      return samples[idx]!;
    }
    return {
      x: seg.startWcs.x + clampedT * (seg.endWcs.x - seg.startWcs.x),
      y: seg.startWcs.y + clampedT * (seg.endWcs.y - seg.startWcs.y),
      z: seg.startWcs.z + clampedT * (seg.endWcs.z - seg.startWcs.z),
      a: seg.startWcs.a + clampedT * (seg.endWcs.a - seg.startWcs.a),
      c: seg.startWcs.c + clampedT * (seg.endWcs.c - seg.startWcs.c),
    };
  }

  private notifyListeners(): void {
    if (!this.interpreterResult) return;

    const segs = this.interpreterResult.segments;
    let currentPos: Vector5D = {
      ...this.interpreterResult.finalModalState.positionWcs,
    };
    let activeLineNumber: number | null = null;
    let elapsedTimeSeconds = 0;
    let overallProgress = 0;
    let currentModalState = this.interpreterResult.finalModalState;

    if (segs.length > 0) {
      const seg = segs[this.currentSegmentIndex]!;
      currentPos = this.interpolateSegmentPosition(seg, this.segmentProgressT);
      activeLineNumber = seg.lineNumber;

      const prevCumulative =
        this.currentSegmentIndex > 0
          ? segs[this.currentSegmentIndex - 1]!.cumulativeTimeSeconds
          : 0;
      elapsedTimeSeconds =
        prevCumulative + seg.durationSeconds * this.segmentProgressT;
      overallProgress =
        (this.currentSegmentIndex + this.segmentProgressT) / segs.length;

      const snapshot = this.interpreterResult.lineSnapshots.find(
        (s) => s.lineNumber === activeLineNumber
      );
      if (snapshot) {
        currentModalState = {
          ...snapshot.modalStateAfter,
          positionWcs: currentPos,
        };
      }
    }

    const frameState: PlayerFrameState = {
      isPlaying: this.isPlaying,
      speedMultiplier: this.speedMultiplier,
      currentSegmentIndex: this.currentSegmentIndex,
      segmentProgressT: this.segmentProgressT,
      overallProgress,
      activeLineNumber,
      currentPositionWcs: currentPos,
      currentModalState,
      elapsedTimeSeconds,
      totalTimeSeconds: this.interpreterResult.stats.totalTimeSeconds,
      heightmapModel: this.liveHeightmap,
    };

    for (const listener of this.listeners) {
      listener(frameState);
    }
  }
}
