/**
 * Testy jednostkowe modelu materiału (HeightmapMaterialModel)
 * oraz analizatora obróbki i kolizji (analyzeToolpathMaterial) – Etap 1.
 */

import { describe, expect, it } from 'vitest';
import { interpretGCode } from '../core/gcode/interpreter';
import {
  DEFAULT_MILL_STOCK,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../core/machines/presets';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';
import { analyzeToolpathMaterial } from '../core/simulation/materialAnalyzer';

describe('Model materiału i analizator kolizji (analyzeToolpathMaterial)', () => {
  it('1. [Poprawny] domyślna rozdzielczość wynosi 0.5 mm (minimum 0.25 mm), a frezowanie G1 usuwa materiał na zadanej głębokości', () => {
    const modelDefault = new HeightmapMaterialModel(DEFAULT_MILL_STOCK);
    expect(modelDefault.resolutionMm).toBe(0.5);

    const modelClamped = new HeightmapMaterialModel(DEFAULT_MILL_STOCK, {
      resolutionMm: 0.1, // Poniżej minimum 0.25 mm -> powinno zostać ograniczone do 0.25 mm
    });
    expect(modelClamped.resolutionMm).toBe(0.25);

    const code = `
      T1 M6
      S3000 M3
      G43 H1 Z5
      G0 X20 Y40
      G1 Z-4 F200
      G1 X80 Y40 F300
      G0 Z10
      M30
    `;
    const interp = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });
    expect(interp.success).toBe(true);

    const analysis = analyzeToolpathMaterial({
      segments: interp.segments,
      stock: DEFAULT_MILL_STOCK,
      tools: MILL_3AXIS_MACHINE.tools,
      materialModel: modelDefault,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(analysis.success).toBe(true);
    expect(analysis.totalRemovedVolumeMm3).toBeGreaterThan(1000);
    // W środku wyfrezowanego rowka (X=50, Y=40) powierzchnia ma wysokość Z = -4.0 mm
    const sampledZ = analysis.finalMaterialModel.sampleSurfaceAtWcs({
      x: 50,
      y: 40,
      z: 0,
      a: 0,
      c: 0,
    });
    expect(sampledZ).toBeCloseTo(-4.0, 3);
  });

  it('2. [Graniczny] ruch szybki G0 dokładnie po górnej powierzchni (Z = 0.0 mm) nie zbiera materiału i nie wywołuje kolizji, natomiast brak G43 (G49) obniża fizyczny wierzchołek o długość narzędzia i wywołuje kolizję', () => {
    const skimCode = `
      T1 M6
      S3000 M3
      G43 H1 Z0
      G0 X50 Y40 Z0
      M30
    `;
    const skimInterp = interpretGCode({
      sourceText: skimCode,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });
    const skimAnalysis = analyzeToolpathMaterial({
      segments: skimInterp.segments,
      stock: DEFAULT_MILL_STOCK,
      tools: MILL_3AXIS_MACHINE.tools,
      materialModel: new HeightmapMaterialModel(DEFAULT_MILL_STOCK),
      validationPolicy: STRICT_VALIDATION_POLICY,
    });
    expect(skimAnalysis.success).toBe(true);
    expect(skimAnalysis.totalRemovedVolumeMm3).toBe(0);

    // Teraz ten sam ruch na Z=10 mm, ale BEZ G43 (przy G49): fizyczny wierzchołek T1 (length=50 mm)
    // znajdzie się na Z = 10 - 50 = -40 mm, co przebija surówkę (dno Z=-20 mm)!
    const noG43Code = `
      T1 M6
      S3000 M3
      G49 G0 X50 Y40 Z10
      M30
    `;
    const noG43Interp = interpretGCode({
      sourceText: noG43Code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });
    const noG43Analysis = analyzeToolpathMaterial({
      segments: noG43Interp.segments,
      stock: DEFAULT_MILL_STOCK,
      tools: MILL_3AXIS_MACHINE.tools,
      materialModel: new HeightmapMaterialModel(DEFAULT_MILL_STOCK),
      validationPolicy: STRICT_VALIDATION_POLICY,
    });
    expect(noG43Analysis.success).toBe(false);
    const codes = noG43Analysis.materialDiagnostics.map((d) => d.code);
    expect(codes).toContain('RAPID_COLLISION_IN_MATERIAL');
    expect(codes).toContain('CUT_BELOW_WORKPIECE_BOTTOM');
  });

  it('3. [Błędny] wykrywa kolizję ruchu szybkiego G0 z materiałem (RAPID_COLLISION_IN_MATERIAL)', () => {
    const code = `
      T1 M6
      S3000 M3
      G43 H1 Z10
      G0 X50 Y40 Z-3
      M30
    `;
    const interp = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    const analysis = analyzeToolpathMaterial({
      segments: interp.segments,
      stock: DEFAULT_MILL_STOCK,
      tools: MILL_3AXIS_MACHINE.tools,
      materialModel: new HeightmapMaterialModel(DEFAULT_MILL_STOCK),
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(analysis.success).toBe(false);
    const err = analysis.materialDiagnostics.find(
      (d) => d.code === 'RAPID_COLLISION_IN_MATERIAL'
    );
    expect(err).toBeDefined();
    expect(err!.messagePl).toContain('KOLIZJA');
  });

  it('4. [Błędny] wykrywa wejście w materiał przy wyłączonym wrzecionie (SPINDLE_OFF_DURING_CUT) oraz zjazd poniżej dna surówki (CUT_BELOW_WORKPIECE_BOTTOM)', () => {
    const code = `
      T1 M6
      G43 H1 Z5
      G0 X30 Y30
      G1 Z-22 F150
      M30
    `;
    const interp = interpretGCode({
      sourceText: code,
      machineConfig: MILL_3AXIS_MACHINE,
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    const analysis = analyzeToolpathMaterial({
      segments: interp.segments,
      stock: DEFAULT_MILL_STOCK,
      tools: MILL_3AXIS_MACHINE.tools,
      materialModel: new HeightmapMaterialModel(DEFAULT_MILL_STOCK),
      validationPolicy: STRICT_VALIDATION_POLICY,
    });

    expect(analysis.success).toBe(false);
    const codes = analysis.materialDiagnostics.map((d) => d.code);
    expect(codes).toContain('SPINDLE_OFF_DURING_CUT');
    expect(codes).toContain('CUT_BELOW_WORKPIECE_BOTTOM');
  });
});
