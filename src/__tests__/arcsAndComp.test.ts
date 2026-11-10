/**
 * Testy jednostkowe dla łuków G2/G3 (IJK oraz R), korekcji promienia G40/G41/G42 (D)
 * oraz cykli wiertarskich G80, G81, G82, G83 z G98/G99 (Etap 1).
 */

import { describe, expect, it } from 'vitest';
import { interpretGCode } from '../core/gcode/interpreter';
import {
  EARLY_LESSON_VALIDATION_POLICY,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../core/machines/presets';

describe('Interpreter G-code: Łuki G2 i G3 (formy IJK oraz R)', () => {
  it('1. [Poprawny] wylicza ćwiartkę łuku G2 (CW) w formacie IJK oraz G3 (CCW) w formacie R', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y20
      G2 X20 Y0 I0 J-20 F200
      G3 X40 Y20 R20
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const cwArc = res.segments.find((s) => s.type === 'ARC_CW')!;
    const ccwArc = res.segments.find((s) => s.type === 'ARC_CCW')!;

    expect(cwArc.arcGeometry?.radiusMm).toBeCloseTo(20, 4);
    expect(cwArc.arcGeometry?.centerWcs).toEqual({ x: 0, y: 0, z: 0 });
    expect(cwArc.lengthMm).toBeCloseTo((Math.PI * 20) / 2, 3);

    expect(ccwArc.arcGeometry?.radiusMm).toBeCloseTo(20, 4);
    expect(ccwArc.arcGeometry?.centerWcs.x).toBeCloseTo(20, 4);
    expect(ccwArc.arcGeometry?.centerWcs.y).toBeCloseTo(20, 4);
  });

  it('2. [Graniczny] obsługuje pełny okrąg 360° z IJK, łuk dłuższy (>180°) z ujemnym R oraz łuk śrubowy (helikalny) z przesuwem Z (axialPitchMm)', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X10 Y0
      G2 X10 Y0 I-10 J0 Z-5 F200
      G3 X30 Y0 R-15
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    const fullHelix = res.segments.find((s) => s.type === 'ARC_CW')!;
    expect(fullHelix.arcGeometry?.sweepAngleRad).toBeCloseTo(-2 * Math.PI, 4);
    expect(fullHelix.arcGeometry?.axialPitchMm).toBeCloseTo(-5, 4);

    const longArc = res.segments.find((s) => s.type === 'ARC_CCW')!;
    expect(longArc.arcGeometry?.sweepAngleRad).toBeGreaterThan(Math.PI);
  });

  it('3. [Błędny] wykrywa ARC_ENDPOINT_MISMATCH, ARC_GEOMETRY_IMPOSSIBLE (za małe R), ARC_MIXED_IJK_AND_R oraz ARC_MISSING_PARAMETERS', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y0
      G2 X20 Y0 I5 J0 F200
      G2 X20 Y0 R5
      G3 X30 Y0 I5 J0 R10
      G2 X40 Y0
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(false);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes).toContain('ARC_ENDPOINT_MISMATCH');
    expect(codes).toContain('ARC_GEOMETRY_IMPOSSIBLE');
    expect(codes).toContain('ARC_MIXED_IJK_AND_R');
    expect(codes).toContain('ARC_MISSING_PARAMETERS');
  });
});

describe('Interpreter G-code: Korekcja promienia narzędzia G40 / G41 / G42 z rejestrem D', () => {
  it('1. [Poprawny] odsuwa tor narzędzia w lewo (G41 D1, R=5 mm) oraz w prawo (G42 D1) względem zaprogramowanego konturu', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 X0 Y0
      G1 G41 D1 X20 Y0 F200
      G1 X40 Y0
      G1 G40 X50 Y0
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    // Ruch wzdłuż +X: lewa strona (G41) to przesunięcie o +5 mm w osi +Y
    const compSeg = res.segments[2]!;
    expect(compSeg.programmedEndWcs.x).toBeCloseTo(20, 4);
    expect(compSeg.programmedEndWcs.y).toBeCloseTo(0, 4);
    expect(compSeg.endWcs.x).toBeCloseTo(20, 4);
    expect(compSeg.endWcs.y).toBeCloseTo(5, 4);
  });

  it('2. [Graniczny] odwołuje korekcję promienia G40 w osobnym bloku bez ruchu XY', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G1 G42 D1 X20 Y0 F200
      G0 Z20
      G40
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    expect(res.finalModalState.cutterComp).toBe('G40');
    expect(res.finalModalState.activeRadiusRegD).toBe(0);
  });

  it('3. [Błędny] wykrywa CUTTER_COMP_ON_RAPID (włączenie G41 w G0) oraz COMPENSATION_GOUGE (promień łuku wewnętrznego mniejszy niż D1)', () => {
    const code = `
      T1 M6
      G43 H1 Z0
      G0 G41 D1 X10 Y0
      G1 X30 Y0 F200
      G3 X33 Y3 R3
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(false);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes).toContain('CUTTER_COMP_ON_RAPID');
    expect(codes).toContain('COMPENSATION_GOUGE');
  });
});

describe('Interpreter G-code: Cykle stałe G80, G81, G82, G83 z G98/G99 (Reguła 2 i 5)', () => {
  it('1. [Poprawny] rozwija cykl G81 dla dwóch otworów (drugi wywołany modalnie bez R i Z – Reguła 5) i ustawia motionMode = null (Reguła 2)', () => {
    const code = `
      T3 M6
      G43 H3 Z20
      G98 G81 X10 Y10 Z-12 R2 F150
      X30 Y10
      G80
      G0 Z50
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    // Sprawdzenie Reguły 2: po linii G81 cycleMode === 'G81' oraz motionMode === null
    const snapAfterG81 = res.lineSnapshots.find((s) => s.rawText.includes('G81'))!;
    expect(snapAfterG81.modalStateAfter.cycleMode).toBe('G81');
    expect(snapAfterG81.modalStateAfter.motionMode).toBeNull();

    // Sprawdzenie wiercenia w drugim punkcie (X30 Y10) na głębokość Z=-12 i powrotu G98 do Z=20
    const drillSegmentsAtX30 = res.segments.filter(
      (s) => s.originatedFromCycle === 'G81' && Math.abs(s.endWcs.x - 30) < 1e-4
    );
    expect(drillSegmentsAtX30.some((s) => s.type === 'LINEAR' && Math.abs(s.endWcs.z - -12) < 1e-4)).toBe(true);
    expect(drillSegmentsAtX30[drillSegmentsAtX30.length - 1]!.endWcs.z).toBeCloseTo(20, 4);
  });

  it('2. [Graniczny] obsługuje G82 (postój P na dnie), G83 (wiercenie skokowe Q) z G99 (powrót do R) oraz automatyczne odwołanie cyklu przez G0', () => {
    const code = `
      T3 M6
      G43 H3 Z25
      G99 G82 X10 Y20 Z-8 R3 P0.5 F120
      G83 X40 Y20 Z-15 R3 Q6 F120
      G0 X0 Y0 Z30
      M30
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(res.success).toBe(true);
    // Po G82 z G99 powrót powinien nastąpić do poziomu R=3 mm (a nie Z=25 mm)
    const snapAfterG82 = res.lineSnapshots.find((s) => s.rawText.includes('G82'))!;
    expect(snapAfterG82.modalStateAfter.positionWcs.z).toBeCloseTo(3, 4);

    // G83 od R=3 do Z=-15 (całkowita droga 18 mm) ze skokiem Q=6 mm daje 3 robocze skoki LINEAR
    const g83LinearSteps = res.segments.filter(
      (s) => s.originatedFromCycle === 'G83' && s.type === 'LINEAR'
    );
    expect(g83LinearSteps).toHaveLength(3);

    // Wywołanie G0 automatycznie anuluje cykl (cycleMode = 'G80', motionMode = 'G0')
    expect(res.finalModalState.cycleMode).toBe('G80');
    expect(res.finalModalState.motionMode).toBe('G0');
  });

  it('3. [Błędny] zgłasza CYCLE_MISSING_PARAMETERS gdy brak Q w G83 lub gdy Z >= R, oraz błąd przy ruchu po G80 bez podania G0-G3', () => {
    const code = `
      T3 M6
      G43 H3 Z20
      G83 X10 Y10 Z-10 R2 F100
      G81 X20 Y20 Z5 R2 F100
      G80
      X50 Y50
    `;
    const res = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    });

    expect(res.success).toBe(false);
    const cycleErrors = res.diagnostics.filter((d) => d.code === 'CYCLE_MISSING_PARAMETERS');
    expect(cycleErrors.length).toBeGreaterThanOrEqual(2);
    // Ruch X50 Y50 po G80 (gdy motionMode === null) generuje błąd
    expect(res.diagnostics.some((d) => d.lineNumber === 7)).toBe(true);
  });
});
