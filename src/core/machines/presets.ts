/**
 * Domyślne konfiguracje maszyn, narzędzi, surówek oraz polityk walidacji dla Modułu 1.
 */

import type { ValidationPolicy } from '../types/interpreter';
import type {
  MachineConfig,
  PrismaticStock,
  ToolDefinition,
  ToolOffsetRegister,
  WorkOffsetTable,
} from '../types/machine';

/** Domyślny magazyn narzędzi frezarki 3-osiowej (Moduł 1) */
export const DEFAULT_MILL_TOOLS: ToolDefinition[] = [
  {
    pocketNumber: 1,
    name: 'Frez walcowo-czołowy Ø10 mm',
    type: 'FLAT_ENDMILL',
    diameterMm: 10,
    lengthMm: 50,
    flutesCount: 4,
    maxPlungeDepthMm: 10,
  },
  {
    pocketNumber: 2,
    name: 'Frez fazujący Ø8 mm (90°)',
    type: 'CHAMFER_MILL',
    diameterMm: 8,
    lengthMm: 45,
    flutesCount: 2,
    pointAngleDeg: 90,
    maxPlungeDepthMm: 4,
  },
  {
    pocketNumber: 3,
    name: 'Wiertło kręte Ø6 mm (118°)',
    type: 'DRILL',
    diameterMm: 6,
    lengthMm: 60,
    flutesCount: 2,
    pointAngleDeg: 118,
    maxPlungeDepthMm: 30,
  },
  {
    pocketNumber: 4,
    name: 'Frez walcowo-czołowy Ø6 mm',
    type: 'FLAT_ENDMILL',
    diameterMm: 6,
    lengthMm: 40,
    flutesCount: 3,
    maxPlungeDepthMm: 6,
  },
];

/**
 * Domyślna tabela rejestrów korekcyjnych H (długość) i D (promień) w sterowniku.
 * Rejestry 1..4 odpowiadają dokładnym wymiarom fizycznym narzędzi T1..T4.
 */
export const DEFAULT_MILL_TOOL_OFFSETS: ToolOffsetRegister[] = [
  {
    registerNumber: 1,
    lengthOffsetMm: 50,
    lengthWearMm: 0,
    radiusOffsetMm: 5,
    radiusWearMm: 0,
  },
  {
    registerNumber: 2,
    lengthOffsetMm: 45,
    lengthWearMm: 0,
    radiusOffsetMm: 4,
    radiusWearMm: 0,
  },
  {
    registerNumber: 3,
    lengthOffsetMm: 60,
    lengthWearMm: 0,
    radiusOffsetMm: 3,
    radiusWearMm: 0,
  },
  {
    registerNumber: 4,
    lengthOffsetMm: 40,
    lengthWearMm: 0,
    radiusOffsetMm: 3,
    radiusWearMm: 0,
  },
];

/** Domyślna tabela punktów zerowych przedmiotu G54-G59 względem zera maszyny (MCS) */
export const DEFAULT_MILL_WORK_OFFSETS: WorkOffsetTable = {
  G54: { x: 50, y: 40, z: -100, a: 0, c: 0 },
  G55: { x: 180, y: 40, z: -100, a: 0, c: 0 },
  G56: { x: 50, y: 140, z: -100, a: 0, c: 0 },
  G57: { x: 180, y: 140, z: -100, a: 0, c: 0 },
  G58: { x: 100, y: 100, z: -90, a: 0, c: 0 },
  G59: { x: 0, y: 0, z: -100, a: 0, c: 0 },
};

/** Domyślna konfiguracja 3-osiowej frezarki edukacyjnej dla Modułu 1 */
export const MILL_3AXIS_MACHINE: MachineConfig = {
  id: 'mill-3axis-edu',
  name: 'Frezarka 3-osiowa CNC (Moduł 1)',
  kinematics: 'MILL_3AXIS',
  limits: {
    x: { min: -50, max: 350 },
    y: { min: -50, max: 250 },
    z: { min: -220, max: 100 },
    maxSpindleRpm: 12000,
    maxFeedRateMmPerMin: 5000,
    rapidRateMmPerMin: 10000,
    toolChangeTimeSeconds: 4,
  },
  toolChangePositionMcs: { x: 0, y: 0, z: 50, a: 0, c: 0 },
  homePositionMcs: { x: 50, y: 40, z: 0, a: 0, c: 0 },
  tools: DEFAULT_MILL_TOOLS,
  toolOffsets: DEFAULT_MILL_TOOL_OFFSETS,
  workOffsets: DEFAULT_MILL_WORK_OFFSETS,
};

/** Domyślna surówka prostopadłościenna 100 x 80 x 20 mm (górna ścianka na Z = 0 w WCS) */
export const DEFAULT_MILL_STOCK: PrismaticStock = {
  kind: 'PRISMATIC',
  sizeXMm: 100,
  sizeYMm: 80,
  sizeZMm: 20,
  minCornerInWcs: { x: 0, y: 0, z: -20 },
  materialName: 'Aluminium PA6 (EN AW-2017A)',
};

/** Pełna, rygorystyczna polityka walidacji (dla lekcji od 10 wzwyż oraz trybu swobodnego) */
export const STRICT_VALIDATION_POLICY: ValidationPolicy = {
  requireSpindleOnForCutting: true,
  requireToolInSpindle: true,
  requireLengthCompensation: true,
  warnOnMismatchedHOffset: true,
  forbidRapidInMaterial: true,
  forbidCutBelowStockBottom: true,
  requireProgramEndM30: true,
  arcEndpointToleranceMm: 0.01,
};

/** Łagodniejsza polityka walidacji dla wczesnych lekcji (zanim wprowadzone zostanie G43 H lub M3) */
export const EARLY_LESSON_VALIDATION_POLICY: ValidationPolicy = {
  requireSpindleOnForCutting: false,
  requireToolInSpindle: false,
  requireLengthCompensation: false,
  warnOnMismatchedHOffset: true,
  forbidRapidInMaterial: true,
  forbidCutBelowStockBottom: true,
  requireProgramEndM30: false,
  arcEndpointToleranceMm: 0.01,
};
