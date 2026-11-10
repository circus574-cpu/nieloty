/**
 * Rozwijanie cykli stałych wiertarskich G81 (wiercenie zwykłe),
 * G82 (wiercenie z postojem na dnie P) oraz G83 (wiercenie głębokie skokowe Q)
 * z obsługą poziomów powrotu G98 (punkt początkowy Z) oraz G99 (płaszczyzna R).
 */

import type {
  CannedCycleMode,
  CycleReturnMode,
  DiagnosticMessage,
} from '../types/common';
import type { Vector5D } from '../types/machine';

export interface CycleAtomicStep {
  kind: 'MOTION' | 'DWELL';
  motionType?: 'RAPID' | 'LINEAR';
  programmedTargetWcs?: Vector5D;
  dwellSeconds?: number;
  descriptionPl?: string;
}

export interface CannedCycleExpansionInput {
  lineNumber: number;
  cycle: Exclude<CannedCycleMode, 'G80'>;
  returnMode: CycleReturnMode;
  currentProgrammedWcs: Vector5D;
  targetXYWcs: { x: number; y: number; a: number; c: number };
  initialZProgrammed: number;
  retractPlaneRProgrammed: number | null;
  finalDepthZProgrammed: number | null;
  peckIncrementQMm: number | null;
  dwellSecondsP: number | null;
  feedRateMmPerMin: number;
}

export interface CannedCycleExpansionResult {
  steps: CycleAtomicStep[];
  finalProgrammedWcs: Vector5D;
  diagnostics: DiagnosticMessage[];
}

const PECK_CLEARANCE_MM = 0.5;

/**
 * Rozwija pojedyncze wywołanie cyklu G81 / G82 / G83 w sekwencję atomowych ruchów G0/G1 i postojów G4.
 */
export function expandCannedCycle(
  input: CannedCycleExpansionInput
): CannedCycleExpansionResult {
  const {
    lineNumber,
    cycle,
    returnMode,
    currentProgrammedWcs,
    targetXYWcs,
    initialZProgrammed,
    retractPlaneRProgrammed,
    finalDepthZProgrammed,
    peckIncrementQMm,
    dwellSecondsP,
    feedRateMmPerMin,
  } = input;

  const diagnostics: DiagnosticMessage[] = [];
  const steps: CycleAtomicStep[] = [];

  if (retractPlaneRProgrammed === null || finalDepthZProgrammed === null) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'CYCLE_MISSING_PARAMETERS',
      messagePl: `Linia ${lineNumber}: Brak wymaganych parametrów głębokości Z lub płaszczyzny odniesienia R dla cyklu ${cycle}.`,
      hintPl: `W wywołaniu ${cycle} podaj docelową głębokość Z oraz poziom bezpiecznego dojazdu R (np. ${cycle} X10 Y10 Z-15 R2 F150).`,
    });
    return { steps, finalProgrammedWcs: { ...currentProgrammedWcs }, diagnostics };
  }

  if (finalDepthZProgrammed >= retractPlaneRProgrammed - 1e-6) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'CYCLE_MISSING_PARAMETERS',
      messagePl: `Linia ${lineNumber}: W cyklu ${cycle} docelowa współrzędna dna otworu Z (${finalDepthZProgrammed} mm) nie leży poniżej płaszczyzny R (${retractPlaneRProgrammed} mm).`,
      hintPl: 'Współrzędna Z dna otworu musi być mniejsza niż R (np. R2 oraz Z-12).',
    });
    return { steps, finalProgrammedWcs: { ...currentProgrammedWcs }, diagnostics };
  }

  if (cycle === 'G83' && (peckIncrementQMm === null || peckIncrementQMm <= 1e-6)) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'CYCLE_MISSING_PARAMETERS',
      messagePl: `Linia ${lineNumber}: Cykl głębokiego wiercenia G83 wymaga dodatniego parametru skoku Q.`,
      hintPl: 'Dodaj parametr Q określający głębokość pojedynczego zagłębienia wiertła w mm (np. Q4).',
    });
    return { steps, finalProgrammedWcs: { ...currentProgrammedWcs }, diagnostics };
  }

  if (cycle === 'G82' && dwellSecondsP !== null && dwellSecondsP < 0) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'DWELL_NEGATIVE_TIME',
      messagePl: `Linia ${lineNumber}: Czas postoju P w cyklu G82 nie może być ujemny.`,
      hintPl: 'Podaj dodatni czas postoju na dnie otworu (np. P0.5 lub P500).',
    });
    return { steps, finalProgrammedWcs: { ...currentProgrammedWcs }, diagnostics };
  }

  if (feedRateMmPerMin <= 0) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'MISSING_FEED_RATE',
      messagePl: `Linia ${lineNumber}: Wywołano cykl wiertarski ${cycle} bez zaprogramowanego posuwu F (F = 0).`,
      hintPl: 'Podaj dodatnią prędkość posuwu wiercenia F (np. F150).',
    });
    return { steps, finalProgrammedWcs: { ...currentProgrammedWcs }, diagnostics };
  }

  let cursor = { ...currentProgrammedWcs };

  // Krok 1: Dojazd szybki G0 w płaszczyźnie XY do pozycji otworu na bieżącej wysokości Z
  if (
    Math.abs(cursor.x - targetXYWcs.x) > 1e-6 ||
    Math.abs(cursor.y - targetXYWcs.y) > 1e-6 ||
    Math.abs(cursor.a - targetXYWcs.a) > 1e-6 ||
    Math.abs(cursor.c - targetXYWcs.c) > 1e-6
  ) {
    cursor = {
      x: targetXYWcs.x,
      y: targetXYWcs.y,
      z: cursor.z,
      a: targetXYWcs.a,
      c: targetXYWcs.c,
    };
    steps.push({
      kind: 'MOTION',
      motionType: 'RAPID',
      programmedTargetWcs: { ...cursor },
    });
  }

  // Krok 2: Dojazd szybki G0 w osi Z do płaszczyzny R
  if (Math.abs(cursor.z - retractPlaneRProgrammed) > 1e-6) {
    cursor = { ...cursor, z: retractPlaneRProgrammed };
    steps.push({
      kind: 'MOTION',
      motionType: 'RAPID',
      programmedTargetWcs: { ...cursor },
    });
  }

  // Krok 3: Wiercenie robocze w zależności od typu cyklu (G81, G82, G83)
  if (cycle === 'G81' || cycle === 'G82') {
    cursor = { ...cursor, z: finalDepthZProgrammed };
    steps.push({
      kind: 'MOTION',
      motionType: 'LINEAR',
      programmedTargetWcs: { ...cursor },
    });

    if (cycle === 'G82' && dwellSecondsP !== null && dwellSecondsP > 0) {
      steps.push({
        kind: 'DWELL',
        dwellSeconds: dwellSecondsP,
        descriptionPl: `Postój na dnie otworu G82 (${dwellSecondsP.toFixed(2)} s)`,
      });
    }
  } else if (cycle === 'G83' && peckIncrementQMm !== null) {
    let currentHoleDepth = retractPlaneRProgrammed;
    while (currentHoleDepth > finalDepthZProgrammed + 1e-6) {
      const nextDepth = Math.max(finalDepthZProgrammed, currentHoleDepth - peckIncrementQMm);

      // Jeśli to kolejny skok (nie pierwszy), zjedź szybko G0 tuż nad poprzednie dno
      if (currentHoleDepth < retractPlaneRProgrammed - 1e-6) {
        const approachZ = Math.min(retractPlaneRProgrammed, currentHoleDepth + PECK_CLEARANCE_MM);
        cursor = { ...cursor, z: approachZ };
        steps.push({
          kind: 'MOTION',
          motionType: 'RAPID',
          programmedTargetWcs: { ...cursor },
        });
      }

      // Skok roboczy G1 na nową głębokość
      cursor = { ...cursor, z: nextDepth };
      steps.push({
        kind: 'MOTION',
        motionType: 'LINEAR',
        programmedTargetWcs: { ...cursor },
      });

      currentHoleDepth = nextDepth;

      // Jeśli jeszcze nie osiągnięto dna końcowego, wycofaj szybko G0 do R w celu ewakuacji wióra
      if (currentHoleDepth > finalDepthZProgrammed + 1e-6) {
        cursor = { ...cursor, z: retractPlaneRProgrammed };
        steps.push({
          kind: 'MOTION',
          motionType: 'RAPID',
          programmedTargetWcs: { ...cursor },
        });
      }
    }
  }

  // Krok 4: Wycofanie szybkie G0 do poziomu powrotu (G98 -> initialZ, G99 -> R)
  const returnZ =
    returnMode === 'G98'
      ? Math.max(initialZProgrammed, retractPlaneRProgrammed)
      : retractPlaneRProgrammed;

  cursor = { ...cursor, z: returnZ };
  steps.push({
    kind: 'MOTION',
    motionType: 'RAPID',
    programmedTargetWcs: { ...cursor },
  });

  return {
    steps,
    finalProgrammedWcs: cursor,
    diagnostics,
  };
}
