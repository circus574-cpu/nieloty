# Kurs Programowania Ruchu Maszyn CNC z Symulatorem 3D

Interaktywna aplikacja edukacyjna w przeglądarce ucząca programowania ruchu obrabiarek sterowanych numerycznie (**CNC – Computer Numerical Control**) w języku **G-code** (dialekt bazowy w stylu **ISO 6983 / Fanuc / Haas**) od całkowitych podstaw.

> **⚠️ WAŻNA INFORMACJA O BEZPIECZEŃSTWIE (BHP)**  
> Ten kurs wykorzystuje uproszczony model nauczania i **nie zastępuje** dokumentacji techniczno-ruchowej rzeczywistego sterownika obrabiarki, szkolenia stanowiskowego BHP ani pracy pod nadzorem doświadczonego operatora/ustawiacza. Nigdy nie uruchamiaj niesprawdzonego programu na prawdziwej maszynie bez weryfikacji na pojedynczym bloku (`Single Block`), obniżonego posuwu szybkiego (`Rapid Override`) i nadzoru instruktora.

---

## 1. Jak uruchomić projekt lokalnie

### Wymagania wstępne
- **Node.js** w wersji `>= 18.x` oraz menedżer pakietów `npm`.

### Instalacja i uruchomienie

```bash
# 1. Pobranie zależności
npm install

# 2. Uruchomienie serwera deweloperskiego (domyślnie http://localhost:5173)
npm run dev

# 3. Sprawdzenie typów TypeScript (strict: true)
npm run typecheck

# 4. Uruchomienie wszystkich testów jednostkowych (Vitest)
npm test

# 5. Zbudowanie paczki produkcyjnej do katalogu dist/
npm run build
```

---

## 2. Architektura projektu

Szczegółowy opis kontraktów danych znajduje się w pliku [`ARCHITECTURE.md`](./ARCHITECTURE.md). Rdzeń symulatora jest celowo rozdzielony na **dwa niezależne kroki** (bez zależności od DOM czy Three.js):

```
Tekst G-code (Fanuc/ISO, docelowo Siemens / Heidenhain / GRBL)
      │
      ▼
[1] Frontend Dialektu (src/core/dialects/fanucFrontend.ts)
      │  Buduje Kanoniczną Reprezentację Pośrednią (CanonicalProgramIR)
      │  przechowującą literały liczbowe bez przeliczania G20/G21.
      ▼
[2] Czysty Interpreter Kinematyczny (src/core/gcode/interpreter.ts)
      │  Rozwiązuje modalność (motionMode vs cycleMode), jednostki G20/G21,
      │  punkty zerowe G54–G59, korekcję długości G43/G44/G49, korekcję
      │  promienia G41/G42/G40 oraz rozwija cykle stałe G81/G82/G83.
      │  Zwraca analityczne odcinki ruchu (MotionSegment[]) w WCS wierzchołka
      │  narzędzia (Tooltip) oraz błędy składni/kinematyki.
      ▼
[3] Wymienny Analizator Materiału i Kolizji (src/core/simulation/materialAnalyzer.ts)
      │  Przyjmuje MotionSegment[], surówkę (WorkpieceStock) oraz model
      │  materiału (HeightmapMaterialModel o domyślnej rozdzielczości 0.5 mm,
      │  min. 0.25 mm). Oblicza ubytek materiału i wykrywa kolizje (np. G0
      │  w materiale, skrawanie przy wyłączonym wrzecionie M5, przebicie dna).
      ▼
[4] Wizualizacja 3D (Three.js) + Sprawdzacz Zadań (TaskGrader)
```

### Główne katalogi w `src/`
- `src/core/types/` – kontrakty domenowe (`common.ts`, `machine.ts`, `ir.ts`, `interpreter.ts`, `material.ts`, `curriculum.ts`).
- `src/core/dialects/` – parser dialektu ISO/Fanuc do postaci pośredniej (`CanonicalProgramIR`).
- `src/core/gcode/` – czysty interpreter kinematyczny, geometria łuków (`arcs.ts`), kompensacja promieniowa (`cutterCompensation.ts`), rozwijanie cykli wiertarskich (`cannedCycles.ts`).
- `src/core/simulation/` – model siatki wysokości 2.5D (`heightmapModel.ts`) oraz analizator kolizji (`materialAnalyzer.ts`).
- `src/curriculum/` – sprawdzacz zadań po wyniku symulacji (`grader.ts`), słowniczek (`glossary.ts`), lekcje Modułu 0 (`module0/lessonsM0.ts`), lekcje Modułu 1 (`module1/lessonsM1.ts`) oraz sylabus Modułów 2–4 (`modules2to4/syllabusM2toM4.ts`).
- `src/simulator3d/` – scena 3D Three.js (`SceneManager.ts`, `WorkpieceMesh.ts`, `ToolpathRenderer.ts`, `MachineActor.ts`, `SimulationPlayer.ts`).
- `src/ui/` – komponenty interfejsu (`AppShell.ts`, `CodeEditor.ts`, `LessonPanel.ts`, `InteractiveWidgetsM0.ts`, `ModalStateBar.ts`, `ToolAndOffsetModal.ts`, `GlossaryModal.ts`).
- `src/storage/` – zapis postępu z bezpiecznym fallbackiem do pamięci RAM (`progressStore.ts`).
- `src/__tests__/` – 59 testów jednostkowych (`interpreter.test.ts`, `arcsAndComp.test.ts`, `materialAnalyzer.test.ts`, `grader.test.ts`).

---

## 3. Struktura kursu

1. **Moduł 0: Wstęp przed maszyną (Lekcje 0.A – 0.E, bez kodu G)**
   - **0.A**: Rysunek techniczny – trzy rzuty prostokątne i odczyt wymiarów gabarytowych.
   - **0.B**: Tolerancje wymiarowe, pasowania (luźne/ciasne) i chropowatość powierzchni ($Ra$).
   - **0.C**: Narzędzia pomiarowe – wirtualna suwmiarka noniuszowa ($0{,}1\text{ mm}$) i mikrometr ($0{,}01\text{ mm}$).
   - **0.D**: Podstawy skrawania – obroty $S$, posuw $F$, posuw na ostrze $f_z$ oraz chłodziwo.
   - **0.E**: Budowa 3-osiowej frezarki CNC i zasady BHP.
2. **Moduł 1: Frezarka 3-osiowa CNC (Lekcje 1.1 – 1.14)**
   - Od układu współrzędnych i zasady `Z0` na górnej powierzchni detalu (`1.1`–`1.2`), przez `G0`/`G1` (`1.3`), technologię `F/S/M3/M8` (`1.4`), konturowanie i modalność (`1.5`), łuki `G2`/`G3` z `R` oraz `IJK` (`1.6`), `G90`/`G91` (`1.7`), bazy `G54`–`G59` (`1.8`), wymianę narzędzia `T/M6` (`1.9`), korekcję długości `G43 H` (`1.10`), korekcję promienia `G41/G42 D` (`1.11`), cykle wiercenia `G81/G82/G83` z `G98/G99` i `G80` (`1.12`), kompletny projekt z 3 narzędziami (`1.13`), aż po lekcję debugowania błędów (`1.14`).
3. **Sylabus Modułów 2–4** (przygotowany pod dalszą rozbudowę w Etapie 5+):
   - **Moduł 2**: Tokarka 2-osiowa (`X` jako średnica, `Z` jako oś wrzeciona, `G96`/`G97`, `G95`).
   - **Moduł 3**: Frezarka 4-osiowa z podzielnicą obrotową (oś `A` wokół osi `X`).
   - **Moduł 4**: Frezarka 5-osiowa kołyskowa (osie `A` i `C`, obróbka indeksowana `3+2`).

---

## 4. Jak dodać nową lekcję i kryterium sprawdzacza

### Dodanie nowej lekcji do Modułu 1
W pliku `src/curriculum/module1/lessonsM1.ts` dopisz nowy obiekt spełniający interfejs `LessonDefinition` (zdefiniowany w `src/core/types/curriculum.ts`):

```ts
{
  id: 'M1_15',
  moduleId: 'MODULE_1',
  orderIndex: 15,
  titlePl: 'Lekcja 1.15: Frezowanie kieszeni prostokątnej',
  shortSubtitlePl: 'Wybieranie materiału warstwami ze środka na zewnątrz',
  theoryParagraphsPl: [
    'Pierwszy akapit teorii po polsku (z angielskim terminem Pocket Milling w nawiasie)...',
  ],
  machineConfig: MILL_3AXIS_MACHINE,
  stock: DEFAULT_MILL_STOCK,
  validationPolicy: STRICT_VALIDATION_POLICY,
  initialActiveToolPocket: 1,
  starterCode: `T1 M6\nG21 G90 G17 G54\nS3200 M3\nG43 H1 Z20\n...`,
  taskDescriptionPl: 'Wyfrezuj dno kieszeni w punkcie (X50, Y40) na głębokość Z = -5 mm.',
  assertions: [
    {
      kind: 'NO_ERRORS_AND_NO_COLLISIONS',
      descriptionPl: 'Program wykonuje się bez błędów i kolizji',
    },
    {
      kind: 'SURFACE_HEIGHT_AT_POINT',
      pointXY: { x: 50, y: 40 },
      expectedZMm: -5,
      toleranceMm: 0.5,
      descriptionPl: 'Środek kieszeni (X50 Y40) ma głębokość Z = -5 mm',
    },
  ],
  hintsPl: [
    'Podpowiedź 1/3: ...',
    'Podpowiedź 2/3: ...',
    'Podpowiedź 3/3: ...',
  ],
  solutionCode: `...`,
  solutionExplanationPl: 'Wyjaśnienie dlaczego wzorcowe rozwiązanie działa.',
  quiz: [
    {
      id: 'q_m1_15',
      questionPl: 'Treść pytania...',
      optionsPl: ['Odpowiedź A', 'Odpowiedź B', 'Odpowiedź C'],
      correctOptionIndex: 0,
      explanationPl: 'Wyjaśnienie poprawnej odpowiedzi.',
    },
  ],
}
```

### Dodanie nowego rodzaju kryterium (`TaskAssertion`)
1. Rozszerz unię dyskryminowaną `TaskAssertion` w `src/core/types/curriculum.ts` o nowy wariant `kind`.
2. Obsłuż nowy `case` w funkcji `evaluateSingleAssertion` w `src/curriculum/grader.ts`.
3. Dopisz test jednostkowy w `src/__tests__/grader.test.ts`.

---

## 5. Wykaz bibliotek i licencji

| Pakiet | Wersja | Przeznaczenie | Licencja |
| :--- | :--- | :--- | :--- |
| `three` + `@types/three` | `^0.170.0` | Wizualizacja 3D WebGL (surówka, ścieżki, wrzeciono, osie) | **MIT** |
| `@codemirror/state`, `@codemirror/view`, `@codemirror/commands` | `^6.x` | Edytor kodu G z numeracją linii, podświetlaniem aktywnego bloku i diagnostyką | **MIT** |
| `typescript` | `^5.6.3` | Kompilator TypeScript (`strict: true`) | **Apache-2.0** |
| `vite` | `^5.4.10` | Narzędzie budujące i serwer deweloperski | **MIT** |
| `vitest` | `^2.1.4` | Framework testów jednostkowych | **MIT** |

---

## 6. Notatki z weryfikacji merytorycznej (perspektywa operatora CNC)

1. **Konwencja punktu zerowego `Z0` na górnej powierzchni detalu**:
   - W praktyce warsztatowej początkujący operatorzy najczęściej ustawiają `Z0` na górnej płaszczyźnie obrabianej surówki. Dzięki temu każda dodatnia wartość `Z > 0` oznacza bezpieczną strefę w powietrzu nad materiałem, a każda wartość ujemna `Z < 0` oznacza rzeczywistą głębokość zagłębienia narzędzia w materiale.
2. **Fizyczne wymiary narzędzia (`ToolDefinition`) vs. Rejestry sterownika (`ToolOffsetRegister` `H`/`D`)**:
   - Na prawdziwej maszynie wymiary fizyczne narzędzia zamontowanego we wrzecionie i liczby wpisane przez operatora w tabeli offsetów sterownika to dwie osobne rzeczy.
   - Bez aktywnego `G43`/`G44` (w stanie `G49`) zaprogramowana współrzędna `Z` odnosi się do czoła wrzeciona (*spindle gauge line*), więc fizyczny wierzchołek narzędzia znajduje się niżej o długość narzędzia (`z_tip = z_prog - tool.lengthMm`). Dopiero włączenie `G43 Hn` przesuwa układ sterowania o wartość rejestru `H` (`z_tip = z_prog + offsetH - tool.lengthMm`). Wpisanie błędnej wartości w tabeli `H` lub `D` natychmiast skutkuje na ekranie 3D niedocięciem, podcięciem wymiaru lub kolizją.
3. **Rozdział grup modalnych ruchu (`G0`–`G3`) oraz cykli stałych (`G80`–`G83`)**:
   - Zgodnie ze standardem sterowników Fanuc/Haas stan modalny przechowuje osobno `motionMode: 'G0' | 'G1' | 'G2' | 'G3' | null` oraz `cycleMode: 'G80' | 'G81' | 'G82' | 'G83'`.
   - Aktywacja cyklu wiercenia (`G81`–`G83`) ustawia `motionMode = null`. Odwołanie cyklu kodem `G80` kasuje cykl, a użycie dowolnego kodu z grupy `G0`–`G3` automatycznie anuluje aktywny cykl (`cycleMode = 'G80'`).
4. **Poziom powrotu w cyklach wiercenia (`G98` vs. `G99`)**:
   - `G98` wycofuje wiertło pomiędzy kolejnymi otworami do początkowej płaszczyzny `Z` sprzed wywołania cyklu (bezpieczne omijanie łap dociskowych), natomiast `G99` wycofuje wiertło tylko do płaszczyzny odniesienia `R` (szybszy przejazd nad płaską płytą).

---

## 7. Znane ograniczenia symulatora (Known Limitations)

1. **Model materiału jako siatka wysokości 2.5D (`HeightmapMaterialModel`)**:
   - Obrabiana surówka w Module 1 jest reprezentowana przez regularną siatkę kolumn wysokości $Z(x, y)$ o domyślnej rozdzielczości $0{,}5\text{ mm}$ (konfigurowalnej od $0{,}25\text{ mm}$).
   - Model 2.5D bardzo dokładnie i szybko odwzorowuje planowanie, kieszenie, wyspy, wiercenie i konturowanie od góry, ale **nie odwzorowuje podcięć bocznych** (np. rowków teowych, wpustów pod jaskółczy ogon ani wiercenia pod kątem z boku). Dla pełnych 4 i 5 osi architektura (`IMaterialModel`) przewiduje podmianę implementacji na model wokselowy lub Dexel.
2. **Uproszczona kompensacja promienia narzędzia (`G41`/`G42`)**:
   - Moduł `cutterCompensation.ts` oblicza odsunięcie toru środka narzędzia o wartość z rejestru `D` dla odcinków prostych i łuków oraz wykrywa podcięcia przy promieniu narzędzia większym od promienia naroża wewnętrznego (`COMPENSATION_GOUGE`), jednak nie implementuje pełnego wieloblokowego bufora przeglądania w przód (*multi-block look-ahead*) dla skomplikowanych samoprzecięć konturu.
3. **Brak symulacji ugięcia narzędzia, drgań (*chatter*) i zużycia ostrza**:
   - Symulator sprawdza geometryczną poprawność toru, kolizje ruchu szybkiego `G0` w materiale, wejście w materiał przy wyłączonym wrzecionie (`M5`) oraz wylicza czas obróbki, lecz nie modeluje sił skrawania ani obciążeń termicznych.
4. **Zakres obsługiwanych kodów w Etapie 1–4**:
   - Kody odniesienia maszynowego `G28` oraz `G53`, makra parametryczne (*Custom Macro B*), podprogramy `M98`/`M99` oraz gwintowanie sztywne `G84` są jawnie zgłaszane przez interpreter jako `UNSUPPORTED_FEATURE` z czytelnym komunikatem po polsku.
