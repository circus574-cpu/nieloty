/**
 * Analizator obróbki materiału oraz kolizji (Krok 3 potoku wykonawczego).
 * Przyjmuje czystą reprezentację ruchów z interpretera (MotionSegment[]), definicję surówki (stock),
 * fizyczne narzędzia (tools), wymienny model materiału (IMaterialModel) oraz politykę walidacji.
 *
 * Wylicza ubytek materiału i wykrywa błędy zależne od kontaktu z surówką:
 * - RAPID_COLLISION_IN_MATERIAL (ruch szybki G0 w materiał),
 * - SPINDLE_OFF_DURING_CUT (skrawanie przy wyłączonym wrzecionie M5),
 * - CUT_BELOW_WORKPIECE_BOTTOM (zjazd poniżej dolnej powierzchni surówki).
 */

import type {
  DiagnosticCode,
  DiagnosticMessage,
} from '../types/common';
import type {
  MaterialAnalysisInput,
  MaterialAnalysisResult,
  SegmentMaterialAnnotation,
} from '../types/material';

export function analyzeToolpathMaterial(
  input: MaterialAnalysisInput
): MaterialAnalysisResult {
  const {
    segments,
    stock,
    tools,
    materialModel,
    validationPolicy,
  } = input;

  const stockBottomZ =
    stock.kind === 'PRISMATIC'
      ? stock.minCornerInWcs.z
      : -stock.outerDiameterMm / 2;

  const workingModel = materialModel.clone();
  const segmentAnnotations = new Map<number, SegmentMaterialAnnotation>();
  const materialDiagnostics: DiagnosticMessage[] = [];
  let totalRemovedVolumeMm3 = 0;

  for (const seg of segments) {
    const tool = tools.find((t) => t.pocketNumber === seg.toolPocket);
    const outcome = workingModel.applySegment(seg, tool);
    totalRemovedVolumeMm3 += outcome.removedVolumeMm3;

    const collisionCodes: DiagnosticCode[] = [];

    // 1. Kolizja w ruchu szybkim G0 z materiałem
    if (
      validationPolicy.forbidRapidInMaterial &&
      seg.type === 'RAPID' &&
      outcome.didTouchMaterial
    ) {
      collisionCodes.push('RAPID_COLLISION_IN_MATERIAL');
      materialDiagnostics.push({
        lineNumber: seg.lineNumber,
        severity: 'ERROR',
        code: 'RAPID_COLLISION_IN_MATERIAL',
        messagePl: `Linia ${seg.lineNumber}: KOLIZJA! Ruch szybki G0 uderza w materiał przedmiotu obrabianego (Z = ${outcome.minToolTipZInStockWcs.toFixed(2)} mm).`,
        hintPl: 'Zatrzymaj ruch szybki G0 na bezpiecznej wysokości nad materiałem (np. Z2 lub Z5), a w materiał wchodź wyłącznie ruchem roboczym G1 z posuwem F.',
        relatedSegmentId: seg.id,
      });
    }

    // 2. Wejście w materiał przy wyłączonym wrzecionie (M5)
    if (
      validationPolicy.requireSpindleOnForCutting &&
      outcome.didTouchMaterial &&
      (seg.spindleState === 'M5_STOP' || seg.spindleRpm <= 0)
    ) {
      collisionCodes.push('SPINDLE_OFF_DURING_CUT');
      materialDiagnostics.push({
        lineNumber: seg.lineNumber,
        severity: 'ERROR',
        code: 'SPINDLE_OFF_DURING_CUT',
        messagePl: `Linia ${seg.lineNumber}: Narzędzie wchodzi w materiał przy nieruchomym wrzecionie (brak M3/M4 lub S=0)!`,
        hintPl: 'Przed rozpoczęciem skrawania włącz obroty wrzeciona, np. S2500 M3.',
        relatedSegmentId: seg.id,
      });
    }

    // 3. Zjazd wierzchołkiem narzędzia poniżej dna przedmiotu (ryzyko wwiercenia w stół/imadło)
    if (
      validationPolicy.forbidCutBelowStockBottom &&
      outcome.wentBelowStockBottom
    ) {
      collisionCodes.push('CUT_BELOW_WORKPIECE_BOTTOM');
      materialDiagnostics.push({
        lineNumber: seg.lineNumber,
        severity: 'ERROR',
        code: 'CUT_BELOW_WORKPIECE_BOTTOM',
        messagePl: `Linia ${seg.lineNumber}: Wierzchołek narzędzia zszedł poniżej dna przedmiotu obrabianego (osiągnięto Z = ${outcome.minToolTipZInStockWcs.toFixed(2)} mm przy dnie na Z = ${stockBottomZ.toFixed(2)} mm)!`,
        hintPl: 'Sprawdź zaprogramowaną głębokość Z oraz upewnij się, że włączono właściwą korekcję długości narzędzia (G43 H..).',
        relatedSegmentId: seg.id,
      });
    }

    segmentAnnotations.set(seg.id, {
      segmentId: seg.id,
      isCuttingMaterial: outcome.didTouchMaterial,
      removedVolumeMm3: outcome.removedVolumeMm3,
      hasCollisionOrError: collisionCodes.length > 0,
      collisionCodes,
    });
  }

  const hasErrors = materialDiagnostics.some((d) => d.severity === 'ERROR');

  return {
    success: !hasErrors,
    segmentAnnotations,
    materialDiagnostics,
    totalRemovedVolumeMm3,
    finalMaterialModel: workingModel,
  };
}
