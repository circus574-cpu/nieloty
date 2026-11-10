/**
 * Panel stanu modalnego sterownika CNC (ModalStateBar):
 * Wyświetla na żywo bieżące współrzędne wierzchołka narzędzia (WCS),
 * aktywne kody G/M, narzędzie T, korektory H/D, posuw F, obroty S
 * oraz szacowany czas obróbki.
 */

import type { ModalState, ProgramStats } from '../core/types/interpreter';

function formatSecondsPl(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)} s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins} min ${secs} s`;
}

export class ModalStateBar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public update(state: ModalState, stats: ProgramStats): void {
    const pos = state.positionWcs;
    const motionBadge =
      state.motionMode !== null
        ? state.motionMode
        : state.cycleMode !== 'G80'
        ? `Cykl: ${state.cycleMode}`
        : 'Brak (po G80)';

    const spindleLabel =
      state.spindleState === 'M3_CW'
        ? 'M3 (Prawe ↻)'
        : state.spindleState === 'M4_CCW'
        ? 'M4 (Lewe ↺)'
        : 'M5 (Stop ⏹)';

    const coolantLabel =
      state.coolantState === 'M8_FLOOD' ? 'M8 (Wł. 💧)' : 'M9 (Wył.)';

    const lenCompLabel =
      state.lengthComp === 'G49'
        ? 'G49 (Brak korekcji H!)'
        : `${state.lengthComp} H${state.activeLengthRegH}`;

    const radCompLabel =
      state.cutterComp === 'G40'
        ? 'G40 (Brak D)'
        : `${state.cutterComp} D${state.activeRadiusRegD}`;

    this.container.innerHTML = `
      <div class="modal-bar-grid" role="region" aria-label="Bieżący stan modalny sterownika CNC">
        <div class="dro-coords-group">
          <div class="dro-axis dro-x">
            <span class="dro-label">X (${state.workOffset})</span>
            <span class="dro-val">${pos.x.toFixed(3)} mm</span>
          </div>
          <div class="dro-axis dro-y">
            <span class="dro-label">Y (${state.workOffset})</span>
            <span class="dro-val">${pos.y.toFixed(3)} mm</span>
          </div>
          <div class="dro-axis dro-z">
            <span class="dro-label">Z wierzch. (${state.workOffset})</span>
            <span class="dro-val">${pos.z.toFixed(3)} mm</span>
          </div>
        </div>

        <div class="modal-badges-group">
          <span class="modal-badge" title="Aktywny kod ruchu (Grupa 01/09)">
            <strong>Ruch:</strong> ${motionBadge}
          </span>
          <span class="modal-badge" title="Aktywny cykl stały i poziom powrotu">
            <strong>Cykl:</strong> ${state.cycleMode} (${state.cycleReturnMode})
          </span>
          <span class="modal-badge" title="Płaszczyzna, tryb wymiarowania i jednostki">
            <strong>Tryb:</strong> ${state.plane} | ${state.distanceMode} | ${state.units}
          </span>
          <span class="modal-badge" title="Punkt zerowy przedmiotu">
            <strong>Baza:</strong> ${state.workOffset}
          </span>
          <span class="modal-badge" title="Narzędzie we wrzecionie (oraz przygotowane w magazynie)">
            <strong>Narzędzie:</strong> ${
              state.activeToolPocket > 0 ? `T${state.activeToolPocket}` : 'Brak (T0)'
            } ${
              state.selectedToolPocket !== state.activeToolPocket
                ? `(gotowe: T${state.selectedToolPocket})`
                : ''
            }
          </span>
          <span class="modal-badge ${
            state.lengthComp === 'G49' ? 'badge-warn' : 'badge-ok'
          }" title="Korekcja długości narzędzia">
            <strong>Długość:</strong> ${lenCompLabel}
          </span>
          <span class="modal-badge" title="Korekcja promienia narzędzia">
            <strong>Promień:</strong> ${radCompLabel}
          </span>
          <span class="modal-badge" title="Posuw roboczy F i obroty wrzeciona S">
            <strong>F:</strong> ${Math.round(state.feedRateMmPerMin)} mm/min |
            <strong>S:</strong> ${Math.round(state.spindleRpm)} obr./min
          </span>
          <span class="modal-badge" title="Stan wrzeciona i chłodziwa">
            ${spindleLabel} | ${coolantLabel}
          </span>
          <span class="modal-badge badge-time" title="Szacowany czas wykonania całego programu">
            <strong>Czas obróbki:</strong> ${formatSecondsPl(stats.totalTimeSeconds)}
            (skrawanie: ${formatSecondsPl(stats.cuttingFeedTimeSeconds)})
          </span>
        </div>
      </div>
    `;
  }
}
