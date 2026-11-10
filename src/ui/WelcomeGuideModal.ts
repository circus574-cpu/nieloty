/**
 * Ekran startowy z krótkim przewodnikiem po aplikacji (WelcomeGuideModal).
 * Wyświetlany przy pierwszym uruchomieniu (oraz dostępny zawsze pod przyciskiem
 * „👋 Przewodnik / Start” w górnym pasku aplikacji).
 */

const WELCOME_SEEN_KEY = 'cnc_kurs_welcome_seen_v1';

export interface WelcomeGuideCallbacks {
  onStartFromLesson00: () => void;
  onContinueCurrentLesson: () => void;
}

export class WelcomeGuideModal {
  private overlayEl: HTMLElement;
  private callbacks: WelcomeGuideCallbacks;

  constructor(parent: HTMLElement, callbacks: WelcomeGuideCallbacks) {
    this.callbacks = callbacks;
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'modal-overlay';
    this.overlayEl.hidden = true;
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute(
      'aria-label',
      'Ekran startowy i przewodnik po kursie CNC'
    );

    this.render();
    parent.appendChild(this.overlayEl);

    if (!this.hasSeenWelcome()) {
      this.open();
    }
  }

  public open(): void {
    this.overlayEl.hidden = false;
  }

  public close(): void {
    this.overlayEl.hidden = true;
    this.markWelcomeSeen();
  }

  private hasSeenWelcome(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      return window.localStorage.getItem(WELCOME_SEEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  private markWelcomeSeen(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(WELCOME_SEEN_KEY, '1');
      }
    } catch {
      // Ignoruj w trybie bez localStorage
    }
  }

  private render(): void {
    this.overlayEl.innerHTML = `
      <div class="modal-card welcome-modal-card">
        <div class="nieloty-subpage-top-banner">
          <span class="nieloty-logo-badge">🦅 NIELOTY.PL</span>
          <span class="nieloty-slogan-inline">TYLKO I WYŁĄCZNIE DLA NIE UNOSZĄCYCH SIĘ DRAPIEŻNIKÓW.</span>
        </div>

        <div class="modal-header">
          <div>
            <span class="brand-tag">PRZEWODNIK PO APLIKACJI • OD ABSOLUTNEGO ZERA (40 LEKCJI • 5 MODUŁÓW)</span>
            <h3>👋 Witaj w interaktywnym kursie programowania CNC z symulatorem 3D!</h3>
          </div>
          <button type="button" id="btn-close-welcome" class="btn" aria-label="Zamknij ekran startowy">
            Zamknij ✕
          </button>
        </div>

        <div class="welcome-modal-body">
          <p class="welcome-lead">
            Ten program szkoleniowy został stworzony dla osób, które <strong>nigdy wcześniej nie widziały maszyny CNC ani nie pisały żadnego kodu</strong>.
            Krok po kroku przejdziesz drogę od prostych pojęć warsztatowych aż do samodzielnego programowania obróbki 3-, 4- i 5-osiowej w 3D.
          </p>

          <div class="welcome-steps-grid">
            <div class="welcome-step-box">
              <span class="welcome-step-num">1</span>
              <h4>📚 Panel lekcji (Po lewej stronie)</h4>
              <p>
                Tu czytasz wyjaśnienie napisane prostym językiem, przeglądasz <strong>ściągawkę pojęć</strong>,
                rozbiór kodu znak po znaku oraz wykonujesz <strong>ćwiczenia praktyczne i mini-quizy</strong>.
                Jeśli utkniesz, masz do dyspozycji <strong>3 podpowiedzi</strong> oraz wzorcowe rozwiązanie.
              </p>
            </div>

            <div class="welcome-step-box">
              <span class="welcome-step-num">2</span>
              <h4>🖥️ Wirtualna maszyna 3D (Po prawej stronie)</h4>
              <p>
                Obracaj widok myszką (lewy przycisk = obrót, kółko = przybliżenie, prawy przycisk = przesuwanie)
                lub przełączaj kamery (<strong>Góra XY</strong>, <strong>Przód XZ</strong>, <strong>3D ISO</strong>).
                Żółta linia przerywana to ruch szybki w powietrzu (<code>G0</code>), a niebieska ciągła to cięcie metalu (<code>G1/G2/G3</code>).
              </p>
            </div>

            <div class="welcome-step-box">
              <span class="welcome-step-num">3</span>
              <h4>▶️ Odtwarzacz symulacji i Ręczny ruch (JOG)</h4>
              <p>
                Pod oknem 3D możesz uruchomić animację (<strong>▶ Start</strong>), wykonywać program
                <strong>linijka po linijce (Następna linia ▶)</strong> albo przesuwać suwak czasu.
                W zakładce <strong>„🕹 Ręczny ruch (JOG)”</strong> możesz też samemu poruszać wrzecionem strzałkami!
              </p>
            </div>

            <div class="welcome-step-box">
              <span class="welcome-step-num">4</span>
              <h4>🗺️ Twoja ścieżka nauki (40 lekcji w 5 modułach)</h4>
              <p>
                • <strong>Moduł 0 (10 lekcji 0.0 – 0.E)</strong>: Wstęp bez pisania kodu – czym jest CNC, 4 podstawowe pojęcia, rysunek techniczny, suwmiarka, bazowanie G54 i pulpit operatora.<br/>
                • <strong>Moduł 1 (18 lekcji 1.1 – 1.18)</strong>: Pełny kurs frezarki 3-osiowej (G0, G1, G2/G3, G43, G41/G42, G81/G83, G98/G99, planowanie, kieszenie, helisa i fazowanie).<br/>
                • <strong>Moduły 2–4 (12 lekcji 2.1 – 4.4)</strong>: Tokarka CNC (G96/G97), frezarka 4-osiowa (oś A) oraz 5-osiowa (A+C, G68.2, TCPM G43.4 i 4 dialekty sterowań).
              </p>
            </div>
          </div>

          <div class="welcome-actions-footer">
            <button type="button" id="btn-welcome-start-00" class="btn btn-accent">
              🚀 Zacznij od Lekcji 0.0: „Witaj w CNC” (Dla początkujących)
            </button>
            <button type="button" id="btn-welcome-continue" class="btn btn-primary">
              ▶ Przejdź do aktualnie wybranej lekcji
            </button>
          </div>

          <footer class="nieloty-subpage-footer">
            Wszelkie prawa od mnie dla Ciebie. Copyright nieloty.pl
          </footer>
        </div>
      </div>
    `;

    this.overlayEl
      .querySelector('#btn-close-welcome')
      ?.addEventListener('click', () => this.close());

    this.overlayEl
      .querySelector('#btn-welcome-start-00')
      ?.addEventListener('click', () => {
        this.close();
        this.callbacks.onStartFromLesson00();
      });

    this.overlayEl
      .querySelector('#btn-welcome-continue')
      ?.addEventListener('click', () => {
        this.close();
        this.callbacks.onContinueCurrentLesson();
      });

    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });
  }
}
