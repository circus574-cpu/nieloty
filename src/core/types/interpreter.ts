/**
 * Kontrakt czystego interpretera kinematycznego G-code / IR.
 * Interpreter zamienia program (z wartościami dosłownymi w IR) na reprezentację ruchów
 * przeliczoną na milimetry (MotionSegment[]), stany modalne, zdarzenia maszynowe
 * oraz błędy składniowe, geometryczne i krańcowe.
 *
 * UWAGA: Ten moduł NIE zależy od modelu materiału (surówki) i NIE tworzy cyklu importów z ir.ts.
 */

import type {
  CannedCycleMode,
  CoolantState,
  CutterCompMode,
  CycleReturnMode,
  DiagnosticMessage,
  DialectId,
  DistanceMode,
  LengthCompMode,
  LinearOrArcMotionMode,
  PlaneMode,
  SpindleState,
  UnitMode,
} from './common';
import type { CanonicalProgramIR } from './ir';
import type { MachineConfig, Vector3D, Vector5D, WorkOffsetCode } from './machine';

/**
 * Polityka walidacji dydaktycznej przekazywana z lekcji.
 * Oddzielona od MachineConfig, ponieważ zmienia się wraz z postępem w lekcjach,
 * a nie wraz z fizyczną maszyną.
 */
export interface ValidationPolicy {
  requireSpindleOnForCutting: boolean;    // Wymagaj M3/M4 podczas skrawania materiału
  requireToolInSpindle: boolean;          // Wymagaj zamocowanego narzędzia (T.. M6 lub narzędzia startowego)
  requireLengthCompensation: boolean;     // Wymagaj aktywnego G43 H.. podczas ruchów roboczych
  warnOnMismatchedHOffset: boolean;       // Ostrzegaj, gdy numer H != numer aktywnego narzędzia T
  forbidRapidInMaterial: boolean;         // Błąd krytyczny, gdy G0 wchodzi w objętość materiału
  forbidCutBelowStockBottom: boolean;     // Błąd/ostrzeżenie, gdy wierzchołek narzędzia schodzi poniżej dna surówki
  requireProgramEndM30: boolean;          // Ostrzegaj o braku M2/M30 na końcu programu
  arcEndpointToleranceMm: number;         // Dopuszczalna odchyłka promienia w łuku IJK (domyślnie 0.01 mm)
}

/**
 * Pełny stan modalny sterownika w dowolnym punkcie programu.
 *
 * 1. REGUŁA GRUP MODALNYCH RUCHU (motionMode vs cycleMode):
 *    - Gdy aktywowany jest cykl wiertarski (`cycleMode !== 'G80'`), pole `motionMode` przyjmuje wartość `null`.
 *    - Gdy wywoływany jest kod ruchu `G0`–`G3`, pole `motionMode` przyjmuje ten kod, a aktywny cykl
 *      zostaje automatycznie odwołany (`cycleMode = 'G80'`).
 *    - Gdy wywołane zostanie `G80`, `cycleMode` przechodzi na `'G80'`, natomiast `motionMode` pozostaje `null`
 *      do czasu jawnego podania `G0`, `G1`, `G2` lub `G3`.
 *
 * 2. KONWENCJA PUNKTU ODNIESIENIA NARZĘDZIA I KOREKCJI DŁUGOŚCI (G43/G44/G49):
 *    - Fizyczny rozmiar narzędzia jest zdefiniowany w `ToolDefinition` (`lengthMm` oraz `diameterMm / 2`).
 *    - Wartości korekcyjne wpisane przez operatora w sterowniku znajdują się w `ToolOffsetRegister` (`H` oraz `D`).
 *    - BEZ AKTYWNEGO G43/G44 (`lengthComp === 'G49'`): zaprogramowane `Z` w układzie WCS dotyczy
 *      CZOŁA WRZECIONA (Spindle Gauge Line). Fizyczny wierzchołek narzędzia (Tool Tip Center)
 *      znajduje się wtedy poniżej zaprogramowanego `Z` o fizyczną długość narzędzia (`z_tip = z_prog - tool.lengthMm`).
 *    - Z AKTYWNYM G43 Hn (lub G44 Hn): sterownik kompensuje długość o wartość z rejestru `Hn` (`offsetH`).
 *      Jeśli `offsetH === tool.lengthMm`, fizyczny wierzchołek narzędzia znajduje się dokładnie
 *      w zaprogramowanym `Z` (`z_tip = z_prog`).
 *    - Jeśli `offsetH !== tool.lengthMm` (błędnie wpisany offset w tabeli lub wywołanie złego rejestru H),
 *      fizyczny wierzchołek narzędzia w `positionWcs.z` znajdzie się na wysokości `z_prog + offsetH - tool.lengthMm`,
 *      co skutkuje błędem wymiarowym przedmiotu lub kolizją!
 */
export interface ModalState {
  motionMode: LinearOrArcMotionMode | null; // null, gdy aktywny jest cykl (cycleMode !== 'G80') lub po samym G80
  cycleMode: CannedCycleMode;
  plane: PlaneMode;
  distanceMode: DistanceMode;
  units: UnitMode;
  workOffset: WorkOffsetCode;
  cutterComp: CutterCompMode;
  activeRadiusRegD: number;               // 0 = brak wybranego rejestru D
  lengthComp: LengthCompMode;
  activeLengthRegH: number;               // 0 = brak wybranego rejestru H
  cycleReturnMode: CycleReturnMode;
  feedRateMmPerMin: number;
  spindleRpm: number;
  spindleState: SpindleState;
  coolantState: CoolantState;
  selectedToolPocket: number;             // Narzędzie wybrane słowem T (oczekujące na M6)
  activeToolPocket: number;               // Narzędzie zamocowane we wrzecionie (0 = puste wrzeciono)
  positionWcs: Vector5D;                  // Rzeczywista pozycja FIZYCZNEGO wierzchołka narzędzia (Tool Tip Center) w WCS
  programmedPositionWcs: Vector5D;        // Zaprogramowana pozycja w WCS (przed kompensacją G41/G42 i przy założeniu idealnego H)
  positionMcs: Vector5D;                  // Pozycja czoła wrzeciona (Spindle Gauge Line) w układzie maszynowym (MCS)
  cycleInitialZ: number | null;           // Zapamiętana współrzędna Z przed wejściem w cykl (dla G98, w mm)
  cycleLastR: number | null;              // Ostatnio zaprogramowana płaszczyzna R w cyklu (w mm)
  cycleLastDepthZ: number | null;         // Ostatnio zaprogramowana głębokość Z w cyklu (w mm)
  cycleLastPeckQ: number | null;          // Ostatnio zaprogramowany skok Q dla G83 (w mm)
  cycleLastDwellP: number | null;         // Ostatnio zaprogramowany postój P dla G82 (w sekundach)
  isProgramEnded: boolean;
}

/**
 * Parametry analityczne łuku (płaskiego lub śrubowego/helikalnego, bez wstępnego próbkowania punktów).
 * Renderer 3D oraz analizator materiału same próbkują łuk ze swoją rozdzielczością.
 */
export interface AnalyticalArcGeometry {
  plane: PlaneMode;
  centerWcs: Vector3D;                    // Środek łuku w płaszczyźnie roboczej WCS (po kompensacji G41/G42)
  radiusMm: number;                       // Promień toru środka narzędzia (mm)
  startAngleRad: number;                  // Kąt początkowy w płaszczyźnie łuku (rad)
  sweepAngleRad: number;                  // Kąt zakreślony ze znakiem: < 0 dla CW (G2), > 0 dla CCW (G3)
  /**
   * Całkowite przesunięcie śrubowe (helikalne) wzdłuż osi prostopadłej do płaszczyzny łuku
   * (oś Z dla G17, oś Y dla G18, oś X dla G19) w milimetrach:
   * 0 = łuk płaski 2D, wartość niezerowa = interpolacja śrubowa (helikalna).
   */
  axialPitchMm: number;
  normalVector: Vector3D;                 // Wektor normalny płaszczyzny łuku (np. [0,0,1] dla G17)
}

/**
 * Czysty kinematyczny odcinek trajektorii fizycznego wierzchołka narzędzia (Tool Tip Center).
 * Wszystkie wymiary są przeliczone przez interpreter na milimetry (mm) i mm/min.
 * Nie zawiera informacji o materiale ani kolizjach z surówką.
 */
export interface MotionSegment {
  id: number;
  lineNumber: number;                     // Numer linii źródłowej (1-based)
  blockNumberN: number | null;
  type: 'RAPID' | 'LINEAR' | 'ARC_CW' | 'ARC_CCW';
  /** Położenie początkowe i końcowe fizycznego wierzchołka narzędzia (Tool Tip Center) w WCS */
  startWcs: Vector5D;
  endWcs: Vector5D;
  /** Położenie początkowe i końcowe czoła wrzeciona (Spindle Gauge Line) w układzie maszynowym (MCS) */
  startMcs: Vector5D;
  endMcs: Vector5D;
  /** Współrzędne zaprogramowane w WCS (pełne 5D, przed korekcją promienia D i błędem długości H) */
  programmedStartWcs: Vector5D;
  programmedEndWcs: Vector5D;
  /** Analityczny opis łuku (wyłącznie dla ARC_CW oraz ARC_CCW) */
  arcGeometry?: AnalyticalArcGeometry;
  /** Flaga pomocnicza wskazująca, czy odcinek powstał z rozwinięcia cyklu stałego G81-G83 */
  originatedFromCycle: Exclude<CannedCycleMode, 'G80'> | null;
  toolPocket: number;
  lengthCompMode: LengthCompMode;
  activeLengthRegH: number;
  cutterCompMode: CutterCompMode;
  activeRadiusRegD: number;
  feedRateMmPerMin: number;
  spindleRpm: number;
  spindleState: SpindleState;
  coolantState: CoolantState;
  lengthMm: number;
  durationSeconds: number;
  cumulativeTimeSeconds: number;
}

/** Zdarzenia dyskretne na osi czasu maszyny */
export type MachineEventType =
  | 'TOOL_PREPARE'
  | 'TOOL_CHANGE'
  | 'SPINDLE_CHANGE'
  | 'COOLANT_CHANGE'
  | 'DWELL'
  | 'WORK_OFFSET_CHANGE'
  | 'COMPENSATION_CHANGE'
  | 'PROGRAM_END';

export interface MachineEvent {
  lineNumber: number;
  type: MachineEventType;
  descriptionPl: string;
  durationSeconds: number;
  timestampSeconds: number;
}

/** Migawka stanu po wykonaniu pojedynczej linii kodu */
export interface LineExecutionSnapshot {
  lineNumber: number;
  rawText: string;
  modalStateAfter: ModalState;
  segmentIds: number[];
  diagnostics: DiagnosticMessage[];
}

export interface ProgramStats {
  totalTimeSeconds: number;
  rapidTimeSeconds: number;
  cuttingFeedTimeSeconds: number;         // Czas ruchów roboczych G1/G2/G3 (niezależnie od kontaktu z surówką)
  toolChangeAndDwellSeconds: number;
  totalRapidDistanceMm: number;
  totalFeedDistanceMm: number;
}

/** Wejście do czystego interpretera (brak surówki!) */
export interface InterpreterInput {
  sourceText?: string;                    // Tekst kodu G (jeśli nie przekazano gotowego IR)
  dialect?: DialectId;                    // Domyślnie 'FANUC_HAAS'
  ir?: CanonicalProgramIR;                // Opcjonalnie gotowe IR z warstwy dialektów
  machineConfig: MachineConfig;
  validationPolicy: ValidationPolicy;
  initialActiveToolPocket?: number;       // Np. domyślne T1 we wrzecionie dla wczesnych lekcji (1..8)
}

/** Wyjście z czystego interpretera */
export interface InterpreterResult {
  success: boolean;                       // true, jeśli brak błędów 'ERROR' na etapie składni i kinematyki
  ir: CanonicalProgramIR;
  segments: MotionSegment[];
  events: MachineEvent[];
  diagnostics: DiagnosticMessage[];
  lineSnapshots: LineExecutionSnapshot[];
  finalModalState: ModalState;
  stats: ProgramStats;
}
