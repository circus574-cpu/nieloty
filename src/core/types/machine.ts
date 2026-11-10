/**
 * Model danych maszyny CNC, narzędzi, korektorów oraz surówki (WorkpieceStock).
 * Czysty moduł typów domenowych bez zależności od DOM ani od modelu materiału.
 */

/** Typ kinematyki maszyny przypisany do modułu kursu */
export type MachineKinematicsType =
  | 'MILL_3AXIS'     // Moduł 1: Frezarka 3-osiowa (X, Y, Z)
  | 'LATHE_2AXIS'    // Moduł 2: Tokarka z rewolwerem (X - średnicowo, Z - wzdłużnie)
  | 'MILL_4AXIS'     // Moduł 3: Frezarka 4-osiowa (X, Y, Z + oś obrotowa A wokół X)
  | 'MILL_5AXIS'     // Moduł 4: Frezarka 5-osiowa (X, Y, Z + osie obrotowe A i C)
  | 'LASER_CUTTER'   // Moduł 5: Wycinarka Laserowa / Plazmowa / Waterjet 2D CNC
  | 'GANTRY_ROUTER'  // Moduł 6: Ploter bramowy CNC (Gantry Router do drewna/kompozytów/Alu)
  | 'MILL_TURN';     // Moduł 7: Centrum tokarsko-frezarskie z napędzanymi narzędziami (oś C + oś Y)

/** Współrzędne 3D (w milimetrach) */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Pełny wektor 5-osiowy (w mm oraz stopniach).
 * Dla maszyn 2- i 3-osiowych pola a = 0 oraz c = 0 są zawsze obecne,
 * co ujednolica obliczenia i nie blokuje rozszerzenia do 4 i 5 osi.
 */
export interface Vector5D {
  x: number;
  y: number;
  z: number;
  a: number; // Kąt obrotu osi A w stopniach (wokół osi X)
  c: number; // Kąt obrotu osi C w stopniach (wokół osi Z)
}

/** Zakres roboczy pojedynczej osi (w mm lub stopniach) */
export interface AxisRange {
  min: number;
  max: number;
}

/** Limity ruchu dla poszczególnych osi maszyny (w układzie maszynowym MCS) */
export interface MachineLimits {
  x: AxisRange;
  y: AxisRange;
  z: AxisRange;
  a?: AxisRange;
  c?: AxisRange;
  maxSpindleRpm: number;         // Maksymalna prędkość obrotowa wrzeciona (obr./min)
  maxFeedRateMmPerMin: number;   // Maksymalny posuw roboczy (mm/min)
  rapidRateMmPerMin: number;     // Prędkość ruchu szybkiego G0 (mm/min) do szacowania czasu
  toolChangeTimeSeconds: number; // Czas pojedynczej wymiany narzędzia M6 (s)
}

/** Geometria części roboczej narzędzia skrawającego */
export type ToolGeometryType =
  | 'FLAT_ENDMILL'    // Frez walcowo-czołowy (płaski)
  | 'BALL_ENDMILL'    // Frez kulisty
  | 'CHAMFER_MILL'    // Frez fazujący / grawerski
  | 'DRILL'           // Wiertło kręte
  | 'LATHE_TURNING'   // Nóż tokarski do toczenia zewnętrznego (Moduł 2)
  | 'LATHE_GROOVING'  // Nóż tokarski przecinak / do rowków (Moduł 2)
  | 'LASER_NOZZLE'    // Głowica / wiązka laserowa, plazmowa lub struga wodna (Moduł 5)
  | 'V_BIT';          // Frez grawerski stożkowy V-Bit do plotera (Moduł 6)

/**
 * Definicja FIZYCZNEGO narzędzia zamocowanego w oprawce w magazynie narzędziowym.
 * UWAGA:
 * - Promień fizyczny narzędzia wynosi `diameterMm / 2`, a fizyczny wysięg `lengthMm`.
 * - Są to rzeczywiste wymiary fizyczne używane przez model materiału do symulacji skrawania i kolizji.
 * - Natomiast wartości wpisane przez operatora w sterowniku znajdują się w `ToolOffsetRegister` (H i D).
 *   Każda rozbieżność między `ToolDefinition` a aktywnym `ToolOffsetRegister` (lub brak włączenia G43/G41)
 *   powoduje rzeczywisty błąd wymiaru obrabianego detalu lub kolizję narzędzia z materiałem!
 */
export interface ToolDefinition {
  pocketNumber: number;       // Numer gniazda T (np. 1 dla T1)
  name: string;               // Nazwa po polsku, np. "Frez walcowy Ø10 mm"
  type: ToolGeometryType;
  diameterMm: number;         // Fizyczna średnica robocza narzędzia w mm (promień fizyczny = diameterMm / 2)
  lengthMm: number;           // Fizyczna długość wysięgu narzędzia z oprawki w mm
  flutesCount: number;        // Liczba ostrzy
  pointAngleDeg?: number;     // Kąt wierzchołkowy dla wierteł / fazowników (np. 118° lub 90°)
  maxPlungeDepthMm: number;   // Zalecana maksymalna głębokość skrawania na jedno przejście
}

/**
 * Rejestr korekcyjny w tabeli offsetów sterownika (H - długość, D - promień).
 * Reprezentuje wartości wpisane w pamięci sterownika CNC (a nie fizyczny wymiar narzędzia!).
 * Całkowity offset długościowy H = lengthOffsetMm + lengthWearMm.
 * Całkowity offset promieniowy D = radiusOffsetMm + radiusWearMm.
 * Jeśli wartość wpisana w rejestrze różni się od fizycznego wymiaru w `ToolDefinition`,
 * wierzchołek lub bok narzędzia pojedzie po przesuniętym torze, powodując niedocięcie, podcięcie lub kolizję.
 */
export interface ToolOffsetRegister {
  registerNumber: number;     // Numer rejestru (1..99)
  lengthOffsetMm: number;     // Wartość geometryczna korekcji długości H wpisana w sterowniku (mm)
  lengthWearMm: number;       // Zużycie długościowe H wpisane w sterowniku (mm, domyślnie 0)
  radiusOffsetMm: number;     // Wartość geometryczna korekcji promienia D wpisana w sterowniku (mm)
  radiusWearMm: number;       // Zużycie promieniowe D wpisane w sterowniku (mm, domyślnie 0)
}

/** Nazwy obsługiwanych układów współrzędnych przedmiotu (WCS - Work Coordinate System) */
export type WorkOffsetCode = 'G54' | 'G55' | 'G56' | 'G57' | 'G58' | 'G59';

/** Tabela przesunięć punktów zerowych przedmiotu względem zera maszyny (MCS) */
export type WorkOffsetTable = Record<WorkOffsetCode, Vector5D>;

/**
 * Surówka prostopadłościenna (dla frezarek 3-, 4- i 5-osiowych).
 */
export interface PrismaticStock {
  kind: 'PRISMATIC';
  sizeXMm: number;            // Wymiar wzdłuż osi X (mm)
  sizeYMm: number;            // Wymiar wzdłuż osi Y (mm)
  sizeZMm: number;            // Wysokość/grubość wzdłuż osi Z (mm)
  /**
   * Położenie narożnika minimalnego (Xmin, Ymin, Zmin) w bazowym układzie przedmiotu (G54).
   * Przykład standardowy: minCornerInWcs = { x: 0, y: 0, z: -sizeZMm },
   * dzięki czemu górna powierzchnia surówki leży dokładnie na Z = 0.
   */
  minCornerInWcs: Vector3D;
  materialName: string;
}

/**
 * Surówka walcowa / rurowa (dla tokarki w Module 2 oraz wałka w osi obrotowej A w Module 3).
 */
export interface CylindricalStock {
  kind: 'CYLINDRICAL';
  outerDiameterMm: number;    // Średnica zewnętrzna wałka (mm)
  innerDiameterMm: number;    // Średnica otworu przelotowego (0 dla pełnego wałka)
  lengthZMm: number;          // Długość wałka wzdłuż osi Z (mm)
  /**
   * Położenie prawego czoła detalu na osi Z w układzie przedmiotu (zazwyczaj Z = 0,
   * wówczas materiał rozciąga się od Z = zFaceInWcs - lengthZMm do Z = zFaceInWcs).
   */
  zFaceInWcs: number;
  unclampedLengthZMm: number; // Długość wystająca ze szczęk uchwytu (do wykrywania kolizji ze szczękami)
  materialName: string;
}

/** Unia rozłączna opisująca surówkę przed obróbką (bez parametrów siatki symulacyjnej) */
export type WorkpieceStock = PrismaticStock | CylindricalStock;

/**
 * Czysta konfiguracja fizyczna maszyny i tablic sterownika.
 * Nie zawiera surówki ani polityki oceniania lekcji.
 */
export interface MachineConfig {
  id: string;
  name: string;
  kinematics: MachineKinematicsType;
  limits: MachineLimits;
  /** Pozycja bezpiecznej wymiany narzędzia w układzie maszynowym (MCS) */
  toolChangePositionMcs: Vector5D;
  /** Pozycja początkowa punktu odniesienia wrzeciona (Spindle Gauge Line) w MCS */
  homePositionMcs: Vector5D;
  /** Dostępne narzędzia w magazynie/rewolwerze */
  tools: ToolDefinition[];
  /** Tabela korektorów H i D */
  toolOffsets: ToolOffsetRegister[];
  /** Tabela przesunięć punktów zerowych G54-G59 */
  workOffsets: WorkOffsetTable;
}
