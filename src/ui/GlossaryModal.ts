/**
 * Okno modalne Słownika Pojęć CNC (GlossaryModal) dostępne z każdej lekcji.
 * Zawiera wyszukiwarkę haseł po polsku i angielsku.
 */

import { CNC_GLOSSARY } from '../curriculum/glossary';

export class GlossaryModal {
  private modalEl: HTMLElement;

  constructor(parent: HTMLElement) {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'glossary-modal-backdrop';
    this.modalEl.hidden = true;
    this.modalEl.setAttribute('role', 'dialog');
    this.modalEl.setAttribute('aria-modal', 'true');
    this.modalEl.setAttribute('aria-label', 'Słownik pojęć CNC');
    parent.appendChild(this.modalEl);
    this.render('');
  }

  public open(initialFilter = ''): void {
    this.modalEl.hidden = false;
    this.render(initialFilter);
    const searchInput =
      this.modalEl.querySelector<HTMLInputElement>('#glossary-search');
    searchInput?.focus();
  }

  public close(): void {
    this.modalEl.hidden = true;
  }

  private render(filterText: string): void {
    const q = filterText.trim().toLowerCase();
    const filtered = CNC_GLOSSARY.filter(
      (entry) =>
        entry.termPl.toLowerCase().includes(q) ||
        entry.termEn.toLowerCase().includes(q) ||
        entry.shortDefinitionPl.toLowerCase().includes(q)
    );

    const itemsHtml =
      filtered.length === 0
        ? `<p class="table-hint">Brak pojęć pasujących do zapytania „${filterText}”.</p>`
        : filtered
            .map(
              (item) => `
          <div class="glossary-item">
            <div class="glossary-term-row">
              <strong class="glossary-term-pl">${item.termPl}</strong>
              <span class="glossary-term-en">(${item.termEn})</span>
            </div>
            <p class="glossary-def">${item.shortDefinitionPl}</p>
            ${
              item.examplePl
                ? `<p class="glossary-example"><em>Przykład:</em> ${item.examplePl}</p>`
                : ''
            }
          </div>
        `
            )
            .join('');

    this.modalEl.innerHTML = `
      <div class="glossary-modal-card">
        <div class="nieloty-subpage-top-banner">
          <span class="nieloty-logo-badge">🦅 NIELOTY.PL</span>
          <span class="nieloty-slogan-inline">TYLKO I WYŁĄCZNIE DLA NIE UNOSZĄCYCH SIĘ DRAPIEŻNIKÓW.</span>
        </div>
        <div class="glossary-modal-header">
          <h3>📖 Słownik pojęć CNC (Polsko-Angielski)</h3>
          <button type="button" id="btn-close-glossary" class="btn" aria-label="Zamknij słownik">
            Zamknij ✕
          </button>
        </div>
        <div class="glossary-search-bar">
          <label for="glossary-search" class="sr-only">Szukaj pojęcia w słowniku</label>
          <input
            type="search"
            id="glossary-search"
            class="glossary-search-input"
            placeholder="Szukaj pojęcia (np. wrzeciono, G54, noniusz, posuw, spindle)..."
            value="${filterText}"
          />
        </div>
        <div class="glossary-list">
          ${itemsHtml}
        </div>
        <footer class="nieloty-subpage-footer">
          Wszelkie prawa od mnie dla Ciebie. Copyright nieloty.pl
        </footer>
      </div>
    `;

    this.modalEl
      .querySelector('#btn-close-glossary')
      ?.addEventListener('click', () => this.close());

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    const inputEl =
      this.modalEl.querySelector<HTMLInputElement>('#glossary-search');
    inputEl?.addEventListener('input', () => {
      const pos = inputEl.selectionStart ?? inputEl.value.length;
      this.render(inputEl.value);
      const newInput =
        this.modalEl.querySelector<HTMLInputElement>('#glossary-search');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(pos, pos);
      }
    });
  }
}
