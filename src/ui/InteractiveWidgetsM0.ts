/**
 * Interaktywne widżety warsztatowe dla Modułu 0 (Lekcje A–E, bez kodu G):
 * - 0.A: Interaktywny rysunek techniczny (rzut z góry XY i z przodu XZ) z odczytem wymiarów,
 * - 0.B: Stanowisko kontroli jakości i symulator pola tolerancji (50,0 ±0,1 mm),
 * - 0.C: Wirtualna suwmiarka z noniuszem (0,05 mm) oraz mikrometr (0,01 mm),
 * - 0.D: Symulator intuicji skrawania (suwaki S i F, wizualizacja wióra i obciążenia wrzeciona),
 * - 0.E: Interaktywny schemat budowy frezarki i tokarki CNC.
 */

export function renderModule0Widget(
  lessonId: string,
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  switch (lessonId) {
    case 'M0_0':
      renderWelcomeCncWidget(container, onTaskPassed);
      break;
    case 'M0_1':
      renderBasicConceptsWidget(container, onTaskPassed);
      break;
    case 'M0_A':
      renderTechnicalDrawingWidget(container, onTaskPassed);
      break;
    case 'M0_B':
      renderToleranceWidget(container, onTaskPassed);
      break;
    case 'M0_C':
      renderCaliperAndMicrometerWidget(container, onTaskPassed);
      break;
    case 'M0_D':
      renderCuttingIntuitionWidget(container, onTaskPassed);
      break;
    case 'M0_E':
      renderMachineAnatomyWidget(container, onTaskPassed);
      break;
    default:
      container.innerHTML = '';
  }
}

function renderWelcomeCncWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>👋 Ćwiczenie powitalne: Frezarka a Tokarka i droga od rysunku do części</h4>
      <div class="m0-svg-box">
        <svg viewBox="0 0 560 155" class="tech-drawing-svg" role="img" aria-label="Porównanie frezarki i tokarki oraz 4 kroków powstawania części">
          <!-- Frezarka -->
          <rect x="12" y="12" width="255" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
          <text x="24" y="34" fill="#38bdf8" font-size="13" font-weight="bold">1. FREZARKA CNC (Kostki i płyty)</text>
          <!-- Wrzeciono i frez -->
          <rect x="122" y="42" width="34" height="28" fill="#64748b" />
          <rect x="133" y="70" width="12" height="26" fill="#fbbf24" />
          <text x="154" y="65" fill="#fbbf24" font-size="11">↻ Kręci się FREZ</text>
          <!-- Kostka w imadle -->
          <rect x="90" y="96" width="100" height="26" fill="#2563eb" stroke="#93c5fd" stroke-width="1.5" />
          <text x="32" y="135" fill="#cbd5e1" font-size="11">Kostka stoi NIERUCHOMO w imadle</text>

          <!-- Tokarka -->
          <rect x="290" y="12" width="258" height="130" rx="8" fill="#0f172a" stroke="#4ade80" stroke-width="1.8" />
          <text x="302" y="34" fill="#4ade80" font-size="13" font-weight="bold">2. TOKARKA CNC (Okrągłe wałki)</text>
          <!-- Uchwyt i wałek -->
          <rect x="305" y="56" width="26" height="48" fill="#64748b" />
          <rect x="331" y="66" width="110" height="28" rx="4" fill="#2563eb" stroke="#93c5fd" stroke-width="1.5" />
          <text x="342" y="58" fill="#4ade80" font-size="11">↻ Kręci się WAŁEK</text>
          <!-- Nóż tokarski -->
          <polygon points="442,94 468,85 468,112 442,112" fill="#fbbf24" />
          <text x="305" y="135" fill="#cbd5e1" font-size="11">Nóż stoi NIERUCHOMO i zbiera metal</text>
        </svg>
      </div>

      <div class="m0-form-grid">
        <label class="m0-field">
          <span>1. Na FREZARCE szybko obraca się:</span>
          <select id="m00-q1" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="tool">Narzędzie (frez / wiertło), a kostka stoi nieruchomo w imadle</option>
            <option value="table">Cała hala produkcyjna</option>
          </select>
        </label>

        <label class="m0-field">
          <span>2. Na TOKARCE szybko obraca się:</span>
          <select id="m00-q2" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="part">Obrabiany przedmiot (okrągły wałek), a nóż tokarski się nie kręci</option>
            <option value="none">Nic się nie obraca</option>
          </select>
        </label>

        <label class="m0-field">
          <span>3. Jaka jest prawidłowa droga od pomysłu do gotowej części?</span>
          <select id="m00-q3" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="order">1. Rysunek z wymiarami → 2. Program ruchów → 3. Wycięcie w maszynie → 4. Pomiar suwmiarką</option>
            <option value="wrong">Najpierw wycinamy na ślepo, a potem zgadujemy co wyszło</option>
          </select>
        </label>
      </div>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m00" class="btn btn-accent">
          ✔ Sprawdź ćwiczenie powitalne
        </button>
        <span id="m00-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  container.querySelector('#btn-check-m00')?.addEventListener('click', () => {
    const q1 = container.querySelector<HTMLSelectElement>('#m00-q1')?.value;
    const q2 = container.querySelector<HTMLSelectElement>('#m00-q2')?.value;
    const q3 = container.querySelector<HTMLSelectElement>('#m00-q3')?.value;
    const fb = container.querySelector<HTMLElement>('#m00-feedback')!;

    if (q1 === 'tool' && q2 === 'part' && q3 === 'order') {
      fb.textContent =
        '🎉 Brawo! Znasz już różnicę między frezarką a tokarką oraz 4 kroki powstawania części!';
      fb.className = 'm0-feedback check-pass';
      onTaskPassed();
    } else {
      fb.textContent =
        '✖ Sprawdź jeszcze raz: na frezarce kręci się narzędzie, na tokarce kręci się wałek, a pracę zaczynamy od rysunku.';
      fb.className = 'm0-feedback check-fail';
    }
  });
}

function renderBasicConceptsWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>🧭 Wizualna mapa 4 podstawowych pojęć: Wrzeciono, Narzędzie, Oś i Współrzędna</h4>
      <div class="m0-svg-box">
        <svg viewBox="0 0 560 190" class="tech-drawing-svg" role="img" aria-label="Schemat wrzeciona, narzędzia, osi X Y Z i współrzędnych na kostce">
          <!-- Kostka 100x80 -->
          <rect x="60" y="55" width="200" height="110" fill="#1e293b" stroke="#93c5fd" stroke-width="2" />
          <!-- Punkt zerowy (0,0,0) -->
          <circle cx="60" cy="165" r="6" fill="#fbbf24" />
          <text x="15" y="182" fill="#fbbf24" font-size="12" font-weight="bold">Zero (0,0,0)</text>

          <!-- Osie X i Y -->
          <line x1="60" y1="165" x2="170" y2="165" stroke="#ef4444" stroke-width="3" />
          <text x="175" y="170" fill="#ef4444" font-size="12" font-weight="bold">Oś X+ (w prawo)</text>
          <line x1="60" y1="165" x2="60" y2="75" stroke="#22c55e" stroke-width="3" />
          <text x="68" y="72" fill="#22c55e" font-size="12" font-weight="bold">Oś Y+ (w głąb)</text>

          <!-- Punkt środkowy X=50, Y=40 -->
          <circle cx="160" cy="110" r="5" fill="#38bdf8" />
          <text x="115" y="128" fill="#38bdf8" font-size="12" font-weight="bold">Środek: X=50, Y=40</text>

          <!-- Widok z boku: Wrzeciono, Narzędzie i Oś Z -->
          <rect x="370" y="16" width="54" height="42" rx="4" fill="#64748b" stroke="#cbd5e1" />
          <text x="432" y="38" fill="#f8fafc" font-size="12" font-weight="bold">1. WRZECIONO (silnik)</text>
          <rect x="389" y="58" width="16" height="38" fill="#fbbf24" />
          <text x="432" y="80" fill="#fbbf24" font-size="12" font-weight="bold">2. NARZĘDZIE (frez)</text>

          <!-- Oś Z -->
          <line x1="345" y1="115" x2="345" y2="35" stroke="#60a5fa" stroke-width="3" />
          <text x="285" y="45" fill="#60a5fa" font-size="12" font-weight="bold">Oś Z+ (góra)</text>
          <text x="285" y="112" fill="#f87171" font-size="12" font-weight="bold">Oś Z- (dół)</text>

          <!-- Kostka z boku (Z=0 na górze) -->
          <rect x="335" y="122" width="140" height="44" fill="#1e293b" stroke="#93c5fd" stroke-width="2" />
          <text x="342" y="140" fill="#4ade80" font-size="11" font-weight="bold">Góra kostki: Z = 0</text>
          <text x="342" y="158" fill="#f87171" font-size="11">Wewnątrz metalu: Z ujemne (np. Z-4)</text>
        </svg>
      </div>

      <div class="m0-form-grid">
        <label class="m0-field">
          <span>1. Co to jest WRZECIONO, a co to jest NARZĘDZIE?</span>
          <select id="m01-q1" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="ok">Wrzeciono to silnik obracający, a Narzędzie to ostry frez lub wiertło włożone do wrzeciona</option>
            <option value="bad">To dwie nazwy na szafkę ubraniową</option>
          </select>
        </label>

        <label class="m0-field">
          <span>2. Która OŚ odpowiada za ruch pionowy (góra / dół)?</span>
          <select id="m01-q2" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="x">Oś X (lewo / prawo)</option>
            <option value="y">Oś Y (przód / tył)</option>
            <option value="z">Oś Z (Z+ w górę nad detal, Z- w dół w stronę metalu)</option>
          </select>
        </label>

        <label class="m0-field">
          <span>3. Co oznacza WSPÓŁRZĘDNA Z = 10 mm, a co Z = -4 mm (gdy Z=0 jest na górze kostki)?</span>
          <select id="m01-q3" class="sample-select">
            <option value="">-- wybierz odpowiedź --</option>
            <option value="ok">Z=10 to 10 mm bezpiecznie w powietrzu nad kostką, a Z=-4 to 4 mm zagłębienia wewnątrz metalu</option>
            <option value="bad">Obie oznaczają to samo</option>
          </select>
        </label>
      </div>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m01" class="btn btn-accent">
          ✔ Sprawdź znajomość 4 pojęć
        </button>
        <span id="m01-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  container.querySelector('#btn-check-m01')?.addEventListener('click', () => {
    const q1 = container.querySelector<HTMLSelectElement>('#m01-q1')?.value;
    const q2 = container.querySelector<HTMLSelectElement>('#m01-q2')?.value;
    const q3 = container.querySelector<HTMLSelectElement>('#m01-q3')?.value;
    const fb = container.querySelector<HTMLElement>('#m01-feedback')!;

    if (q1 === 'ok' && q2 === 'z' && q3 === 'ok') {
      fb.textContent =
        '🎉 Doskonale! Rozumiesz już pojęcia: Wrzeciono, Narzędzie, Oś (X, Y, Z) oraz Współrzędna!';
      fb.className = 'm0-feedback check-pass';
      onTaskPassed();
    } else {
      fb.textContent =
        '✖ Sprawdź jeszcze raz: Wrzeciono obraca narzędziem, oś Z to ruch pionowy (góra/dół), a Z dodatnie jest nad kostką.';
      fb.className = 'm0-feedback check-fail';
    }
  });
}

function renderTechnicalDrawingWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>📐 Interaktywny Rysunek Techniczny (Wszystkie wymiary w mm)</h4>
      <div class="m0-svg-box">
        <svg viewBox="0 0 540 250" class="tech-drawing-svg" role="img" aria-label="Rysunek techniczny płytki 100 na 80 mm z otworem fi 12">
          <!-- Rzut z góry (XY) -->
          <text x="20" y="22" fill="#38bdf8" font-size="13" font-weight="bold">WIDOK Z GÓRY (Płaszczyzna XY)</text>
          <rect x="40" y="38" width="200" height="160" fill="#1e293b" stroke="#f8fafc" stroke-width="2.5" />
          <!-- Punkt (0,0) -->
          <circle cx="40" cy="198" r="5" fill="#fbbf24" />
          <text x="15" y="216" fill="#fbbf24" font-size="12" font-weight="bold">(0,0)</text>

          <!-- Otwór w X=30 (40 + 60 = 100), Y=50 (198 - 100 = 98) -->
          <circle cx="100" cy="98" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
          <line x1="82" y1="98" x2="118" y2="98" stroke="#64748b" stroke-dasharray="3,2" />
          <line x1="100" y1="80" x2="100" y2="116" stroke="#64748b" stroke-dasharray="3,2" />
          <text x="118" y="85" fill="#38bdf8" font-size="13" font-weight="bold">Ø12</text>

          <!-- Wymiar X=30 do otworu -->
          <line x1="40" y1="98" x2="100" y2="98" stroke="#4ade80" stroke-width="1.5" />
          <text x="58" y="92" fill="#4ade80" font-size="12" font-weight="bold">30</text>

          <!-- Wymiar Y=50 do otworu -->
          <line x1="100" y1="198" x2="100" y2="98" stroke="#4ade80" stroke-width="1.5" />
          <text x="106" y="155" fill="#4ade80" font-size="12" font-weight="bold">50</text>

          <!-- Wymiar całkowity X=100 -->
          <line x1="40" y1="225" x2="240" y2="225" stroke="#f8fafc" stroke-width="1.5" />
          <text x="128" y="242" fill="#f8fafc" font-size="13" font-weight="bold">100</text>

          <!-- Wymiar całkowity Y=80 -->
          <line x1="258" y1="38" x2="258" y2="198" stroke="#f8fafc" stroke-width="1.5" />
          <text x="265" y="122" fill="#f8fafc" font-size="13" font-weight="bold">80</text>

          <!-- Rzut z przodu (XZ) -->
          <text x="320" y="22" fill="#38bdf8" font-size="13" font-weight="bold">WIDOK Z PRZODU (Grubość Z)</text>
          <rect x="330" y="110" width="160" height="45" fill="#1e293b" stroke="#f8fafc" stroke-width="2.5" />
          <text x="335" y="102" fill="#60a5fa" font-size="12">Góra płytki: Z = 0</text>
          <line x1="505" y1="110" x2="505" y2="155" stroke="#fbbf24" stroke-width="1.5" />
          <text x="512" y="138" fill="#fbbf24" font-size="13" font-weight="bold">20</text>
        </svg>
      </div>

      <div class="m0-form-grid">
        <label class="m0-field">
          <span>1. Całkowita szerokość płytki (X w mm):</span>
          <input type="number" id="m0a-width" class="table-num-input" placeholder="np. 100" />
        </label>
        <label class="m0-field">
          <span>2. Średnica otworu Ø (w mm):</span>
          <input type="number" id="m0a-dia" class="table-num-input" placeholder="np. 12" />
        </label>
        <label class="m0-field">
          <span>3. Współrzędna X środka otworu (mm):</span>
          <input type="number" id="m0a-hx" class="table-num-input" placeholder="np. 30" />
        </label>
        <label class="m0-field">
          <span>4. Współrzędna Y środka otworu (mm):</span>
          <input type="number" id="m0a-hy" class="table-num-input" placeholder="np. 50" />
        </label>
      </div>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m0a" class="btn btn-accent">
          ✔ Sprawdź odczyt z rysunku
        </button>
        <span id="m0a-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  container.querySelector('#btn-check-m0a')?.addEventListener('click', () => {
    const w = Number(
      container.querySelector<HTMLInputElement>('#m0a-width')?.value
    );
    const dia = Number(
      container.querySelector<HTMLInputElement>('#m0a-dia')?.value
    );
    const hx = Number(
      container.querySelector<HTMLInputElement>('#m0a-hx')?.value
    );
    const hy = Number(
      container.querySelector<HTMLInputElement>('#m0a-hy')?.value
    );
    const fb = container.querySelector<HTMLElement>('#m0a-feedback')!;

    if (w === 100 && dia === 12 && hx === 30 && hy === 50) {
      fb.className = 'm0-feedback status-ok';
      fb.textContent =
        '🎉 Znakomicie! Wszystkie wymiary i współrzędne otworu odczytane bezbłędnie.';
      onTaskPassed();
    } else {
      fb.className = 'm0-feedback status-err';
      fb.textContent =
        '✖ Któraś z wartości się nie zgadza. Sprawdź wymiar na dole (100), symbol Ø (12) oraz zielone linie do otworu (X=30, Y=50).';
    }
  });
}

function renderToleranceWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  const parts = [
    { id: 1, measured: '49,95 mm', isGood: true },
    { id: 2, measured: '49,82 mm', isGood: false },
    { id: 3, measured: '50,10 mm', isGood: true },
    { id: 4, measured: '50,18 mm', isGood: false },
  ];

  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>🔍 Wirtualna Kontrola Jakości – Wymiar z rysunku: <code>50,0 ±0,1 mm</code></h4>
      <p class="table-hint">
        Dopuszczalny przedział: od <strong>49,90 mm</strong> do <strong>50,10 mm</strong>.
        Oceń każdą z 4 wyprodukowanych sztuk:
      </p>
      <div class="m0-parts-list">
        ${parts
          .map(
            (p) => `
          <div class="m0-part-row">
            <span>Sztuka #${p.id}: zmierzono <strong>${p.measured}</strong></span>
            <select id="m0b-part-${p.id}" class="sample-select" aria-label="Ocena sztuki ${p.id}">
              <option value="">-- Wybierz ocenę --</option>
              <option value="good">✔ Dobra (w tolerancji)</option>
              <option value="bad">✖ Brak (poza tolerancją)</option>
            </select>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="m0-actions-row">
        <button type="button" id="btn-check-m0b" class="btn btn-accent">
          ✔ Zatwierdź kontrolę jakości
        </button>
        <span id="m0b-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  container.querySelector('#btn-check-m0b')?.addEventListener('click', () => {
    let allCorrect = true;
    for (const p of parts) {
      const sel = container.querySelector<HTMLSelectElement>(
        `#m0b-part-${p.id}`
      )?.value;
      const expected = p.isGood ? 'good' : 'bad';
      if (sel !== expected) {
        allCorrect = false;
      }
    }
    const fb = container.querySelector<HTMLElement>('#m0b-feedback')!;
    if (allCorrect) {
      fb.className = 'm0-feedback status-ok';
      fb.textContent =
        '🎉 Brawo! Wszystkie 4 detale zostały prawidłowo sklasyfikowane względem pola tolerancji [49,90 .. 50,10] mm.';
      onTaskPassed();
    } else {
      fb.className = 'm0-feedback status-err';
      fb.textContent =
        '✖ Błąd klasyfikacji! Pamiętaj: sztuki od 49,90 mm do 50,10 mm włącznie są DOBRE, a pozostałe to BRAK.';
    }
  });
}

function renderCaliperAndMicrometerWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  let caliperMm = 20.0;
  let microMm = 10.0;

  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>📏 Wirtualna Suwmiarka (0,05 mm) i Mikrometr (0,01 mm)</h4>

      <div class="m0-instrument-box">
        <div class="instrument-header">
          <strong>1. Suwmiarka z noniuszem (Cel zadania: ustaw <code>24,50 mm</code>)</strong>
          <span id="caliper-readout" class="dro-val">20.00 mm</span>
        </div>
        <div class="instrument-controls">
          <button type="button" id="cal-minus" class="btn">-0,05 mm</button>
          <input type="range" id="cal-slider" class="scrub-slider" min="0" max="40" step="0.05" value="20" aria-label="Suwak suwmiarki" />
          <button type="button" id="cal-plus" class="btn">+0,05 mm</button>
        </div>
        <p id="caliper-scale-desc" class="table-hint"></p>
      </div>

      <div class="m0-instrument-box">
        <div class="instrument-header">
          <strong>2. Mikrometr zewnętrzny (Cel zadania: ustaw <code>12,35 mm</code>)</strong>
          <span id="micro-readout" class="dro-val">10.00 mm</span>
        </div>
        <div class="instrument-controls">
          <button type="button" id="mic-minus" class="btn">-0,01 mm</button>
          <input type="range" id="mic-slider" class="scrub-slider" min="0" max="25" step="0.01" value="10" aria-label="Bęben mikrometru" />
          <button type="button" id="mic-plus" class="btn">+0,01 mm</button>
        </div>
        <p id="micro-scale-desc" class="table-hint"></p>
      </div>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m0c" class="btn btn-accent">
          ✔ Zatwierdź oba pomiary (24,50 mm oraz 12,35 mm)
        </button>
        <span id="m0c-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  const calReadout = container.querySelector<HTMLElement>('#caliper-readout')!;
  const calSlider = container.querySelector<HTMLInputElement>('#cal-slider')!;
  const calDesc = container.querySelector<HTMLElement>('#caliper-scale-desc')!;

  const micReadout = container.querySelector<HTMLElement>('#micro-readout')!;
  const micSlider = container.querySelector<HTMLInputElement>('#mic-slider')!;
  const micDesc = container.querySelector<HTMLElement>('#micro-scale-desc')!;

  const updateUI = () => {
    caliperMm = Math.round(caliperMm * 20) / 20;
    microMm = Math.round(microMm * 100) / 100;

    calSlider.value = String(caliperMm);
    calReadout.textContent = `${caliperMm.toFixed(2)} mm`;
    const calWhole = Math.floor(caliperMm + 1e-6);
    const calFrac = Math.round((caliperMm - calWhole) * 100);
    calDesc.textContent = `Odczyt skali: kreska "0" noniusza minęła ${calWhole} mm na skali głównej, a na noniuszu pokrywa się działka .${calFrac
      .toString()
      .padStart(2, '0')} mm.`;

    micSlider.value = String(microMm);
    micReadout.textContent = `${microMm.toFixed(2)} mm`;
    const micHalfs = Math.floor(microMm * 2 + 1e-6) / 2;
    const micThimble = Math.round((microMm - micHalfs) * 100);
    micDesc.textContent = `Odczyt mikrometru: na tulei widoczne ${micHalfs.toFixed(
      1
    )} mm, a na bębnie obwodowym kreska nr ${micThimble} (czyli +0,${micThimble
      .toString()
      .padStart(2, '0')} mm).`;
  };

  updateUI();

  calSlider.addEventListener('input', () => {
    caliperMm = Number(calSlider.value);
    updateUI();
  });
  container.querySelector('#cal-minus')?.addEventListener('click', () => {
    caliperMm = Math.max(0, caliperMm - 0.05);
    updateUI();
  });
  container.querySelector('#cal-plus')?.addEventListener('click', () => {
    caliperMm = Math.min(40, caliperMm + 0.05);
    updateUI();
  });

  micSlider.addEventListener('input', () => {
    microMm = Number(micSlider.value);
    updateUI();
  });
  container.querySelector('#mic-minus')?.addEventListener('click', () => {
    microMm = Math.max(0, microMm - 0.01);
    updateUI();
  });
  container.querySelector('#mic-plus')?.addEventListener('click', () => {
    microMm = Math.min(25, microMm + 0.01);
    updateUI();
  });

  container.querySelector('#btn-check-m0c')?.addEventListener('click', () => {
    const fb = container.querySelector<HTMLElement>('#m0c-feedback')!;
    if (
      Math.abs(caliperMm - 24.5) < 0.01 &&
      Math.abs(microMm - 12.35) < 0.005
    ) {
      fb.className = 'm0-feedback status-ok';
      fb.textContent =
        '🎉 Doskonale! Suwmiarka (24,50 mm) oraz mikrometr (12,35 mm) ustawione z pełną precyzją.';
      onTaskPassed();
    } else {
      fb.className = 'm0-feedback status-err';
      fb.textContent = `✖ Obecnie ustawiono: suwmiarka = ${caliperMm.toFixed(
        2
      )} mm (wymagane 24,50 mm), mikrometr = ${microMm.toFixed(
        2
      )} mm (wymagane 12,35 mm).`;
    }
  });
}

function renderCuttingIntuitionWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>⚡ Symulator Intuicji Skrawania (Frez walcowy Ø10 mm, 4 ostrza, Aluminium)</h4>

      <div class="m0-instrument-box">
        <label class="m0-field">
          <span>Obroty wrzeciona <strong>S</strong> (obr./min): <strong id="m0d-s-val">3200</strong></span>
          <input type="range" id="m0d-s" class="scrub-slider" min="800" max="6000" step="100" value="1200" />
        </label>

        <label class="m0-field">
          <span>Posuw roboczy <strong>F</strong> (mm/min): <strong id="m0d-f-val">400</strong></span>
          <input type="range" id="m0d-f" class="scrub-slider" min="50" max="1200" step="25" value="800" />
        </label>

        <div id="m0d-status-box" class="diag-card"></div>
      </div>

      <details class="m0-curiosity-box">
        <summary>💡 Ciekawostka dla chętnych: skąd biorą się wzory w katalogach narzędziowych?</summary>
        <p class="table-hint">
          W codziennej pracy korzystamy z gotowych tabel, ale warto wiedzieć, że obroty <code>S</code> wynikają z prędkości skrawania <code>Vc</code> i średnicy <code>D</code>:
          <code>S = (1000 · Vc) / (π · D)</code>, natomiast posuw <code>F</code> to iloczyn obrotów <code>S</code>, liczby ostrzy <code>z</code> i posuwu na ostrze <code>fz</code>:
          <code>F = S · z · fz</code>.
        </p>
      </details>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m0d" class="btn btn-accent">
          ✔ Zatwierdź dobrane parametry skrawania
        </button>
        <span id="m0d-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  const sSlider = container.querySelector<HTMLInputElement>('#m0d-s')!;
  const fSlider = container.querySelector<HTMLInputElement>('#m0d-f')!;
  const sValEl = container.querySelector<HTMLElement>('#m0d-s-val')!;
  const fValEl = container.querySelector<HTMLElement>('#m0d-f-val')!;
  const statusBox = container.querySelector<HTMLElement>('#m0d-status-box')!;

  let isSweetSpot = false;

  const evaluateParams = () => {
    const s = Number(sSlider.value);
    const f = Number(fSlider.value);
    sValEl.textContent = `${s} obr./min`;
    fValEl.textContent = `${f} mm/min`;

    // Grubość wióra na jedno ostrze (4 ostrza): fz = F / (S * 4)
    const fz = f / (s * 4);

    if (fz > 0.06 || s < 2000) {
      isSweetSpot = false;
      statusBox.className = 'diag-card diag-error';
      statusBox.innerHTML = `
        <strong>✖ PRZECIĄŻENIE NARZĘDZIA (Wiór za gruby: fz = ${fz.toFixed(3)} mm/ostrze)</strong>
        <p>Posuw F jest za szybki w stosunku do obrotów S! Frez może ulec złamaniu. Zwiększ obroty S (np. 2800..4000) lub zmniejsz posuw F.</p>
      `;
    } else if (fz < 0.02) {
      isSweetSpot = false;
      statusBox.className = 'diag-card diag-warning';
      statusBox.innerHTML = `
        <strong>⚠ TARCIE I PRZEGRZANIE (Wiór za cienki: fz = ${fz.toFixed(3)} mm/ostrze)</strong>
        <p>Posuw F jest zbyt wolny! Ostrze zamiast ścinać wiór trze o aluminium i tępi się. Zwiększ posuw F (np. do 300..500 mm/min).</p>
      `;
    } else {
      isSweetSpot = true;
      statusBox.className = 'diag-card';
      statusBox.style.borderLeftColor = '#4ade80';
      statusBox.innerHTML = `
        <strong class="status-ok">✔ ZDROWY WIÓR – STABILNA OBRÓBKA (fz = ${fz.toFixed(3)} mm/ostrze)</strong>
        <p>Obroty S i posuw F są świetnie zbalansowane dla aluminium. Kliknij przycisk poniżej, aby zaliczyć zadanie!</p>
      `;
    }
  };

  evaluateParams();
  sSlider.addEventListener('input', evaluateParams);
  fSlider.addEventListener('input', evaluateParams);

  container.querySelector('#btn-check-m0d')?.addEventListener('click', () => {
    const fb = container.querySelector<HTMLElement>('#m0d-feedback')!;
    if (isSweetSpot) {
      fb.className = 'm0-feedback status-ok';
      fb.textContent =
        '🎉 Świetnie! Dobrałaś/dobrałeś bezpieczne parametry skrawania w zielonej strefie.';
      onTaskPassed();
    } else {
      fb.className = 'm0-feedback status-err';
      fb.textContent =
        '✖ Ustaw suwaki S (np. 3200) i F (np. 400) tak, aby wskaźnik pokazał zielony komunikat „ZDROWY WIÓR”.';
    }
  });
}

function renderMachineAnatomyWidget(
  container: HTMLElement,
  onTaskPassed: () => void
): void {
  container.innerHTML = `
    <div class="m0-widget-card">
      <h4>🏭 Budowa Frezarki i Tokarki CNC – Dopasuj elementy</h4>

      <div class="m0-parts-list">
        <div class="m0-part-row">
          <span>1. Co wykonuje szybki ruch obrotowy podczas pracy na <strong>frezarce CNC</strong>?</span>
          <select id="m0e-q1" class="sample-select">
            <option value="">-- Wybierz odpowiedź --</option>
            <option value="tool">Narzędzie skrawające (frez / wiertło) we wrzecionie</option>
            <option value="table">Cały stół razem z halą fabryczną</option>
          </select>
        </div>

        <div class="m0-part-row">
          <span>2. Co wykonuje szybki ruch obrotowy podczas pracy na <strong>tokarce CNC</strong>?</span>
          <select id="m0e-q2" class="sample-select">
            <option value="">-- Wybierz odpowiedź --</option>
            <option value="workpiece">Przedmiot obrabiany (wałek) w uchwycie tokarskim</option>
            <option value="turret">Nóż tokarski kręci się wokół nieruchomego wałka</option>
          </select>
        </div>

        <div class="m0-part-row">
          <span>3. Do czego służy duży czerwony przycisk grzybkowy (<strong>E-Stop</strong>) na pulpicie maszyny?</span>
          <select id="m0e-q3" class="sample-select">
            <option value="">-- Wybierz odpowiedź --</option>
            <option value="estop">Do natychmiastowego zatrzymania awaryjnego maszyny w razie zagrożenia</option>
            <option value="turbo">Do włączenia trybu przyspieszonego</option>
          </select>
        </div>
      </div>

      <div class="m0-actions-row">
        <button type="button" id="btn-check-m0e" class="btn btn-accent">
          ✔ Sprawdź i ukończ Moduł 0
        </button>
        <span id="m0e-feedback" class="m0-feedback"></span>
      </div>
    </div>
  `;

  container.querySelector('#btn-check-m0e')?.addEventListener('click', () => {
    const a1 = container.querySelector<HTMLSelectElement>('#m0e-q1')?.value;
    const a2 = container.querySelector<HTMLSelectElement>('#m0e-q2')?.value;
    const a3 = container.querySelector<HTMLSelectElement>('#m0e-q3')?.value;
    const fb = container.querySelector<HTMLElement>('#m0e-feedback')!;

    if (a1 === 'tool' && a2 === 'workpiece' && a3 === 'estop') {
      fb.className = 'm0-feedback status-ok';
      fb.textContent =
        '🎉 Brawo! Wszystkie odpowiedzi poprawne. Moduł 0 ukończony – możesz przejść do Lekcji 1.1 w Module 1!';
      onTaskPassed();
    } else {
      fb.className = 'm0-feedback status-err';
      fb.textContent =
        '✖ Sprawdź odpowiedzi: na frezarce kręci się narzędzie, na tokarce przedmiot (wałek), a E-Stop to wyłącznik awaryjny.';
    }
  });
}
