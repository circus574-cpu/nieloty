/**
 * Wizualizacja 3D podzespołów maszyny CNC w Three.js:
 * - Stół teowy frezarki i szczęki imadła maszynowego,
 * - Układ współrzędnych przedmiotu (punkt zerowy WCS G54..G59 z osiami X, Y, Z),
 * - Głowica wrzeciona, oprawka narzędziowa (ustawiona na Spindle Gauge Line)
 *   oraz fizyczne narzędzie skrawające (frez walcowy, kulisty, fazujący, wiertło),
 *   którego czubek leży dokładnie w punkcie Tool Tip Center (positionWcs).
 */

import * as THREE from 'three';
import type { CoolantState, SpindleState } from '../core/types/common';
import type {
  PrismaticStock,
  ToolDefinition,
  Vector5D,
} from '../core/types/machine';

export class MachineActor {
  public readonly group: THREE.Group;
  private tableGroup: THREE.Group;
  private wcsAxesGroup: THREE.Group;
  private toolAssemblyGroup: THREE.Group;
  private rotatingCutterGroup: THREE.Group;
  private coolantRingMesh: THREE.Mesh;
  private currentToolPocket = -1;
  private spindleState: SpindleState = 'M5_STOP';

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MachineActorGroup';

    this.tableGroup = new THREE.Group();
    this.wcsAxesGroup = new THREE.Group();
    this.toolAssemblyGroup = new THREE.Group();
    this.rotatingCutterGroup = new THREE.Group();

    this.toolAssemblyGroup.add(this.rotatingCutterGroup);

    // Pierścień wizualizujący włączone chłodziwo M8
    const coolantGeom = new THREE.TorusGeometry(9, 0.8, 8, 24);
    const coolantMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    this.coolantRingMesh = new THREE.Mesh(coolantGeom, coolantMat);
    this.coolantRingMesh.visible = false;
    this.toolAssemblyGroup.add(this.coolantRingMesh);

    this.group.add(this.tableGroup);
    this.group.add(this.wcsAxesGroup);
    this.group.add(this.toolAssemblyGroup);

    this.buildWcsTriad();
  }

  /**
   * Buduje stół maszynowy oraz szczęki imadła dopasowane do wymiarów surówki.
   */
  public configureForStock(stock: PrismaticStock): void {
    while (this.tableGroup.children.length > 0) {
      this.tableGroup.remove(this.tableGroup.children[0]!);
    }

    const minX = stock.minCornerInWcs.x;
    const minY = stock.minCornerInWcs.y;
    const bottomZ = stock.minCornerInWcs.z;
    const centerX = minX + stock.sizeXMm / 2;
    const centerY = minY + stock.sizeYMm / 2;

    // 1. Szczęki imadła maszynowego (przód i tył wzdłuż osi Y)
    const jawHeight = Math.min(10, stock.sizeZMm * 0.45);
    const jawDepth = 12;
    const jawWidth = stock.sizeXMm + 16;
    const jawMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.6,
    });

    const frontJaw = new THREE.Mesh(
      new THREE.BoxGeometry(jawWidth, jawDepth, jawHeight),
      jawMat
    );
    frontJaw.position.set(
      centerX,
      minY - jawDepth / 2 - 0.2,
      bottomZ + jawHeight / 2
    );
    this.tableGroup.add(frontJaw);

    const backJaw = new THREE.Mesh(
      new THREE.BoxGeometry(jawWidth, jawDepth, jawHeight),
      jawMat
    );
    backJaw.position.set(
      centerX,
      minY + stock.sizeYMm + jawDepth / 2 + 0.2,
      bottomZ + jawHeight / 2
    );
    this.tableGroup.add(backJaw);

    // 2. Korpus stołu frezarki pod imadłem
    const tableWidth = Math.max(220, stock.sizeXMm + 120);
    const tableDepth = Math.max(160, stock.sizeYMm + 100);
    const tableThickness = 10;
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.4,
    });
    const tableMesh = new THREE.Mesh(
      new THREE.BoxGeometry(tableWidth, tableDepth, tableThickness),
      tableMat
    );
    tableMesh.position.set(
      centerX,
      centerY,
      bottomZ - tableThickness / 2 - 0.5
    );
    this.tableGroup.add(tableMesh);

    // Siatka pomocnicza co 10 mm na poziomie stołu
    const grid = new THREE.GridHelper(
      Math.max(tableWidth, tableDepth),
      Math.round(Math.max(tableWidth, tableDepth) / 10),
      0x475569,
      0x334155
    );
    grid.rotation.x = Math.PI / 2; // Dopasowanie do płaszczyzny XY (Z-up)
    grid.position.set(centerX, centerY, bottomZ - 0.2);
    this.tableGroup.add(grid);
  }

  /**
   * Aktualizuje pozycję wierzchołka narzędzia (positionWcs), wygląd wybranego narzędzia T
   * oraz stan wrzeciona i chłodziwa.
   */
  public updateToolState(params: {
    positionWcs: Vector5D;
    tool: ToolDefinition | undefined;
    spindleState: SpindleState;
    coolantState: CoolantState;
  }): void {
    const { positionWcs, tool, spindleState, coolantState } = params;
    this.spindleState = spindleState;

    const pocket = tool?.pocketNumber ?? 0;
    if (pocket !== this.currentToolPocket) {
      this.currentToolPocket = pocket;
      this.rebuildToolGeometry(tool);
    }

    // Punkt odniesienia grupy narzędzia to fizyczny wierzchołek narzędzia (Tool Tip Center)
    this.toolAssemblyGroup.position.set(
      positionWcs.x,
      positionWcs.y,
      positionWcs.z
    );

    const toolLen = tool?.lengthMm ?? 45;
    this.coolantRingMesh.position.set(0, 0, toolLen + 2);
    this.coolantRingMesh.visible = coolantState === 'M8_FLOOD';
  }

  /**
   * Obraca wizualnie narzędzie w pętli animacji, gdy wrzeciono pracuje (M3 lub M4).
   */
  public animateSpindleStep(deltaSeconds: number): void {
    if (this.spindleState === 'M3_CW') {
      this.rotatingCutterGroup.rotation.z -= deltaSeconds * 18;
    } else if (this.spindleState === 'M4_CCW') {
      this.rotatingCutterGroup.rotation.z += deltaSeconds * 18;
    }
  }

  private rebuildToolGeometry(tool: ToolDefinition | undefined): void {
    while (this.rotatingCutterGroup.children.length > 0) {
      this.rotatingCutterGroup.remove(this.rotatingCutterGroup.children[0]!);
    }

    const diameter = tool ? tool.diameterMm : 8;
    const radius = diameter / 2;
    const length = tool ? tool.lengthMm : 45;

    if (tool) {
      const cutterMat = new THREE.MeshStandardMaterial({
        color:
          tool.type === 'DRILL'
            ? 0xfacc15
            : tool.type === 'CHAMFER_MILL'
            ? 0xf97316
            : 0x38bdf8,
        roughness: 0.3,
        metalness: 0.7,
      });

      if (tool.type === 'DRILL' || tool.type === 'CHAMFER_MILL') {
        const angleDeg = tool.pointAngleDeg ?? (tool.type === 'DRILL' ? 118 : 90);
        const halfRad = ((angleDeg / 2) * Math.PI) / 180;
        const tipHeight = Math.min(length * 0.4, radius / Math.tan(halfRad));
        const bodyLen = Math.max(2, length - tipHeight);

        // Stożek ostrza (wierzchołek w Z=0, rozszerza się w górę do Z=tipHeight)
        const coneGeom = new THREE.ConeGeometry(radius, tipHeight, 20);
        coneGeom.rotateX(-Math.PI / 2);
        coneGeom.translate(0, 0, tipHeight / 2);
        this.rotatingCutterGroup.add(new THREE.Mesh(coneGeom, cutterMat));

        // Walec chwytu narzędzia
        const cylGeom = new THREE.CylinderGeometry(radius, radius, bodyLen, 20);
        cylGeom.rotateX(Math.PI / 2);
        cylGeom.translate(0, 0, tipHeight + bodyLen / 2);
        this.rotatingCutterGroup.add(new THREE.Mesh(cylGeom, cutterMat));
      } else {
        // Frez walcowo-czołowy lub kulisty: spód na Z=0, góra na Z=length
        const cylGeom = new THREE.CylinderGeometry(radius, radius, length, 24);
        cylGeom.rotateX(Math.PI / 2);
        cylGeom.translate(0, 0, length / 2);
        this.rotatingCutterGroup.add(new THREE.Mesh(cylGeom, cutterMat));
      }

      // Rowki wiórowe (wizualny pasek ułatwiający dostrzeżenie obrotu wrzeciona M3/M4)
      const fluteStripeGeom = new THREE.BoxGeometry(
        radius * 2.08,
        Math.max(1, radius * 0.28),
        length * 0.65
      );
      fluteStripeGeom.translate(0, 0, length * 0.35);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      this.rotatingCutterGroup.add(new THREE.Mesh(fluteStripeGeom, stripeMat));
    }

    // Oprawka narzędziowa (Collet Holder) i czoło wrzeciona (Spindle Gauge Line na Z = length)
    const holderMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.8,
    });
    const nutGeom = new THREE.CylinderGeometry(14, 10, 14, 24);
    nutGeom.rotateX(Math.PI / 2);
    nutGeom.translate(0, 0, length + 7);
    this.rotatingCutterGroup.add(new THREE.Mesh(nutGeom, holderMat));

    const spindleBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.6,
    });
    const spindleGeom = new THREE.CylinderGeometry(22, 16, 36, 24);
    spindleGeom.rotateX(Math.PI / 2);
    spindleGeom.translate(0, 0, length + 32);
    this.rotatingCutterGroup.add(new THREE.Mesh(spindleGeom, spindleBodyMat));
  }

  private buildWcsTriad(): void {
    const axisLength = 25;
    // Oś X+ (czerwona)
    const xArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      axisLength,
      0xef4444,
      5,
      2.5
    );
    // Oś Y+ (zielona)
    const yArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      axisLength,
      0x22c55e,
      5,
      2.5
    );
    // Oś Z+ (niebieska)
    const zArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      axisLength,
      0x3b82f6,
      5,
      2.5
    );

    // Kula oznaczająca punkt zerowy przedmiotu (WCS 0,0,0)
    const zeroSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );

    this.wcsAxesGroup.add(xArrow, yArrow, zArrow, zeroSphere);
  }
}
