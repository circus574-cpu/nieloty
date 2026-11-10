/**
 * Wspólne typy modalne oraz diagnostyczne współdzielone między warstwą IR (ir.ts),
 * czystym interpreterem (interpreter.ts) oraz analizatorem materiału (material.ts).
 * Eliminuje cykliczne zależności importów między modułami typów.
 */

/** Obsługiwane identyfikatory dialektów sterowników CNC */
export type DialectId =
  | 'FANUC_HAAS'      // Dialekt podstawowy kursu (ISO 6983: Fanuc / Haas)
  | 'SIEMENS_840D'    // Siemens Sinumerik (np. TRANS, CYCLE81/82/83, T="...", D1)
  | 'HEIDENHAIN_TNC'  // Heidenhain zapis dialogowy (TOOL CALL, L, CC, C, CYCL DEF)
  | 'GRBL_LINUXCNC';  // Uproszczony G-code dla małych maszyn (GRBL / LinuxCNC)

/**
 * Grupa modalna 01: Podstawowy tryb interpolacji ruchu.
 * REGUŁA WZAJEMNEGO WYKLUCZANIA Z CYKLAMI (Grupa 09):
 * - Aktywacja dowolnego kodu G0, G1, G2, G3 automatycznie anuluje aktywny cykl wiertarski
 *   (ustawia cycleMode = 'G80').
 * - Aktywacja cyklu stałego (G81, G82, G83) ustawia motionMode = null w ModalState.
 */
export type LinearOrArcMotionMode = 'G0' | 'G1' | 'G2' | 'G3';

/**
 * Grupa modalna 09: Cykle stałe (wiertarskie).
 * - 'G80' oznacza brak aktywnego cyklu.
 * - Gdy cycleMode !== 'G80', w ModalState pole motionMode ma wartość null,
 *   a każdy blok z ruchem w osiach pozycjonowania wykonuje cykl w nowym punkcie.
 */
export type CannedCycleMode = 'G80' | 'G81' | 'G82' | 'G83';

/** Grupa modalna 02: Płaszczyzna robocza */
export type PlaneMode = 'G17' | 'G18' | 'G19';

/** Grupa modalna 03: Tryb wymiarowania (bezwzględny G90 / przyrostowy G91) */
export type DistanceMode = 'G90' | 'G91';

/** Grupa modalna 06: Jednostki (cale G20 / milimetry G21) */
export type UnitMode = 'G20' | 'G21';

/** Grupa modalna 07: Korekcja promienia narzędzia */
export type CutterCompMode = 'G40' | 'G41' | 'G42';

/** Grupa modalna 08: Korekcja długości narzędzia */
export type LengthCompMode = 'G43' | 'G44' | 'G49';

/** Grupa modalna 10: Poziom powrotu w cyklach stałych */
export type CycleReturnMode = 'G98' | 'G99';

/** Stan wrzeciona */
export type SpindleState = 'M5_STOP' | 'M3_CW' | 'M4_CCW';

/** Stan chłodziwa */
export type CoolantState = 'M9_OFF' | 'M8_FLOOD';

export type DiagnosticSeverity = 'ERROR' | 'WARNING' | 'INFO';

/** Pełna lista kodów diagnostycznych (składniowych, geometrycznych, kinematycznych i materiałowych) */
export type DiagnosticCode =
  // Składnia i dialekty:
  | 'SYNTAX_UNKNOWN_WORD'
  | 'SYNTAX_MISSING_NUMBER'
  | 'SYNTAX_UNCLOSED_COMMENT'
  | 'UNSUPPORTED_FEATURE'                 // Funkcja nieobsługiwana w modelu (w tym jawnie G28 oraz G53)
  | 'CONFLICTING_GCODES_IN_BLOCK'         // Dwa kody G z tej samej grupy modalnej w jednym bloku
  // Narzędzia, wrzeciono, posuw, korekcje:
  | 'NO_TOOL_IN_SPINDLE'
  | 'TOOL_NOT_FOUND'
  | 'OFFSET_REGISTER_NOT_FOUND'           // Odwołanie do nieistniejącego rejestru H lub D w tabeli offsetów
  | 'MISSING_FEED_RATE'
  | 'MISSING_LENGTH_COMPENSATION'
  | 'MISMATCHED_H_OFFSET'
  | 'CUTTER_COMP_ON_RAPID'                // Próba włączenia/odwołania G41/G42 w G0 lub w G2/G3
  | 'COMPENSATION_GOUGE'                  // Podcięcie konturu przy G41/G42 (promień frezu > promień naroża wewn.)
  // Geometria łuków i cykli:
  | 'ARC_MISSING_PARAMETERS'
  | 'ARC_MIXED_IJK_AND_R'
  | 'ARC_GEOMETRY_IMPOSSIBLE'             // Zbyt mały promień R dla zadanej cięciwy
  | 'ARC_ENDPOINT_MISMATCH'               // Punkt końcowy nie leży na okręgu wyznaczonym przez IJK
  | 'CYCLE_MISSING_PARAMETERS'
  | 'DWELL_NEGATIVE_TIME'
  // Kinematyka maszyny:
  | 'EXCEEDED_MACHINE_LIMITS'             // Przekroczenie zakresu osi X/Y/Z/A/C
  | 'MISSING_PROGRAM_END'
  // Błędy wyliczane w Kroku 3 przez Analizator Materiału (analyzeToolpathMaterial):
  | 'SPINDLE_OFF_DURING_CUT'              // Wejście w materiał przy M5
  | 'RAPID_COLLISION_IN_MATERIAL'         // Ruch szybki G0 skrawa materiał (kolizja!)
  | 'CUT_BELOW_WORKPIECE_BOTTOM';         // Zjazd wierzchołkiem narzędzia poniżej dna surówki

export interface DiagnosticMessage {
  lineNumber: number;
  columnStart?: number;
  columnEnd?: number;
  severity: DiagnosticSeverity;
  code: DiagnosticCode;
  messagePl: string;
  hintPl: string;
  relatedSegmentId?: number;
}
