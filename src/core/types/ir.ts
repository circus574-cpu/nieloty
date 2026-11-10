/**
 * Kanoniczna Reprezentacja Pośrednia (IR - Intermediate Representation) dla warstwy dialektów.
 * Oddziela składnię konkretnego sterownika (Fanuc/Haas, Sinumerik, Heidenhain, GRBL)
 * od silnika wykonawczego interpretera i umożliwia tłumaczenie między dialektami.
 *
 * WAŻNA REGUŁA JEDNOSTEK W IR:
 * IR przechowuje wartości liczbowe DOSŁOWNIE tak, jak zostały zapisane w programie źródłowym
 * (bez przeliczania cali G20 na milimetry G21 i bez rozwiązywania modalności).
 * Przeliczenie jednostek na milimetry (mm oraz mm/min) wykonuje dopiero interpreter
 * na podstawie aktualnego stanu ModalState.units.
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
import type { WorkOffsetCode } from './machine';

/**
 * Docelowe współrzędne zadane w pojedynczym bloku (tylko osie jawnie podane w linii).
 * Wartości są przechowywane dosłownie z programu (bez konwersji G20/G21).
 */
export interface IRTargetAxes {
  x?: number;
  y?: number;
  z?: number;
  a?: number;
  c?: number;
}

/**
 * Parametry łuku w reprezentacji pośredniej (wartości dosłowne z kodu, bez konwersji G20/G21).
 */
export type IRArcSpec =
  | { kind: 'IJK_INCREMENTAL'; i?: number; j?: number; k?: number }
  | { kind: 'RADIUS'; r: number }
  | { kind: 'CENTER_ABSOLUTE'; ccX?: number; ccY?: number; ccZ?: number };

/**
 * Parametry wywołania cyklu wiertarskiego w IR (wartości dosłowne z kodu).
 * Pola retractPlaneR oraz finalDepthZ są opcjonalne: jeśli w kolejnym bloku modalnym
 * zostaną pominięte, interpreter pobiera je ze stanu modalnego (cycleLastR, cycleLastDepthZ).
 */
export interface IRCycleParams {
  cycle: Exclude<CannedCycleMode, 'G80'>;
  retractPlaneR?: number;      // Opcjonalny poziom R; brakujący brany z ModalState.cycleLastR
  finalDepthZ?: number;        // Opcjonalna głębokość Z; brakująca brana z ModalState.cycleLastDepthZ
  peckIncrementQ?: number;     // Opcjonalny skok Q dla G83; brakujący brany z ModalState.cycleLastPeckQ
  dwellSecondsP?: number;      // Opcjonalny postój P dla G82; brakujący brany z ModalState.cycleLastDwellP
}

/**
 * Pojedynczy kanoniczny blok wykonawczy (odpowiada jednej logicznej instrukcji sterownika).
 * Wszystkie wartości liczbowe (współrzędne, łuki, cykle, posuw F) są zapisane dosłownie
 * w jednostkach programu źródłowego (bez przeliczenia G20/G21).
 */
export interface IRBlock {
  sourceLine: number;          // Numer linii w tekście źródłowym (1-based)
  rawText: string;             // Oryginalny tekst linii
  blockNumberN?: number;       // Numer bloku N (jeśli występuje)
  comment?: string;            // Treść komentarza z tej linii (do zachowania przy tłumaczeniu dialektów)

  // --- Zmiany grup modalnych w tym bloku ---
  setUnits?: UnitMode;                        // G20 / G21
  setPlane?: PlaneMode;                       // G17 / G18 / G19
  setDistanceMode?: DistanceMode;             // G90 / G91
  setWorkOffset?: WorkOffsetCode;             // G54..G59
  setMotionMode?: LinearOrArcMotionMode;      // G0 / G1 / G2 / G3 (anuluje aktywny cykl!)
  cancelCycleG80?: boolean;                   // Jawne G80
  setCycleReturnMode?: CycleReturnMode;       // G98 / G99
  setLengthComp?: {
    mode?: LengthCompMode;                    // G43 / G44 / G49 (opcjonalne, gdy w bloku podano samo H)
    registerH?: number;
  };
  setCutterComp?: {
    mode?: CutterCompMode;                    // G40 / G41 / G42 (opcjonalne, gdy w bloku podano samo D)
    registerD?: number;
  };

  // --- Parametry technologiczne i maszynowe ---
  setFeedRate?: number;                       // Posuw F (dosłowna wartość z programu, przed konwersją G20/G21)
  setSpindleSpeed?: number;                   // Obroty S
  setSpindleState?: SpindleState;             // M3 / M4 / M5
  setCoolantState?: CoolantState;             // M8 / M9
  selectToolPocket?: number;                  // Wybór narzędzia T
  executeToolChangeM6?: boolean;              // Wykonanie wymiany narzędzia M6
  dwellSeconds?: number;                      // Postój czasowy G4 (znormalizowany do sekund)
  endProgram?: 'M2' | 'M30';                  // Koniec programu

  // --- Polecenie geometryczne (ruch lub cykl) ---
  targetAxes?: IRTargetAxes;                  // Zaprogramowane współrzędne docelowe w bloku
  arcSpec?: IRArcSpec;                        // Dodatkowe parametry łuku (dla G2/G3)
  cycleSpec?: IRCycleParams;                  // Definicja/wywołanie cyklu stałego
}

/** Kanoniczna reprezentacja całego programu CNC */
export interface CanonicalProgramIR {
  sourceDialect: DialectId;
  programName?: string;
  blocks: IRBlock[];
}

/** Wynik parsowania tekstu dowolnego dialektu do IR */
export interface IRParseResult {
  ir: CanonicalProgramIR;
  syntaxDiagnostics: DiagnosticMessage[];
}

/** Mapowanie linii i adnotacje edukacyjne przy tłumaczeniu między dialektami */
export interface DialectTranslatedLine {
  targetLineNumber: number;
  sourceLineNumber: number | null;
  text: string;
  explanationPl?: string;                     // Wyjaśnienie różnicy składniowej po polsku
  requiresOperatorVerification?: boolean;     // Flaga: "DO WERYFIKACJI PRZEZ DOŚWIADCZONEGO OPERATORA"
}

export interface DialectTranslationResult {
  sourceDialect: DialectId;
  targetDialect: DialectId;
  translatedText: string;
  lines: DialectTranslatedLine[];
}
