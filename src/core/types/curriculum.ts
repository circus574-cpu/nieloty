/**
 * Typy warstwy dydaktycznej: lekcje, zadania, kryteria sprawdzania po wyniku symulacji
 * (Result-Based Grading), stopniowane podpowiedzi, mini-quizy i słownik pojęć.
 */

import type {
  CannedCycleMode,
  CutterCompMode,
  LengthCompMode,
} from './common';
import type {
  ValidationPolicy,
} from './interpreter';
import type {
  MachineConfig,
  Vector5D,
  WorkOffsetCode,
  WorkpieceStock,
} from './machine';

export type CourseModuleId =
  | 'MODULE_0'
  | 'MODULE_1'
  | 'MODULE_2'
  | 'MODULE_3'
  | 'MODULE_4';

/** Pojedyncze kryterium sprawdzania zadania na podstawie wyniku symulacji (nie po tekście kodu!) */
export type TaskAssertion =
  | {
      kind: 'NO_ERRORS_AND_NO_COLLISIONS';
      descriptionPl: string;
    }
  | {
      kind: 'TOOLTIP_VISITED_POINT_WCS';
      targetWcs: Vector5D;
      toleranceMm: number;
      requireCuttingMotion: boolean; // true = musi dojechać ruchem roboczym G1/G2/G3, a nie G0
      requiredWorkOffset?: WorkOffsetCode;
      /** Jeśli true, sprawdza również kąty osi obrotowych A oraz C (dla Modułów 3 i 4) */
      checkRotaryAxes?: boolean;
      descriptionPl: string;
    }
  | {
      kind: 'SURFACE_HEIGHT_AT_POINT';
      pointXY: { x: number; y: number };
      expectedZMm: number;
      toleranceMm: number;
      descriptionPl: string;
    }
  | {
      kind: 'USED_ARC_MOTION';
      direction?: 'ARC_CW' | 'ARC_CCW' | 'ANY';
      expectedRadiusMm?: number;
      toleranceMm?: number;
      descriptionPl: string;
    }
  | {
      kind: 'USED_TOOL_POCKETS';
      requiredPockets: number[];
      requireInOrder: boolean;
      descriptionPl: string;
    }
  | {
      kind: 'USED_MODAL_FEATURE';
      feature:
        | { type: 'LENGTH_COMP'; mode: LengthCompMode; registerH?: number }
        | { type: 'CUTTER_COMP'; mode: CutterCompMode; registerD?: number }
        | { type: 'CANNED_CYCLE'; cycle: Exclude<CannedCycleMode, 'G80'> }
        | { type: 'WORK_OFFSET'; offset: WorkOffsetCode };
      descriptionPl: string;
    }
  | {
      kind: 'MINIMUM_REMOVED_VOLUME';
      minVolumeMm3: number;
      descriptionPl: string;
    };

/** Wynik sprawdzenia pojedynczego kryterium */
export interface AssertionCheckResult {
  assertion: TaskAssertion;
  passed: boolean;
  feedbackPl: string;
}

/** Całościowy wynik sprawdzenia zadania */
export interface TaskGradeResult {
  passedAll: boolean;
  checks: AssertionCheckResult[];
  summaryPl: string;
}

/** Pytanie w mini-quizie kończącym lekcję */
export interface QuizQuestion {
  id: string;
  questionPl: string;
  optionsPl: string[];
  correctOptionIndex: number;
  explanationPl: string;
}

/** Wiersz w tabeli ściągawki pojęć/poleceń dla początkującego */
export interface LessonCheatSheetRow {
  codeOrSymbol: string;
  meaningPl: string;
  examplePl: string;
}

/** Rozbiór pojedynczej linii kodu na części pierwsze (token po tokenie) */
export interface CodeAnatomyBreakdown {
  titlePl?: string;
  lineCode: string;
  parts: {
    token: string;
    explanationPl: string;
  }[];
}

/** Przycisk szybkiej demonstracji ruchu na maszynie 3D */
export interface InteractiveDemo3D {
  labelPl: string;
  descriptionPl?: string;
  gcode: string;
}

/** Definicja lekcji w kursie */
export interface LessonDefinition {
  id: string;
  moduleId: CourseModuleId;
  orderIndex: number;
  titlePl: string;
  shortSubtitlePl: string;
  /** Treść teoretyczna lekcji w akapitach */
  theoryParagraphsPl: string[];
  /** Opcjonalna tabela pojęć i poleceń wprowadzanych w tej lekcji ("Ściągawka dla początkującego") */
  cheatSheetRows?: LessonCheatSheetRow[];
  /** Opcjonalny wizualny rozbiór przykładowego bloku G-code znak po znaku */
  anatomyBreakdown?: CodeAnatomyBreakdown;
  /** Opcjonalne przyciski uruchamiające pokazowy ruch na maszynie 3D jednym kliknięciem */
  interactiveDemos3D?: InteractiveDemo3D[];
  /** Opcjonalna instrukcja wykonania zadania krok po kroku dla początkującego */
  stepByStepGuidePl?: string[];
  /** Opcjonalne ostrzeżenie o typowym błędzie początkującego w warsztacie */
  commonMistakeWarningPl?: string;
  /** Konfiguracja maszyny i surówki dla danej lekcji (dla Modułów 1-4) */
  machineConfig?: MachineConfig;
  stock?: WorkpieceStock;
  validationPolicy?: ValidationPolicy;
  initialActiveToolPocket?: number;
  /** Kod początkowy ładowany do edytora (przykład interaktywny / szablon zadania) */
  starterCode?: string;
  /** Opis zadania praktycznego */
  taskDescriptionPl: string;
  /** Kryteria automatycznego sprawdzania wyniku symulacji */
  assertions: TaskAssertion[];
  /** Trzystopniowe podpowiedzi */
  hintsPl: [string, string, string];
  /** Pełne wzorcowe rozwiązanie (odblokowywane po wyczerpaniu 3 podpowiedzi) */
  solutionCode?: string;
  solutionExplanationPl: string;
  /** Mini-quiz sprawdzający zrozumienie pojęcia */
  quiz: QuizQuestion[];
}

/** Wpis w słowniku pojęć CNC */
export interface GlossaryEntry {
  id: string;
  termPl: string;
  termEn: string;
  shortDefinitionPl: string;
  examplePl?: string;
}
