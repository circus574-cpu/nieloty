/**
 * Kontrakt modelu materiału (IMaterialModel) oraz analizatora obróbki i kolizji
 * (`analyzeToolpathMaterial(input: MaterialAnalysisInput): MaterialAnalysisResult`).
 * Oddzielony od interpretera G-code, co pozwala:
 * 1. Utrzymać interpreter czystym (geometrycznym),
 * 2. Wymieniać model materiału między 3 osiami (Heightmap), tokarką (RadialProfile)
 *    oraz 4 i 5 osiami (IndexedMultiAxis / Voxel).
 */

import type {
  DiagnosticCode,
  DiagnosticMessage,
} from './common';
import type {
  MotionSegment,
  ValidationPolicy,
} from './interpreter';
import type {
  ToolDefinition,
  Vector5D,
  WorkpieceStock,
} from './machine';

/**
 * Konfiguracja rozdzielczości modelu materiału.
 * Odseparowana od definicji surówki (WorkpieceStock).
 */
export interface MaterialModelOptions {
  /**
   * Rozdzielczość dyskretyzacji w milimetrach.
   * Wartość domyślna: 0.5 mm.
   * Wartość minimalna dozwolona: 0.25 mm (wymuszana w konstruktorze modelu).
   */
  resolutionMm?: number;
}

export const DEFAULT_MATERIAL_RESOLUTION_MM = 0.5;
export const MIN_MATERIAL_RESOLUTION_MM = 0.25;

/** Wynik pojedynczego kroku symulacji odcinka w modelu materiału */
export interface SegmentCutOutcome {
  didTouchMaterial: boolean;        // Czy narzędzie zebrało jakąkolwiek objętość materiału
  removedVolumeMm3: number;         // Przybliżona objętość usuniętego materiału w tym ruchu (mm³)
  minToolTipZInStockWcs: number;    // Najniższa współrzędna Z osiągnięta w obrębie rzutu surówki
  wentBelowStockBottom: boolean;    // Czy wierzchołek narzędzia zjechał poniżej dolnej płaszczyzny surówki
}

/**
 * Abstrakcyjny interfejs modelu materiału (wzorzec Strategy).
 * Pozwala podmienić implementację bez zmian w analizatorze kolizji ani w sprawdzaczach zadań:
 * - HeightmapMaterialModel (dla frezarki 3-osiowej w Module 1),
 * - LatheRadialMaterialModel (dla tokarki w Module 2),
 * - IndexedMultiAxisMaterialModel (dla frezarek 4- i 5-osiowych w Modułach 3 i 4).
 */
export interface IMaterialModel {
  readonly stock: WorkpieceStock;
  readonly resolutionMm: number;

  /** Resetuje stan materiału do nienaruszonej surówki początkowej */
  reset(): void;

  /** Tworzy głęboką kopię stanu materiału (do migawek czasu / przewijania symulacji) */
  clone(): IMaterialModel;

  /**
   * Symuluje przejście fizycznego narzędzia (`ToolDefinition`) wzdłuż pojedynczego odcinka ruchu.
   * Aktualizuje wewnętrzną strukturę materiału i zwraca informację o skrawaniu.
   */
  applySegment(
    segment: MotionSegment,
    tool: ToolDefinition | undefined
  ): SegmentCutOutcome;

  /**
   * Zwraca aktualny wymiar materiału (np. wysokość Z w Heightmap lub promień w tokarce)
   * w zadanym punkcie kontrolnym WCS. Używane przez sprawdzacze zadań (TaskGrader).
   */
  sampleSurfaceAtWcs(pointWcs: Vector5D): number | null;
}

/** Informacje materiałowe i kolizyjne przypisane do odcinka MotionSegment po analizie */
export interface SegmentMaterialAnnotation {
  segmentId: number;
  isCuttingMaterial: boolean;
  removedVolumeMm3: number;
  hasCollisionOrError: boolean;
  collisionCodes: DiagnosticCode[];
}

/**
 * Wejście do ujednoliconego analizatora materiału i kolizji:
 * `analyzeToolpathMaterial(input: MaterialAnalysisInput): MaterialAnalysisResult`
 */
export interface MaterialAnalysisInput {
  segments: MotionSegment[];
  stock: WorkpieceStock;
  tools: ToolDefinition[];
  materialModel: IMaterialModel;
  validationPolicy: ValidationPolicy;
}

/** Wyjście z analizatora materiału i kolizji (`analyzeToolpathMaterial`) */
export interface MaterialAnalysisResult {
  success: boolean;                 // true, jeśli brak kolizji i błędów technologicznych
  segmentAnnotations: Map<number, SegmentMaterialAnnotation>;
  materialDiagnostics: DiagnosticMessage[];
  totalRemovedVolumeMm3: number;
  finalMaterialModel: IMaterialModel;
}
