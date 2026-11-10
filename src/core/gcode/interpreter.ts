/**
 * Czysty interpreter kinematyczny G-code / IR.
 * Zamienia tekst programu (lub strukturę IR) na listę odcinków ruchu (MotionSegment[]),
 * zdarzenia maszynowe (MachineEvent[]), migawki dla wykonywania krokowego (LineExecutionSnapshot[])
 * oraz komunikaty diagnostyczne (DiagnosticMessage[]).
 *
 * Moduł jest w 100% odseparowany od modelu materiału (surówki) oraz od DOM.
 */

import { parseFanucToIR } from '../dialects/fanucFrontend';
import type {
  CannedCycleMode,
  DiagnosticMessage,
  LengthCompMode,
} from '../types/common';
import type {
  InterpreterInput,
  InterpreterResult,
  LineExecutionSnapshot,
  MachineEvent,
  ModalState,
  MotionSegment,
  ProgramStats,
} from '../types/interpreter';
import type { IRArcSpec } from '../types/ir';
import type {
  MachineConfig,
  Vector5D,
  WorkOffsetCode,
} from '../types/machine';
import { computeArcGeometry } from './arcs';
import { expandCannedCycle } from './cannedCycles';
import { evaluateCutterCompensation } from './cutterCompensation';

function cloneVector5D(v: Vector5D): Vector5D {
  return { x: v.x, y: v.y, z: v.z, a: v.a, c: v.c };
}

function cloneModalState(s: ModalState): ModalState {
  return {
    ...s,
    positionWcs: cloneVector5D(s.positionWcs),
    programmedPositionWcs: cloneVector5D(s.programmedPositionWcs),
    positionMcs: cloneVector5D(s.positionMcs),
  };
}

function getPhysicalToolLengthMm(toolPocket: number, config: MachineConfig): number {
  if (toolPocket <= 0) return 0;
  const tool = config.tools.find((t) => t.pocketNumber === toolPocket);
  return tool ? tool.lengthMm : 0;
}

function getControllerLengthOffsetSignedMm(
  lengthComp: LengthCompMode,
  regH: number,
  config: MachineConfig
): number {
  if (lengthComp === 'G49' || regH <= 0) return 0;
  const reg = config.toolOffsets.find((r) => r.registerNumber === regH);
  if (!reg) return 0;
  const val = reg.lengthOffsetMm + reg.lengthWearMm;
  return lengthComp === 'G43' ? val : -val;
}

/**
 * Przelicza pozycję wierzchołka narzędzia (positionWcs) oraz czoła wrzeciona (positionMcs)
 * na podstawie zaprogramowanego Z (programmedZ), aktywnego układu WCS, korekcji długości H
 * oraz fizycznej długości narzędzia.
 *
 * Zgodnie z Regułą 3 i 4 z Etapu 0:
 * - Czoło wrzeciona w MCS: Z_mcs = W_z + Z_prog + deltaH
 * - Fizyczny wierzchołek narzędzia w WCS: Z_tip_wcs = Z_prog + deltaH - tool.lengthMm
 *   (gdy G49 -> deltaH = 0, więc Z_tip_wcs = Z_prog - tool.lengthMm;
 *    gdy G43 Hn i deltaH == tool.lengthMm -> Z_tip_wcs = Z_prog).
 */
function computeActualAndMcsPositions(
  xyacCompensatedWcs: Vector5D,
  programmedZ: number,
  workOffset: WorkOffsetCode,
  lengthComp: LengthCompMode,
  regH: number,
  activeToolPocket: number,
  config: MachineConfig
): { actualTipWcs: Vector5D; spindleGaugeMcs: Vector5D } {
  const wcsOrigin = config.workOffsets[workOffset];
  const physLen = getPhysicalToolLengthMm(activeToolPocket, config);
  const deltaH = getControllerLengthOffsetSignedMm(lengthComp, regH, config);

  const actualTipWcs: Vector5D = {
    x: xyacCompensatedWcs.x,
    y: xyacCompensatedWcs.y,
    z: programmedZ + deltaH - physLen,
    a: xyacCompensatedWcs.a,
    c: xyacCompensatedWcs.c,
  };

  const spindleGaugeMcs: Vector5D = {
    x: wcsOrigin.x + xyacCompensatedWcs.x,
    y: wcsOrigin.y + xyacCompensatedWcs.y,
    z: wcsOrigin.z + programmedZ + deltaH,
    a: wcsOrigin.a + xyacCompensatedWcs.a,
    c: wcsOrigin.c + xyacCompensatedWcs.c,
  };

  return { actualTipWcs, spindleGaugeMcs };
}

function checkMachineLimits(
  lineNumber: number,
  segmentId: number,
  targetMcs: Vector5D,
  config: MachineConfig
): DiagnosticMessage[] {
  const diagnostics: DiagnosticMessage[] = [];
  const { limits } = config;

  if (targetMcs.x < limits.x.min - 1e-6 || targetMcs.x > limits.x.max + 1e-6) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'EXCEEDED_MACHINE_LIMITS',
      messagePl: `Linia ${lineNumber}: Przekroczono zakres roboczy osi X maszyny (${targetMcs.x.toFixed(2)} mm poza zakresem [${limits.x.min}, ${limits.x.max}] mm w MCS).`,
      hintPl: 'Zmniejsz współrzędną X w programie lub sprawdź przesunięcie punktu zerowego G54-G59.',
      relatedSegmentId: segmentId,
    });
  }

  if (targetMcs.y < limits.y.min - 1e-6 || targetMcs.y > limits.y.max + 1e-6) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'EXCEEDED_MACHINE_LIMITS',
      messagePl: `Linia ${lineNumber}: Przekroczono zakres roboczy osi Y maszyny (${targetMcs.y.toFixed(2)} mm poza zakresem [${limits.y.min}, ${limits.y.max}] mm w MCS).`,
      hintPl: 'Zmniejsz współrzędną Y w programie lub sprawdź przesunięcie punktu zerowego G54-G59.',
      relatedSegmentId: segmentId,
    });
  }

  if (targetMcs.z < limits.z.min - 1e-6 || targetMcs.z > limits.z.max + 1e-6) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'EXCEEDED_MACHINE_LIMITS',
      messagePl: `Linia ${lineNumber}: Przekroczono zakres roboczy osi Z maszyny (${targetMcs.z.toFixed(2)} mm poza zakresem [${limits.z.min}, ${limits.z.max}] mm w MCS).`,
      hintPl: 'Sprawdź wysokość Z w programie oraz korekcję długości narzędzia G43 H.',
      relatedSegmentId: segmentId,
    });
  }

  return diagnostics;
}

/**
 * Główna funkcja czystego interpretera kinematycznego.
 */
export function interpretGCode(input: InterpreterInput): InterpreterResult {
  const {
    sourceText,
    ir: providedIr,
    machineConfig,
    validationPolicy,
    initialActiveToolPocket = 0,
  } = input;

  const parseResult = providedIr
    ? { ir: providedIr, syntaxDiagnostics: [] }
    : parseFanucToIR(sourceText ?? '');

  const ir = parseResult.ir;
  const allDiagnostics: DiagnosticMessage[] = [...parseResult.syntaxDiagnostics];
  const segments: MotionSegment[] = [];
  const events: MachineEvent[] = [];
  const lineSnapshots: LineExecutionSnapshot[] = [];

  const stats: ProgramStats = {
    totalTimeSeconds: 0,
    rapidTimeSeconds: 0,
    cuttingFeedTimeSeconds: 0,
    toolChangeAndDwellSeconds: 0,
    totalRapidDistanceMm: 0,
    totalFeedDistanceMm: 0,
  };

  // Pozycja startowa w G54 wyliczona z homePositionMcs
  const initialWcsOrigin = machineConfig.workOffsets.G54;
  const initialPhysLen = getPhysicalToolLengthMm(initialActiveToolPocket, machineConfig);
  const initialProgWcs: Vector5D = {
    x: machineConfig.homePositionMcs.x - initialWcsOrigin.x,
    y: machineConfig.homePositionMcs.y - initialWcsOrigin.y,
    z: machineConfig.homePositionMcs.z - initialWcsOrigin.z,
    a: machineConfig.homePositionMcs.a - initialWcsOrigin.a,
    c: machineConfig.homePositionMcs.c - initialWcsOrigin.c,
  };

  const modal: ModalState = {
    motionMode: 'G0',
    cycleMode: 'G80',
    plane: 'G17',
    distanceMode: 'G90',
    units: 'G21',
    workOffset: 'G54',
    cutterComp: 'G40',
    activeRadiusRegD: 0,
    lengthComp: 'G49',
    activeLengthRegH: 0,
    cycleReturnMode: 'G98',
    feedRateMmPerMin: 0,
    spindleRpm: 0,
    spindleState: 'M5_STOP',
    coolantState: 'M9_OFF',
    selectedToolPocket: initialActiveToolPocket,
    activeToolPocket: initialActiveToolPocket,
    positionWcs: {
      ...initialProgWcs,
      z: initialProgWcs.z - initialPhysLen,
    },
    programmedPositionWcs: cloneVector5D(initialProgWcs),
    positionMcs: cloneVector5D(machineConfig.homePositionMcs),
    cycleInitialZ: null,
    cycleLastR: null,
    cycleLastDepthZ: null,
    cycleLastPeckQ: null,
    cycleLastDwellP: null,
    isProgramEnded: false,
  };

  let nextSegmentId = 1;

  // Pomocnicza funkcja dodająca pojedynczy odcinek ruchu (liniowy lub łukowy)
  const appendMotionSegment = (params: {
    lineNumber: number;
    blockNumberN: number | null;
    type: MotionSegment['type'];
    startWcs: Vector5D;
    endWcs: Vector5D;
    startMcs: Vector5D;
    endMcs: Vector5D;
    programmedStartWcs: Vector5D;
    programmedEndWcs: Vector5D;
    arcGeometry?: MotionSegment['arcGeometry'];
    originatedFromCycle: Exclude<CannedCycleMode, 'G80'> | null;
    lengthMm: number;
    lineDiagnostics: DiagnosticMessage[];
    lineSegmentIds: number[];
  }) => {
    const segId = nextSegmentId++;
    const isRapid = params.type === 'RAPID';
    const rateMmPerMin = isRapid
      ? machineConfig.limits.rapidRateMmPerMin
      : modal.feedRateMmPerMin;

    const durationSeconds =
      rateMmPerMin > 0 && params.lengthMm > 0
        ? (params.lengthMm / rateMmPerMin) * 60
        : 0;

    stats.totalTimeSeconds += durationSeconds;
    if (isRapid) {
      stats.rapidTimeSeconds += durationSeconds;
      stats.totalRapidDistanceMm += params.lengthMm;
    } else {
      stats.cuttingFeedTimeSeconds += durationSeconds;
      stats.totalFeedDistanceMm += params.lengthMm;
    }

    const seg: MotionSegment = {
      id: segId,
      lineNumber: params.lineNumber,
      blockNumberN: params.blockNumberN,
      type: params.type,
      startWcs: cloneVector5D(params.startWcs),
      endWcs: cloneVector5D(params.endWcs),
      startMcs: cloneVector5D(params.startMcs),
      endMcs: cloneVector5D(params.endMcs),
      programmedStartWcs: cloneVector5D(params.programmedStartWcs),
      programmedEndWcs: cloneVector5D(params.programmedEndWcs),
      arcGeometry: params.arcGeometry,
      originatedFromCycle: params.originatedFromCycle,
      toolPocket: modal.activeToolPocket,
      lengthCompMode: modal.lengthComp,
      activeLengthRegH: modal.activeLengthRegH,
      cutterCompMode: modal.cutterComp,
      activeRadiusRegD: modal.activeRadiusRegD,
      feedRateMmPerMin: rateMmPerMin,
      spindleRpm: modal.spindleRpm,
      spindleState: modal.spindleState,
      coolantState: modal.coolantState,
      lengthMm: params.lengthMm,
      durationSeconds,
      cumulativeTimeSeconds: stats.totalTimeSeconds,
    };

    segments.push(seg);
    params.lineSegmentIds.push(segId);

    const limitDiags = checkMachineLimits(
      params.lineNumber,
      segId,
      params.endMcs,
      machineConfig
    );
    params.lineDiagnostics.push(...limitDiags);
  };

  for (const block of ir.blocks) {
    if (modal.isProgramEnded) {
      break;
    }

    const lineNumber = block.sourceLine;
    const lineDiagnostics: DiagnosticMessage[] = [];
    const lineSegmentIds: number[] = [];

    // 1. Jednostki (G20 = cale, G21 = milimetry)
    if (block.setUnits) {
      modal.units = block.setUnits;
    }
    const unitScale = modal.units === 'G20' ? 25.4 : 1.0;

    // 2. Płaszczyzna (G17/G18/G19), tryb wymiarowania (G90/G91), poziom powrotu cyklu (G98/G99)
    if (block.setPlane) {
      modal.plane = block.setPlane;
    }
    if (block.setDistanceMode) {
      modal.distanceMode = block.setDistanceMode;
    }
    if (block.setCycleReturnMode) {
      modal.cycleReturnMode = block.setCycleReturnMode;
    }

    // 3. Punkt zerowy przedmiotu (G54..G59)
    if (block.setWorkOffset && block.setWorkOffset !== modal.workOffset) {
      const newOffset = block.setWorkOffset;
      const newWcsOrigin = machineConfig.workOffsets[newOffset];
      const deltaH = getControllerLengthOffsetSignedMm(
        modal.lengthComp,
        modal.activeLengthRegH,
        machineConfig
      );
      const physLen = getPhysicalToolLengthMm(modal.activeToolPocket, machineConfig);
      const compDx = modal.positionWcs.x - modal.programmedPositionWcs.x;
      const compDy = modal.positionWcs.y - modal.programmedPositionWcs.y;

      // Fizyczna maszyna nie rusza się przy samej zmianie G54->G55; przeliczamy współrzędne WCS względem nowego zera
      modal.workOffset = newOffset;
      modal.programmedPositionWcs = {
        x: modal.positionMcs.x - newWcsOrigin.x - compDx,
        y: modal.positionMcs.y - newWcsOrigin.y - compDy,
        z: modal.positionMcs.z - newWcsOrigin.z - deltaH,
        a: modal.positionMcs.a - newWcsOrigin.a,
        c: modal.positionMcs.c - newWcsOrigin.c,
      };
      modal.positionWcs = {
        x: modal.programmedPositionWcs.x + compDx,
        y: modal.programmedPositionWcs.y + compDy,
        z: modal.programmedPositionWcs.z + deltaH - physLen,
        a: modal.programmedPositionWcs.a,
        c: modal.programmedPositionWcs.c,
      };

      events.push({
        lineNumber,
        type: 'WORK_OFFSET_CHANGE',
        descriptionPl: `Aktywacja układu współrzędnych przedmiotu ${newOffset}`,
        durationSeconds: 0,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    // 4. Wybór narzędzia (T) oraz wymiana narzędzia (M6)
    if (block.selectToolPocket !== undefined) {
      const toolExists = machineConfig.tools.some(
        (t) => t.pocketNumber === block.selectToolPocket
      );
      if (!toolExists) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'TOOL_NOT_FOUND',
          messagePl: `Linia ${lineNumber}: Narzędzie T${block.selectToolPocket} nie istnieje w magazynie narzędziowym maszyny.`,
          hintPl: `Dostępne narzędzia w magazynie to: ${machineConfig.tools.map((t) => `T${t.pocketNumber} (${t.name})`).join(', ')}.`,
        });
      } else {
        modal.selectedToolPocket = block.selectToolPocket;
        events.push({
          lineNumber,
          type: 'TOOL_PREPARE',
          descriptionPl: `Przygotowanie narzędzia T${block.selectToolPocket} w magazynie`,
          durationSeconds: 0,
          timestampSeconds: stats.totalTimeSeconds,
        });
      }
    }

    if (block.executeToolChangeM6) {
      const targetPocket = modal.selectedToolPocket;
      const toolDef = machineConfig.tools.find((t) => t.pocketNumber === targetPocket);
      if (!toolDef) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'TOOL_NOT_FOUND',
          messagePl: `Linia ${lineNumber}: Nie można wykonać wymiany M6 – nie wybrano prawidłowego narzędzia słowem T.`,
          hintPl: 'Podaj numer istniejącego narzędzia przed lub w jednej linii z M6 (np. T1 M6).',
        });
      } else {
        modal.activeToolPocket = targetPocket;
        const tcTime = machineConfig.limits.toolChangeTimeSeconds;
        stats.totalTimeSeconds += tcTime;
        stats.toolChangeAndDwellSeconds += tcTime;

        // Po wymianie narzędzia aktualizujemy położenie wierzchołka nowego narzędzia
        const updated = computeActualAndMcsPositions(
          modal.positionWcs,
          modal.programmedPositionWcs.z,
          modal.workOffset,
          modal.lengthComp,
          modal.activeLengthRegH,
          modal.activeToolPocket,
          machineConfig
        );
        modal.positionWcs = updated.actualTipWcs;
        modal.positionMcs = updated.spindleGaugeMcs;

        events.push({
          lineNumber,
          type: 'TOOL_CHANGE',
          descriptionPl: `Wymiana narzędzia na T${targetPocket} (${toolDef.name})`,
          durationSeconds: tcTime,
          timestampSeconds: stats.totalTimeSeconds,
        });
      }
    }

    // 5. Obroty (S), wrzeciono (M3/M4/M5), chłodziwo (M8/M9) i posuw (F)
    if (block.setSpindleSpeed !== undefined) {
      if (block.setSpindleSpeed < 0 || block.setSpindleSpeed > machineConfig.limits.maxSpindleRpm) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'WARNING',
          code: 'EXCEEDED_MACHINE_LIMITS',
          messagePl: `Linia ${lineNumber}: Zaprogramowane obroty S${block.setSpindleSpeed} przekraczają zakres wrzeciona (0..${machineConfig.limits.maxSpindleRpm} obr./min).`,
          hintPl: `Ustaw prędkość obrotową S nie większą niż ${machineConfig.limits.maxSpindleRpm}.`,
        });
      }
      modal.spindleRpm = Math.max(0, Math.min(block.setSpindleSpeed, machineConfig.limits.maxSpindleRpm));
    }

    if (block.setSpindleState) {
      modal.spindleState = block.setSpindleState;
      events.push({
        lineNumber,
        type: 'SPINDLE_CHANGE',
        descriptionPl:
          block.setSpindleState === 'M3_CW'
            ? `Włączenie wrzeciona w prawo M3 (${modal.spindleRpm} obr./min)`
            : block.setSpindleState === 'M4_CCW'
            ? `Włączenie wrzeciona w lewo M4 (${modal.spindleRpm} obr./min)`
            : 'Zatrzymanie wrzeciona M5',
        durationSeconds: 0,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    if (block.setCoolantState) {
      modal.coolantState = block.setCoolantState;
      events.push({
        lineNumber,
        type: 'COOLANT_CHANGE',
        descriptionPl:
          block.setCoolantState === 'M8_FLOOD'
            ? 'Włączenie chłodziwa M8'
            : 'Wyłączenie chłodziwa M9',
        durationSeconds: 0,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    if (block.setFeedRate !== undefined) {
      const convertedFeed = block.setFeedRate * unitScale;
      if (convertedFeed <= 0) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'MISSING_FEED_RATE',
          messagePl: `Linia ${lineNumber}: Prędkość posuwu F musi być dodatnia (podano F${block.setFeedRate}).`,
          hintPl: 'Podaj dodatnią wartość posuwu w mm/min, np. F200.',
        });
      }
      modal.feedRateMmPerMin = Math.max(0, convertedFeed);
    }

    // 6. Korekcja długości narzędzia (G43 / G44 / G49 oraz H)
    if (block.setLengthComp) {
      if (block.setLengthComp.mode) {
        modal.lengthComp = block.setLengthComp.mode;
      }
      if (block.setLengthComp.registerH !== undefined) {
        modal.activeLengthRegH = block.setLengthComp.registerH;
      }
      if (modal.lengthComp === 'G49') {
        modal.activeLengthRegH = 0;
      } else {
        const regExists = machineConfig.toolOffsets.some(
          (r) => r.registerNumber === modal.activeLengthRegH
        );
        if (!regExists || modal.activeLengthRegH <= 0) {
          lineDiagnostics.push({
            lineNumber,
            severity: 'ERROR',
            code: 'OFFSET_REGISTER_NOT_FOUND',
            messagePl: `Linia ${lineNumber}: Nie znaleziono rejestru korekcji długości H${modal.activeLengthRegH > 0 ? modal.activeLengthRegH : ''} w tabeli offsetów sterownika.`,
            hintPl: 'Podaj numer istniejącego korektora długości odpowiadającego narzędziu, np. G43 H1.',
          });
        } else if (
          validationPolicy.warnOnMismatchedHOffset &&
          modal.activeToolPocket > 0 &&
          modal.activeLengthRegH !== modal.activeToolPocket
        ) {
          lineDiagnostics.push({
            lineNumber,
            severity: 'WARNING',
            code: 'MISMATCHED_H_OFFSET',
            messagePl: `Linia ${lineNumber}: Ostrzeżenie – we wrzecionie znajduje się narzędzie T${modal.activeToolPocket}, ale włączono korekcję długości H${modal.activeLengthRegH}!`,
            hintPl: `Dla narzędzia T${modal.activeToolPocket} zaleca się użycie odpowiadającego mu rejestru H${modal.activeToolPocket}, aby uniknąć kolizji lub błędu głębokości.`,
          });
        }
      }

      // Przelicz bieżącą pozycję po zmianie korekcji długości (gdy w bloku nie ma ruchu Z)
      if (!block.targetAxes || block.targetAxes.z === undefined) {
        const updated = computeActualAndMcsPositions(
          modal.positionWcs,
          modal.programmedPositionWcs.z,
          modal.workOffset,
          modal.lengthComp,
          modal.activeLengthRegH,
          modal.activeToolPocket,
          machineConfig
        );
        modal.positionWcs = updated.actualTipWcs;
        modal.positionMcs = updated.spindleGaugeMcs;
      }

      events.push({
        lineNumber,
        type: 'COMPENSATION_CHANGE',
        descriptionPl:
          modal.lengthComp === 'G49'
            ? 'Odwołanie korekcji długości narzędzia G49'
            : `Włączenie korekcji długości ${modal.lengthComp} H${modal.activeLengthRegH}`,
        durationSeconds: 0,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    // 7. Aktualizacja grup modalnych ruchu (motionMode vs cycleMode - Reguła 2)
    if (block.cancelCycleG80) {
      modal.cycleMode = 'G80';
      modal.cycleInitialZ = null;
      if (!block.setMotionMode) {
        modal.motionMode = null;
      }
    }

    if (block.setMotionMode) {
      modal.motionMode = block.setMotionMode;
      modal.cycleMode = 'G80';
      modal.cycleInitialZ = null;
    }

    // 8. Postój czasowy G4 (Dwell)
    if (block.dwellSeconds !== undefined && block.dwellSeconds >= 0) {
      stats.totalTimeSeconds += block.dwellSeconds;
      stats.toolChangeAndDwellSeconds += block.dwellSeconds;
      events.push({
        lineNumber,
        type: 'DWELL',
        descriptionPl: `Postój czasowy G4 (${block.dwellSeconds.toFixed(2)} s)`,
        durationSeconds: block.dwellSeconds,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    // 9. Wykonanie cyklu stałego (G81 / G82 / G83)
    if (block.cycleSpec) {
      if (modal.cycleMode === 'G80') {
        modal.cycleInitialZ = modal.programmedPositionWcs.z;
      }
      modal.cycleMode = block.cycleSpec.cycle;
      modal.motionMode = null;

      // Aktualizacja modalnych parametrów cyklu (przeliczonych na mm zgodnie z G20/G21)
      if (block.cycleSpec.retractPlaneR !== undefined) {
        const rInputMm = block.cycleSpec.retractPlaneR * unitScale;
        modal.cycleLastR =
          modal.distanceMode === 'G90'
            ? rInputMm
            : (modal.cycleInitialZ ?? modal.programmedPositionWcs.z) + rInputMm;
      }
      if (block.cycleSpec.finalDepthZ !== undefined) {
        const zInputMm = block.cycleSpec.finalDepthZ * unitScale;
        modal.cycleLastDepthZ =
          modal.distanceMode === 'G90'
            ? zInputMm
            : (modal.cycleLastR ?? modal.programmedPositionWcs.z) + zInputMm;
      }
      if (block.cycleSpec.peckIncrementQ !== undefined) {
        modal.cycleLastPeckQ = block.cycleSpec.peckIncrementQ * unitScale;
      }
      if (block.cycleSpec.dwellSecondsP !== undefined) {
        modal.cycleLastDwellP = block.cycleSpec.dwellSecondsP;
      }

      // Walidacja obecności narzędzia i korekcji długości dla cyklu
      if (modal.activeToolPocket <= 0) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'NO_TOOL_IN_SPINDLE',
          messagePl: `Linia ${lineNumber}: Brak zamocowanego narzędzia we wrzecionie przed wywołaniem cyklu ${modal.cycleMode}.`,
          hintPl: 'Najpierw wybierz i zamontuj wiertło poleceniem T.. M6 (np. T3 M6).',
        });
      }
      if (validationPolicy.requireLengthCompensation && modal.lengthComp === 'G49') {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'MISSING_LENGTH_COMPENSATION',
          messagePl: `Linia ${lineNumber}: Brak aktywnej korekcji długości narzędzia (G43 H..) podczas cyklu ${modal.cycleMode}.`,
          hintPl: `Włącz korekcję długości przed wierceniem, np. G43 H${modal.activeToolPocket || 1} Z50.`,
        });
      }

      const targetX =
        block.targetAxes?.x !== undefined
          ? modal.distanceMode === 'G90'
            ? block.targetAxes.x * unitScale
            : modal.programmedPositionWcs.x + block.targetAxes.x * unitScale
          : modal.programmedPositionWcs.x;

      const targetY =
        block.targetAxes?.y !== undefined
          ? modal.distanceMode === 'G90'
            ? block.targetAxes.y * unitScale
            : modal.programmedPositionWcs.y + block.targetAxes.y * unitScale
          : modal.programmedPositionWcs.y;

      const targetA =
        block.targetAxes?.a !== undefined
          ? modal.distanceMode === 'G90'
            ? block.targetAxes.a
            : modal.programmedPositionWcs.a + block.targetAxes.a
          : modal.programmedPositionWcs.a;

      const targetC =
        block.targetAxes?.c !== undefined
          ? modal.distanceMode === 'G90'
            ? block.targetAxes.c
            : modal.programmedPositionWcs.c + block.targetAxes.c
          : modal.programmedPositionWcs.c;

      const cycleExpansion = expandCannedCycle({
        lineNumber,
        cycle: modal.cycleMode,
        returnMode: modal.cycleReturnMode,
        currentProgrammedWcs: modal.programmedPositionWcs,
        targetXYWcs: { x: targetX, y: targetY, a: targetA, c: targetC },
        initialZProgrammed: modal.cycleInitialZ ?? modal.programmedPositionWcs.z,
        retractPlaneRProgrammed: modal.cycleLastR,
        finalDepthZProgrammed: modal.cycleLastDepthZ,
        peckIncrementQMm: modal.cycleLastPeckQ,
        dwellSecondsP: modal.cycleLastDwellP,
        feedRateMmPerMin: modal.feedRateMmPerMin,
      });

      lineDiagnostics.push(...cycleExpansion.diagnostics);

      for (const step of cycleExpansion.steps) {
        if (step.kind === 'DWELL' && step.dwellSeconds !== undefined) {
          stats.totalTimeSeconds += step.dwellSeconds;
          stats.toolChangeAndDwellSeconds += step.dwellSeconds;
          events.push({
            lineNumber,
            type: 'DWELL',
            descriptionPl: step.descriptionPl ?? `Postój G82 (${step.dwellSeconds} s)`,
            durationSeconds: step.dwellSeconds,
            timestampSeconds: stats.totalTimeSeconds,
          });
        } else if (step.kind === 'MOTION' && step.programmedTargetWcs && step.motionType) {
          const progStart = cloneVector5D(modal.programmedPositionWcs);
          const progEnd = cloneVector5D(step.programmedTargetWcs);
          const startActual = cloneVector5D(modal.positionWcs);
          const startMcs = cloneVector5D(modal.positionMcs);

          const endPositions = computeActualAndMcsPositions(
            progEnd,
            progEnd.z,
            modal.workOffset,
            modal.lengthComp,
            modal.activeLengthRegH,
            modal.activeToolPocket,
            machineConfig
          );

          const distMm = Math.hypot(
            endPositions.actualTipWcs.x - startActual.x,
            endPositions.actualTipWcs.y - startActual.y,
            endPositions.actualTipWcs.z - startActual.z
          );

          appendMotionSegment({
            lineNumber,
            blockNumberN: block.blockNumberN ?? null,
            type: step.motionType,
            startWcs: startActual,
            endWcs: endPositions.actualTipWcs,
            startMcs,
            endMcs: endPositions.spindleGaugeMcs,
            programmedStartWcs: progStart,
            programmedEndWcs: progEnd,
            originatedFromCycle: modal.cycleMode,
            lengthMm: distMm,
            lineDiagnostics,
            lineSegmentIds,
          });

          modal.programmedPositionWcs = progEnd;
          modal.positionWcs = endPositions.actualTipWcs;
          modal.positionMcs = endPositions.spindleGaugeMcs;
        }
      }
    } else {
      // 10. Obsługa korekcji promienia G40/G41/G42 oraz ruchów podstawowych G0/G1/G2/G3
      const prevCompMode = modal.cutterComp;
      if (block.setCutterComp) {
        if (block.setCutterComp.mode) {
          modal.cutterComp = block.setCutterComp.mode;
        }
        if (block.setCutterComp.registerD !== undefined) {
          modal.activeRadiusRegD = block.setCutterComp.registerD;
        }
        if (modal.cutterComp === 'G40') {
          modal.activeRadiusRegD = 0;
        }
      }

      const hasTargetAxes =
        block.targetAxes !== undefined &&
        (block.targetAxes.x !== undefined ||
          block.targetAxes.y !== undefined ||
          block.targetAxes.z !== undefined ||
          block.targetAxes.a !== undefined ||
          block.targetAxes.c !== undefined);

      const hasArcSpec = block.arcSpec !== undefined;
      const hasMotionCommand = hasTargetAxes || hasArcSpec;

      if (hasMotionCommand && modal.motionMode === null) {
        lineDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'SYNTAX_UNKNOWN_WORD',
          messagePl: `Linia ${lineNumber}: Próba wykonania ruchu po odwołaniu cyklu (G80) bez podania kodu interpolacji (G0, G1, G2 lub G3).`,
          hintPl: 'Po poleceniu G80 jawnie wpisz kod ruchu, np. G0 Z50 lub G1 X10 Y10.',
        });
      } else if (hasMotionCommand || block.setCutterComp) {
        const progStart = cloneVector5D(modal.programmedPositionWcs);
        const progEnd = cloneVector5D(modal.programmedPositionWcs);

        if (block.targetAxes) {
          if (block.targetAxes.x !== undefined) {
            const xMm = block.targetAxes.x * unitScale;
            progEnd.x = modal.distanceMode === 'G90' ? xMm : progStart.x + xMm;
          }
          if (block.targetAxes.y !== undefined) {
            const yMm = block.targetAxes.y * unitScale;
            progEnd.y = modal.distanceMode === 'G90' ? yMm : progStart.y + yMm;
          }
          if (block.targetAxes.z !== undefined) {
            const zMm = block.targetAxes.z * unitScale;
            progEnd.z = modal.distanceMode === 'G90' ? zMm : progStart.z + zMm;
          }
          if (block.targetAxes.a !== undefined) {
            progEnd.a =
              modal.distanceMode === 'G90'
                ? block.targetAxes.a
                : progStart.a + block.targetAxes.a;
          }
          if (block.targetAxes.c !== undefined) {
            progEnd.c =
              modal.distanceMode === 'G90'
                ? block.targetAxes.c
                : progStart.c + block.targetAxes.c;
          }
        }

        const hasPlanarMove =
          Math.abs(progEnd.x - progStart.x) > 1e-6 ||
          Math.abs(progEnd.y - progStart.y) > 1e-6 ||
          hasArcSpec;

        // Przelicz parametry łuku z jednostek programu na milimetry
        let scaledArcSpec: IRArcSpec | undefined;
        let approxProgArcRadiusMm: number | undefined;
        if (block.arcSpec) {
          if (block.arcSpec.kind === 'IJK_INCREMENTAL') {
            scaledArcSpec = {
              kind: 'IJK_INCREMENTAL',
              i: block.arcSpec.i !== undefined ? block.arcSpec.i * unitScale : undefined,
              j: block.arcSpec.j !== undefined ? block.arcSpec.j * unitScale : undefined,
              k: block.arcSpec.k !== undefined ? block.arcSpec.k * unitScale : undefined,
            };
            approxProgArcRadiusMm = Math.hypot(
              scaledArcSpec.i ?? 0,
              scaledArcSpec.j ?? 0,
              scaledArcSpec.k ?? 0
            );
          } else if (block.arcSpec.kind === 'RADIUS') {
            scaledArcSpec = {
              kind: 'RADIUS',
              r: block.arcSpec.r * unitScale,
            };
            approxProgArcRadiusMm = Math.abs(scaledArcSpec.r);
          } else {
            scaledArcSpec = {
              kind: 'CENTER_ABSOLUTE',
              ccX: block.arcSpec.ccX !== undefined ? block.arcSpec.ccX * unitScale : undefined,
              ccY: block.arcSpec.ccY !== undefined ? block.arcSpec.ccY * unitScale : undefined,
              ccZ: block.arcSpec.ccZ !== undefined ? block.arcSpec.ccZ * unitScale : undefined,
            };
          }
        }

        // Ewaluacja korekcji promienia G40/G41/G42
        const compResult = evaluateCutterCompensation({
          lineNumber,
          plane: modal.plane,
          previousCompMode: prevCompMode,
          newCompMode: modal.cutterComp,
          activeRadiusRegD: modal.activeRadiusRegD,
          motionMode: modal.motionMode,
          hasPlanarMotion: hasPlanarMove,
          programmedStartWcs: progStart,
          programmedEndWcs: progEnd,
          currentActualWcs: modal.positionWcs,
          programmedArcRadiusMm: approxProgArcRadiusMm,
          toolOffsets: machineConfig.toolOffsets,
        });

        lineDiagnostics.push(...compResult.diagnostics);

        if (block.setCutterComp && prevCompMode !== modal.cutterComp) {
          events.push({
            lineNumber,
            type: 'COMPENSATION_CHANGE',
            descriptionPl:
              modal.cutterComp === 'G40'
                ? 'Odwołanie korekcji promienia narzędzia G40'
                : `Włączenie korekcji promienia ${modal.cutterComp} D${modal.activeRadiusRegD}`,
            durationSeconds: 0,
            timestampSeconds: stats.totalTimeSeconds,
          });
        }

        if (hasMotionCommand && modal.motionMode !== null) {
          const isCuttingMove =
            modal.motionMode === 'G1' ||
            modal.motionMode === 'G2' ||
            modal.motionMode === 'G3';

          // Walidacja obecności narzędzia we wrzecionie
          if (
            modal.activeToolPocket <= 0 &&
            (isCuttingMove || validationPolicy.requireToolInSpindle)
          ) {
            lineDiagnostics.push({
              lineNumber,
              severity: 'ERROR',
              code: 'NO_TOOL_IN_SPINDLE',
              messagePl: `Linia ${lineNumber}: Brak zamocowanego narzędzia we wrzecionie przed wykonaniem ruchu ${modal.motionMode}.`,
              hintPl: 'Zamontuj narzędzie za pomocą polecenia T.. M6 (np. T1 M6) na początku programu.',
            });
          }

          // Walidacja obecności korekcji długości G43 H
          if (
            isCuttingMove &&
            validationPolicy.requireLengthCompensation &&
            modal.lengthComp === 'G49'
          ) {
            lineDiagnostics.push({
              lineNumber,
              severity: 'ERROR',
              code: 'MISSING_LENGTH_COMPENSATION',
              messagePl: `Linia ${lineNumber}: Wykonywanie ruchu roboczego ${modal.motionMode} bez aktywnej korekcji długości narzędzia (G43 H..).`,
              hintPl: `Przed zjazdem roboczym aktywuj korekcję długości dla bieżącego narzędzia, np. G43 H${modal.activeToolPocket || 1} Z50.`,
            });
          }

          // Walidacja posuwu F dla G1/G2/G3
          if (isCuttingMove && modal.feedRateMmPerMin <= 0) {
            lineDiagnostics.push({
              lineNumber,
              severity: 'ERROR',
              code: 'MISSING_FEED_RATE',
              messagePl: `Linia ${lineNumber}: Ruch roboczy ${modal.motionMode} wymaga zaprogramowania prędkości posuwu F (obecnie F = 0).`,
              hintPl: 'Dodaj parametr posuwu F w tej linii lub wcześniej (np. F250).',
            });
          }

          const startActual = cloneVector5D(modal.positionWcs);
          const startMcs = cloneVector5D(modal.positionMcs);
          const endPositions = computeActualAndMcsPositions(
            compResult.compensatedEndWcs,
            progEnd.z,
            modal.workOffset,
            modal.lengthComp,
            modal.activeLengthRegH,
            modal.activeToolPocket,
            machineConfig
          );

          if (modal.motionMode === 'G0' || modal.motionMode === 'G1') {
            if (hasArcSpec) {
              lineDiagnostics.push({
                lineNumber,
                severity: 'ERROR',
                code: 'SYNTAX_UNKNOWN_WORD',
                messagePl: `Linia ${lineNumber}: Podano parametry łuku (I/J/K lub R) podczas ruchu prostoliniowego ${modal.motionMode}.`,
                hintPl: 'Użyj kodu G2 (łuk w prawo) lub G3 (łuk w lewo), jeśli chcesz wyfrezować łuk.',
              });
            }

            const distMm = Math.hypot(
              endPositions.actualTipWcs.x - startActual.x,
              endPositions.actualTipWcs.y - startActual.y,
              endPositions.actualTipWcs.z - startActual.z
            );

            appendMotionSegment({
              lineNumber,
              blockNumberN: block.blockNumberN ?? null,
              type: modal.motionMode === 'G0' ? 'RAPID' : 'LINEAR',
              startWcs: startActual,
              endWcs: endPositions.actualTipWcs,
              startMcs,
              endMcs: endPositions.spindleGaugeMcs,
              programmedStartWcs: progStart,
              programmedEndWcs: progEnd,
              originatedFromCycle: null,
              lengthMm: distMm,
              lineDiagnostics,
              lineSegmentIds,
            });
          } else if (modal.motionMode === 'G2' || modal.motionMode === 'G3') {
            const isClockwise = modal.motionMode === 'G2';

            // Dla łuku w korekcji promienia środek łuku jest taki sam, natomiast promień R zmienia się o offset
            let effectiveArcSpec = scaledArcSpec;
            if (
              modal.cutterComp !== 'G40' &&
              scaledArcSpec?.kind === 'RADIUS' &&
              compResult.effectiveRadiusOffsetMm > 0
            ) {
              const isInsideArc =
                (modal.cutterComp === 'G41' && !isClockwise) ||
                (modal.cutterComp === 'G42' && isClockwise);
              const rSign = Math.sign(scaledArcSpec.r) || 1;
              const rAbs = Math.abs(scaledArcSpec.r);
              const rComp = isInsideArc
                ? Math.max(0.001, rAbs - compResult.effectiveRadiusOffsetMm)
                : rAbs + compResult.effectiveRadiusOffsetMm;
              effectiveArcSpec = {
                kind: 'RADIUS',
                r: rSign * rComp,
              };
            } else if (
              modal.cutterComp !== 'G40' &&
              scaledArcSpec?.kind === 'IJK_INCREMENTAL'
            ) {
              // Wektor od skompensowanego punktu startowego do środka okręgu
              const startShiftX = startActual.x - progStart.x;
              const startShiftY = startActual.y - progStart.y;
              effectiveArcSpec = {
                kind: 'IJK_INCREMENTAL',
                i: (scaledArcSpec.i ?? 0) - startShiftX,
                j: (scaledArcSpec.j ?? 0) - startShiftY,
                k: scaledArcSpec.k,
              };
            }

            const arcCalc = computeArcGeometry({
              lineNumber,
              plane: modal.plane,
              isClockwise,
              startWcs: startActual,
              endWcs: endPositions.actualTipWcs,
              arcSpec: effectiveArcSpec,
              endpointToleranceMm: validationPolicy.arcEndpointToleranceMm,
            });

            lineDiagnostics.push(...arcCalc.diagnostics);

            if (arcCalc.arcGeometry) {
              appendMotionSegment({
                lineNumber,
                blockNumberN: block.blockNumberN ?? null,
                type: isClockwise ? 'ARC_CW' : 'ARC_CCW',
                startWcs: startActual,
                endWcs: endPositions.actualTipWcs,
                startMcs,
                endMcs: endPositions.spindleGaugeMcs,
                programmedStartWcs: progStart,
                programmedEndWcs: progEnd,
                arcGeometry: arcCalc.arcGeometry,
                originatedFromCycle: null,
                lengthMm: arcCalc.arcLengthMm,
                lineDiagnostics,
                lineSegmentIds,
              });
            }
          }

          modal.programmedPositionWcs = progEnd;
          modal.positionWcs = endPositions.actualTipWcs;
          modal.positionMcs = endPositions.spindleGaugeMcs;
        }
      }
    }

    // 11. Koniec programu (M2 / M30)
    if (block.endProgram) {
      modal.isProgramEnded = true;
      modal.spindleState = 'M5_STOP';
      modal.coolantState = 'M9_OFF';
      events.push({
        lineNumber,
        type: 'PROGRAM_END',
        descriptionPl: `Koniec programu (${block.endProgram})`,
        durationSeconds: 0,
        timestampSeconds: stats.totalTimeSeconds,
      });
    }

    allDiagnostics.push(...lineDiagnostics);
    lineSnapshots.push({
      lineNumber,
      rawText: block.rawText,
      modalStateAfter: cloneModalState(modal),
      segmentIds: lineSegmentIds,
      diagnostics: lineDiagnostics,
    });
  }

  // Sprawdzenie obecności M2/M30 na końcu programu
  if (!modal.isProgramEnded && validationPolicy.requireProgramEndM30 && ir.blocks.length > 0) {
    const lastLine = ir.blocks[ir.blocks.length - 1]!.sourceLine;
    allDiagnostics.push({
      lineNumber: lastLine,
      severity: 'WARNING',
      code: 'MISSING_PROGRAM_END',
      messagePl: `Linia ${lastLine}: Brak polecenia końca programu (M30 lub M2) na końcu kodu.`,
      hintPl: 'Zakończ program blokiem M30, który zatrzymuje maszynę i przewija program na początek.',
    });
  }

  const hasErrors = allDiagnostics.some((d) => d.severity === 'ERROR');

  return {
    success: !hasErrors,
    ir,
    segments,
    events,
    diagnostics: allDiagnostics,
    lineSnapshots,
    finalModalState: cloneModalState(modal),
    stats,
  };
}
