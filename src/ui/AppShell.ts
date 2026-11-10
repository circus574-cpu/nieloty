/**
 * Główny szkielet aplikacji edukacyjnej (AppShell – Etap 2 + Etap 3):
 * - Pełny system lekcji: Moduł 0 (A–E) oraz Moduł 1 (1–14) + zarys Modułów 2–4,
 * - Automatyczny sprawdzacz zadań po wyniku symulacji (gradeLessonTask),
 * - Zapis postępu w przeglądarce z bezpiecznym fallbackiem (SafeProgressStore),
 * - Słownik pojęć CNC (GlossaryModal) oraz nota bezpieczeństwa BHP,
 * - Zintegrowany edytor CodeMirror 6, podgląd 3D Three.js, odtwarzacz symulacji i tabele T/H/D/G54.
 */

import { interpretGCode } from '../core/gcode/interpreter';
import {
  DEFAULT_MILL_STOCK,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../core/machines/presets';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';
import { analyzeToolpathMaterial } from '../core/simulation/materialAnalyzer';
import type { DiagnosticMessage } from '../core/types/common';
import type {
  LessonDefinition,
  TaskGradeResult,
} from '../core/types/curriculum';
import type {
  InterpreterResult,
  ValidationPolicy,
} from '../core/types/interpreter';
import type { MachineConfig, Vector5D } from '../core/types/machine';
import type { MaterialAnalysisResult } from '../core/types/material';
import { gradeLessonTask } from '../curriculum/grader';
import { MODULE_0_LESSONS } from '../curriculum/module0/lessonsM0';
import { MODULE_1_LESSONS } from '../curriculum/module1/lessonsM1';
import { SYLLABUS_MODULES_2_TO_4 } from '../curriculum/modules2to4/syllabusM2toM4';
import { type CameraViewPreset, SceneManager } from '../simulator3d/SceneManager';
import { SimulationPlayer } from '../simulator3d/SimulationPlayer';
import { SafeProgressStore } from '../storage/progressStore';
import { CodeEditor } from './CodeEditor';
import { GlossaryModal } from './GlossaryModal';
import { LessonPanel } from './LessonPanel';
import { ModalStateBar } from './ModalStateBar';
import { ToolAndOffsetPanel } from './ToolAndOffsetModal';
import { WelcomeGuideModal } from './WelcomeGuideModal';

const ALL_LESSONS: LessonDefinition[] = [
  ...MODULE_0_LESSONS,
  ...MODULE_1_LESSONS,
];

export class AppShell {
  private root: HTMLElement;
  private progressStore: SafeProgressStore;
  private currentLesson: LessonDefinition;
  private machineConfig: MachineConfig;
  private stock = { ...DEFAULT_MILL_STOCK };
  private activeValidationPolicy: ValidationPolicy = STRICT_VALIDATION_POLICY;

  private sceneManager!: SceneManager;
  private player!: SimulationPlayer;
  private editor!: CodeEditor;
  private modalStateBar!: ModalStateBar;
  private toolAndOffsetPanel!: ToolAndOffsetPanel;
  private lessonPanel!: LessonPanel;
  private glossaryModal!: GlossaryModal;
  private welcomeModal!: WelcomeGuideModal;

  private lastInterpResult!: InterpreterResult;
  private lastMaterialResult!: MaterialAnalysisResult;

  private lessonSelectEl!: HTMLSelectElement;
  private progressBadgeEl!: HTMLElement;
  private diagnosticsContainer!: HTMLElement;
  private statusBadgeEl!: HTMLElement;
  private playBtnEl!: HTMLButtonElement;
  private scrubInputEl!: HTMLInputElement;
  private timeLabelEl!: HTMLElement;
  private editorBlockWrapperEl!: HTMLElement;
  private jogStepMm = 5;

  constructor(root: HTMLElement) {
    this.root = root;
    this.progressStore = new SafeProgressStore('M0_0');
    const savedId = this.progressStore.getCurrentLessonId();
    this.currentLesson =
      ALL_LESSONS.find((l) => l.id === savedId) ?? ALL_LESSONS[0]!;
    this.machineConfig = structuredClone(MILL_3AXIS_MACHINE);

    this.buildLayout();
    this.initializeComponents();
    this.loadLesson(this.currentLesson.id);
  }

  private buildLayout(): void {
    const syllabusHtml = SYLLABUS_MODULES_2_TO_4.map(
      (mod) => `
      <div class="table-section">
        <h4>${mod.titlePl}</h4>
        <p class="table-hint">${mod.machineSummaryPl}</p>
        <div class="table-scroll">
          <table class="cnc-table">
            <thead>
              <tr>
                <th>Lekcja</th>
                <th>Temat</th>
                <th>Cel dydaktyczny</th>
              </tr>
            </thead>
            <tbody>
              ${mod.lessons
                .map(
                  (l) => `
                <tr>
                  <td><strong>${l.code}</strong></td>
                  <td>${l.titlePl}</td>
                  <td>${l.goalPl}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
    ).join('');

    this.root.innerHTML = `
      <header class="app-header">
        <div class="brand-block">
          <span class="brand-tag">INTERAKTYWNY KURS CNC • OD ZERA DO PROGRAMISTY</span>
          <h1 class="app-title">Kurs Programowania Ruchu Maszyn CNC z Symulatorem 3D</h1>
        </div>

        <div class="header-actions">
          <label class="sample-select-label" for="lesson-select">
            Wybierz lekcję:
          </label>
          <select id="lesson-select" class="sample-select" aria-label="Wybierz lekcję kursu CNC"></select>

          <span id="course-progress-badge" class="status-pill pill-ok" title="Twój postęp w kursie">
            Postęp: 0/${ALL_LESSONS.length}
          </span>

          <button type="button" id="btn-header-welcome" class="btn btn-primary" title="Otwórz ekran startowy i przewodnik po aplikacji">
            👋 Przewodnik / Start
          </button>

          <button type="button" id="btn-header-glossary" class="btn" title="Otwórz słownik pojęć CNC">
            📖 Słownik
          </button>

          <button type="button" id="btn-bhp-info" class="btn btn-secondary" title="Zasady bezpieczeństwa BHP">
            ⚠ Nota BHP
          </button>
        </div>
      </header>

      <div id="bhp-banner" class="bhp-banner" role="note" hidden>
        <strong>WAŻNA INFORMACJA O BEZPIECZEŃSTWIE (BHP):</strong>
        Ten kurs wykorzystuje <em>uproszczony model nauczania (w stylu ISO / Fanuc)</em> i <strong>NIE zastępuje</strong>
        rzeczywistego sterownika obrabiarki, szkolenia BHP ani pracy pod nadzorem doświadczonego operatora.
        Nigdy nie uruchamiaj niesprawdzonego programu na prawdziwej maszynie bez nadzoru instruktora.
        <button type="button" id="btn-close-bhp" class="btn-inline-close" aria-label="Zamknij notę BHP">Zamknij ✕</button>
      </div>

      <main class="workspace-grid">
        <!-- PRAWY / GÓRNY PANEL: SCENA 3D + STEROWANIE SYMULACJĄ + STAN MODALNY -->
        <section class="viewport-section" aria-label="Wizualizacja 3D i sterowanie symulacją">
          <div class="viewport-wrapper">
            <div id="three-viewport" class="three-viewport"></div>

            <div class="camera-toolbar" role="toolbar" aria-label="Widoki kamery 3D">
              <button type="button" class="btn-cam" data-cam="TOP_XY" title="Widok z góry (płaszczyzna XY)">Góra (XY)</button>
              <button type="button" class="btn-cam" data-cam="FRONT_XZ" title="Widok z przodu (płaszczyzna XZ)">Przód (XZ)</button>
              <button type="button" class="btn-cam" data-cam="SIDE_YZ" title="Widok z boku (płaszczyzna YZ)">Bok (YZ)</button>
              <button type="button" class="btn-cam active" data-cam="ISO_3D" title="Widok izometryczny 3D">3D ISO</button>
            </div>

            <div class="path-legend" aria-label="Legenda ścieżki narzędzia">
              <span class="legend-item"><span class="legend-line dashed-yellow"></span> <code>G0</code> Szybki (przerywana)</span>
              <span class="legend-item"><span class="legend-line solid-blue"></span> <code>G1/G2/G3</code> Roboczy (ciągła)</span>
              <span class="legend-item"><span class="legend-line dashed-green"></span> Kontur <code>G41/G42</code></span>
              <span class="legend-item"><span class="legend-icon-err">◆</span> Kolizja / Błąd</span>
            </div>
          </div>

          <!-- Pasek odtwarzacza symulacji -->
          <div class="player-bar" role="region" aria-label="Sterowanie odtwarzaniem symulacji">
            <div class="player-buttons">
              <button type="button" id="btn-play-pause" class="btn btn-primary" aria-label="Uruchom lub wstrzymaj symulację">
                ▶ Start
              </button>
              <button type="button" id="btn-step-prev" class="btn" title="Poprzednia linia ruchu" aria-label="Cofnij o jedną linię">
                ◀ Krok -1
              </button>
              <button type="button" id="btn-step-next" class="btn" title="Wykonaj następną linia kodu" aria-label="Następna linia">
                Następna linia ▶
              </button>
              <button type="button" id="btn-jump-end" class="btn" title="Pokaż od razu gotowy detal na końcu programu">
                ⏭ Koniec
              </button>
              <button type="button" id="btn-reset-sim" class="btn" title="Zresetuj surówkę do stanu początkowego">
                ⏮ Reset
              </button>
            </div>

            <div class="player-scrub-row">
              <label for="sim-scrub-slider" class="sr-only">Postęp symulacji</label>
              <input
                type="range"
                id="sim-scrub-slider"
                class="scrub-slider"
                min="0"
                max="1000"
                value="1000"
              />
              <span id="sim-time-label" class="time-readout">0.0 s / 0.0 s</span>

              <label for="sim-speed-select" class="speed-label">Prędkość:</label>
              <select id="sim-speed-select" class="speed-select" aria-label="Prędkość animacji symulacji">
                <option value="0.25">0.25x (Wolno)</option>
                <option value="0.5">0.5x</option>
                <option value="1" selected>1x (Normalnie)</option>
                <option value="2">2x</option>
                <option value="5">5x (Szybko)</option>
                <option value="10">10x</option>
              </select>
            </div>
          </div>

          <div id="modal-state-container" class="modal-state-container"></div>
        </section>

        <!-- LEWY / DOLNY PANEL: LEKCJA, EDYTOR G-CODE, DIAGNOSTYKA, TABELE, JOG, SYLABUS -->
        <section class="editor-section" aria-label="Treść lekcji, edytor G-code i diagnostyka">
          <div class="panel-tabs-header" role="tablist">
            <button type="button" class="tab-btn active" role="tab" aria-selected="true" data-tab="tab-lesson">
              🎓 Lekcja i zadanie
            </button>
            <button type="button" class="tab-btn" role="tab" aria-selected="false" data-tab="tab-diagnostics">
              🔍 Diagnostyka <span id="diag-count-badge" class="status-pill pill-ok">OK</span>
            </button>
            <button type="button" class="tab-btn" role="tab" aria-selected="false" data-tab="tab-tables">
              🛠 Tabele T / H / D / G54
            </button>
            <button type="button" class="tab-btn" role="tab" aria-selected="false" data-tab="tab-jog">
              🕹 Ręczny ruch (JOG)
            </button>
            <button type="button" class="tab-btn" role="tab" aria-selected="false" data-tab="tab-syllabus">
              📚 Moduły 2–4
            </button>
          </div>

          <!-- Karta 1: Treść lekcji NA GÓRZE + Zintegrowany Edytor G-code (dla Modułu 1) -->
          <div id="tab-lesson" class="tab-pane active" role="tabpanel">
            <div id="lesson-panel-host" class="lesson-panel-host"></div>

            <div id="editor-block-wrapper" class="editor-block-wrapper">
              <div class="editor-toolbar">
                <span id="editor-status-badge" class="editor-status status-ok">
                  ✔ Kod poprawny – brak błędów i kolizji
                </span>
                <button type="button" id="btn-run-code" class="btn btn-primary">
                  🔄 Przelicz ścieżkę 3D
                </button>
              </div>
              <div id="codemirror-host" class="codemirror-host"></div>
            </div>
          </div>

          <!-- Karta 2: Lista błędów i ostrzeżeń po polsku -->
          <div id="tab-diagnostics" class="tab-pane" role="tabpanel" hidden>
            <div id="diagnostics-list" class="diagnostics-list"></div>
          </div>

          <!-- Karta 3: Tabele narzędzi, korektorów H/D i punktów zerowych G54-G59 -->
          <div id="tab-tables" class="tab-pane" role="tabpanel" hidden>
            <div id="tables-host"></div>
          </div>

          <!-- Karta 4: Ręczne poruszanie osiami (JOG) -->
          <div id="tab-jog" class="tab-pane" role="tabpanel" hidden>
            <div class="jog-panel">
              <h4>Ręczne sterowanie osiami maszyny (Tryb JOG)</h4>
              <p class="table-hint">
                Przesuwaj wrzeciono wzdłuż osi <strong>X</strong> (lewo/prawo),
                <strong>Y</strong> (przód/tył) oraz <strong>Z</strong> (góra/dół) i obserwuj ruch narzędzia w 3D.
              </p>
              <div class="jog-step-row">
                <span>Krok pojedynczego kliknięcia:</span>
                <button type="button" class="btn btn-jog-step" data-step="1">1 mm</button>
                <button type="button" class="btn btn-jog-step active" data-step="5">5 mm</button>
                <button type="button" class="btn btn-jog-step" data-step="10">10 mm</button>
              </div>
              <div class="jog-axes-grid">
                <div class="jog-axis-box">
                  <span class="jog-axis-title axis-x-color">Oś X (Lewo / Prawo)</span>
                  <div class="jog-btn-pair">
                    <button type="button" class="btn btn-jog" data-axis="x" data-dir="-1">◀ X-</button>
                    <button type="button" class="btn btn-jog" data-axis="x" data-dir="1">X+ ▶</button>
                  </div>
                </div>
                <div class="jog-axis-box">
                  <span class="jog-axis-title axis-y-color">Oś Y (Przód / Tył)</span>
                  <div class="jog-btn-pair">
                    <button type="button" class="btn btn-jog" data-axis="y" data-dir="-1">▼ Y-</button>
                    <button type="button" class="btn btn-jog" data-axis="y" data-dir="1">Y+ ▲</button>
                  </div>
                </div>
                <div class="jog-axis-box">
                  <span class="jog-axis-title axis-z-color">Oś Z (Dół / Góra)</span>
                  <div class="jog-btn-pair">
                    <button type="button" class="btn btn-jog" data-axis="z" data-dir="-1">⬇ Z-</button>
                    <button type="button" class="btn btn-jog" data-axis="z" data-dir="1">Z+ ⬆</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Karta 5: Spis lekcji Modułów 2-4 -->
          <div id="tab-syllabus" class="tab-pane" role="tabpanel" hidden>
            <div class="tables-panel-content">
              <h3>Spis lekcji kolejnych modułów (Tokarka, 4 osie, 5 osi)</h3>
              <p class="table-hint">
                Zgodnie z planem kursu po opanowaniu Modułu 0 i Modułu 1 przechodzimy do tokarki z głowicą rewolwerową
                oraz frezarek wieloosiowych:
              </p>
              ${syllabusHtml}
            </div>
          </div>
        </section>
      </main>
    `;
  }

  private initializeComponents(): void {
    const viewportEl = this.root.querySelector<HTMLElement>('#three-viewport')!;
    const modalBarEl = this.root.querySelector<HTMLElement>(
      '#modal-state-container'
    )!;
    const cmHostEl = this.root.querySelector<HTMLElement>('#codemirror-host')!;
    const tablesHostEl = this.root.querySelector<HTMLElement>('#tables-host')!;
    const lessonHostEl =
      this.root.querySelector<HTMLElement>('#lesson-panel-host')!;

    this.lessonSelectEl =
      this.root.querySelector<HTMLSelectElement>('#lesson-select')!;
    this.progressBadgeEl = this.root.querySelector<HTMLElement>(
      '#course-progress-badge'
    )!;
    this.diagnosticsContainer =
      this.root.querySelector<HTMLElement>('#diagnostics-list')!;
    this.statusBadgeEl = this.root.querySelector<HTMLElement>(
      '#editor-status-badge'
    )!;
    this.playBtnEl =
      this.root.querySelector<HTMLButtonElement>('#btn-play-pause')!;
    this.scrubInputEl =
      this.root.querySelector<HTMLInputElement>('#sim-scrub-slider')!;
    this.timeLabelEl =
      this.root.querySelector<HTMLElement>('#sim-time-label')!;
    this.editorBlockWrapperEl = this.root.querySelector<HTMLElement>(
      '#editor-block-wrapper'
    )!;

    this.glossaryModal = new GlossaryModal(this.root);
    this.welcomeModal = new WelcomeGuideModal(this.root, {
      onStartFromLesson00: () => this.loadLesson('M0_0'),
      onContinueCurrentLesson: () => {},
    });
    this.sceneManager = new SceneManager(viewportEl);
    this.player = new SimulationPlayer(this.machineConfig, this.stock);
    this.modalStateBar = new ModalStateBar(modalBarEl);

    this.editor = new CodeEditor(
      cmHostEl,
      this.currentLesson.starterCode ?? '',
      {
        onChange: (newCode) => {
          if (this.currentLesson.moduleId !== 'MODULE_0') {
            this.progressStore.saveUserCode(this.currentLesson.id, newCode);
            this.runSimulationFromEditor(false);
          }
        },
        onCursorLineChange: (lineNo) => {
          this.sceneManager.highlightEditorLine(lineNo);
        },
      }
    );

    this.toolAndOffsetPanel = new ToolAndOffsetPanel(
      tablesHostEl,
      this.machineConfig,
      (updatedConfig) => {
        this.machineConfig = updatedConfig;
        this.runSimulationFromEditor(true);
      }
    );

    this.lessonPanel = new LessonPanel(lessonHostEl, this.progressStore, {
      onCheckTaskRequested: (lesson) => this.evaluateCurrentLessonTask(lesson),
      onResetStarterCode: (starterCode) => {
        this.editor.setValue(starterCode);
        this.progressStore.saveUserCode(this.currentLesson.id, starterCode);
        this.runSimulationFromEditor(true);
      },
      onApplySolutionCode: (solutionCode) => {
        this.editor.setValue(solutionCode);
        this.progressStore.saveUserCode(this.currentLesson.id, solutionCode);
        this.runSimulationFromEditor(true);
        const res = this.evaluateCurrentLessonTask(this.currentLesson);
        this.lessonPanel.showGradeResult(res);
      },
      onRunDemo3D: (demoGCode) => {
        this.editor.setValue(demoGCode);
        this.runSimulationFromEditor(false);
        this.player.reset();
        this.player.play();
      },
      onOpenGlossary: () => this.glossaryModal.open(),
      onOpenWelcomeGuide: () => this.welcomeModal.open(),
      onNavigateLesson: (dir) => this.navigateLesson(dir),
      onProgressUpdated: () => this.refreshLessonSelectorAndProgress(),
    });

    this.player.onUpdate((frame) => {
      this.playBtnEl.textContent = frame.isPlaying ? '⏸ Pauza' : '▶ Start';
      this.scrubInputEl.value = String(Math.round(frame.overallProgress * 1000));
      this.timeLabelEl.textContent = `${frame.elapsedTimeSeconds.toFixed(
        1
      )} s / ${frame.totalTimeSeconds.toFixed(1)} s`;

      this.editor.setActiveExecutionLine(frame.activeLineNumber);
      this.sceneManager.highlightEditorLine(frame.activeLineNumber);
      this.sceneManager.updateWorkpieceHeightmap(frame.heightmapModel);

      const activeTool = this.machineConfig.tools.find(
        (t) => t.pocketNumber === frame.currentModalState.activeToolPocket
      );
      this.sceneManager.updateToolPose({
        positionWcs: frame.currentPositionWcs,
        tool: activeTool,
        spindleState: frame.currentModalState.spindleState,
        coolantState: frame.currentModalState.coolantState,
      });

      this.modalStateBar.update(frame.currentModalState, {
        totalTimeSeconds: frame.totalTimeSeconds,
        rapidTimeSeconds: 0,
        cuttingFeedTimeSeconds: frame.elapsedTimeSeconds,
        toolChangeAndDwellSeconds: 0,
        totalRapidDistanceMm: 0,
        totalFeedDistanceMm: 0,
      });
    });

    this.bindUIEvents();
    this.refreshLessonSelectorAndProgress();
  }

  private refreshLessonSelectorAndProgress(): void {
    const allIds = ALL_LESSONS.map((l) => l.id);
    const completedCount = this.progressStore.getCompletedLessonsCount(allIds);
    this.progressBadgeEl.textContent = `Ukończono: ${completedCount}/${ALL_LESSONS.length}`;

    const m0Options = MODULE_0_LESSONS.map((l) => {
      const done = this.progressStore.getLessonRecord(l.id).taskCompleted;
      return `<option value="${l.id}" ${
        l.id === this.currentLesson.id ? 'selected' : ''
      }>${done ? '✔ ' : '○ '}${l.titlePl}</option>`;
    }).join('');

    const m1Options = MODULE_1_LESSONS.map((l) => {
      const done = this.progressStore.getLessonRecord(l.id).taskCompleted;
      return `<option value="${l.id}" ${
        l.id === this.currentLesson.id ? 'selected' : ''
      }>${done ? '✔ ' : '○ '}${l.titlePl}</option>`;
    }).join('');

    this.lessonSelectEl.innerHTML = `
      <optgroup label="Moduł 0: Wprowadzenie od zera (Lekcje 0.0 – 0.E)">
        ${m0Options}
      </optgroup>
      <optgroup label="Moduł 1: Frezarka 3-osiowa CNC (Lekcje 1–14)">
        ${m1Options}
      </optgroup>
    `;
  }

  private loadLesson(lessonId: string): void {
    const found = ALL_LESSONS.find((l) => l.id === lessonId);
    if (!found) return;

    this.currentLesson = found;
    this.progressStore.setCurrentLessonId(found.id);
    this.refreshLessonSelectorAndProgress();

    const isModule0 = found.moduleId === 'MODULE_0';
    this.editorBlockWrapperEl.hidden = isModule0;

    if (!isModule0) {
      this.machineConfig = structuredClone(
        found.machineConfig ?? MILL_3AXIS_MACHINE
      );
      this.stock =
        found.stock && found.stock.kind === 'PRISMATIC'
          ? { ...found.stock }
          : { ...DEFAULT_MILL_STOCK };
      this.activeValidationPolicy =
        found.validationPolicy ?? STRICT_VALIDATION_POLICY;

      const rec = this.progressStore.getLessonRecord(found.id);
      const codeToLoad = rec.savedUserCode ?? found.starterCode ?? '';
      this.editor.setValue(codeToLoad);
      this.runSimulationFromEditor(true);
    }

    this.lessonPanel.setLesson(found);
  }

  private navigateLesson(direction: 'prev' | 'next'): void {
    const idx = ALL_LESSONS.findIndex((l) => l.id === this.currentLesson.id);
    if (idx < 0) return;
    const nextIdx =
      direction === 'next'
        ? Math.min(ALL_LESSONS.length - 1, idx + 1)
        : Math.max(0, idx - 1);
    const targetLesson = ALL_LESSONS[nextIdx];
    if (targetLesson) {
      this.loadLesson(targetLesson.id);
    }
  }

  private evaluateCurrentLessonTask(lesson: LessonDefinition): TaskGradeResult {
    this.runSimulationFromEditor(true);
    return gradeLessonTask(
      lesson.assertions,
      this.lastInterpResult,
      this.lastMaterialResult
    );
  }

  private bindUIEvents(): void {
    this.lessonSelectEl.addEventListener('change', () => {
      this.loadLesson(this.lessonSelectEl.value);
    });

    this.root
      .querySelector('#btn-header-welcome')
      ?.addEventListener('click', () => this.welcomeModal.open());

    this.root
      .querySelector('#btn-header-glossary')
      ?.addEventListener('click', () => this.glossaryModal.open());

    const bhpBanner = this.root.querySelector<HTMLElement>('#bhp-banner')!;
    this.root
      .querySelector('#btn-bhp-info')!
      .addEventListener('click', () => {
        bhpBanner.hidden = !bhpBanner.hidden;
      });
    this.root
      .querySelector('#btn-close-bhp')!
      .addEventListener('click', () => {
        bhpBanner.hidden = true;
      });

    const camButtons =
      this.root.querySelectorAll<HTMLButtonElement>('button.btn-cam');
    camButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        camButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.cam as CameraViewPreset;
        this.sceneManager.setCameraPreset(preset);
      });
    });

    this.playBtnEl.addEventListener('click', () => {
      if (this.playBtnEl.textContent?.includes('Pauza')) {
        this.player.pause();
      } else {
        this.player.play();
      }
    });

    this.root
      .querySelector('#btn-step-next')!
      .addEventListener('click', () => this.player.stepNextLine());

    this.root
      .querySelector('#btn-step-prev')!
      .addEventListener('click', () => this.player.stepPrevLine());

    this.root
      .querySelector('#btn-jump-end')!
      .addEventListener('click', () => this.player.jumpToEnd());

    this.root
      .querySelector('#btn-reset-sim')!
      .addEventListener('click', () => this.player.reset());

    this.scrubInputEl.addEventListener('input', () => {
      const val01 = Number(this.scrubInputEl.value) / 1000;
      this.player.seekToOverallProgress(val01);
    });

    const speedSelect =
      this.root.querySelector<HTMLSelectElement>('#sim-speed-select')!;
    speedSelect.addEventListener('change', () => {
      this.player.setSpeedMultiplier(Number(speedSelect.value));
    });

    this.root
      .querySelector('#btn-run-code')!
      .addEventListener('click', () => this.runSimulationFromEditor(true));

    const tabBtns =
      this.root.querySelectorAll<HTMLButtonElement>('button.tab-btn');
    const tabPanes =
      this.root.querySelectorAll<HTMLElement>('div.tab-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab!;
        tabBtns.forEach((b) => {
          const active = b.dataset.tab === targetId;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', String(active));
        });
        tabPanes.forEach((pane) => {
          const isMatch = pane.id === targetId;
          pane.classList.toggle('active', isMatch);
          pane.hidden = !isMatch;
        });
      });
    });

    const stepBtns =
      this.root.querySelectorAll<HTMLButtonElement>('button.btn-jog-step');
    stepBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        stepBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.jogStepMm = Number(btn.dataset.step);
      });
    });

    const jogBtns =
      this.root.querySelectorAll<HTMLButtonElement>('button.btn-jog');
    let manualJogPos: Vector5D = { x: 50, y: 40, z: 15, a: 0, c: 0 };
    jogBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.player.pause();
        const axis = btn.dataset.axis as 'x' | 'y' | 'z';
        const dir = Number(btn.dataset.dir);
        manualJogPos = {
          ...manualJogPos,
          [axis]: manualJogPos[axis] + dir * this.jogStepMm,
        };
        const t1 = this.machineConfig.tools[0];
        this.sceneManager.updateToolPose({
          positionWcs: manualJogPos,
          tool: t1,
          spindleState: 'M5_STOP',
          coolantState: 'M9_OFF',
        });
      });
    });
  }

  private runSimulationFromEditor(jumpToEndAfterParse: boolean): void {
    const code = this.editor.getValue();

    const interpRes = interpretGCode({
      sourceText: code,
      machineConfig: this.machineConfig,
      validationPolicy: this.activeValidationPolicy,
      initialActiveToolPocket: this.currentLesson.initialActiveToolPocket ?? 0,
    });

    const initialHeightmap = new HeightmapMaterialModel(this.stock);
    const matRes = analyzeToolpathMaterial({
      segments: interpRes.segments,
      stock: this.stock,
      tools: this.machineConfig.tools,
      materialModel: initialHeightmap,
      validationPolicy: this.activeValidationPolicy,
    });

    this.lastInterpResult = interpRes;
    this.lastMaterialResult = matRes;

    const combinedDiagnostics: DiagnosticMessage[] = [
      ...interpRes.diagnostics,
      ...matRes.materialDiagnostics,
    ].sort((a, b) => a.lineNumber - b.lineNumber);

    this.editor.setDiagnostics(combinedDiagnostics);
    this.renderDiagnosticsList(combinedDiagnostics);

    const errorSegIds = new Set<number>();
    for (const d of combinedDiagnostics) {
      if (d.relatedSegmentId !== undefined) {
        errorSegIds.add(d.relatedSegmentId);
      }
    }

    this.sceneManager.setStockAndRebuildScene(this.stock, initialHeightmap);
    this.sceneManager.updateToolpath(
      interpRes.segments,
      matRes.segmentAnnotations,
      errorSegIds
    );

    this.player.loadProgramResult(interpRes, this.machineConfig, this.stock);
    if (jumpToEndAfterParse) {
      this.player.jumpToEnd();
    }
    this.toolAndOffsetPanel.setMachineConfig(this.machineConfig);
  }

  private renderDiagnosticsList(diagnostics: DiagnosticMessage[]): void {
    const errorCount = diagnostics.filter((d) => d.severity === 'ERROR').length;
    const warnCount = diagnostics.filter((d) => d.severity === 'WARNING').length;
    const countBadge =
      this.root.querySelector<HTMLElement>('#diag-count-badge')!;

    if (errorCount > 0) {
      this.statusBadgeEl.className = 'editor-status status-err';
      this.statusBadgeEl.textContent = `✖ Wykryto błędy: ${errorCount} (ostrzeżenia: ${warnCount})`;
      countBadge.className = 'status-pill pill-err';
      countBadge.textContent = `${errorCount} bł.`;
    } else if (warnCount > 0) {
      this.statusBadgeEl.className = 'editor-status status-warn';
      this.statusBadgeEl.textContent = `⚠ Program wykonalny z ostrzeżeniami (${warnCount})`;
      countBadge.className = 'status-pill pill-warn';
      countBadge.textContent = `${warnCount} ostrz.`;
    } else {
      this.statusBadgeEl.className = 'editor-status status-ok';
      this.statusBadgeEl.textContent =
        '✔ Kod poprawny – brak błędów i kolizji';
      countBadge.className = 'status-pill pill-ok';
      countBadge.textContent = 'OK';
    }

    if (diagnostics.length === 0) {
      this.diagnosticsContainer.innerHTML = `
        <div class="diag-empty">
          <strong>✔ Brak błędów i ostrzeżeń.</strong>
          <p>Ścieżka narzędzia mieści się w polu roboczym maszyny i nie powoduje kolizji z materiałem.</p>
        </div>
      `;
      return;
    }

    this.diagnosticsContainer.innerHTML = diagnostics
      .map(
        (d) => `
        <article class="diag-card diag-${d.severity.toLowerCase()}" data-line="${
          d.lineNumber
        }">
          <div class="diag-header">
            <span class="diag-icon">${
              d.severity === 'ERROR' ? '✖ BŁĄD' : '⚠ OSTRZEŻENIE'
            }</span>
            <span class="diag-code">${d.code}</span>
            <button type="button" class="btn-goto-line" data-line="${
              d.lineNumber
            }">
              Pokaż linię ${d.lineNumber} →
            </button>
          </div>
          <p class="diag-msg">${d.messagePl}</p>
          <p class="diag-hint"><strong>💡 Podpowiedź:</strong> ${d.hintPl}</p>
        </article>
      `
      )
      .join('');

    const gotoBtns =
      this.diagnosticsContainer.querySelectorAll<HTMLButtonElement>(
        'button.btn-goto-line'
      );
    gotoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lineNo = Number(btn.dataset.line);
        const lessonTabBtn = this.root.querySelector<HTMLButtonElement>(
          'button.tab-btn[data-tab="tab-lesson"]'
        );
        lessonTabBtn?.click();
        this.editor.scrollToLine(lineNo);
        this.sceneManager.highlightEditorLine(lineNo);
      });
    });
  }
}
