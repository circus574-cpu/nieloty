/**
 * Testy jednostkowe czystego interpretera G-code (Etap 1).
 * Co najmniej po 3 przypadki (poprawny, graniczny, błędny) dla każdego polecenia
 * z weryfikacją współrzędnych oraz polskich komunikatów diagnostycznych.
 */

import { describe, expect, it } from 'vitest';
import { interpretGCode } from '../core/gcode/interpreter';
import {
  EARLY_LESSON_VALIDATION_POLICY,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../core/machines/presets';

describe('Interpreter G-code: Komentarze, numery bloków N i składnia', () => {
  it('1. [Poprawny] obsługuje numery bloków N, komentarze nawiasowe i średnikowe oraz małą/wielką literę', () => {
    const code = `
      %
      O0001 (Program testowy)
      N10 g21 g90 (Jednostki mm) ; komentarz po średniku
      N20 T1 M6
      N30 G43 H1 Z50
      N40 g0 x15.5 y25.25
      N50 M30
      %
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.ir.programName).toBe('O0001');
    expect(res.finalModalState.positionWcs.x).toBeCloseTo(15.5, 4);
    expect(res.finalModalState.positionWcs.y).toBeCloseTo(25.25, 4);
    expect(res.finalModalState.positionWcs.z).toBeCloseTo(50, 4);
  });

  it('2. [Graniczny] akceptuje wiele komentarzy w jednej linii oraz spacje między literą a liczbą', () => {
    const code = `
      N5 (komentarz 1) G0 (komentarz 2) X 30.0 Y -10.5 ; koniec linii
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(true);
    expect(res.segments).toHaveLength(1);
    expect(res.segments[0]!.endWcs.x).toBeCloseTo(30.0, 4);
    expect(res.segments[0]!.endWcs.y).toBeCloseTo(-10.5, 4);
  });

  it('3. [Błędny] wykrywa niezamknięty komentarz nawiasowy, brak liczby oraz nieznany adres', () => {
    const code = `
      G0 X10 (niezamkniety komentarz
      G1 X Y20 F200
      E55
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes).toContain('SYNTAX_UNCLOSED_COMMENT');
    expect(codes).toContain('SYNTAX_MISSING_NUMBER');
    expect(codes).toContain('SYNTAX_UNKNOWN_WORD');
    expect(res.diagnostics[0]!.messagePl).toContain('Linia 2');
  });
});

describe('Interpreter G-code: Ruch szybki G0 i krańcówki maszyny', () => {
  it('1. [Poprawny] wykonuje ruch szybki G0 do zadanych współrzędnych i wylicza czas trwania', () => {
    const code = `
      T1 M6
      G43 H1 Z10
      G0 X100 Y50
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const lastSeg = res.segments[res.segments.length - 1]!;
    expect(lastSeg.type).toBe('RAPID');
    expect(lastSeg.endWcs).toEqual({ x: 100, y: 50, z: 10, a: 0, c: 0 });
    expect(res.stats.rapidTimeSeconds).toBeGreaterThan(0);
  });

  it('2. [Graniczny] akceptuje ruch dokładnie do granicy krańcówki osi X (MCS max = 350 mm, G54.x = 50 -> WCS X = 300)', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X300 Y0
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.finalModalState.positionMcs.x).toBeCloseTo(350, 4);
  });

  it('3. [Błędny] zgłasza błąd EXCEEDED_MACHINE_LIMITS przy wyjeździe poza zakres maszyny', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X350 Y0
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(false);
    const err = res.diagnostics.find((d) => d.code === 'EXCEEDED_MACHINE_LIMITS');
    expect(err).toBeDefined();
    expect(err!.messagePl).toContain('Linia 4');
    expect(err!.messagePl).toContain('osi X');
  });
});

describe('Interpreter G-code: Ruch roboczy G1 oraz posuw F', () => {
  it('1. [Poprawny] wykonuje ruch roboczy G1 z zadanym posuwem F i wylicza dokładny czas skrawania', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y0
      G1 X60 Y0 F120
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const cutSeg = res.segments.find((s) => s.type === 'LINEAR')!;
    expect(cutSeg.lengthMm).toBeCloseTo(60, 4);
    // 60 mm przy posuwie 120 mm/min = 0.5 minuty = 30 sekund
    expect(cutSeg.durationSeconds).toBeCloseTo(30, 4);
  });

  it('2. [Graniczny] pamięta modalnie kod G1 oraz posuw F w kolejnych blokach zawierających same współrzędne', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G1 X10 Y0 F300
      X20 Y10
      X30 Y10
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const linearSegs = res.segments.filter((s) => s.type === 'LINEAR');
    expect(linearSegs).toHaveLength(3);
    expect(linearSegs[2]!.endWcs.x).toBeCloseTo(30, 4);
    expect(linearSegs[2]!.feedRateMmPerMin).toBeCloseTo(300, 4);
  });

  it('3. [Błędny] zgłasza błąd MISSING_FEED_RATE przy próbie wykonania G1 bez podania F', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G1 X25 Y25
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(false);
    const err = res.diagnostics.find((d) => d.code === 'MISSING_FEED_RATE');
    expect(err).toBeDefined();
    expect(err!.messagePl).toContain('posuwu F');
  });
});

describe('Interpreter G-code: Płaszczyzny G17, G18, G19', () => {
  it('1. [Poprawny] domyślnie pracuje w płaszczyźnie G17 (XY) i pozwala przełączyć na G18 (ZX)', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y0
      G18 G2 X10 Z-10 I10 K0 F200
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.finalModalState.plane).toBe('G18');
    const arcSeg = res.segments.find((s) => s.type === 'ARC_CW')!;
    expect(arcSeg.arcGeometry?.plane).toBe('G18');
    expect(arcSeg.arcGeometry?.normalVector).toEqual({ x: 0, y: 1, z: 0 });
  });

  it('2. [Graniczny] wykonuje łuk w płaszczyźnie G19 (YZ) za pomocą wektorów J oraz K', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y0
      G19 G3 Y10 Z10 J0 K10 F200
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.finalModalState.plane).toBe('G19');
    const arcSeg = res.segments.find((s) => s.type === 'ARC_CCW')!;
    expect(arcSeg.arcGeometry?.plane).toBe('G19');
    expect(arcSeg.arcGeometry?.radiusMm).toBeCloseTo(10, 4);
  });

  it('3. [Błędny] wykrywa konflikt G17 i G18 w jednym bloku (CONFLICTING_GCODES_IN_BLOCK)', () => {
    const code = `G17 G18 G0 X10`;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    expect(res.diagnostics.some((d) => d.code === 'CONFLICTING_GCODES_IN_BLOCK')).toBe(true);
  });
});

describe('Interpreter G-code: Jednostki G20 (cale) i G21 (milimetry) – Reguła 6', () => {
  it('1. [Poprawny] zachowuje dosłowne wartości w IR, a w interpreterze przelicza G20 (cale) na mm (1 cal = 25.4 mm)', () => {
    const code = `
      G20
      T1 M6
      G0 X1.0 Y2.0
      G1 X2.0 F10.0
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    // W IR wartość X wynosi dosłownie 1.0 (bez przeliczania!)
    const moveBlock = res.ir.blocks.find((b) => b.targetAxes?.x === 1.0);
    expect(moveBlock).toBeDefined();
    // W interpreterze współrzędne są przeliczone na mm: X=2.0 cala -> 50.8 mm, Y=2.0 cala -> 50.8 mm, F=10 cali/min -> 254 mm/min
    expect(res.finalModalState.positionWcs.x).toBeCloseTo(50.8, 4);
    expect(res.finalModalState.positionWcs.y).toBeCloseTo(50.8, 4);
    expect(res.finalModalState.feedRateMmPerMin).toBeCloseTo(254.0, 4);
  });

  it('2. [Graniczny] pozwala przełączyć z G20 na G21 w trakcie programu', () => {
    const code = `
      G20 G0 X1.0 Y0
      G21 G0 X30.0 Y0
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(true);
    expect(res.segments[0]!.endWcs.x).toBeCloseTo(25.4, 4);
    expect(res.segments[1]!.endWcs.x).toBeCloseTo(30.0, 4);
  });

  it('3. [Błędny] odrzuca jednoczesne podanie G20 i G21 w jednym bloku', () => {
    const res = interpretGCode({
      sourceText: 'G20 G21 X10',
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    expect(res.diagnostics[0]!.code).toBe('CONFLICTING_GCODES_IN_BLOCK');
  });
});

describe('Interpreter G-code: Tryby wymiarowania G90 (bezwzględny) i G91 (przyrostowy)', () => {
  it('1. [Poprawny] prawidłowo sumuje przyrosty w trybie G91 i wraca do G90', () => {
    const code = `
      G90 G0 X10 Y10
      G91 G1 X15 Y-5 F200
      X5 Y10
      G90 G0 X0 Y0
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(true);
    expect(res.segments[1]!.endWcs.x).toBeCloseTo(25, 4);
    expect(res.segments[1]!.endWcs.y).toBeCloseTo(5, 4);
    expect(res.segments[2]!.endWcs.x).toBeCloseTo(30, 4);
    expect(res.segments[2]!.endWcs.y).toBeCloseTo(15, 4);
    expect(res.segments[3]!.endWcs.x).toBeCloseTo(0, 4);
    expect(res.segments[3]!.endWcs.y).toBeCloseTo(0, 4);
  });

  it('2. [Graniczny] ruch przyrostowy G91 X0 Y0 Z0 ma zerową długość i nie zmienia pozycji', () => {
    const code = `
      G90 G0 X20 Y30
      G91 G1 X0 Y0 F100
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(true);
    expect(res.segments[1]!.lengthMm).toBeCloseTo(0, 6);
    expect(res.finalModalState.positionWcs.x).toBeCloseTo(20, 4);
    expect(res.finalModalState.positionWcs.y).toBeCloseTo(30, 4);
  });

  it('3. [Błędny] odrzuca jednoczesne użycie G90 i G91 w jednej linii', () => {
    const res = interpretGCode({
      sourceText: 'G90 G91 X10',
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    expect(res.diagnostics[0]!.code).toBe('CONFLICTING_GCODES_IN_BLOCK');
  });
});

describe('Interpreter G-code: Punkty zerowe przedmiotu G54–G59', () => {
  it('1. [Poprawny] przełącza bazę z G54 (X_mcs=50) na G55 (X_mcs=180) i jedzie do X10 w G55 (X_mcs=190)', () => {
    const code = `
      T1 M6
      G43 H1 Z10
      G54 G0 X10 Y10
      G55 G0 X10 Y10
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.segments[1]!.endMcs.x).toBeCloseTo(60, 4); // 50 + 10
    expect(res.segments[2]!.endMcs.x).toBeCloseTo(190, 4); // 180 + 10
    expect(res.finalModalState.workOffset).toBe('G55');
  });

  it('2. [Graniczny] samo wywołanie G56 bez ruchu nie przemieszcza fizycznej maszyny (positionMcs pozostaje stałe)', () => {
    const code = `
      T1 M6
      G43 H1 Z10
      G54 G0 X20 Y20
      G56
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const snapBefore = res.lineSnapshots[2]!.modalStateAfter;
    const snapAfter = res.lineSnapshots[3]!.modalStateAfter;
    expect(snapAfter.positionMcs).toEqual(snapBefore.positionMcs);
    // G54 Y=40, G56 Y=140 -> różnica 100 mm, więc Y=20 w G54 to Y=-80 w G56
    expect(snapAfter.positionWcs.y).toBeCloseTo(-80, 4);
  });

  it('3. [Błędny] zgłasza konflikt przy podaniu dwóch baz G54 i G55 w jednej linii', () => {
    const res = interpretGCode({
      sourceText: 'G54 G55 G0 X0 Y0',
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    expect(res.diagnostics[0]!.code).toBe('CONFLICTING_GCODES_IN_BLOCK');
  });
});

describe('Interpreter G-code: Wymiana narzędzia T i M6 oraz korekcja długości G43/G44/G49 (Reguła 3 i 4)', () => {
  it('1. [Poprawny] po T1 M6 oraz G43 H1 wierzchołek narzędzia (lengthMm=50, H1=50) znajduje się dokładnie w zaprogramowanym Z', () => {
    const code = `
      T1 M6
      G43 H1 Z25
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.finalModalState.activeToolPocket).toBe(1);
    expect(res.finalModalState.programmedPositionWcs.z).toBeCloseTo(25, 4);
    expect(res.finalModalState.positionWcs.z).toBeCloseTo(25, 4);
  });

  it('2. [Graniczny] bez aktywnego G43 (przy G49) zaprogramowane Z dotyczy czoła wrzeciona, więc wierzchołek T1 leży o 50 mm niżej (Reguła 3)', () => {
    const code = `
      T1 M6
      G49 G0 Z25
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    // Zaprogramowane Z = 25 (czoło wrzeciona), a fizyczna długość T1 = 50 mm -> wierzchołek na Z = -25 mm!
    expect(res.finalModalState.programmedPositionWcs.z).toBeCloseTo(25, 4);
    expect(res.finalModalState.positionWcs.z).toBeCloseTo(-25, 4);
  });

  it('3. [Graniczny] przy niezgodnym rejestrze (T1 length=50 mm z G43 H2=45 mm) ostrzega MISMATCHED_H_OFFSET i wylicza rzeczywiste przesunięcie -5 mm (Reguła 4)', () => {
    const code = `
      T1 M6
      G43 H2 Z20
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const warn = res.diagnostics.find((d) => d.code === 'MISMATCHED_H_OFFSET');
    expect(warn).toBeDefined();
    // Z_tip = Z_prog (20) + H2 (45) - L_T1 (50) = 15 mm
    expect(res.finalModalState.positionWcs.z).toBeCloseTo(15, 4);
  });

  it('4. [Błędny] wykrywa nieistniejące narzędzie T99, brak narzędzia we wrzecionie oraz nieistniejący rejestr H99', () => {
    const code = `
      G1 X10 F100
      T99 M6
      T1 M6
      G43 H99 Z10
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
      initialActiveToolPocket: 0,
    });

    expect(res.success).toBe(false);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes).toContain('NO_TOOL_IN_SPINDLE');
    expect(codes).toContain('TOOL_NOT_FOUND');
    expect(codes).toContain('OFFSET_REGISTER_NOT_FOUND');
  });
});

describe('Interpreter G-code: Wrzeciono (S, M3, M4, M5), chłodziwo (M8, M9), pauza (G4) i koniec (M2/M30)', () => {
  it('1. [Poprawny] włącza wrzeciono S3000 M3, chłodziwo M8, wykonuje postój G4 P1.5 i kończy M30', () => {
    const code = `
      T1 M6
      S3000 M3 M8
      G4 P1.5
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.stats.toolChangeAndDwellSeconds).toBeCloseTo(4 + 1.5, 4);
    expect(res.finalModalState.isProgramEnded).toBe(true);
    expect(res.finalModalState.spindleState).toBe('M5_STOP');
    expect(res.finalModalState.coolantState).toBe('M9_OFF');
  });

  it('2. [Graniczny] przelicza G4 P500 (zapis całkowity >= 100 ms) na 0.5 sekundy i ignoruje linie po M2', () => {
    const code = `
      T1 M6
      G4 P500
      M2
      G0 X100 Y100
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.stats.toolChangeAndDwellSeconds).toBeCloseTo(4 + 0.5, 4);
    expect(res.segments).toHaveLength(0);
  });

  it('3. [Błędny] zgłasza DWELL_NEGATIVE_TIME dla ujemnego czasu G4, konflikt M3 M4 oraz UNSUPPORTED_FEATURE dla G28 i G53', () => {
    const code = `
      M3 M4
      G4 P-2
      G28 Z0
      G53 Z0
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
      initialActiveToolPocket: 1,
    });

    expect(res.success).toBe(false);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes).toContain('CONFLICTING_GCODES_IN_BLOCK');
    expect(codes).toContain('DWELL_NEGATIVE_TIME');
    const unsupported = res.diagnostics.filter((d) => d.code === 'UNSUPPORTED_FEATURE');
    expect(unsupported.length).toBeGreaterThanOrEqual(2);
    expect(unsupported[0]!.messagePl).toContain('G28');
    expect(unsupported[1]!.messagePl).toContain('G53');
  });
});
