/**
 * Renderer ścieżki narzędzia 3D (Three.js):
 * - Ruchy szybkie G0: linia przerywana (żółto-pomarańczowa #fbbf24),
 * - Ruchy robocze G1/G2/G3: linia ciągła (błękitna #38bdf8), z próbkowaniem analitycznych łuków na żądanie,
 * - Zaprogramowany kontur przy aktywnym G41/G42: linia pomocnicza zielona,
 * - Odcinki z błędem/kolizją: pogrubiona linia czerwono-magentowa (#f43f5e) + znacznik 3D ośmiościanu (!),
 * - Podświetlenie aktualnie wybranej linii z edytora.
 */

import * as THREE from 'three';
import { sampleAnalyticalArcSegment } from '../core/gcode/arcs';
import type { MotionSegment } from '../core/types/interpreter';
import type { Vector5D } from '../core/types/machine';
import type { SegmentMaterialAnnotation } from '../core/types/material';

export class ToolpathRenderer {
  public readonly group: THREE.Group;
  private highlightedLineGroup: THREE.Group;
  private lastSegments: MotionSegment[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ToolpathGroup';
    this.highlightedLineGroup = new THREE.Group();
    this.group.add(this.highlightedLineGroup);
  }

  /**
   * Przebudowuje wizualizację ścieżek narzędzia oraz znaczników kolizji/błędów.
   */
  public renderToolpath(
    segments: MotionSegment[],
    annotations: Map<number, SegmentMaterialAnnotation>,
    errorSegmentIds: Set<number>
  ): void {
    this.clearGroup(this.group);
    this.highlightedLineGroup = new THREE.Group();
    this.group.add(this.highlightedLineGroup);
    this.lastSegments = segments;

    const rapidPoints: THREE.Vector3[] = [];
    const cuttingPolylines: THREE.Vector3[][] = [];
    const compProgrammedPoints: THREE.Vector3[] = [];
    const collisionPoints: THREE.Vector3[] = [];
    const collisionMarkers: THREE.Vector3[] = [];

    for (const seg of segments) {
      const ann = annotations.get(seg.id);
      const isError =
        Boolean(ann?.hasCollisionOrError) || errorSegmentIds.has(seg.id);

      const sampled = this.sampleSegmentPoints(seg);

      if (isError) {
        for (let i = 0; i < sampled.length - 1; i++) {
          collisionPoints.push(sampled[i]!, sampled[i + 1]!);
        }
        collisionMarkers.push(sampled[sampled.length - 1]!);
      } else if (seg.type === 'RAPID') {
        for (let i = 0; i < sampled.length - 1; i++) {
          rapidPoints.push(sampled[i]!, sampled[i + 1]!);
        }
      } else {
        cuttingPolylines.push(sampled);
      }

      // Jeśli aktywna jest korekcja promienia G41/G42, narysuj także zaprogramowany kontur odniesienia
      if (seg.cutterCompMode !== 'G40') {
        compProgrammedPoints.push(
          new THREE.Vector3(
            seg.programmedStartWcs.x,
            seg.programmedStartWcs.y,
            seg.programmedStartWcs.z
          ),
          new THREE.Vector3(
            seg.programmedEndWcs.x,
            seg.programmedEndWcs.y,
            seg.programmedEndWcs.z
          )
        );
      }
    }

    // 1. Ruchy szybkie G0 – linia przerywana
    if (rapidPoints.length > 0) {
      const rapidGeom = new THREE.BufferGeometry().setFromPoints(rapidPoints);
      const rapidMat = new THREE.LineDashedMaterial({
        color: 0xfbbf24,
        dashSize: 3.0,
        gapSize: 2.0,
      });
      const rapidLines = new THREE.LineSegments(rapidGeom, rapidMat);
      rapidLines.computeLineDistances();
      this.group.add(rapidLines);
    }

    // 2. Ruchy robocze G1/G2/G3 – linie ciągłe
    if (cuttingPolylines.length > 0) {
      const cuttingMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
      for (const poly of cuttingPolylines) {
        const geom = new THREE.BufferGeometry().setFromPoints(poly);
        const line = new THREE.Line(geom, cuttingMat);
        this.group.add(line);
      }
    }

    // 3. Zaprogramowany kontur przy G41/G42 – przerywana zielona linia pomocnicza
    if (compProgrammedPoints.length > 0) {
      const compGeom = new THREE.BufferGeometry().setFromPoints(
        compProgrammedPoints
      );
      const compMat = new THREE.LineDashedMaterial({
        color: 0x4ade80,
        dashSize: 1.5,
        gapSize: 1.5,
      });
      const compLines = new THREE.LineSegments(compGeom, compMat);
      compLines.computeLineDistances();
      this.group.add(compLines);
    }

    // 4. Odcinki kolizyjne/błędne + znaczniki geometryczne (dostępność poza samym kolorem)
    if (collisionPoints.length > 0) {
      const colGeom = new THREE.BufferGeometry().setFromPoints(collisionPoints);
      const colMat = new THREE.LineBasicMaterial({ color: 0xf43f5e });
      const colLines = new THREE.LineSegments(colGeom, colMat);
      this.group.add(colLines);

      const markerGeom = new THREE.OctahedronGeometry(2.4, 0);
      const markerMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0x9f1239,
        roughness: 0.3,
      });
      for (const pos of collisionMarkers) {
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.position.copy(pos);
        this.group.add(marker);
      }
    }
  }

  /**
   * Podświetla w scenie 3D odcinki odpowiadające wskazanej linii kodu G.
   */
  public highlightLine(lineNumber: number | null): void {
    this.clearGroup(this.highlightedLineGroup);
    if (lineNumber === null) return;

    const matching = this.lastSegments.filter(
      (s) => s.lineNumber === lineNumber
    );
    if (matching.length === 0) return;

    const highlightMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const sphereGeom = new THREE.SphereGeometry(1.4, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (const seg of matching) {
      const pts = this.sampleSegmentPoints(seg);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, highlightMat);
      this.highlightedLineGroup.add(line);

      const endMarker = new THREE.Mesh(sphereGeom, sphereMat);
      endMarker.position.copy(pts[pts.length - 1]!);
      this.highlightedLineGroup.add(endMarker);
    }
  }

  private sampleSegmentPoints(seg: MotionSegment): THREE.Vector3[] {
    if (seg.type === 'ARC_CW' || seg.type === 'ARC_CCW') {
      const pts5d: Vector5D[] = sampleAnalyticalArcSegment(seg, 0.5);
      return pts5d.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    }
    return [
      new THREE.Vector3(seg.startWcs.x, seg.startWcs.y, seg.startWcs.z),
      new THREE.Vector3(seg.endWcs.x, seg.endWcs.y, seg.endWcs.z),
    ];
  }

  private clearGroup(grp: THREE.Group): void {
    while (grp.children.length > 0) {
      const child = grp.children[0]!;
      grp.remove(child);
    }
  }
}
