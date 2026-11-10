/**
 * Dynamiczna siatka 3D przedmiotu obrabianego (surówki) w Three.js,
 * aktualizowana bezpośrednio z bufora Float32Array modelu HeightmapMaterialModel.
 */

import * as THREE from 'three';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';

export class WorkpieceMesh {
  public readonly group: THREE.Group;
  private topMesh: THREE.Mesh | null = null;
  private sidesMesh: THREE.Mesh | null = null;
  private edgesLine: THREE.LineSegments | null = null;
  private currentColsX = 0;
  private currentRowsY = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'WorkpieceGroup';
  }

  /**
   * Buduje lub aktualizuje geometrię 3D surówki na podstawie aktualnego stanu HeightmapMaterialModel.
   */
  public updateFromHeightmap(model: HeightmapMaterialModel): void {
    const { colsX, rowsY, stock, topZMm, bottomZMm, resolutionMm } = model;

    if (
      !this.topMesh ||
      this.currentColsX !== colsX ||
      this.currentRowsY !== rowsY
    ) {
      this.rebuildGeometry(model);
    }

    if (!this.topMesh) return;

    const geom = this.topMesh.geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = geom.getAttribute('color') as THREE.BufferAttribute;
    const heights = model.getHeightsBuffer();

    const minX = stock.minCornerInWcs.x;
    const minY = stock.minCornerInWcs.y;
    const totalDepthRange = Math.max(1, topZMm - bottomZMm);

    let vIdx = 0;
    for (let iy = 0; iy < rowsY; iy++) {
      const y = minY + iy * resolutionMm;
      const rowOffset = iy * colsX;
      for (let ix = 0; ix < colsX; ix++) {
        const x = minX + ix * resolutionMm;
        const rawZ = heights[rowOffset + ix]!;
        const clampedZ = Math.max(bottomZMm, Math.min(topZMm, rawZ));

        posAttr.setXYZ(vIdx, x, y, clampedZ);

        // Kolorowanie wierzchołków: nienaruszona góra = jasne szczotkowane aluminium,
        // powierzchnia skrawana = wyraźny chłodny odcień zależny od głębokości skrawania
        if (clampedZ >= topZMm - 1e-3) {
          colAttr.setXYZ(vIdx, 0.78, 0.82, 0.87);
        } else {
          const depthRatio = Math.min(1, (topZMm - clampedZ) / totalDepthRange);
          const r = 0.35 - depthRatio * 0.12;
          const g = 0.58 - depthRatio * 0.15;
          const b = 0.78 - depthRatio * 0.1;
          colAttr.setXYZ(vIdx, r, g, b);
        }
        vIdx++;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geom.computeVertexNormals();
  }

  private rebuildGeometry(model: HeightmapMaterialModel): void {
    this.clearMeshes();

    const { colsX, rowsY, stock, bottomZMm } = model;
    this.currentColsX = colsX;
    this.currentRowsY = rowsY;

    const vertexCount = colsX * rowsY;
    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const indices: number[] = [];

    for (let iy = 0; iy < rowsY - 1; iy++) {
      for (let ix = 0; ix < colsX - 1; ix++) {
        const a = iy * colsX + ix;
        const b = iy * colsX + (ix + 1);
        const c = (iy + 1) * colsX + ix;
        const d = (iy + 1) * colsX + (ix + 1);

        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    const topGeom = new THREE.BufferGeometry();
    topGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    topGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    topGeom.setIndex(indices);

    const topMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.45,
      metalness: 0.35,
      side: THREE.DoubleSide,
    });

    this.topMesh = new THREE.Mesh(topGeom, topMat);
    this.group.add(this.topMesh);

    // Bryła boczna i dno surówki (półprzezroczysty obrys bazowy + podstawa)
    const boxGeom = new THREE.BoxGeometry(
      stock.sizeXMm,
      stock.sizeYMm,
      stock.sizeZMm
    );
    const centerX = stock.minCornerInWcs.x + stock.sizeXMm / 2;
    const centerY = stock.minCornerInWcs.y + stock.sizeYMm / 2;
    const centerZ = bottomZMm + stock.sizeZMm / 2;

    const sidesMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.65,
      metalness: 0.25,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    this.sidesMesh = new THREE.Mesh(boxGeom, sidesMat);
    this.sidesMesh.position.set(centerX, centerY, centerZ - 0.05);
    this.group.add(this.sidesMesh);

    // Krawędzie obrysu wyjściowej surówki (ułatwiają ocenę wymiarów i korekcji promienia)
    const edgesGeom = new THREE.EdgesGeometry(boxGeom);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.6,
    });
    this.edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
    this.edgesLine.position.set(centerX, centerY, centerZ);
    this.group.add(this.edgesLine);
  }

  private clearMeshes(): void {
    if (this.topMesh) {
      this.topMesh.geometry.dispose();
      (this.topMesh.material as THREE.Material).dispose();
      this.group.remove(this.topMesh);
      this.topMesh = null;
    }
    if (this.sidesMesh) {
      this.sidesMesh.geometry.dispose();
      (this.sidesMesh.material as THREE.Material).dispose();
      this.group.remove(this.sidesMesh);
      this.sidesMesh = null;
    }
    if (this.edgesLine) {
      this.edgesLine.geometry.dispose();
      (this.edgesLine.material as THREE.Material).dispose();
      this.group.remove(this.edgesLine);
      this.edgesLine = null;
    }
  }
}
