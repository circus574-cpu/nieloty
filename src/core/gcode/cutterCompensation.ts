/**
 * Obsługa korekcji promienia narzędzia G40 / G41 (lewostronna) / G42 (prawostronna)
 * z tabelą rejestrów D oraz wykrywaniem błędów aktywacji (CUTTER_COMP_ON_RAPID)
 * i podcięcia konturu (COMPENSATION_GOUGE).
 */

import type {
  CutterCompMode,
  DiagnosticMessage,
  LinearOrArcMotionMode,
  PlaneMode,
} from '../types/common';
import type {
  ToolOffsetRegister,
  Vector5D,
} from '../types/machine';

export interface CutterCompEvaluationInput {
  lineNumber: number;
  plane: PlaneMode;
  previousCompMode: CutterCompMode;
  newCompMode: CutterCompMode;
  activeRadiusRegD: number;
  motionMode: LinearOrArcMotionMode | null;
  hasPlanarMotion: boolean;
  programmedStartWcs: Vector5D;
  programmedEndWcs: Vector5D;
  currentActualWcs: Vector5D;
  programmedArcRadiusMm?: number;
  toolOffsets: ToolOffsetRegister[];
}

export interface CutterCompEvaluationResult {
  compensatedStartWcs: Vector5D;
  compensatedEndWcs: Vector5D;
  offsetVectorXY: { dx: number; dy: number };
  effectiveRadiusOffsetMm: number;
  diagnostics: DiagnosticMessage[];
}

/**
 * Oblicza przesunięcie toru narzędzia dla korekcji promienia G40/G41/G42
 * oraz sprawdza ograniczenia technologiczne i geometryczne.
 */
export function evaluateCutterCompensation(
  input: CutterCompEvaluationInput
): CutterCompEvaluationResult {
  const {
    lineNumber,
    previousCompMode,
    newCompMode,
    activeRadiusRegD,
    motionMode,
    hasPlanarMotion,
    programmedStartWcs,
    programmedEndWcs,
    currentActualWcs,
    programmedArcRadiusMm,
    toolOffsets,
  } = input;

  const diagnostics: DiagnosticMessage[] = [];
  const isTurningOn = previousCompMode === 'G40' && (newCompMode === 'G41' || newCompMode === 'G42');
  const isTurningOff = (previousCompMode === 'G41' || previousCompMode === 'G42') && newCompMode === 'G40';

  // 1. Walidacja włączenia/wyłączenia w ruchu szybkim G0 lub w łuku G2/G3
  if (isTurningOn) {
    if (motionMode === 'G0' || motionMode === 'G2' || motionMode === 'G3') {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'CUTTER_COMP_ON_RAPID',
        messagePl: `Linia ${lineNumber}: Niedozwolone włączenie korekcji promienia (${newCompMode}) podczas ruchu ${motionMode}.`,
        hintPl: 'Korekcję promienia narzędzia (G41/G42) należy zawsze włączać w prostoliniowym ruchu roboczym G1 (na odcinku dojazdowym).',
      });
    }
  } else if (isTurningOff && hasPlanarMotion) {
    if (motionMode === 'G0' || motionMode === 'G2' || motionMode === 'G3') {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'CUTTER_COMP_ON_RAPID',
        messagePl: `Linia ${lineNumber}: Niedozwolone odwołanie korekcji promienia (G40) z ruchem w trybie ${motionMode}.`,
        hintPl: 'Odwołaj korekcję G40 w prostoliniowym ruchu wyjazdowym G1 albo w osobnej linii po odjeździe narzędziem nad detal.',
      });
    }
  }

  // Jeśli korekcja jest wyłączona (G40), wierzchołek jedzie do zaprogramowanego punktu końcowego
  if (newCompMode === 'G40') {
    return {
      compensatedStartWcs: { ...currentActualWcs },
      compensatedEndWcs: { ...programmedEndWcs },
      offsetVectorXY: { dx: 0, dy: 0 },
      effectiveRadiusOffsetMm: 0,
      diagnostics,
    };
  }

  // 2. Pobranie wartości promienia z rejestru D w tabeli offsetów sterownika
  const reg = toolOffsets.find((r) => r.registerNumber === activeRadiusRegD);
  if (!reg || activeRadiusRegD <= 0) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'OFFSET_REGISTER_NOT_FOUND',
      messagePl: `Linia ${lineNumber}: Brak poprawnego rejestru korekcji promienia D${activeRadiusRegD > 0 ? activeRadiusRegD : ''} dla aktywnego ${newCompMode}.`,
      hintPl: 'Przy włączaniu G41/G42 podaj istniejący numer korektora promienia z tabeli narzędzi, np. G41 D1.',
    });
    return {
      compensatedStartWcs: { ...currentActualWcs },
      compensatedEndWcs: { ...programmedEndWcs },
      offsetVectorXY: { dx: 0, dy: 0 },
      effectiveRadiusOffsetMm: 0,
      diagnostics,
    };
  }

  const radiusOffsetMm = reg.radiusOffsetMm + reg.radiusWearMm;
  const dxProg = programmedEndWcs.x - programmedStartWcs.x;
  const dyProg = programmedEndWcs.y - programmedStartWcs.y;
  const planarLen = Math.hypot(dxProg, dyProg);

  if (!hasPlanarMotion || planarLen < 1e-6) {
    // Ruch wyłącznie w osi Z (lub brak ruchu XY) – utrzymujemy dotychczasowe przesunięcie XY
    const currentOffsetDx = currentActualWcs.x - programmedStartWcs.x;
    const currentOffsetDy = currentActualWcs.y - programmedStartWcs.y;
    return {
      compensatedStartWcs: { ...currentActualWcs },
      compensatedEndWcs: {
        ...programmedEndWcs,
        x: programmedEndWcs.x + currentOffsetDx,
        y: programmedEndWcs.y + currentOffsetDy,
      },
      offsetVectorXY: { dx: currentOffsetDx, dy: currentOffsetDy },
      effectiveRadiusOffsetMm: radiusOffsetMm,
      diagnostics,
    };
  }

  // 3. Sprawdzenie podcięcia konturu (COMPENSATION_GOUGE)
  if (motionMode === 'G2' || motionMode === 'G3') {
    // Wewnętrzny łuk: dla G41 (lewo) wewnętrzny jest łuk G3 (CCW); dla G42 (prawo) wewnętrzny jest łuk G2 (CW)
    const isInsideArc =
      (newCompMode === 'G41' && motionMode === 'G3') ||
      (newCompMode === 'G42' && motionMode === 'G2');
    if (
      isInsideArc &&
      programmedArcRadiusMm !== undefined &&
      programmedArcRadiusMm < radiusOffsetMm - 1e-6
    ) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'COMPENSATION_GOUGE',
        messagePl: `Linia ${lineNumber}: Podcięcie konturu! Promień łuku wewnętrznego (${programmedArcRadiusMm.toFixed(2)} mm) jest mniejszy niż promień korekcji narzędzia D${activeRadiusRegD} (${radiusOffsetMm.toFixed(2)} mm).`,
        hintPl: 'Użyj frezu o mniejszej średnicy lub zwiększ promień zaokrąglenia naroża wewnętrznego w programie.',
      });
    }
  } else if (planarLen < radiusOffsetMm - 1e-6) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'COMPENSATION_GOUGE',
      messagePl: `Linia ${lineNumber}: Odcinek ruchu (${planarLen.toFixed(2)} mm) podczas korekcji ${newCompMode} jest krótszy niż promień narzędzia D${activeRadiusRegD} (${radiusOffsetMm.toFixed(2)} mm), co powoduje podcięcie konturu.`,
      hintPl: `Wydłuż odcinek dojazdowy/konturowy do co najmniej ${radiusOffsetMm.toFixed(1)} mm.`,
    });
  }

  // Wektor jednostkowy styczny i normalny w płaszczyźnie XY:
  // G41 (po lewej stronie): normalna (-ty, tx)
  // G42 (po prawej stronie): normalna (ty, -tx)
  const tx = dxProg / planarLen;
  const ty = dyProg / planarLen;
  const nx = newCompMode === 'G41' ? -ty : ty;
  const ny = newCompMode === 'G41' ? tx : -tx;

  const offsetDx = nx * radiusOffsetMm;
  const offsetDy = ny * radiusOffsetMm;

  return {
    compensatedStartWcs: { ...currentActualWcs },
    compensatedEndWcs: {
      ...programmedEndWcs,
      x: programmedEndWcs.x + offsetDx,
      y: programmedEndWcs.y + offsetDy,
    },
    offsetVectorXY: { dx: offsetDx, dy: offsetDy },
    effectiveRadiusOffsetMm: radiusOffsetMm,
    diagnostics,
  };
}
