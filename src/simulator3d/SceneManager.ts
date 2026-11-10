/**
 * Zarządca sceny 3D (SceneManager) oparty na Three.js:
 * - Naturalny dla CNC układ współrzędnych (oś Z skierowana w górę: camera.up = [0, 0, 1]),
 * - Presety kamery: Widok z góry (XY), z przodu (XZ), z boku (YZ) oraz izometryczny (3D ISO),
 * - Obsługa dotyku (obracanie jednym palcem, przesuwanie dwoma, przybliżanie pinch-to-zoom) przez OrbitControls,
 * - Integracja WorkpieceMesh, ToolpathRenderer oraz MachineActor.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';
import type { CoolantState, SpindleState } from '../core/types/common';
import type { MotionSegment } from '../core/types/interpreter';
import type {
  PrismaticStock,
  ToolDefinition,
  Vector5D,
} from '../core/types/machine';
import type { SegmentMaterialAnnotation } from '../core/types/material';
import { MachineActor } from './MachineActor';
import { ToolpathRenderer } from './ToolpathRenderer';
import { WorkpieceMesh } from './WorkpieceMesh';

export type CameraViewPreset = 'TOP_XY' | 'FRONT_XZ' | 'SIDE_YZ' | 'ISO_3D';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  public readonly workpieceMesh: WorkpieceMesh;
  public readonly toolpathRenderer: ToolpathRenderer;
  public readonly machineActor: MachineActor;

  private currentStock: PrismaticStock | null = null;
  private resizeObserver: ResizeObserver;
  private rafId: number | null = null;
  private lastRenderTime = performance.now();

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1120);

    const width = Math.max(300, container.clientWidth || 640);
    const height = Math.max(240, container.clientHeight || 420);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    this.camera.up.set(0, 0, 1); // Oś Z skierowana pionowo w górę (standard CNC)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true;

    this.setupLighting();

    this.workpieceMesh = new WorkpieceMesh();
    this.toolpathRenderer = new ToolpathRenderer();
    this.machineActor = new MachineActor();

    this.scene.add(this.machineActor.group);
    this.scene.add(this.workpieceMesh.group);
    this.scene.add(this.toolpathRenderer.group);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.startRenderLoop();
  }

  public setStockAndRebuildScene(
    stock: PrismaticStock,
    heightmap: HeightmapMaterialModel
  ): void {
    const isFirstStock = this.currentStock === null;
    this.currentStock = stock;
    this.machineActor.configureForStock(stock);
    this.workpieceMesh.updateFromHeightmap(heightmap);

    if (isFirstStock) {
      this.setCameraPreset('ISO_3D');
    }
  }

  public updateWorkpieceHeightmap(heightmap: HeightmapMaterialModel): void {
    this.workpieceMesh.updateFromHeightmap(heightmap);
  }

  public updateToolpath(
    segments: MotionSegment[],
    annotations: Map<number, SegmentMaterialAnnotation>,
    errorSegmentIds: Set<number>
  ): void {
    this.toolpathRenderer.renderToolpath(
      segments,
      annotations,
      errorSegmentIds
    );
  }

  public highlightEditorLine(lineNumber: number | null): void {
    this.toolpathRenderer.highlightLine(lineNumber);
  }

  public updateToolPose(params: {
    positionWcs: Vector5D;
    tool: ToolDefinition | undefined;
    spindleState: SpindleState;
    coolantState: CoolantState;
  }): void {
    this.machineActor.updateToolState(params);
  }

  /**
   * Ustawia kamerę w jednym z 4 standardowych widoków warsztatowych:
   * - TOP_XY: Widok z góry (oś X w prawo, oś Y w górę ekranu – jak na rysunku technicznym),
   * - FRONT_XZ: Widok z przodu (oś X w prawo, oś Z w górę),
   * - SIDE_YZ: Widok z boku (oś Y w prawo, oś Z w górę),
   * - ISO_3D: Widok izometryczny 3D.
   */
  public setCameraPreset(preset: CameraViewPreset): void {
    const stock = this.currentStock;
    const cx = stock ? stock.minCornerInWcs.x + stock.sizeXMm / 2 : 50;
    const cy = stock ? stock.minCornerInWcs.y + stock.sizeYMm / 2 : 40;
    const cz = stock ? stock.minCornerInWcs.z + stock.sizeZMm / 2 : -10;
    const span = stock
      ? Math.max(stock.sizeXMm, stock.sizeYMm, stock.sizeZMm) * 1.9
      : 180;

    this.controls.target.set(cx, cy, cz);

    switch (preset) {
      case 'TOP_XY':
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(cx, cy, cz + span * 1.15);
        break;
      case 'FRONT_XZ':
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(cx, cy - span * 1.15, cz + 15);
        break;
      case 'SIDE_YZ':
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(cx + span * 1.15, cy, cz + 15);
        break;
      case 'ISO_3D':
      default:
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(
          cx + span * 0.72,
          cy - span * 0.88,
          cz + span * 0.78
        );
        break;
    }

    this.controls.update();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(120, -140, 220);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fillLight.position.set(-120, 150, 100);
    this.scene.add(fillLight);
  }

  private handleResize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w <= 0 || h <= 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private startRenderLoop(): void {
    const renderStep = (now: number) => {
      const dt = Math.min(0.1, (now - this.lastRenderTime) / 1000);
      this.lastRenderTime = now;

      this.machineActor.animateSpindleStep(dt);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      this.rafId = requestAnimationFrame(renderStep);
    };
    this.rafId = requestAnimationFrame(renderStep);
  }

  public dispose(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
  }
}
