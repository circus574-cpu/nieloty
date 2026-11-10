/**
 * Implementacja modelu materiału 2.5D (Heightmap / Dexel) dla surówki prostopadłościennej (PrismaticStock).
 * Zoptymalizowana pod kątem urządzeń mobilnych dzięki wykorzystaniu płaskiego bufora Float32Array.
 * Rozdzielczość jest konfigurowalna (domyślnie 0.5 mm, minimum 0.25 mm).
 */

import { sampleAnalyticalArcSegment } from '../gcode/arcs';
import type { MotionSegment } from '../types/interpreter';
import type {
  PrismaticStock,
  ToolDefinition,
  Vector5D,
} from '../types/machine';
import {
  DEFAULT_MATERIAL_RESOLUTION_MM,
  type IMaterialModel,
  type MaterialModelOptions,
  MIN_MATERIAL_RESOLUTION_MM,
  type SegmentCutOutcome,
} from '../types/material';

export class HeightmapMaterialModel implements IMaterialModel {
  public readonly stock: PrismaticStock;
  public readonly resolutionMm: number;
  public readonly colsX: number;
  public readonly rowsY: number;
  public readonly topZMm: number;
  public readonly bottomZMm: number;
  private readonly cellAreaMm2: number;
  private heights: Float32Array;

  constructor(stock: PrismaticStock, options?: MaterialModelOptions) {
    this.stock = stock;
    const requestedRes = options?.resolutionMm ?? DEFAULT_MATERIAL_RESOLUTION_MM;
    this.resolutionMm = Math.max(MIN_MATERIAL_RESOLUTION_MM, requestedRes);

    this.colsX = Math.max(2, Math.round(stock.sizeXMm / this.resolutionMm) + 1);
    this.rowsY = Math.max(2, Math.round(stock.sizeYMm / this.resolutionMm) + 1);
    this.bottomZMm = stock.minCornerInWcs.z;
    this.topZMm = stock.minCornerInWcs.z + stock.sizeZMm;
    this.cellAreaMm2 = this.resolutionMm * this.resolutionMm;

    this.heights = new Float32Array(this.colsX * this.rowsY);
    this.reset();
  }

  public reset(): void {
    this.heights.fill(this.topZMm);
  }

  public clone(): HeightmapMaterialModel {
    const copy = new HeightmapMaterialModel(this.stock, {
      resolutionMm: this.resolutionMm,
    });
    copy.heights.set(this.heights);
    return copy;
  }

  /** Udostępnia bufor wysokości dla szybkiego odświeżania siatki 3D (Three.js BufferGeometry) */
  public getHeightsBuffer(): Float32Array {
    return this.heights;
  }

  public sampleSurfaceAtWcs(pointWcs: Vector5D): number | null {
    const relX = pointWcs.x - this.stock.minCornerInWcs.x;
    const relY = pointWcs.y - this.stock.minCornerInWcs.y;

    if (
      relX < -1e-6 ||
      relX > this.stock.sizeXMm + 1e-6 ||
      relY < -1e-6 ||
      relY > this.stock.sizeYMm + 1e-6
    ) {
      return null;
    }

    const ix = Math.min(
      this.colsX - 1,
      Math.max(0, Math.round(relX / this.resolutionMm))
    );
    const iy = Math.min(
      this.rowsY - 1,
      Math.max(0, Math.round(relY / this.resolutionMm))
    );

    return this.heights[iy * this.colsX + ix] ?? null;
  }

  public applySegment(
    segment: MotionSegment,
    tool: ToolDefinition | undefined
  ): SegmentCutOutcome {
    const physRadiusMm = tool ? Math.max(0.25, tool.diameterMm / 2) : 0.5;
    const stepSizeMm = Math.max(0.15, this.resolutionMm * 0.5);

    // Wygeneruj próbki pośrednie wzdłuż odcinka (liniowego lub łukowego)
    let points: Vector5D[];
    if (segment.type === 'ARC_CW' || segment.type === 'ARC_CCW') {
      points = sampleAnalyticalArcSegment(segment, stepSizeMm);
    } else {
      const steps = Math.max(1, Math.ceil(segment.lengthMm / stepSizeMm));
      points = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        points.push({
          x: segment.startWcs.x + t * (segment.endWcs.x - segment.startWcs.x),
          y: segment.startWcs.y + t * (segment.endWcs.y - segment.startWcs.y),
          z: segment.startWcs.z + t * (segment.endWcs.z - segment.startWcs.z),
          a: segment.startWcs.a + t * (segment.endWcs.a - segment.startWcs.a),
          c: segment.startWcs.c + t * (segment.endWcs.c - segment.startWcs.c),
        });
      }
    }

    let didTouchMaterial = false;
    let removedVolumeMm3 = 0;
    let minToolTipZInStockWcs = Number.POSITIVE_INFINITY;
    let wentBelowStockBottom = false;

    const minX = this.stock.minCornerInWcs.x;
    const maxX = minX + this.stock.sizeXMm;
    const minY = this.stock.minCornerInWcs.y;
    const maxY = minY + this.stock.sizeYMm;
    const rSq = physRadiusMm * physRadiusMm;

    // Współczynnik stożka dla wiertła, frezu fazującego lub frezu grawerskiego V-Bit
    let coneSlope = 0;
    if (
      tool &&
      (tool.type === 'DRILL' ||
        tool.type === 'CHAMFER_MILL' ||
        tool.type === 'V_BIT')
    ) {
      const angleDeg = tool.pointAngleDeg ?? (tool.type === 'DRILL' ? 118 : 90);
      const halfAngleRad = ((angleDeg / 2) * Math.PI) / 180;
      const tanHalf = Math.tan(halfAngleRad);
      if (tanHalf > 1e-3) {
        coneSlope = 1 / tanHalf;
      }
    }

    for (const pt of points) {
      // Szybki test obwiedni XY względem surówki
      if (
        pt.x + physRadiusMm < minX ||
        pt.x - physRadiusMm > maxX ||
        pt.y + physRadiusMm < minY ||
        pt.y - physRadiusMm > maxY
      ) {
        continue;
      }

      if (pt.z < minToolTipZInStockWcs) {
        minToolTipZInStockWcs = pt.z;
      }
      if (pt.z < this.bottomZMm - 1e-4) {
        wentBelowStockBottom = true;
      }

      // Jeśli nawet najniższy punkt narzędzia jest powyżej górnej powierzchni surówki, pomiń pętlę siatki
      if (pt.z >= this.topZMm - 1e-5) {
        continue;
      }

      const ixMin = Math.max(
        0,
        Math.floor((pt.x - physRadiusMm - minX) / this.resolutionMm)
      );
      const ixMax = Math.min(
        this.colsX - 1,
        Math.ceil((pt.x + physRadiusMm - minX) / this.resolutionMm)
      );
      const iyMin = Math.max(
        0,
        Math.floor((pt.y - physRadiusMm - minY) / this.resolutionMm)
      );
      const iyMax = Math.min(
        this.rowsY - 1,
        Math.ceil((pt.y + physRadiusMm - minY) / this.resolutionMm)
      );

      for (let iy = iyMin; iy <= iyMax; iy++) {
        const cellY = minY + iy * this.resolutionMm;
        const dy = cellY - pt.y;
        const dySq = dy * dy;
        const rowOffset = iy * this.colsX;

        for (let ix = ixMin; ix <= ixMax; ix++) {
          const cellX = minX + ix * this.resolutionMm;
          const dx = cellX - pt.x;
          const distSq = dx * dx + dySq;

          if (distSq > rSq + 1e-7) {
            continue;
          }

          let toolSurfaceZ = pt.z;
          if (tool?.type === 'BALL_ENDMILL') {
            toolSurfaceZ =
              pt.z + physRadiusMm - Math.sqrt(Math.max(0, rSq - distSq));
          } else if (coneSlope > 0) {
            toolSurfaceZ = pt.z + Math.sqrt(distSq) * coneSlope;
          }

          const cellIdx = rowOffset + ix;
          const currentZ = this.heights[cellIdx]!;

          if (toolSurfaceZ < currentZ - 1e-4) {
            didTouchMaterial = true;
            const clampedNewZ = Math.max(this.bottomZMm, toolSurfaceZ);
            if (clampedNewZ < currentZ) {
              removedVolumeMm3 += (currentZ - clampedNewZ) * this.cellAreaMm2;
            }
            this.heights[cellIdx] = toolSurfaceZ;
          }
        }
      }
    }

    return {
      didTouchMaterial,
      removedVolumeMm3,
      minToolTipZInStockWcs,
      wentBelowStockBottom,
    };
  }
}
