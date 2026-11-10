/**
 * Silnik automatycznego sprawdzania zadań (TaskGrader).
 *
 * Zgodnie z wymaganiami dydaktycznymi kursu:
 * Zadania są sprawdzane WYŁĄCZNIE po wyniku symulacji (trajektorii wierzchołka narzędzia,
 * końcowej mapie wysokości wyfrezowanego przedmiotu, użytych narzędziach i braku kolizji),
 * a NIGDY po porównywaniu tekstu kodu G. Dzięki temu poprawne są różne zapisy tego samego
 * rozwiązania (np. G90 vs G91, R vs IJK, zera wiodące G00 vs G0, podział na więcej odcinków).
 */

import { sampleAnalyticalArcSegment } from '../core/gcode/arcs';
import type {
  AssertionCheckResult,
  TaskAssertion,
  TaskGradeResult,
} from '../core/types/curriculum';
import type {
  InterpreterResult,
  MotionSegment,
} from '../core/types/interpreter';
import type { Vector5D } from '../core/types/machine';
import type { MaterialAnalysisResult } from '../core/types/material';

/**
 * Oblicza minimalną odległość 3D pomiędzy punktem docelowym a odcinkiem ruchu (liniowym lub łukowym).
 */
function minDistanceFromSegmentToPoint(
  seg: MotionSegment,
  target: Vector5D
): number {
  if (seg.type === 'ARC_CW' || seg.type === 'ARC_CCW') {
    const pts = sampleAnalyticalArcSegment(seg, 0.25);
    let minD = Number.POSITIVE_INFINITY;
    for (const p of pts) {
      const d = Math.hypot(p.x - target.x, p.y - target.y, p.z - target.z);
      if (d < minD) minD = d;
    }
    return minD;
  }

  // Odległość punktu od odcinka prostoliniowego AB w 3D
  const ax = seg.startWcs.x;
  const ay = seg.startWcs.y;
  const az = seg.startWcs.z;
  const bx = seg.endWcs.x;
  const by = seg.endWcs.y;
  const bz = seg.endWcs.z;

  const abx = bx - ax;
  const aby = by - ay;
  const abz = bz - az;
  const abLenSq = abx * abx + aby * aby + abz * abz;

  if (abLenSq < 1e-10) {
    return Math.hypot(target.x - ax, target.y - ay, target.z - az);
  }

  const apx = target.x - ax;
  const apy = target.y - ay;
  const apz = target.z - az;
  const t = Math.max(
    0,
    Math.min(1, (apx * abx + apy * aby + apz * abz) / abLenSq)
  );

  const closestX = ax + t * abx;
  const closestY = ay + t * aby;
  const closestZ = az + t * abz;

  return Math.hypot(
    target.x - closestX,
    target.y - closestY,
    target.z - closestZ
  );
}

/**
 * Sprawdza pojedyncze kryterium zadania na podstawie wyników interpretera i analizatora materiału.
 */
function evaluateSingleAssertion(
  assertion: TaskAssertion,
  interp: InterpreterResult,
  material: MaterialAnalysisResult
): AssertionCheckResult {
  switch (assertion.kind) {
    case 'NO_ERRORS_AND_NO_COLLISIONS': {
      const errCount =
        interp.diagnostics.filter((d) => d.severity === 'ERROR').length +
        material.materialDiagnostics.filter((d) => d.severity === 'ERROR').length;
      const passed = errCount === 0;
      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl}`
          : `✖ ${assertion.descriptionPl} (wykryto błędy lub kolizje: ${errCount}). Sprawdź kartę Diagnostyka.`,
      };
    }

    case 'TOOLTIP_VISITED_POINT_WCS': {
      const {
        targetWcs,
        toleranceMm,
        requireCuttingMotion,
        requiredWorkOffset,
        checkRotaryAxes,
      } = assertion;

      let bestDist = Number.POSITIVE_INFINITY;
      for (const seg of interp.segments) {
        if (requireCuttingMotion && seg.type === 'RAPID') {
          continue;
        }
        if (requiredWorkOffset) {
          const snap = interp.lineSnapshots.find(
            (s) => s.lineNumber === seg.lineNumber
          );
          if (snap && snap.modalStateAfter.workOffset !== requiredWorkOffset) {
            continue;
          }
        }
        if (checkRotaryAxes) {
          const angleDiffEnd = Math.hypot(
            seg.endWcs.a - targetWcs.a,
            seg.endWcs.c - targetWcs.c
          );
          if (angleDiffEnd > 1.0) {
            continue;
          }
        }
        const d = minDistanceFromSegmentToPoint(seg, targetWcs);
        if (d < bestDist) {
          bestDist = d;
        }
      }

      // Jeśli brak odcinków ruchu lub punkt to pozycja końcowa
      if (!requireCuttingMotion && interp.segments.length === 0) {
        const p = interp.finalModalState.positionWcs;
        bestDist = Math.hypot(
          p.x - targetWcs.x,
          p.y - targetWcs.y,
          p.z - targetWcs.z
        );
      }

      const passed = bestDist <= toleranceMm;
      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl}`
          : `✖ ${assertion.descriptionPl} (najbliższe przejście narzędzia w odległości ${
              Number.isFinite(bestDist) ? `${bestDist.toFixed(2)} mm` : 'brak odpowiedniego ruchu'
            } od punktu X${targetWcs.x} Y${targetWcs.y} Z${targetWcs.z}).`,
      };
    }

    case 'SURFACE_HEIGHT_AT_POINT': {
      const { pointXY, expectedZMm, toleranceMm } = assertion;
      const actualZ = material.finalMaterialModel.sampleSurfaceAtWcs({
        x: pointXY.x,
        y: pointXY.y,
        z: 0,
        a: 0,
        c: 0,
      });

      const passed =
        actualZ !== null && Math.abs(actualZ - expectedZMm) <= toleranceMm;
      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl} (uzyskano Z = ${actualZ!.toFixed(2)} mm)`
          : `✖ ${assertion.descriptionPl} (w punkcie X${pointXY.x} Y${pointXY.y} wysokość powierzchni wynosi Z = ${
              actualZ !== null ? `${actualZ.toFixed(2)} mm` : 'poza surówką'
            }, oczekiwano Z = ${expectedZMm.toFixed(2)} mm ±${toleranceMm} mm).`,
      };
    }

    case 'USED_ARC_MOTION': {
      const { direction = 'ANY', expectedRadiusMm, toleranceMm = 0.5 } =
        assertion;

      const matchingArcs = interp.segments.filter((s) => {
        if (direction === 'ARC_CW' && s.type !== 'ARC_CW') return false;
        if (direction === 'ARC_CCW' && s.type !== 'ARC_CCW') return false;
        if (
          direction === 'ANY' &&
          s.type !== 'ARC_CW' &&
          s.type !== 'ARC_CCW'
        ) {
          return false;
        }
        if (expectedRadiusMm !== undefined && s.arcGeometry) {
          return (
            Math.abs(s.arcGeometry.radiusMm - expectedRadiusMm) <= toleranceMm
          );
        }
        return true;
      });

      const passed = matchingArcs.length > 0;
      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl}`
          : `✖ ${assertion.descriptionPl} (nie wykryto wymaganego ruchu po łuku G2/G3).`,
      };
    }

    case 'USED_TOOL_POCKETS': {
      const { requiredPockets, requireInOrder } = assertion;
      const usedSequence: number[] = [];
      for (const seg of interp.segments) {
        if (
          seg.toolPocket > 0 &&
          usedSequence[usedSequence.length - 1] !== seg.toolPocket
        ) {
          usedSequence.push(seg.toolPocket);
        }
      }

      let passed = false;
      if (requireInOrder) {
        let reqIdx = 0;
        for (const p of usedSequence) {
          if (p === requiredPockets[reqIdx]) {
            reqIdx++;
            if (reqIdx === requiredPockets.length) break;
          }
        }
        passed = reqIdx === requiredPockets.length;
      } else {
        passed = requiredPockets.every((req) => usedSequence.includes(req));
      }

      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl}`
          : `✖ ${assertion.descriptionPl} (użyto narzędzi: ${
              usedSequence.length > 0
                ? usedSequence.map((t) => `T${t}`).join(' → ')
                : 'brak'
            }).`,
      };
    }

    case 'USED_MODAL_FEATURE': {
      const { feature } = assertion;
      let passed = false;

      if (feature.type === 'LENGTH_COMP') {
        passed = interp.segments.some(
          (s) =>
            s.lengthCompMode === feature.mode &&
            (feature.registerH === undefined ||
              s.activeLengthRegH === feature.registerH)
        );
      } else if (feature.type === 'CUTTER_COMP') {
        passed = interp.segments.some(
          (s) =>
            s.cutterCompMode === feature.mode &&
            (feature.registerD === undefined ||
              s.activeRadiusRegD === feature.registerD)
        );
      } else if (feature.type === 'CANNED_CYCLE') {
        passed = interp.segments.some(
          (s) => s.originatedFromCycle === feature.cycle
        );
      } else if (feature.type === 'WORK_OFFSET') {
        passed = interp.lineSnapshots.some(
          (snap) => snap.modalStateAfter.workOffset === feature.offset
        );
      }

      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl}`
          : `✖ ${assertion.descriptionPl} (wymagana funkcja nie została aktywowana podczas obróbki).`,
      };
    }

    case 'MINIMUM_REMOVED_VOLUME': {
      const passed =
        material.totalRemovedVolumeMm3 >= assertion.minVolumeMm3;
      return {
        assertion,
        passed,
        feedbackPl: passed
          ? `✔ ${assertion.descriptionPl} (usunięto ${Math.round(
              material.totalRemovedVolumeMm3
            )} mm³ materiału)`
          : `✖ ${assertion.descriptionPl} (usunięto tylko ${Math.round(
              material.totalRemovedVolumeMm3
            )} mm³ materiału, wymagane min. ${assertion.minVolumeMm3} mm³).`,
      };
    }
  }
}

/**
 * Ocenia wszystkie kryteria zadania dla danej lekcji na podstawie wyniku symulacji.
 */
export function gradeLessonTask(
  assertions: TaskAssertion[],
  interp: InterpreterResult,
  material: MaterialAnalysisResult
): TaskGradeResult {
  const checks = assertions.map((a) =>
    evaluateSingleAssertion(a, interp, material)
  );
  const passedCount = checks.filter((c) => c.passed).length;
  const passedAll = passedCount === checks.length;

  return {
    passedAll,
    checks,
    summaryPl: passedAll
      ? `🎉 Brawo! Zadanie zaliczone w całości (${passedCount}/${checks.length} kryteriów spełnionych).`
      : `Do zaliczenia zadania pozostało jeszcze ${
          checks.length - passedCount
        } z ${checks.length} kryteriów. Sprawdź szczegóły poniżej lub skorzystaj z podpowiedzi.`,
  };
}
