/**
 * Obliczenia geometryczne dla interpolacji kołowej i śrubowej (G2 / G3)
 * w płaszczyznach G17 (XY), G18 (ZX) oraz G19 (YZ), w formatach IJK oraz R.
 */

import type {
  DiagnosticMessage,
  PlaneMode,
} from '../types/common';
import type {
  AnalyticalArcGeometry,
  MotionSegment,
} from '../types/interpreter';
import type { IRArcSpec } from '../types/ir';
import type { Vector3D, Vector5D } from '../types/machine';

export interface ArcCalculationInput {
  lineNumber: number;
  plane: PlaneMode;
  isClockwise: boolean; // true = G2 (CW), false = G3 (CCW)
  startWcs: Vector5D;
  endWcs: Vector5D;
  arcSpec: IRArcSpec | undefined; // Już przeliczone na milimetry!
  endpointToleranceMm: number;
}

export interface ArcCalculationResult {
  arcGeometry?: AnalyticalArcGeometry;
  arcLengthMm: number;
  diagnostics: DiagnosticMessage[];
}

interface PlaneAxesAdapter {
  getU(v: Vector3D): number;
  getV(v: Vector3D): number;
  getW(v: Vector3D): number;
  setUVW(u: number, v: number, w: number): Vector3D;
  getOffsetUV(spec: Extract<IRArcSpec, { kind: 'IJK_INCREMENTAL' }>): {
    du: number;
    dv: number;
    hasAnyOffset: boolean;
  };
  normalVector: Vector3D;
}

/**
 * Zwraca adapter prawoskrętnego układu osi (U, V, W) dla wybranej płaszczyzny:
 * - G17: U = X, V = Y, W = Z (offsety I, J)
 * - G18: U = Z, V = X, W = Y (offsety K, I)
 * - G19: U = Y, V = Z, W = X (offsety J, K)
 */
export function getPlaneAdapter(plane: PlaneMode): PlaneAxesAdapter {
  switch (plane) {
    case 'G17':
      return {
        getU: (p) => p.x,
        getV: (p) => p.y,
        getW: (p) => p.z,
        setUVW: (u, v, w) => ({ x: u, y: v, z: w }),
        getOffsetUV: (s) => ({
          du: s.i ?? 0,
          dv: s.j ?? 0,
          hasAnyOffset: s.i !== undefined || s.j !== undefined,
        }),
        normalVector: { x: 0, y: 0, z: 1 },
      };
    case 'G18':
      return {
        getU: (p) => p.z,
        getV: (p) => p.x,
        getW: (p) => p.y,
        setUVW: (u, v, w) => ({ x: v, y: w, z: u }),
        getOffsetUV: (s) => ({
          du: s.k ?? 0,
          dv: s.i ?? 0,
          hasAnyOffset: s.k !== undefined || s.i !== undefined,
        }),
        normalVector: { x: 0, y: 1, z: 0 },
      };
    case 'G19':
      return {
        getU: (p) => p.y,
        getV: (p) => p.z,
        getW: (p) => p.x,
        setUVW: (u, v, w) => ({ x: w, y: u, z: v }),
        getOffsetUV: (s) => ({
          du: s.j ?? 0,
          dv: s.k ?? 0,
          hasAnyOffset: s.j !== undefined || s.k !== undefined,
        }),
        normalVector: { x: 1, y: 0, z: 0 },
      };
  }
}

/**
 * Oblicza analityczną geometrię łuku G2/G3 oraz waliduje jego wykonalność.
 */
export function computeArcGeometry(input: ArcCalculationInput): ArcCalculationResult {
  const {
    lineNumber,
    plane,
    isClockwise,
    startWcs,
    endWcs,
    arcSpec,
    endpointToleranceMm,
  } = input;

  const diagnostics: DiagnosticMessage[] = [];
  if (!arcSpec) {
    diagnostics.push({
      lineNumber,
      severity: 'ERROR',
      code: 'ARC_MISSING_PARAMETERS',
      messagePl: `Linia ${lineNumber}: Brak parametrów łuku dla polecenia ${isClockwise ? 'G2' : 'G3'}.`,
      hintPl:
        plane === 'G17'
          ? 'Podaj promień R (np. R20) albo współrzędne przyrostowe środka I oraz J (np. I10 J0).'
          : plane === 'G18'
          ? 'W płaszczyźnie G18 (ZX) podaj promień R albo wektory środka I oraz K.'
          : 'W płaszczyźnie G19 (YZ) podaj promień R albo wektory środka J oraz K.',
    });
    return { arcLengthMm: 0, diagnostics };
  }

  const adapter = getPlaneAdapter(plane);
  const uStart = adapter.getU(startWcs);
  const vStart = adapter.getV(startWcs);
  const wStart = adapter.getW(startWcs);

  const uEnd = adapter.getU(endWcs);
  const vEnd = adapter.getV(endWcs);
  const wEnd = adapter.getW(endWcs);

  const chordDU = uEnd - uStart;
  const chordDV = vEnd - vStart;
  const chordLength = Math.hypot(chordDU, chordDV);
  const axialPitchMm = wEnd - wStart;

  let uCenter = 0;
  let vCenter = 0;
  let radiusMm = 0;

  if (arcSpec.kind === 'IJK_INCREMENTAL') {
    const { du, dv, hasAnyOffset } = adapter.getOffsetUV(arcSpec);
    if (!hasAnyOffset) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_MISSING_PARAMETERS',
        messagePl: `Linia ${lineNumber}: Podano niewłaściwe wektory środka łuku dla aktywnej płaszczyzny ${plane}.`,
        hintPl:
          plane === 'G17'
            ? 'Dla płaszczyzny G17 (XY) użyj adresów I (oś X) oraz J (oś Y).'
            : plane === 'G18'
            ? 'Dla płaszczyzny G18 (ZX) użyj adresów I (oś X) oraz K (oś Z).'
            : 'Dla płaszczyzny G19 (YZ) użyj adresów J (oś Y) oraz K (oś Z).',
      });
      return { arcLengthMm: 0, diagnostics };
    }

    uCenter = uStart + du;
    vCenter = vStart + dv;

    const rStart = Math.hypot(uStart - uCenter, vStart - vCenter);
    const rEnd = Math.hypot(uEnd - uCenter, vEnd - vCenter);

    if (rStart < 1e-6) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_GEOMETRY_IMPOSSIBLE',
        messagePl: `Linia ${lineNumber}: Promień łuku wyznaczony z parametrów I/J/K wynosi 0 mm.`,
        hintPl: 'Wektory I, J, K określają przesunięcie od punktu startowego do środka łuku – przynajmniej jeden z nich musi być niezerowy.',
      });
      return { arcLengthMm: 0, diagnostics };
    }

    const radiusDiff = Math.abs(rStart - rEnd);
    if (radiusDiff > endpointToleranceMm) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_ENDPOINT_MISMATCH',
        messagePl: `Linia ${lineNumber}: Punkt końcowy łuku nie leży na okręgu! Odległość od środka na starcie wynosi ${rStart.toFixed(3)} mm, a na końcu ${rEnd.toFixed(3)} mm (różnica ${radiusDiff.toFixed(3)} mm > ${endpointToleranceMm} mm).`,
        hintPl: 'Sprawdź współrzędne punktu końcowego oraz wartości I, J, K albo użyj zapisu z promieniem R.',
      });
      return { arcLengthMm: 0, diagnostics };
    }

    radiusMm = rStart;
  } else if (arcSpec.kind === 'RADIUS') {
    const rSigned = arcSpec.r;
    const rAbs = Math.abs(rSigned);

    if (rAbs < 1e-6) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_GEOMETRY_IMPOSSIBLE',
        messagePl: `Linia ${lineNumber}: Promień łuku R nie może wynosić zero.`,
        hintPl: 'Podaj dodatnią wartość promienia R (np. R10).',
      });
      return { arcLengthMm: 0, diagnostics };
    }

    if (chordLength < 1e-6) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_GEOMETRY_IMPOSSIBLE',
        messagePl: `Linia ${lineNumber}: Nie można zaprogramować pełnego okręgu (360°) za pomocą parametru R, ponieważ punkt początkowy i końcowy są identyczne.`,
        hintPl: 'Aby wyfrezować pełny okrąg, użyj parametrów środka I oraz J zamiast promienia R (lub podziel okrąg na dwa półokręgi).',
      });
      return { arcLengthMm: 0, diagnostics };
    }

    const halfChord = chordLength / 2;
    if (rAbs + endpointToleranceMm < halfChord) {
      diagnostics.push({
        lineNumber,
        severity: 'ERROR',
        code: 'ARC_GEOMETRY_IMPOSSIBLE',
        messagePl: `Linia ${lineNumber}: Zbyt mały promień R=${rAbs.toFixed(3)} mm! Odległość między punktem początkowym a końcowym wynosi ${chordLength.toFixed(3)} mm, więc minimalny możliwy promień to ${halfChord.toFixed(3)} mm.`,
        hintPl: `Zwiększ promień R do co najmniej ${halfChord.toFixed(2)} mm lub popraw współrzędne punktu końcowego.`,
      });
      return { arcLengthMm: 0, diagnostics };
    }

    radiusMm = Math.max(rAbs, halfChord);
    const h = Math.sqrt(Math.max(0, radiusMm * radiusMm - halfChord * halfChord));

    // Punkt środkowy cięciwy
    const uMid = (uStart + uEnd) / 2;
    const vMid = (vStart + vEnd) / 2;

    // Wektor jednostkowy prostopadły do cięciwy (w lewo od wektora start->end w układzie UV)
    const perpLeftU = -chordDV / chordLength;
    const perpLeftV = chordDU / chordLength;

    // Dla G3 (CCW) i R > 0 (krótszy łuk <= 180°) środek leży po lewej stronie cięciwy.
    // Dla G2 (CW) i R > 0 środek leży po prawej stronie cięciwy.
    // Ujemne R wybiera łuk dłuższy (> 180°), co odwraca stronę środka.
    const chooseLeftCenter = isClockwise ? rSigned < 0 : rSigned > 0;
    const sign = chooseLeftCenter ? 1 : -1;

    uCenter = uMid + sign * h * perpLeftU;
    vCenter = vMid + sign * h * perpLeftV;
  } else {
    // CENTER_ABSOLUTE (np. dla konwersji z Heidenhain CC)
    const center3D: Vector3D = {
      x: arcSpec.ccX ?? startWcs.x,
      y: arcSpec.ccY ?? startWcs.y,
      z: arcSpec.ccZ ?? startWcs.z,
    };
    uCenter = adapter.getU(center3D);
    vCenter = adapter.getV(center3D);
    radiusMm = Math.hypot(uStart - uCenter, vStart - vCenter);
  }

  const startAngleRad = Math.atan2(vStart - vCenter, uStart - uCenter);
  let endAngleRad = Math.atan2(vEnd - vCenter, uEnd - uCenter);

  let sweepAngleRad: number;
  if (chordLength < 1e-6) {
    // Pełny okrąg 360° (tylko dla IJK)
    sweepAngleRad = isClockwise ? -2 * Math.PI : 2 * Math.PI;
  } else {
    if (isClockwise) {
      // G2 (CW): kąt maleje (sweepAngleRad < 0)
      while (endAngleRad >= startAngleRad - 1e-9) {
        endAngleRad -= 2 * Math.PI;
      }
      sweepAngleRad = endAngleRad - startAngleRad;
      if (sweepAngleRad < -2 * Math.PI - 1e-7) {
        sweepAngleRad += 2 * Math.PI;
      }
    } else {
      // G3 (CCW): kąt rośnie (sweepAngleRad > 0)
      while (endAngleRad <= startAngleRad + 1e-9) {
        endAngleRad += 2 * Math.PI;
      }
      sweepAngleRad = endAngleRad - startAngleRad;
      if (sweepAngleRad > 2 * Math.PI + 1e-7) {
        sweepAngleRad -= 2 * Math.PI;
      }
    }
  }

  const planarArcLengthMm = radiusMm * Math.abs(sweepAngleRad);
  const arcLengthMm = Math.hypot(planarArcLengthMm, axialPitchMm);
  const centerWcs = adapter.setUVW(uCenter, vCenter, wStart);

  return {
    arcGeometry: {
      plane,
      centerWcs,
      radiusMm,
      startAngleRad,
      sweepAngleRad,
      axialPitchMm,
      normalVector: adapter.normalVector,
    },
    arcLengthMm,
    diagnostics,
  };
}

/**
 * Pomocnicza funkcja próbkująca analityczny łuk (MotionSegment) na punkty pośrednie 5D.
 * Wywoływana na żądanie przez model materiału (Heightmap) oraz przez renderer 3D (Three.js),
 * dzięki czemu sam MotionSegment pozostaje lekki i wolny od wstępnie spróbkowanych tablic.
 */
export function sampleAnalyticalArcSegment(
  segment: MotionSegment,
  maxStepMm = 0.5
): Vector5D[] {
  const geom = segment.arcGeometry;
  if (!geom) {
    return [segment.startWcs, segment.endWcs];
  }

  const adapter = getPlaneAdapter(geom.plane);
  const uCenter = adapter.getU(geom.centerWcs);
  const vCenter = adapter.getV(geom.centerWcs);
  const wStart = adapter.getW(segment.startWcs);

  const stepMm = Math.max(0.1, maxStepMm);
  const stepsCount = Math.max(8, Math.ceil(segment.lengthMm / stepMm));
  const points: Vector5D[] = [];

  for (let i = 0; i <= stepsCount; i++) {
    const t = i / stepsCount;
    const angle = geom.startAngleRad + t * geom.sweepAngleRad;
    const u = uCenter + geom.radiusMm * Math.cos(angle);
    const v = vCenter + geom.radiusMm * Math.sin(angle);
    const w = wStart + t * geom.axialPitchMm;
    const pos3D = adapter.setUVW(u, v, w);

    points.push({
      x: i === stepsCount ? segment.endWcs.x : pos3D.x,
      y: i === stepsCount ? segment.endWcs.y : pos3D.y,
      z: i === stepsCount ? segment.endWcs.z : pos3D.z,
      a: segment.startWcs.a + t * (segment.endWcs.a - segment.startWcs.a),
      c: segment.startWcs.c + t * (segment.endWcs.c - segment.startWcs.c),
    });
  }

  return points;
}
