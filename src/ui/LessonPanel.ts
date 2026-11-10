/**
 * Panel pojedynczej lekcji (LessonPanel):
 * - Wyświetla teorię lekcji, interaktywny widżet Modułu 0 (dla lekcji A–E) lub zadanie G-code (dla Modułu 1),
 * - Obsługuje automatyczne sprawdzanie zadania po wyniku symulacji (TaskGradeResult),
 * - Udostępnia 3-stopniowe podpowiedzi oraz odblokowuje pełne rozwiązanie dopiero po odkryciu 3 podpowiedzi,
 * - Zawiera interaktywny mini-quiz sprawdzający zrozumienie tematu.
 */

import type {
  LessonDefinition,
  TaskGradeResult,
} from '../core/types/curriculum';
import type { SafeProgressStore } from '../storage/progressStore';
import { renderModule0Widget } from './InteractiveWidgetsM0';

export interface LessonPanelCallbacks {
  onCheckTaskRequested: (lesson: LessonDefinition) => TaskGradeResult;
  onResetStarterCode: (starterCode: string) => void;
  onApplySolutionCode: (solutionCode: string) => void;
  onOpenGlossary: () => void;
  onNavigateLesson: (direction: 'prev' | 'next') => void;
  onProgressUpdated: () => void;
}

export class LessonPanel {
  private container: HTMLElement;
  private progressStore: SafeProgressStore;
  private callbacks: LessonPanelCallbacks;
  private currentLesson: LessonDefinition | null = null;
  private lastGradeResult: TaskGradeResult | null = null;

  constructor(
    container: HTMLElement,
    progressStore: SafeProgressStore,
    callbacks: LessonPanelCallbacks
  ) {
    this.container = container;
    this.progressStore = progressStore;
    this.callbacks = callbacks;
  }

  public setLesson(lesson: LessonDefinition): void {
    this.currentLesson = lesson;
    this.lastGradeResult = null;
    this.render();
  }

  public showGradeResult(result: TaskGradeResult): void {
    this.lastGradeResult = result;
    if (result.passedAll && this.currentLesson) {
      this.progressStore.markTaskCompleted(this.currentLesson.id);
      this.callbacks.onProgressUpdated();
    }
    this.render();
  }

  public render(): void {
    const lesson = this.currentLesson;
    if (!lesson) return;

    const rec = this.progressStore.getLessonRecord(lesson.id);
    const isModule0 = lesson.moduleId === 'MODULE_0';

    const theoryHtml = lesson.theoryParagraphsPl
      .map((p) => `<p class="lesson-paragraph">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    // Renderowanie podpowiedzi (1..3)
    const unlockedHints = lesson.hintsPl.slice(0, rec.unlockedHintsCount);
    const hintsHtml =
      unlockedHints.length === 0
        ? `<p class="table-hint">Utknęłaś/utknąłeś? Możesz odkryć do 3 kolejnych podpowiedzi. Po wykorzystaniu wszystkich 3 odblokuje się pełne rozwiązanie.</p>`
        : unlockedHints
            .map((h) => `<div class="hint-item">💡 ${h}</div>`)
            .join('');

    const canUnlockMoreHints = rec.unlockedHintsCount < 3;
    const canRevealSolution = rec.unlockedHintsCount >= 3;

    // Sekcja wyniku sprawdzacza zadań (dla Modułu 1)
    let gradeHtml = '';
    if (this.lastGradeResult) {
      const checksList = this.lastGradeResult.checks
        .map(
          (c) => `
          <li class="${c.passed ? 'check-pass' : 'check-fail'}">
            ${c.feedbackPl}
          </li>
        `
        )
        .join('');

      gradeHtml = `
        <div class="grade-result-box ${
          this.lastGradeResult.passedAll ? 'grade-box-pass' : 'grade-box-fail'
        }">
          <strong>${this.lastGradeResult.summaryPl}</strong>
          <ul class="grade-checks-list">${checksList}</ul>
        </div>
      `;
    }

    // Sekcja quizu
    const q = lesson.quiz[0];
    const quizHtml = q
      ? `
      <div class="quiz-box">
        <h4>🧠 Mini-quiz sprawdzający ${
          rec.quizCompleted
            ? '<span class="status-pill pill-ok">Zaliczony ✔</span>'
            : ''
        }</h4>
        <p class="quiz-question"><strong>Pytanie:</strong> ${q.questionPl}</p>
        <div class="quiz-options">
          ${q.optionsPl
            .map(
              (opt, idx) => `
            <button type="button" class="btn quiz-opt-btn" data-opt="${idx}">
              ${String.fromCharCode(65 + idx)}. ${opt}
            </button>
          `
            )
            .join('')}
        </div>
        <div id="quiz-feedback" class="quiz-feedback"></div>
      </div>
    `
      : '';

    this.container.innerHTML = `
      <div class="lesson-panel-wrapper">
        <div class="lesson-top-bar">
          <div>
            <span class="lesson-module-badge">
              ${isModule0 ? 'MODUŁ 0 • PODSTAWY BEZ KODU G' : 'MODUŁ 1 • FREZARKA 3-OSIOWA'}
            </span>
            <h2 class="lesson-title">${lesson.titlePl}</h2>
            <p class="lesson-subtitle">${lesson.shortSubtitlePl}</p>
          </div>
          <div class="lesson-badges">
            <span class="status-pill ${
              rec.taskCompleted ? 'pill-ok' : 'pill-warn'
            }">
              ${rec.taskCompleted ? '✔ Zadanie zaliczone' : '⏳ Zadanie do wykonania'}
            </span>
            <button type="button" id="btn-open-glossary" class="btn btn-secondary">
              📖 Słownik pojęć
            </button>
          </div>
        </div>

        <div class="lesson-theory-box">
          ${theoryHtml}
        </div>

        <!-- Host dla interaktywnych widżetów Modułu 0 -->
        <div id="m0-widget-host" ${isModule0 ? '' : 'hidden'}></div>

        <!-- Karta zadania praktycznego -->
        <div class="lesson-task-card">
          <h4>🎯 Zadanie praktyczne</h4>
          <p class="lesson-task-desc">${lesson.taskDescriptionPl}</p>

          ${
            !isModule0
              ? `
            <div class="task-action-buttons">
              <button type="button" id="btn-grade-task" class="btn btn-accent">
                ✔ Sprawdź zadanie (oceń wynik symulacji)
              </button>
              <button type="button" id="btn-reset-starter" class="btn">
                🔄 Przywróć kod startowy lekcji
              </button>
            </div>
            ${gradeHtml}
          `
              : ''
          }
        </div>

        <!-- Stopniowane podpowiedzi (3 poziomy) + pełne rozwiązanie -->
        <div class="hints-card">
          <div class="hints-header">
            <h4>💡 Podpowiedzi (${rec.unlockedHintsCount}/3) i rozwiązanie</h4>
            <div class="hints-actions">
              ${
                canUnlockMoreHints
                  ? `<button type="button" id="btn-unlock-hint" class="btn">
                      Odkryj podpowiedź ${rec.unlockedHintsCount + 1}/3
                    </button>`
                  : ''
              }
              ${
                canRevealSolution && !rec.solutionRevealed
                  ? `<button type="button" id="btn-reveal-solution" class="btn btn-primary">
                      🔓 Pokaż pełne rozwiązanie
                    </button>`
                  : ''
              }
            </div>
          </div>

          <div class="hints-list">
            ${hintsHtml}
          </div>

          ${
            rec.solutionRevealed
              ? `
            <div class="solution-box">
              <h5>✅ Wzorcowe rozwiązanie i wyjaśnienie:</h5>
              <p>${lesson.solutionExplanationPl}</p>
              ${
                lesson.solutionCode
                  ? `
                <pre class="solution-code-pre"><code>${lesson.solutionCode}</code></pre>
                <button type="button" id="btn-apply-solution" class="btn btn-primary">
                  📋 Wklej wzorcowe rozwiązanie do edytora i uruchom
                </button>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>

        ${quizHtml}

        <!-- Nawigacja dół: Poprzednia / Następna lekcja -->
        <div class="lesson-footer-nav">
          <button type="button" id="btn-prev-lesson" class="btn">
            ◀ Poprzednia lekcja
          </button>
          <button type="button" id="btn-next-lesson" class="btn btn-primary">
            Następna lekcja ▶
          </button>
        </div>
      </div>
    `;

    // Jeśli to Moduł 0, wyrenderuj interaktywny widżet warsztatowy
    if (isModule0) {
      const widgetHost =
        this.container.querySelector<HTMLElement>('#m0-widget-host')!;
      renderModule0Widget(lesson.id, widgetHost, () => {
        this.progressStore.markTaskCompleted(lesson.id);
        this.callbacks.onProgressUpdated();
        this.render();
      });
    }

    // Zdarzenia przycisków
    this.container
      .querySelector('#btn-open-glossary')
      ?.addEventListener('click', () => this.callbacks.onOpenGlossary());

    this.container
      .querySelector('#btn-grade-task')
      ?.addEventListener('click', () => {
        const res = this.callbacks.onCheckTaskRequested(lesson);
        this.showGradeResult(res);
      });

    this.container
      .querySelector('#btn-reset-starter')
      ?.addEventListener('click', () => {
        if (lesson.starterCode) {
          this.callbacks.onResetStarterCode(lesson.starterCode);
        }
      });

    this.container
      .querySelector('#btn-unlock-hint')
      ?.addEventListener('click', () => {
        this.progressStore.unlockNextHint(lesson.id);
        this.callbacks.onProgressUpdated();
        this.render();
      });

    this.container
      .querySelector('#btn-reveal-solution')
      ?.addEventListener('click', () => {
        this.progressStore.revealSolution(lesson.id);
        this.callbacks.onProgressUpdated();
        this.render();
      });

    this.container
      .querySelector('#btn-apply-solution')
      ?.addEventListener('click', () => {
        if (lesson.solutionCode) {
          this.callbacks.onApplySolutionCode(lesson.solutionCode);
        }
      });

    this.container
      .querySelector('#btn-prev-lesson')
      ?.addEventListener('click', () => this.callbacks.onNavigateLesson('prev'));

    this.container
      .querySelector('#btn-next-lesson')
      ?.addEventListener('click', () => this.callbacks.onNavigateLesson('next'));

    // Obsługa mini-quizu
    if (q) {
      const optBtns =
        this.container.querySelectorAll<HTMLButtonElement>('button.quiz-opt-btn');
      const fbEl = this.container.querySelector<HTMLElement>('#quiz-feedback')!;

      optBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const chosen = Number(btn.dataset.opt);
          if (chosen === q.correctOptionIndex) {
            this.progressStore.markQuizCompleted(lesson.id);
            this.callbacks.onProgressUpdated();
            fbEl.className = 'quiz-feedback status-ok';
            fbEl.innerHTML = `<strong>✔ Poprawna odpowiedź!</strong> ${q.explanationPl}`;
          } else {
            fbEl.className = 'quiz-feedback status-err';
            fbEl.innerHTML = `<strong>✖ To nie ta odpowiedź.</strong> Spróbuj ponownie!`;
          }
        });
      });
    }
  }
}
