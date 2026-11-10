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
  MachineKinematicsType,
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
  private gantryBridgeGroup: THREE.Group | null = null;
  private rotaryChuckGroup: THREE.Group | null = null;
  private laserBeamGroup: THREE.Group | null = null;
  private coolantRingMesh: THREE.Mesh;
  private currentToolPocket = -1;
  private activeKinematics: MachineKinematicsType = 'MILL_3AXIS';
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
   * Buduje stół maszynowy dopasowany do wybranego typu obrabiarki:
   * - LASER_CUTTER: Ruszt grzebieniowy wycinarki laserowej/plazmowej,
   * - GANTRY_ROUTER: Płyta podkładowa MDF (Spoilboard) + ruchoma brama jezdna Y,
   * - MILL_TURN / LATHE_2AXIS: Uchwyt 3-szczękowy samocentrujący z obrotem osi C,
   * - MILL_3AXIS / MILL_4AXIS / MILL_5AXIS: Stół teowy i imadło maszynowe.
   */
  public configureForStock(
    stock: PrismaticStock,
    kinematics: MachineKinematicsType = 'MILL_3AXIS'
  ): void {
    this.activeKinematics = kinematics;
    this.currentToolPocket = -1;
    this.gantryBridgeGroup = null;
    this.rotaryChuckGroup = null;

    while (this.tableGroup.children.length > 0) {
      this.tableGroup.remove(this.tableGroup.children[0]!);
    }

    const minX = stock.minCornerInWcs.x;
    const minY = stock.minCornerInWcs.y;
    const bottomZ = stock.minCornerInWcs.z;
    const centerX = minX + stock.sizeXMm / 2;
    const centerY = minY + stock.sizeYMm / 2;

    if (kinematics === 'LASER_CUTTER') {
      // Ruszt grzebieniowy wycinarki laserowej / plazmowej
      const slatMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.6,
        metalness: 0.7,
      });
      const slatsCount = 11;
      for (let i = 0; i < slatsCount; i++) {
        const yPos = minY - 10 + (i / (slatsCount - 1)) * (stock.sizeYMm + 20);
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(stock.sizeXMm + 40, 1.5, 14),
          slatMat
        );
        slat.position.set(centerX, yPos, bottomZ - 7.2);
        this.tableGroup.add(slat);
      }

      const panMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stock.sizeXMm + 80, stock.sizeYMm + 60, 6),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
      );
      panMesh.position.set(centerX, centerY, bottomZ - 17);
      this.tableGroup.add(panMesh);
    } else if (kinematics === 'GANTRY_ROUTER') {
      // Płyta podkładowa MDF (Spoilboard) + ruchoma brama jezdna plotera CNC
      const spoilboardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stock.sizeXMm + 40, stock.sizeYMm + 40, 8),
        new THREE.MeshStandardMaterial({
          color: 0x854d0e,
          roughness: 0.85,
          metalness: 0.1,
        })
      );
      spoilboardMesh.position.set(centerX, centerY, bottomZ - 4.1);
      this.tableGroup.add(spoilboardMesh);

      // Ruchoma brama jezdna (Gantry Bridge) poruszająca się wzdłuż osi Y
      const gantry = new THREE.Group();
      const aluMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.75,
      });
      const spanX = stock.sizeXMm + 70;
      const leftPost = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 75), aluMat);
      leftPost.position.set(centerX - spanX / 2, 0, bottomZ + 32);
      const rightPost = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 75), aluMat);
      rightPost.position.set(centerX + spanX / 2, 0, bottomZ + 32);
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(spanX + 10, 12, 14),
        aluMat
      );
      beam.position.set(centerX, 0, bottomZ + 66);
      gantry.add(leftPost, rightPost, beam);
      gantry.position.set(0, centerY, 0);
      this.gantryBridgeGroup = gantry;
      this.tableGroup.add(gantry);
    } else if (kinematics === 'MILL_TURN' || kinematics === 'LATHE_2AXIS') {
      // Uchwyt tokarski 3-szczękowy samocentrujący (z obrotem osi C)
      const chuckGroup = new THREE.Group();
      chuckGroup.position.set(centerX, centerY, bottomZ - 6);

      const chuckBody = new THREE.Mesh(
        new THREE.CylinderGeometry(58, 62, 18, 32),
        new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.4,
          metalness: 0.8,
        })
      );
      chuckBody.rotateX(Math.PI / 2);
      chuckBody.position.set(0, 0, -4);
      chuckGroup.add(chuckBody);

      const jawMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.3,
        metalness: 0.85,
      });
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 16), jawMat);
        jaw.position.set(Math.cos(angle) * 48, Math.sin(angle) * 48, 8);
        jaw.rotation.z = angle;
        chuckGroup.add(jaw);
      }
      this.rotaryChuckGroup = chuckGroup;
      this.tableGroup.add(chuckGroup);
    } else {
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
    }

    // 2. Korpus stołu maszynowego pod spodem
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
      bottomZ - tableThickness / 2 - 14
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

    // Ruch bramy plotera CNC wzdłuż osi Y
    if (this.gantryBridgeGroup) {
      this.gantryBridgeGroup.position.y = positionWcs.y;
    }

    // Obrót uchwytu 3-szczękowego osi C (Mill-Turn)
    if (this.rotaryChuckGroup) {
      this.rotaryChuckGroup.rotation.z = (positionWcs.c * Math.PI) / 180;
    }

    // Wizualizacja wiązki laserowej/plazmowej podczas aktywnego M3
    if (this.laserBeamGroup) {
      this.laserBeamGroup.visible = spindleState !== 'M5_STOP';
    }

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
    this.laserBeamGroup = null;

    const diameter = tool ? tool.diameterMm : 8;
    const radius = Math.max(0.6, diameter / 2);
    const length = tool ? tool.lengthMm : 45;

    if (tool?.type === 'LASER_NOZZLE' || this.activeKinematics === 'LASER_CUTTER') {
      // Miedziana dysza stożkowa głowicy laserowej / plazmowej
      const nozzleMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });
      const nozzleCone = new THREE.ConeGeometry(9, 22, 24);
      nozzleCone.rotateX(-Math.PI / 2);
      nozzleCone.translate(0, 0, 15);
      this.rotatingCutterGroup.add(new THREE.Mesh(nozzleCone, nozzleMat));

      // Świecąca wiązka lasera/plazmy + pierścień iskier (widoczne przy M3)
      const beamGroup = new THREE.Group();
      const beamCyl = new THREE.CylinderGeometry(
        Math.max(0.8, radius),
        Math.max(0.8, radius),
        12,
        16
      );
      beamCyl.rotateX(Math.PI / 2);
      beamCyl.translate(0, 0, 2);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      beamGroup.add(new THREE.Mesh(beamCyl, beamMat));

      const sparkRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.8, 0.7, 8, 20),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      sparkRing.position.set(0, 0, 0.5);
      beamGroup.add(sparkRing);
      this.laserBeamGroup = beamGroup;
      this.rotatingCutterGroup.add(beamGroup);
    } else if (tool) {
      const cutterMat = new THREE.MeshStandardMaterial({
        color:
          tool.type === 'DRILL'
            ? 0xfacc15
            : tool.type === 'CHAMFER_MILL' || tool.type === 'V_BIT'
            ? 0xf97316
            : 0x38bdf8,
        roughness: 0.3,
        metalness: 0.7,
      });

      if (
        tool.type === 'DRILL' ||
        tool.type === 'CHAMFER_MILL' ||
        tool.type === 'V_BIT'
      ) {
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
