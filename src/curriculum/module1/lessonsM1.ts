/**
 * Kompletne scenariusze wszystkich 14 lekcji Modułu 1 (Frezarka 3-osiowa CNC).
 * Każda lekcja zawiera:
 * - Zwięzłą teorię po polsku (z terminami angielskimi w nawiasie),
 * - Kod startowy do eksperymentowania w symulatorze 3D,
 * - Zadanie praktyczne oceniane po wyniku symulacji (TaskAssertion[]),
 * - 3 stopniowane podpowiedzi + pełne rozwiązanie wzorcowe,
 * - Mini-quiz sprawdzający zrozumienie.
 */

import {
  DEFAULT_MILL_STOCK,
  EARLY_LESSON_VALIDATION_POLICY,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../../core/machines/presets';
import type { LessonDefinition } from '../../core/types/curriculum';

export const MODULE_1_LESSONS: LessonDefinition[] = [
  // =========================================================================
  // LEKCJA 1.1
  // =========================================================================
  {
    id: 'M1_01',
    moduleId: 'MODULE_1',
    orderIndex: 1,
    titlePl: 'Lekcja 1.1: Czym jest maszyna CNC i program. Osie X, Y, Z',
    shortSubtitlePl: 'Orientacja osi w przestrzeni 3D i pierwszy ruch nad stołem',
    theoryParagraphsPl: [
      '1. WITAJ PRZY SWOJEJ PIERWSZEJ FREZARCE 3-OSIOWEJ CNC!\nMaszyna porusza wrzecionem z narzędziem w trzech prostopadłych kierunkach nazywanych osiami (Axes):\n• Oś X (czerwona strzałka) = ruch poziomy w lewo (X-) i w prawo (X+).\n• Oś Y (zielona strzałka) = ruch poziomy do przodu/do Ciebie (Y-) i w głąb maszyny (Y+).\n• Oś Z (niebieska strzałka) = ruch pionowy w dół w stronę metalu (Z-) i w górę w powietrze (Z+).',
      '2. JAK MASZYNA CZYTA PROGRAM? (BLOKI, SŁOWA I KOMENTARZE)\nProgram CNC (G-code) czytany jest przez maszynę linijka po linijce od góry do dołu. Każda linia nazywa się BLOKIEM (Block). Tekst zapisany w nawiasach okrągłych, np. (Mój komentarz), to notatka dla człowieka – maszyna całkowicie ją pomija.',
      '3. CO OZNACZAJĄ LINIE PRZYGOTOWAWCZE NA POCZĄTKU PROGRAMU?\nW edytorze na dole tej karty zobaczysz 3 krótkie linie przygotowawcze (tzw. nagłówek bezpieczeństwa), które ustawiają maszynę do pracy: „T1 M6” (załóż do wrzeciona narzędzie nr 1 – frez Ø10 mm), „G21 G90 G17 G54” (pracuj w milimetrach, mierz współrzędne od narożnika kostki G54) oraz „G43 H1 Z20” (uwzględnij długość narzędzia nr 1 i ustaw czubek 20 mm nad kostką). Pod nimi znajduje się właściwy rozkaz ruchu: „G0 X20 Y20 Z10”, czyli szybki przejazd w powietrzu do punktu X=20, Y=20, Z=10.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G0',
        meaningPl: 'Ruch szybki (Rapid Traverse) – szybki dojazd narzędzia w powietrzu nad detalem (żółta linia przerywana)',
        examplePl: 'G0 X80 Y60 Z10',
      },
      {
        codeOrSymbol: 'X, Y, Z',
        meaningPl: 'Współrzędne punktu docelowego w milimetrach liczone od lewego dolnego narożnika kostki (0, 0, 0)',
        examplePl: 'X80 = 80 mm w prawo, Y60 = 60 mm w głąb, Z10 = 10 mm nad kostką',
      },
      {
        codeOrSymbol: 'T1 M6 oraz G43 H1',
        meaningPl: 'Pobranie narzędzia nr 1 do wrzeciona (T1 M6) i włączenie pomiaru jego długości (G43 H1)',
        examplePl: 'Stały nagłówek na początku każdego programu',
      },
      {
        codeOrSymbol: 'M30',
        meaningPl: 'Koniec programu i przewinięcie go na początek',
        examplePl: 'Zawsze w ostatniej linii programu',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór linii ruchu, którą za chwilę zmodyfikujesz w edytorze:',
      lineCode: 'G0 X80 Y60 Z10',
      parts: [
        { token: 'G0', explanationPl: 'Jedź ruchem szybkim w powietrzu' },
        { token: 'X80', explanationPl: 'Ustaw narzędzie 80 mm w prawo od lewej krawędzi kostki' },
        { token: 'Y60', explanationPl: 'Ustaw narzędzie 60 mm w głąb od przedniej krawędzi kostki' },
        { token: 'Z10', explanationPl: 'Utrzymaj bezpieczną wysokość 10 mm nad górną ścianką kostki' },
      ],
    },
    stepByStepGuidePl: [
      'Przewiń ten panel nieco niżej do ciemnego edytora kodu G-code.',
      'Znajdź w linii 9 zapis: G0 X20 Y20 Z10',
      'Zmień w tej linii X20 na X80 oraz Y20 na Y60 (tak aby powstało: G0 X80 Y60 Z10).',
      'Kliknij zielony przycisk „✔ Sprawdź zadanie (oceń wynik symulacji 3D)” powyżej edytora!',
    ],
    commonMistakeWarningPl:
      'Pamiętaj, aby pomiędzy literą a liczbą NIE stawiać znaku równości (piszemy X80, a nie X=80!). Poszczególne słowa oddzielamy zwykłą spacją: G0 X80 Y60 Z10.',
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.1: Poznajemy osie X, Y, Z)
(Naglowek przygotowawczy narzedzia - wyjasniony powyzej)
T1 M6
G21 G90 G17 G54
G43 H1 Z20

(Twoje zadanie: przesun narzedzie ruchem szybkim G0)
(do punktu X80 Y60 na bezpiecznej wysokosci Z10)
G0 X20 Y20 Z10
M30`,
    taskDescriptionPl:
      'Zmień współrzędne w linii z poleceniem G0 (lub dopisz nową linię przed M30) tak, aby wierzchołek narzędzia zatrzymał się nad prawym górnym narożnikiem płytki w punkcie: X = 80 mm, Y = 60 mm, Z = 10 mm.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów składniowych i bez kolizji z materiałem',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 60, z: 10, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: false,
        descriptionPl: 'Wierzchołek narzędzia dotarł do punktu X80 Y60 Z10',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Znajdź w edytorze linię „G0 X20 Y20 Z10”. Liczby po literach X, Y, Z oznaczają docelową pozycję w milimetrach.',
      'Podpowiedź 2/3: Zastąp X20 przez X80 oraz Y20 przez Y60, zostawiając wysokość Z10.',
      'Podpowiedź 3/3: Wpisz dokładnie: G0 X80 Y60 Z10 (przed linią M30) i kliknij „Sprawdź zadanie”.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z20
G0 X80 Y60 Z10
M30`,
    solutionExplanationPl:
      'Polecenie G0 X80 Y60 Z10 przestawia szybko narzędzie nad punkt (80, 60) na bezpiecznej wysokości 10 mm nad górną ścianką detalu.',
    quiz: [
      {
        id: 'q_m1_01',
        questionPl: 'Która oś na pionowej frezarce 3-osiowej odpowiada za podnoszenie i opuszczanie narzędzia (góra / dół)?',
        optionsPl: [
          'Oś X',
          'Oś Y',
          'Oś Z',
        ],
        correctOptionIndex: 2,
        explanationPl: 'Na frezarce pionowej oś Z jest zawsze osią wrzeciona: Z+ unosi narzędzie do góry (od materiału), a Z- opuszcza je w dół (w stronę materiału).',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.2
  // =========================================================================
  {
    id: 'M1_02',
    moduleId: 'MODULE_1',
    orderIndex: 2,
    titlePl: 'Lekcja 1.2: Układ współrzędnych i punkt zerowy przedmiotu (Z0 na górze!)',
    shortSubtitlePl: 'Dlaczego nad detalem Z jest dodatnie (Z > 0), a wewnątrz materiału ujemne (Z < 0)',
    theoryParagraphsPl: [
      'Spójrz na kolorowe strzałki w lewym dolnym narożniku naszej aluminiowej kostki w widoku 3D (żółta kulka). To punkt zerowy przedmiotu (Workpiece Zero, oznaczany kodem G54), gdzie X = 0, Y = 0 oraz Z = 0.',
      'W praktyce warsztatowej wysokość Z = 0 ustawia się niemal zawsze na GÓRNEJ powierzchni obrabianego detalu! Dlaczego to takie mądre? Bo patrząc w kod programu, od razu widzisz bezpieczeństwo: każda dodatnia wartość Z (np. Z5, Z20) oznacza, że narzędzie jest bezpiecznie w powietrzu NAD materiałem. Każda ujemna wartość Z (np. Z-2, Z-5) oznacza, że narzędzie zagłębiło się W materiał!',
      'Nasza kostka ma wymiary 100 mm (w osi X) na 80 mm (w osi Y) i grubość 20 mm (więc jej góra to Z = 0, a spód leżący na imadle to Z = -20 mm).',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.2: Punkt zerowy przedmiotu X0 Y0 Z0)
T1 M6
G21 G90 G17 G54
G43 H1 Z25

(1. Najpierw podjedz nad sam punkt zerowy X0 Y0 na wysokosci Z5)
G0 X0 Y0 Z5

(2. Nastepnie przesun narzedzie nad srodek plytki: X50 Y40 na wysokosci Z2)
(Dopisz ponizej odpowiedni blok G0:)

M30`,
    taskDescriptionPl:
      'Uzupełnij program tak, aby narzędzie najpierw odwiedziło punkt (X0, Y0, Z5) nad narożnikiem zerowym, a następnie przejechało ruchem szybkim G0 nad sam środek płytki (X50, Y40) na bezpiecznej wysokości Z = 2 mm nad powierzchnią.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak kolizji (narzędzie pozostaje nad powierzchnią Z >= 0)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 0, y: 0, z: 5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: false,
        descriptionPl: 'Odwiedzono punkt nad narożnikiem bazowym X0 Y0 Z5',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: 2, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: false,
        descriptionPl: 'Odwiedzono punkt nad środkiem płytki X50 Y40 Z2',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Pierwszy punkt (G0 X0 Y0 Z5) jest już wpisany w kodzie startowym.',
      'Podpowiedź 2/3: Środek płytki 100 × 80 mm leży w połowie szerokości (X50) i połowie głębokości (Y40).',
      'Podpowiedź 3/3: Dopisz przed M30 linię: G0 X50 Y40 Z2',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z25
G0 X0 Y0 Z5
G0 X50 Y40 Z2
M30`,
    solutionExplanationPl:
      'Współrzędna Z2 zatrzymuje czubek frezu 2 mm ponad górną powierzchnią detalu (Z0), dokładnie nad środkiem płytki (X50, Y40).',
    quiz: [
      {
        id: 'q_m1_02',
        questionPl: 'Jeśli Z0 ustawiono na górnej powierzchni detalu o grubości 20 mm, to gdzie znajduje się czubek frezu przy współrzędnej Z-3?',
        optionsPl: [
          '3 mm w powietrzu nad detalem',
          '3 mm wewnątrz materiału (poniżej górnej powierzchni)',
          '3 mm pod stołem maszyny',
        ],
        correctOptionIndex: 1,
        explanationPl: 'Skoro górna ścianka to Z = 0, to Z = -3 mm oznacza zagłębienie na 3 mm w głąb materiału.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.3
  // =========================================================================
  {
    id: 'M1_03',
    moduleId: 'MODULE_1',
    orderIndex: 3,
    titlePl: 'Lekcja 1.3: Pierwszy program skrawający – G0 (szybki) i G1 (roboczy)',
    shortSubtitlePl: 'Złota zasada CNC: w powietrzu G0, w materiale zawsze G1 z posuwem F',
    theoryParagraphsPl: [
      'Poznaj najważniejszą zasadę bezpieczeństwa w programowaniu CNC: ruch szybki G0 (Rapid Traverse – na ekranie żółta linia przerywana) służy WYŁĄCZNIE do przemieszczania narzędzia w powietrzu! Gdybyś wjechała/wjechał w metal z prędkością G0 (10 000 mm/min), frez natychmiast uległby zniszczeniu.',
      'Do skrawania materiału służy ruch roboczy po linii prostej: G1 (Linear Interpolation – na ekranie niebieska linia ciągła). Przy pierwszym wywołaniu G1 musimy podać prędkość posuwu F (Feed Rate), np. F300 (czyli 300 milimetrów na minutę).',
      'Typowa sekwencja frezowania wygląda zawsze tak: 1) Podjedź na G0 nad punkt początkowy i zatrzymaj się na Z5, 2) Wejdź w materiał na G1 na żądaną głębokość (np. G1 Z-4 F200), 3) Wyfrezuj odcinek w osiach X/Y (np. G1 X80 Y40 F400), 4) Wyjedź bezpiecznie do góry nad detal (G0 Z20).',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.3: Pierwszy wyfrezowany rowek G0 i G1)
T1 M6
G21 G90 G17 G54
S3000 M3
G43 H1 Z20

(1. Dojazd szybki nad poczatek rowka X20 Y40 na wysokosci Z5)
G0 X20 Y40 Z5

(2. Zagłębienie robocze G1 w material na glebokosc Z-4 z posuwem F200)
G1 Z-4 F200

(3. ZADANIE: Wyfrezuj poziomy rowek ruchem G1 do punktu X80 Y40 z posuwem F400)
(   a nastepnie wycofaj narzedzie ruchem szybkim G0 na wysokosc Z20)


M30`,
    taskDescriptionPl:
      'Dokończ program tak, aby po zagłębieniu w punkcie X20 Y40 na głębokość Z-4 frez wyfrezował prostoliniowy rowek (G1) do punktu X80 Y40 (na tej samej głębokości Z-4), a na koniec wyjechał nad detal (np. G0 Z20).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak kolizji (w szczególności brak wjazdu w materiał na G0)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano ruch roboczy G1 do punktu końcowego rowka X80 Y40 Z-4',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 40 },
        expectedZMm: -4,
        toleranceMm: 0.5,
        descriptionPl: 'W środku płytki (X50 Y40) powstał rowek o głębokości Z = -4 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Narzędzie jest już zagłębione w punkcie X20 Y40 Z-4. Aby pojechać do X80 Y40, użyj polecenia G1.',
      'Podpowiedź 2/3: Dopisz linię: G1 X80 Y40 F400 (współrzędnej Z-4 nie musisz powtarzać, bo się nie zmienia).',
      'Podpowiedź 3/3: Po wyfrezowaniu rowka dodaj bezpieczny wyjazd do góry: G0 Z20 przed M30.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3000 M3
G43 H1 Z20
G0 X20 Y40 Z5
G1 Z-4 F200
G1 X80 Y40 F400
G0 Z20
M30`,
    solutionExplanationPl:
      'G1 Z-4 F200 płynnie wchodzi w materiał, G1 X80 Y40 F400 wycina rowek o długości 60 mm na głębokości 4 mm, a G0 Z20 bezpiecznie wycofuje frez ponad detal.',
    quiz: [
      {
        id: 'q_m1_03',
        questionPl: 'Dlaczego nie wolno użyć polecenia G0 Z-5, gdy narzędzie znajduje się bezpośrednio nad materiałem?',
        optionsPl: [
          'Ponieważ G0 to ruch szybki (pozycjonujący) i uderzenie nim w materiał powoduje groźną kolizję',
          'Ponieważ G0 działa tylko w osi X',
          'Ponieważ G0 wyłącza zasilanie maszyny',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Ruch szybki G0 służy wyłącznie do przejazdów w powietrzu. W materiał wchodzimy zawsze ruchem roboczym G1 z zadanym posuwem F.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.4
  // =========================================================================
  {
    id: 'M1_04',
    moduleId: 'MODULE_1',
    orderIndex: 4,
    titlePl: 'Lekcja 1.4: Posuw i obroty wrzeciona – F, S, M3, M5 oraz chłodziwo M8/M9',
    shortSubtitlePl: 'Uruchamianie wrzeciona przed skrawaniem i kultura kończenia programu',
    theoryParagraphsPl: [
      'Narzędzie skrawające może ciąć metal tylko wtedy, gdy szybko wiruje! W kodzie G funkcje pomocnicze maszyny zaczynają się od litery M (Miscellaneous Functions). Polecenie M3 włącza prawe obroty wrzeciona (zgodnie ze wskazówkami zegara), ale musimy mu też podać prędkość obrotową literą S (Spindle Speed), np. S3200 M3.',
      'Podczas skrawania metalu wydziela się dużo ciepła, dlatego poleceniem M8 włączamy podawanie płynu chłodząco-smarującego (chłodziwa – Coolant). Po zakończeniu obróbki i wyjechaniu narzędziem nad detal wyłączamy chłodziwo kodem M9, zatrzymujemy wrzeciono kodem M5 i kończymy program kodem M30.',
      'Od tej lekcji symulator pilnuje dyscypliny warsztatowej: jeśli spróbujesz wjechać w materiał przy wyłączonym wrzecionie (bez M3), zgłosi błąd SPINDLE_OFF_DURING_CUT!',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...EARLY_LESSON_VALIDATION_POLICY,
      requireSpindleOnForCutting: true,
      requireProgramEndM30: true,
    },
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.4: Obroty S, wrzeciono M3/M5, chlodziwo M8/M9)
T1 M6
G21 G90 G17 G54
G43 H1 Z20

(UWAGA: W ponizszym programie brakuje wlaczenia wrzeciona S3000 M3 oraz chlodziwa M8!)
(Dodaj je przed zjazdem w material, a na koncu dodaj M9, M5 oraz M30)

G0 X50 Y15 Z5
G1 Z-5 F200
G1 X50 Y65 F350
G0 Z20
`,
    taskDescriptionPl:
      'Napraw i uzupełnij program: 1) przed wejściem w materiał uruchom wrzeciono z prędkością np. S3000 M3 i włącz chłodziwo M8, 2) wyfrezuj pionowy rowek od X50 Y15 do X50 Y65 na głębokości Z-5, 3) po odjeździe na Z20 wyłącz chłodziwo (M9), zatrzymaj wrzeciono (M5) i zakończ program (M30).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Wrzeciono zostało prawidłowo włączone przed skrawaniem (brak błędu SPINDLE_OFF_DURING_CUT)',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 40 },
        expectedZMm: -5,
        toleranceMm: 0.5,
        descriptionPl: 'Wyfrezowano pionowy kanał przez środek płytki na głębokość Z = -5 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Zaraz po linii „G43 H1 Z20” dopisz linię uruchamiającą wrzeciono i chłodziwo: S3000 M3 M8',
      'Podpowiedź 2/3: Ruch roboczy G1 X50 Y65 na głębokości Z-5 jest już w kodzie – zadziała poprawnie, gdy wrzeciono będzie się obracać.',
      'Podpowiedź 3/3: Na samym dole po „G0 Z20” dopisz: M9, następnie M5 oraz M30.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z20
S3000 M3 M8
G0 X50 Y15 Z5
G1 Z-5 F200
G1 X50 Y65 F350
G0 Z20
M9
M5
M30`,
    solutionExplanationPl:
      'S3000 M3 M8 uruchamia prawe obroty wrzeciona (3000 obr./min) oraz chłodziwo przed kontaktem z surówką, a M9, M5 i M30 bezpiecznie kończą cykl pracy.',
    quiz: [
      {
        id: 'q_m1_04',
        questionPl: 'Która para poleceń uruchamia prawe obroty wrzeciona (2500 obr./min), a następnie je zatrzymuje?',
        optionsPl: [
          'S2500 M3 (start) oraz M5 (stop)',
          'F2500 G1 (start) oraz G0 (stop)',
          'T2500 M6 (start) oraz M30 (stop)',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Litera S zadaje obroty wrzeciona, M3 włącza obrót prawy (CW), a M5 zatrzymuje wrzeciono.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.5
  // =========================================================================
  {
    id: 'M1_05',
    moduleId: 'MODULE_1',
    orderIndex: 5,
    titlePl: 'Lekcja 1.5: Konturowanie – prostokąt i zarys z kilku odcinków (modalność)',
    shortSubtitlePl: 'Jak prowadzić narzędzie po zamkniętej ścieżce bez powtarzania G1 i F w każdej linii',
    theoryParagraphsPl: [
      'Kody G0 i G1 oraz posuw F są modalne (Modal Codes). Oznacza to, że gdy raz wpiszesz „G1 Z-3 F300”, sterownik pamięta zarówno tryb G1, jak i prędkość F300. W kolejnych liniach możesz pisać same współrzędne kolejnych narożników: np. „X80 Y20”, potem „X80 Y60”!',
      'Co więcej, jeśli w kolejnym odcinku zmienia się tylko jedna współrzędna (np. jedziemy poziomo z X20 Y20 do X80 Y20), współrzędnej Y20 w ogóle nie musisz powtarzać – wystarczy samo „X80”. Jeśli zmieniają się jednocześnie X oraz Y (np. z X80 Y50 do X70 Y60), maszyna pojedzie idealnie po skosie, tworząc ściętą fazę naroża!',
      'Aby zamknąć kontur (obwiednię), ostatni odcinek roboczy musi wrócić dokładnie do punktu, w którym zaczęliśmy wycinanie w płaszczyźnie XY.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...EARLY_LESSON_VALIDATION_POLICY,
      requireSpindleOnForCutting: true,
    },
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.5: Konturowanie - prostokat ze scietym prawym gornym narozem)
T1 M6
G21 G90 G17 G54
S3200 M3 M8
G43 H1 Z20

(Punkt startowy konturu: X20 Y20)
G0 X20 Y20 Z5
G1 Z-4 F200

(Kolejne punkty konturu na glebokosci Z-4:)
G1 X80 Y20 F400   (Dolny bok do X80 Y20)
X80 Y50           (Prawy bok w gore do X80 Y50)
X70 Y60           (Skosna faza naroza do X70 Y60)
(ZADANIE: Dopisz dwa ostatnie odcinki zamykajace kontur:)
(1. Gorny bok w lewo do punktu X20 Y60)
(2. Lewy bok w dol z powrotem do punktu startowego X20 Y20)


G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'Dokończ obrys konturu na głębokości Z = -4 mm: z punktu (X70, Y60) pojedź ruchem roboczym do lewego górnego narożnika (X20, Y60), a następnie zamknij kontur wracając do punktu startowego (X20, Y20).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 20, y: 60, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie wyfrezowało górny bok do narożnika X20 Y60 Z-4',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 20, y: 40 },
        expectedZMm: -4,
        toleranceMm: 0.5,
        descriptionPl: 'Lewy bok konturu (przechodzący przez X20 Y40) został wyfrezowany na Z = -4 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Ponieważ kod G1 i posuw F400 są już aktywne (modalne), możesz pisać same współrzędne X i Y (albo G1 X... Y...).',
      'Podpowiedź 2/3: Pod linią „X70 Y60” dopisz przejazd do lewego górnego rogu: X20 Y60',
      'Podpowiedź 3/3: W kolejnej linii zamknij obwiednię wracając do punktu początkowego: X20 Y20',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3200 M3 M8
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F200
G1 X80 Y20 F400
X80 Y50
X70 Y60
X20 Y60
X20 Y20
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Dwa odcinki „X20 Y60” oraz „X20 Y20” domykają pięciokątny kontur (prostokąt ze ściętym narożem) na stałej głębokości Z = -4 mm.',
    quiz: [
      {
        id: 'q_m1_05',
        questionPl: 'Jak poruszy się maszyna, jeśli z punktu X20 Y20 wykonamy blok „G1 X50 Y50 F300”?',
        optionsPl: [
          'Pojedzie jednocześnie obiema osiami po linii ukośnej (pod kątem 45°) prosto do punktu X50 Y50',
          'Najpierw pojedzie tylko w X, a dopiero po zatrzymaniu pojedzie w Y',
          'Zgłosi błąd, bo G1 pozwala ruszać tylko jedną osią naraz',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Interpolacja liniowa G1 synchronizuje prędkości wszystkich osi tak, aby narzędzie poruszało się dokładnie po linii prostej (w tym ukośnej) łączącej punkt początkowy z końcowym.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.6
  // =========================================================================
  {
    id: 'M1_06',
    moduleId: 'MODULE_1',
    orderIndex: 6,
    titlePl: 'Lekcja 1.6: Łuki – G2 (w prawo) i G3 (w lewo), formy R oraz IJK',
    shortSubtitlePl: 'Zaokrąglanie naroży promieniem R oraz wycinanie okręgów za pomocą środka I, J',
    theoryParagraphsPl: [
      'Części mechaniczne rzadko mają wyłącznie ostre naroża. Do jazdy po łuku kołowym służą dwa polecenia: G2 (ruch zgodny ze wskazówkami zegara – Clockwise, CW) oraz G3 (ruch przeciwny do wskazówek zegara – Counter-Clockwise, CCW, patrząc z góry na stół w płaszczyźnie G17).',
      'W bloku G2 lub G3 podajemy współrzędne punktu KOŃCOWEGO łuku (X, Y) oraz informację o krzywiźnie na jeden z dwóch sposobów: 1) Sposób z promieniem R (np. G3 X80 Y40 R20) – bardzo wygodny przy zaokrąglaniu naroży o kącie do 180°, 2) Sposób z wektorem środka I, J (np. G2 X35 Y40 I15 J0) – gdzie I oraz J to odległości w osiach X i Y od punktu POCZĄTKOWEGO łuku do ŚRODKA okręgu.',
      'Ważna zasada: za pomocą parametru R nie da się zaprogramować pełnego okręgu 360° (bo punkt startowy i końcowy są w tym samym miejscu, więc okrąg mógłby leżeć z dowolnej strony). Pełny okrąg programujemy za pomocą I oraz J!',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...EARLY_LESSON_VALIDATION_POLICY,
      requireSpindleOnForCutting: true,
    },
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.6: Interpolacja kolowa G2 i G3)
T1 M6
G21 G90 G17 G54
S3200 M3 M8
G43 H1 Z20

(Startujemy w punkcie X20 Y20 i jedziemy w prawo do X60 Y20)
G0 X20 Y20 Z5
G1 Z-4 F200
G1 X60 Y20 F350

(ZADANIE: Z punktu X60 Y20 wykonaj ćwiartkę łuku przeciwnie do zegara - G3)
(do punktu końcowego X80 Y40 o promieniu 20 mm - możesz użyć R20 albo I0 J20!)


G1 X80 Y60
G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'Pomiędzy odcinkiem kończącym się w (X60, Y20) a odcinkiem do (X80, Y60) wstaw ruch po łuku przeciwnie do wskazówek zegara (G3) do punktu X = 80, Y = 40 o promieniu 20 mm (możesz użyć zapisu z R20 albo z I0 J20 – oba zostaną zaliczone!).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Łuk jest geometrycznie poprawny i wolny od błędów',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CCW',
        expectedRadiusMm: 20,
        toleranceMm: 0.5,
        descriptionPl: 'Użyto interpolacji łukowej G3 o promieniu 20 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Łuk zakończył się w punkcie X80 Y40 Z-4',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Ruch przeciwny do ruchu wskazówek zegara to kod G3. Punkt końcowy łuku to X80 Y40.',
      'Podpowiedź 2/3: Najprościej użyć zapisu promieniowego: G3 X80 Y40 R20 (lub wektorowego: G3 X80 Y40 I0 J20).',
      'Podpowiedź 3/3: Pamiętaj, aby po łuku G3 w następnej linii (X80 Y60) był jawnie wpisany kod G1 (w kodzie startowym już jest: G1 X80 Y60), bo G3 też jest modalne!',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3200 M3 M8
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F200
G1 X60 Y20 F350
G3 X80 Y40 R20
G1 X80 Y60
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Blok „G3 X80 Y40 R20” (lub równoważny „G3 X80 Y40 I0 J20”) płynnie łączy punkt (60, 20) z punktem (80, 40) łukiem o promieniu 20 mm.',
    quiz: [
      {
        id: 'q_m1_06',
        questionPl: 'Czym różni się kod G2 od kodu G3 w płaszczyźnie G17 (widok z góry)?',
        optionsPl: [
          'G2 to łuk zgodny z ruchem wskazówek zegara (w prawo), a G3 przeciwny (w lewo)',
          'G2 służy do linii prostych, a G3 do wiercenia',
          'G2 działa w milimetrach, a G3 w calach',
        ],
        correctOptionIndex: 0,
        explanationPl: 'G2 (Clockwise) prowadzi narzędzie po łuku zgodnie z ruchem wskazówek zegara, a G3 (Counter-Clockwise) przeciwnie do wskazówek zegara.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.7
  // =========================================================================
  {
    id: 'M1_07',
    moduleId: 'MODULE_1',
    orderIndex: 7,
    titlePl: 'Lekcja 1.7: Tryby G90 (bezwzględny) i G91 (przyrostowy)',
    shortSubtitlePl: 'Kiedy wygodniej podawać odległość od ostatniego punktu zamiast od zera detalu',
    theoryParagraphsPl: [
      'Do tej pory pracowaliśmy w trybie G90 (Absolute Positioning – wymiarowanie bezwzględne), w którym każda współrzędna X, Y, Z oznacza pozycję liczoną od stałego punktu zerowego przedmiotu (0, 0, 0).',
      'Czasami jednak na rysunku wymiary podane są „łańcuchowo” (od jednego otworu lub narożnika do następnego, np. „przesuń o +20 mm w prawo i +15 mm w górę”). Wtedy możemy przełączyć sterownik w tryb G91 (Incremental Positioning – wymiarowanie przyrostowe). W trybie G91 wpisanie „G1 X20 Y15” oznacza: „przesuń narzędzie o 20 mm w X oraz o 15 mm w Y względem miejsca, w którym teraz stoisz”.',
      'Zasada bezpieczeństwa: po zakończeniu sekcji przyrostowej G91 zawsze jak najszybciej wróć do trybu bezwzględnego G90 przed wykonaniem odjazdu w osi Z (np. G90 G0 Z20), aby przypadkiem nie pomylić wysokości!',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...EARLY_LESSON_VALIDATION_POLICY,
      requireSpindleOnForCutting: true,
    },
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.7: Wymiarowanie bezwzgledne G90 i przyrostowe G91)
T1 M6
G21 G90 G17 G54
S3000 M3 M8
G43 H1 Z20

(Start w trybie G90 w punkcie X20 Y20 Z-4)
G0 X20 Y20 Z5
G1 Z-4 F200

(Przelaczamy na tryb przyrostowy G91 - schodki co +20 mm w X i +15 mm w Y)
G91
G1 X20 Y0 F350    (Jestesmy w X40 Y20)
G1 X0 Y15         (Jestesmy w X40 Y35)
G1 X20 Y0         (Jestesmy w X60 Y35)

(ZADANIE: Wykonaj jeszcze dwa kroki schodków: o +15 mm w Y, a potem o +20 mm w X,)
(tak aby dotrzeć do punktu bezwzględnego X80 Y50. Następnie wróć do G90 i odjedź na Z20!)


M9
M5
M30`,
    taskDescriptionPl:
      'Dokończ schodkowy wzór (w trybie przyrostowym G91 lub bezwzględnym G90 – sprawdzacz ocenia wynikową ścieżkę!), tak aby narzędzie z punktu (X60, Y35) przeszło przez punkt (X60, Y50) i dotarło do (X80, Y50) na głębokości Z = -4 mm, a następnie wyjechało w górę na G90 G0 Z20.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak kolizji i błędów',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 60, y: 50, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie wyfrezowało odcinek pionowy do punktu X60 Y50 Z-4',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 50, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie wyfrezowało ostatni stopień do punktu X80 Y50 Z-4',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Będąc w trybie przyrostowym G91 w punkcie (60, 35), aby przesunąć się do (60, 50), potrzebujesz przyrostu Y15.',
      'Podpowiedź 2/3: Następnie z (60, 50) do (80, 50) potrzebujesz przyrostu X20.',
      'Podpowiedź 3/3: Dopisz linie: „G1 X0 Y15”, potem „G1 X20 Y0”, a na końcu wróć do trybu bezwzględnego: „G90 G0 Z20”.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3000 M3 M8
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F200
G91
G1 X20 Y0 F350
G1 X0 Y15
G1 X20 Y0
G1 X0 Y15
G1 X20 Y0
G90 G0 Z20
M9
M5
M30`,
    solutionExplanationPl:
      'W trybie G91 kolejne polecenia „G1 X0 Y15” oraz „G1 X20 Y0” przesuwają narzędzie o zadane wektory do punktu końcowego (80, 50), po czym „G90 G0 Z20” bezpiecznie przywraca wymiarowanie bezwzględne.',
    quiz: [
      {
        id: 'q_m1_07',
        questionPl: 'Narzędzie stoi w punkcie X30 Y10. Gdzie znajdzie się po wykonaniu bloku „G91 G0 X10 Y-5”?',
        optionsPl: [
          'W punkcie X10 Y-5',
          'W punkcie X40 Y5',
          'W punkcie X20 Y15',
        ],
        correctOptionIndex: 1,
        explanationPl: 'W trybie przyrostowym G91 dodajemy podane wartości do aktualnej pozycji: X = 30 + 10 = 40, Y = 10 + (-5) = 5.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.8
  // =========================================================================
  {
    id: 'M1_08',
    moduleId: 'MODULE_1',
    orderIndex: 8,
    titlePl: 'Lekcja 1.8: Punkty zerowe przedmiotu G54–G59',
    shortSubtitlePl: 'Jak używać wielu baz współrzędnych zapisanych w tabeli sterownika',
    theoryParagraphsPl: [
      'Skąd maszyna wie, w którym miejscu na dużym stole frezarki zamocowaliśmy nasze imadło z detalem? Przed uruchomieniem programu operator mierzy sondą położenie narożnika detalu i wpisuje je do tabeli punktów zerowych w sterowniku pod kodami od G54 do G59 (zajrzyj do karty „🛠 Tabele T / H / D / G54”!).',
      'Standardowo pierwsza sztuka korzysta z bazy G54. Jeśli na stole zamocujemy dwa imadła obok siebie (np. pierwsze w G54, a drugie przesunięte o 130 mm w prawo w G55), możemy wykonać ten sam ruch w G54, a następnie wpisać G55 i powtórzyć dokładnie te same współrzędne!',
      'Samo wpisanie G55 nie powoduje jeszcze ruchu osi maszyny – przełącza jedynie układ odniesienia dla wszystkich kolejnych współrzędnych X, Y, Z.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...EARLY_LESSON_VALIDATION_POLICY,
      requireSpindleOnForCutting: true,
    },
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 1.8: Przelaczanie punktow zerowych G54 i G55)
T1 M6
G21 G90 G17
S3000 M3 M8
G43 H1 Z20

(Operacja 1 w bazie G54 - nawiercenie/wejscie w X30 Y40)
G54
G0 X30 Y40 Z5
G1 Z-4 F200
G0 Z20

(ZADANIE: Przelacz uklad wspolrzednych na G55 i wykonaj ruch do punktu X30 Y40 Z5)


M9
M5
M30`,
    taskDescriptionPl:
      'Po wykonaniu operacji w układzie G54 i odjeździe na Z20, przełącz aktywny układ współrzędnych na G55 i wykonaj dojazd (G0 lub G1) do punktu X30 Y40 Z5 w układzie G55.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak błędów i przekroczeń zakresu osi maszyny',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'WORK_OFFSET', offset: 'G55' },
        descriptionPl: 'Aktywowano drugi układ współrzędnych przedmiotu G55',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 40, z: 5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: false,
        requiredWorkOffset: 'G55',
        descriptionPl: 'Odwiedzono punkt X30 Y40 Z5 w aktywnym układzie G55',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Aby zmienić aktywną bazę przedmiotu, wpisz w nowej linii kod G55.',
      'Podpowiedź 2/3: Po wpisaniu G55 zadaj ruch do punktu X30 Y40 Z5.',
      'Podpowiedź 3/3: Dopisz przed M9 dwie linie: „G55” oraz „G0 X30 Y40 Z5”.',
    ],
    solutionCode: `T1 M6
G21 G90 G17
S3000 M3 M8
G43 H1 Z20
G54
G0 X30 Y40 Z5
G1 Z-4 F200
G0 Z20
G55
G0 X30 Y40 Z5
M9
M5
M30`,
    solutionExplanationPl:
      'Po wywołaniu G55 sterownik dodaje przesunięcie bazy G55 (X=180, Y=40 w MCS), dzięki czemu zapis „G0 X30 Y40 Z5” przesuwa wrzeciono nad drugie stanowisko robocze.',
    quiz: [
      {
        id: 'q_m1_08',
        questionPl: 'Do czego służą kody od G54 do G59 w sterowniku CNC?',
        optionsPl: [
          'Do wyboru zapisanego w tabeli punktu zerowego przedmiotu obrabianego (WCS)',
          'Do zmiany prędkości obrotowej wrzeciona',
          'Do zmiany języka menu maszyny',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Kody G54–G59 wybierają jeden z sześciu podstawowych układów współrzędnych przedmiotu zapisanych w pamięci sterownika.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.9
  // =========================================================================
  {
    id: 'M1_09',
    moduleId: 'MODULE_1',
    orderIndex: 9,
    titlePl: 'Lekcja 1.9: Narzędzia – tabela narzędzi, wybór T i wymiana M6',
    shortSubtitlePl: 'Jak zamontować i wymienić narzędzie w magazynie frezarki',
    theoryParagraphsPl: [
      'Frezarka CNC posiada magazyn narzędziowy (Tool Magazine), w którym czeka kilka różnych narzędzi. W naszej maszynie (sprawdź kartę „🛠 Tabele T / H / D / G54”) mamy: T1 (Frez walcowy Ø10 mm), T2 (Frez fazujący Ø8 mm), T3 (Wiertło kręte Ø6 mm) oraz T4 (Frez walcowy Ø6 mm).',
      'Samo wpisanie „T2” jedynie obraca magazyn i przygotowuje narzędzie nr 2 do wymiany. Dopiero komenda M6 (Tool Change) wykonuje fizyczną wymianę narzędzia we wrzecionie! Najczęściej zapisujemy je razem w jednym bloku: „T2 M6”.',
      'Zawsze przed wymianą narzędzia M6 upewnij się, że poprzednie narzędzie wyjechało bezpiecznie w górę nad detal (np. G0 Z30), a po wymianie uruchom obroty S... M3 i włącz korekcję długości dla nowego narzędzia (np. G43 H2).',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: {
      ...STRICT_VALIDATION_POLICY,
      requireLengthCompensation: false,
    },
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.9: Wymiana narzedzia T1 -> T2 za pomoca M6)
G21 G90 G17 G54

(1. Narzedzie T1 - Frez walcowy fi 10 mm)
T1 M6
S3000 M3
G43 H1 Z20
G0 X20 Y40 Z5
G1 Z-4 F200
G1 X80 Y40 F350
G0 Z30

(2. ZADANIE: Wymien narzedzie na T2 za pomoca T2 M6, wlacz G43 H2 Z20,)
(   uruchom wrzeciono S3500 M3 i wykonaj nawiercenie fazki w punkcie X50 Y20 na Z-3)


M5
M30`,
    taskDescriptionPl:
      'Po wykonaniu rowka narzędziem T1 i odjeździe na Z30: 1) wymień narzędzie na T2 (T2 M6), 2) włącz korekcję G43 H2 Z20 i obroty S3500 M3, 3) podjedź do X50 Y20 Z5 i zjedź roboczo G1 na głębokość Z-3 (z posuwem np. F200), a następnie wyjedź na G0 Z25.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak błędów (narzędzie zamocowane we wrzecionie przed ruchem)',
      },
      {
        kind: 'USED_TOOL_POCKETS',
        requiredPockets: [1, 2],
        requireInOrder: true,
        descriptionPl: 'Użyto kolejno narzędzia T1, a następnie narzędzia T2 (po wymianie M6)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 20, z: -3, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano operację roboczą narzędziem T2 w punkcie X50 Y20 Z-3',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Aby wymienić narzędzie na drugie, wpisz linię: T2 M6',
      'Podpowiedź 2/3: Zaraz po T2 M6 wpisz: S3500 M3 oraz G43 H2 Z20',
      'Podpowiedź 3/3: Następnie dodaj: „G0 X50 Y20 Z5”, potem „G1 Z-3 F200” i wyjazd „G0 Z25”.',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3000 M3
G43 H1 Z20
G0 X20 Y40 Z5
G1 Z-4 F200
G1 X80 Y40 F350
G0 Z30
T2 M6
S3500 M3
G43 H2 Z20
G0 X50 Y20 Z5
G1 Z-3 F200
G0 Z25
M5
M30`,
    solutionExplanationPl:
      'Blok T2 M6 zmienia narzędzie we wrzecionie na frez fazujący Ø8 mm, po czym G43 H2 dopasowuje korekcję długości do wysięgu narzędzia T2 (45 mm).',
    quiz: [
      {
        id: 'q_m1_09',
        questionPl: 'Co zrobi maszyna, jeśli w programie wpiszemy samo słowo „T3” bez komendy „M6”?',
        optionsPl: [
          'Tylko przygotuje narzędzie T3 w magazynie, ale we wrzecionie pozostanie dotychczasowe narzędzie',
          'Natychmiast wymieni narzędzie we wrzecionie na T3',
          'Zatrzyma wrzeciono i wyłączy chłodziwo',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Słowo T wybiera gniazdo w magazynie, a dopiero rozkaz M6 wykonuje fizyczną wymianę narzędzia we wrzecionie.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.10
  // =========================================================================
  {
    id: 'M1_10',
    moduleId: 'MODULE_1',
    orderIndex: 10,
    titlePl: 'Lekcja 1.10: Korekcja długości narzędzia – G43 i rejestr H',
    shortSubtitlePl: 'Dlaczego bez G43 H.. wrzeciono uderzy w detal i dlaczego numer H musi pasować do T',
    theoryParagraphsPl: [
      'Każde narzędzie zamocowane w oprawce wystaje z wrzeciona na inną długość fizyczną (np. nasze T1 ma długość 50 mm, T2 ma 45 mm, a długie wiertło T3 aż 60 mm). Bez włączonej korekcji długości (stan G49) sterownik traktuje współrzędną Z jako położenie CZOŁA WRZECIONA (Spindle Gauge Line). Gdybyś bez korekcji napisała/napisał G0 Z10, czoło wrzeciona zjechałoby na Z10, więc czubek 50-milimetrowego frezu T1 wbiłby się na Z = -40 mm, niszcząc detal i imadło!',
      'Polecenie G43 H1 włącza dodatnią korekcję długości i pobiera z rejestru H1 w sterowniku zmierzoną długość narzędzia (50 mm). Dzięki temu sterownik podnosi wrzeciono o 50 mm wyżej i wierzchołek narzędzia (Tool Tip Center) trafia dokładnie w zaprogramowane Z!',
      'Złota zasada operatora: numer rejestru H musi zawsze odpowiadać numerowi narzędzia T! Dla T1 używamy G43 H1, dla T2 używamy G43 H2, a dla T3 używamy G43 H3.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.10: Korekcja dlugosci G43 H..)
(UWAGA: W tym programie celowo zostawiono G49 - zobacz czerwona kolizje w 3D!)
G21 G90 G17 G54
T3 M6 (Wiertlo fi 6 mm o dlugosci fizycznej 60 mm)
S2500 M3 M8

(ZADANIE: Zamien ponizsze bledne G49 na wlasciwa korekcje dlugosci G43 H3,)
(aby wierzcholek wiertla T3 zatrzymal sie na Z10, a nastepnie wywiercil otwor na Z-10)
G49 G0 X50 Y40 Z10
G1 Z-10 F180
G0 Z25 M9
M5
M30`,
    taskDescriptionPl:
      'W kodzie startowym użyto narzędzia T3 (długość 60 mm) z odwołaną korekcją G49, przez co wiertło przebija surówkę na wylot już podczas ruchu szybkiego G0! Zamień G49 na właściwe polecenie korekcji długości dla narzędzia T3 (G43 H3), aby program wykonał się bez kolizji i nawiercił otwór w X50 Y40 dokładnie na głębokość Z = -10 mm.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Usunięto kolizję i błąd braku korekcji długości',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'LENGTH_COMP', mode: 'G43', registerH: 3 },
        descriptionPl: 'Aktywowano korekcję długości G43 z rejestrem H3 dopasowanym do narzędzia T3',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 40 },
        expectedZMm: -10,
        toleranceMm: 0.5,
        descriptionPl: 'Dno otworu w punkcie X50 Y40 znajduje się dokładnie na Z = -10 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: We wrzecionie zamocowane jest narzędzie T3, więc potrzebujemy rejestru długości H3.',
      'Podpowiedź 2/3: Zastąp słowo „G49” w linii dojazdu przez „G43 H3”.',
      'Podpowiedź 3/3: Linia dojazdu powinna brzmieć: G43 H3 G0 X50 Y40 Z10 (lub w osobnej linii G43 H3 Z10).',
    ],
    solutionCode: `G21 G90 G17 G54
T3 M6
S2500 M3 M8
G43 H3 G0 X50 Y40 Z10
G1 Z-10 F180
G0 Z25 M9
M5
M30`,
    solutionExplanationPl:
      'Włączenie G43 H3 kompensuje 60 mm długości wiertła T3, dzięki czemu ruch G0 zatrzymuje czubek wiertła bezpiecznie na Z10, a ruch G1 wierci dokładnie do Z-10 mm.',
    quiz: [
      {
        id: 'q_m1_10',
        questionPl: 'Co stanie się, jeśli dla długiego wiertła T3 (60 mm) omyłkowo wpiszemy korekcję G43 H4 (40 mm)?',
        optionsPl: [
          'Wierzchołek wiertła pojedzie o 20 mm za nisko względem zaprogramowanego Z, grożąc kolizją!',
          'Sterownik sam zignoruje H4 i użyje H3',
          'Wiertło skróci się fizycznie o 20 mm',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Ponieważ rejestr H4 (40 mm) podniesie wrzeciono tylko o 40 mm zamiast o 60 mm, fizyczny wierzchołek narzędzia T3 znajdzie się o 20 mm niżej niż zaplanowano w kodzie!',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.11
  // =========================================================================
  {
    id: 'M1_11',
    moduleId: 'MODULE_1',
    orderIndex: 11,
    titlePl: 'Lekcja 1.11: Korekcja promienia narzędzia – G41 (lewo), G42 (prawo), G40',
    shortSubtitlePl: 'Jak programować wymiary wprost z rysunku i pozwolić maszynie odsunąć frez o promień D',
    theoryParagraphsPl: [
      'Nasz frez T1 ma średnicę Ø10 mm, czyli promień 5 mm. Gdyby środek frezu pojechał dokładnie po krawędzi wymiaru z rysunku, bok frezu zebrałby o 5 mm materiału za dużo! Zamiast ręcznie przeliczać wszystkie współrzędne na kartce, używamy korekcji promienia narzędzia (Cutter Radius Compensation):',
      '• G41 D1 – odsuwa narzędzie w LEWO od zaprogramowanego kierunku ruchu o promień z rejestru D1 (5 mm). Gdy okrążamy zewnętrzny kontur kostki zgodnie ze wskazówkami zegara, lewa strona to właśnie strona zewnętrzna!\n• G42 D1 – odsuwa narzędzie w PRAWO od kierunku ruchu.\n• G40 – odwołuje korekcję promienia.',
      'Ważna reguła sterowników CNC: włączenie korekcji (G41/G42) oraz jej odwołanie (G40) musi nastąpić na prostoliniowym odcinku dojazdowym G1 (nie wolno włączać G41 w ruchu szybkim G0 ani w łuku G2/G3!). Na ekranie 3D zielona przerywana linia pokaże zaprogramowany kontur, a niebieska – odsuniętą ścieżkę środka frezu.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.11: Korekcja promienia G41 D1 oraz odwolanie G40)
G21 G90 G17 G54
T1 M6
S3000 M3 M8
G43 H1 Z20

(Pozycja startowa dojazdu poza konturem: X5 Y5)
G0 X5 Y5 Z5
G1 Z-4 F200

(ZADANIE: W ponizszej linii dojazdowej wlacz korekcje lewostronna G41 z rejestrem D1!)
G1 X20 Y20 F350

(Objazd konturu prostokata 20..80 x 20..60 zgodnie z zegarem)
G1 X20 Y60
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20

(Odcinek wyjazdowy - tutaj odwolujemy korekcje kodem G40)
G1 G40 X5 Y5
G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'W linii dojazdowej do punktu X20 Y20 włącz lewostronną korekcję promienia narzędzia T1 za pomocą kodu G41 oraz rejestru D1 (czyli „G1 G41 D1 X20 Y20 F350”). Zobacz w widoku z góry (XY), jak niebieski tor frezu odsuwa się na zewnątrz od zielonego konturu!',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Korekcja promienia włączona i wyłączona poprawnie na odcinkach G1 (brak błędów)',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'CUTTER_COMP', mode: 'G41', registerD: 1 },
        descriptionPl: 'Aktywowano korekcję lewostronną G41 z rejestrem D1',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        // Przy ruchu w górę od (20,20) do (20,60), lewa strona to X = 20 - 5 = 15 mm!
        targetWcs: { x: 15, y: 60, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Środek frezu został prawidłowo odsunięty o promień 5 mm w lewo (do X15 Y60)',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Znajdź linię „G1 X20 Y20 F350” (tuż przed objazdem konturu).',
      'Podpowiedź 2/3: Dopisz w tej linii słowa „G41 D1”.',
      'Podpowiedź 3/3: Linia powinna wyglądać tak: G1 G41 D1 X20 Y20 F350',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3000 M3 M8
G43 H1 Z20
G0 X5 Y5 Z5
G1 Z-4 F200
G1 G41 D1 X20 Y20 F350
G1 X20 Y60
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20
G1 G40 X5 Y5
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Dzięki G41 D1 środek frezu Ø10 mm porusza się w odległości 5 mm na lewo od zaprogramowanego konturu (np. po X=15 zamiast X=20), dzięki czemu krawędź boczna narzędzia skrawa dokładnie wzdłuż linii wymiarowej.',
    quiz: [
      {
        id: 'q_m1_11',
        questionPl: 'W jakim ruchu należy włączać (G41/G42) i odwoływać (G40) korekcję promienia narzędzia?',
        optionsPl: [
          'W prostoliniowym ruchu roboczym G1 (na odcinku dojazdowym / wyjazdowym)',
          'W trakcie wycinania łuku G2 lub G3',
          'Podczas wymiany narzędzia M6',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Sterowniki CNC wymagają prostoliniowego odcinka przejściowego (G1), na którym oś narzędzia płynnie przesuwa się o wartość promienia D.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.12
  // =========================================================================
  {
    id: 'M1_12',
    moduleId: 'MODULE_1',
    orderIndex: 12,
    titlePl: 'Lekcja 1.12: Wiercenie – cykle stałe G81, G82, G83 z G98/G99 i odwołanie G80',
    shortSubtitlePl: 'Szybkie wiercenie serii otworów bez pisania dziesiątek linii G0/G1',
    theoryParagraphsPl: [
      'Gdy mamy do wywiercenia 10 otworów, pisanie dla każdego z osobna dojazdu G0, wiercenia G1 i wycofania G0 byłoby żmudne. Dlatego sterowniki CNC mają wbudowane cykle wiertarskie (Canned Cycles):\n• G81 – wiercenie zwykłe (wjazd w dół na Z i natychmiastowy wyjazd w górę),\n• G82 – wiercenie z postojem czasowym P na dnie (wygładza dno otworu),\n• G83 – wiercenie głębokie skokowe (Peck Drilling): wiertło wchodzi skokami co Q milimetrów i za każdym razem wycofuje się do góry, żeby wyrzucić wióry z otworu!',
      'W wywołaniu cyklu podajemy: X, Y (środek pierwszego otworu), Z (dno otworu, np. Z-15), R (płaszczyznę bezpiecznego zbliżenia nad materiałem, np. R2), Q (skok dla G83, np. Q5) oraz F (posuw wiercenia). Kody G98 (powrót do początkowego Z) i G99 (powrót do poziomu R) sterują wysokością przejazdu między otworami.',
      'Największa zaleta: cykl jest modalny! W kolejnych liniach wpisujesz TYLKO współrzędne kolejnych otworów (np. „X50 Y40”, „X80 Y40”), a maszyna sama wierci otwór w każdym punkcie! Po ostatnim otworze odwołujemy cykl kodem G80.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.12: Wiercenie glebokie G83 z wycofaniem wiora Q)
G21 G90 G17 G54
T3 M6 (Wiertlo fi 6 mm)
S2400 M3 M8
G43 H3 Z20

(Cykl G83 wierci pierwszy otwor w X20 Y40 na glebokosc Z-15 co Q5 mm)
G98 G83 X20 Y40 Z-15 R2 Q5 F160

(ZADANIE: Dopisz ponizej dwie linie z samymi wspolrzednymi X i Y,)
(aby wywiercic kolejne dwa otwory w punktach: X50 Y40 oraz X80 Y40!)


(Odwolanie cyklu wiertarskiego G80 i wyjazd w gore)
G80
G0 Z30 M9
M5
M30`,
    taskDescriptionPl:
      'Wykorzystaj modalność cyklu G83: pomiędzy wywołaniem „G98 G83 X20 Y40...” a odwołaniem „G80” dopisz dwie linie ze współrzędnymi dwóch kolejnych otworów: (X50, Y40) oraz (X80, Y40).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Cykl wiercenia i jego odwołanie G80 wykonane bez błędów',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'CANNED_CYCLE', cycle: 'G83' },
        descriptionPl: 'Użyto cyklu głębokiego wiercenia G83',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: -15, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wywiercono środkowy otwór X50 Y40 na głębokość Z = -15 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -15, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wywiercono prawy otwór X80 Y40 na głębokość Z = -15 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Dopóki nie wpiszesz G80, sterownik pamięta cykl G83 oraz parametry Z-15, R2, Q5 i F160.',
      'Podpowiedź 2/3: Pod linią z G83 wpisz w nowej linii: X50 Y40',
      'Podpowiedź 3/3: W kolejnej linii (przed G80) wpisz: X80 Y40',
    ],
    solutionCode: `G21 G90 G17 G54
T3 M6
S2400 M3 M8
G43 H3 Z20
G98 G83 X20 Y40 Z-15 R2 Q5 F160
X50 Y40
X80 Y40
G80
G0 Z30 M9
M5
M30`,
    solutionExplanationPl:
      'Linie „X50 Y40” i „X80 Y40” wyzwalają modalny cykl G83 w nowych pozycjach, a „G80” kończy tryb wiercenia przed ruchem G0 Z30.',
    quiz: [
      {
        id: 'q_m1_12',
        questionPl: 'Do czego służy parametr Q w cyklu głębokiego wiercenia G83 (np. G83 X10 Y10 Z-18 R2 Q6 F150)?',
        optionsPl: [
          'Określa głębokość pojedynczego skoku wiercenia (6 mm) przed wycofaniem wiertła w celu usunięcia wiórów',
          'Określa średnicę wiertła',
          'Określa numer narzędzia w magazynie',
        ],
        correctOptionIndex: 0,
        explanationPl: 'W cyklu G83 parametr Q definiuje głębokość pojedynczego zagłębienia (Peck Increment), po którym wiertło wycofuje się do płaszczyzny R.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.13
  // =========================================================================
  {
    id: 'M1_13',
    moduleId: 'MODULE_1',
    orderIndex: 13,
    titlePl: 'Lekcja 1.13: Program z trzema narzędziami – pełne zadanie końcowe Modułu 1',
    shortSubtitlePl: 'Samodzielne połączenie frezowania (T1), fazowania (T2) oraz wiercenia (T3)',
    theoryParagraphsPl: [
      'Czas połączyć wszystkie poznane umiejętności w jeden kompletny program produkcyjny! W prawdziwym warsztacie niemal każda część wymaga użycia kilku narzędzi po kolei.',
      'W tym zadaniu wykonasz kompletną obróbkę płytki za pomocą trzech narzędzi:\n1) Narzędzie T1 (Frez walcowy Ø10 mm, H1): wyfrezuj poziomy kanał od (X25, Y40) do (X75, Y40) na głębokości Z = -5 mm.\n2) Narzędzie T2 (Frez fazujący Ø8 mm, H2): wykonaj nawiercenie pod fazę w dwóch punktach: (X25, Y20) oraz (X75, Y20) na głębokości Z = -3 mm.\n3) Narzędzie T3 (Wiertło Ø6 mm, H3): wywierć w tych samych dwóch punktach (X25, Y20) oraz (X75, Y20) otwory o głębokości Z = -14 mm (np. cyklem G81 lub G83).',
      'Pamiętaj o schemacie dla każdego narzędzia: bezpieczny odjazd w Z -> T.. M6 -> S.. M3 M8 -> G43 H.. Z20 -> obróbka -> odjazd w Z!',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.13: ZADANIE KONCOWE MODULU 1 - Program z 3 narzedziami)
G21 G90 G17 G54

(--- 1. Narzedzie T1: Frez walcowy fi 10 mm - rowek od X25 Y40 do X75 Y40 na Z-5 ---)
T1 M6
S3200 M3 M8
G43 H1 Z20
G0 X25 Y40 Z5
G1 Z-5 F200
G1 X75 Y40 F400
G0 Z30 M9

(--- 2. Narzedzie T2: Frez fazujacy fi 8 mm - fazy w X25 Y20 i X75 Y20 na Z-3 ---)
T2 M6
S3800 M3 M8
G43 H2 Z20
G98 G81 X25 Y20 Z-3 R2 F200
X75 Y20
G80
G0 Z30 M9

(--- 3. ZADANIE: Dopisz sekcje dla narzedzia T3 - Wiertlo fi 6 mm, H3 ---)
(Wywierc otwory w punktach X25 Y20 oraz X75 Y20 na glebokosc Z-14,)
(odwolaj cykl G80, odjedz na G0 Z30 i zakoncz program M9 M5 M30!)

`,
    taskDescriptionPl:
      'Pierwsze dwa narzędzia (T1 i T2) są już przygotowane w kodzie. Dopisz kompletną sekcję dla trzeciego narzędzia T3 (T3 M6, S2400 M3 M8, G43 H3 Z20), wywierć otwory w punktach (X25, Y20) oraz (X75, Y20) na głębokość Z = -14 mm (cyklem G81/G83 lub ruchem G1), odwołaj cykl (G80), wyjedź nad detal i zakończ program (M30).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Cały program 3-narzędziowy wykonuje się bez błędów i kolizji',
      },
      {
        kind: 'USED_TOOL_POCKETS',
        requiredPockets: [1, 2, 3],
        requireInOrder: true,
        descriptionPl: 'Użyto kolejno wszystkich trzech narzędzi: T1 → T2 → T3',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'LENGTH_COMP', mode: 'G43', registerH: 3 },
        descriptionPl: 'Włączono korekcję długości G43 H3 dla wiertła T3',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 25, y: 20, z: -14, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wywiercono pierwszy otwór w X25 Y20 na głębokość Z = -14 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 20, z: -14, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wywiercono drugi otwór w X75 Y20 na głębokość Z = -14 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Rozpocznij trzecią sekcję od wymiany narzędzia i korekcji: T3 M6, w nowej linii S2400 M3 M8, a w kolejnej G43 H3 Z20.',
      'Podpowiedź 2/3: Użyj cyklu wiertarskiego: G98 G83 X25 Y20 Z-14 R2 Q5 F160, a w kolejnej linii dopisz drugi otwór: X75 Y20.',
      'Podpowiedź 3/3: Po drugim otworze dopisz: G80, następnie G0 Z30 M9, M5 oraz M30.',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3200 M3 M8
G43 H1 Z20
G0 X25 Y40 Z5
G1 Z-5 F200
G1 X75 Y40 F400
G0 Z30 M9
T2 M6
S3800 M3 M8
G43 H2 Z20
G98 G81 X25 Y20 Z-3 R2 F200
X75 Y20
G80
G0 Z30 M9
T3 M6
S2400 M3 M8
G43 H3 Z20
G98 G83 X25 Y20 Z-14 R2 Q5 F160
X75 Y20
G80
G0 Z30 M9
M5
M30`,
    solutionExplanationPl:
      'Program wykonuje kompletną obróbkę technologiczną: frezowanie rowka (T1), nawiercanie faz wejściowych (T2) oraz wiercenie głębokich otworów (T3) z właściwymi korektorami H1, H2 i H3.',
    quiz: [
      {
        id: 'q_m1_13',
        questionPl: 'Dlaczego przed wywołaniem wymiany narzędzia (np. T3 M6) zawsze odjeżdżamy w osi Z wysoko nad detal (np. G0 Z30)?',
        optionsPl: [
          'Aby podczas wymiany i dojazdu nowe, dłuższe narzędzie nie zahaczyło o obrabiany przedmiot ani imadło',
          'Ponieważ komenda M6 działa wyłącznie wtedy, gdy X jest ujemne',
          'Aby chłodziwo szybciej wyparowało',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Bezpieczny odjazd w osi Z przed wymianą narzędzia chroni przed kolizją z przedmiotem i oprzyrządowaniem.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.14
  // =========================================================================
  {
    id: 'M1_14',
    moduleId: 'MODULE_1',
    orderIndex: 14,
    titlePl: 'Lekcja 1.14: Typowe błędy początkujących i jak je znajdować (Debugowanie)',
    shortSubtitlePl: 'Praca krokowa „Następna linia” i naprawa programu z 3 błędami',
    theoryParagraphsPl: [
      'Nawet doświadczeni programiści CNC popełniają literówki. Dlatego zanim uruchomisz program na maszynie, sprawdzasz go w symulatorze, korzystając z karty „🔍 Diagnostyka” oraz przycisku pracy krokowej „Następna linia ▶”.',
      'Trzy najgroźniejsze błędy początkujących to:\n1) Zjazd w materiał ruchem szybkim G0 zamiast G1 (błąd RAPID_COLLISION_IN_MATERIAL),\n2) Zapomnienie o włączeniu wrzeciona M3 przed skrawaniem (błąd SPINDLE_OFF_DURING_CUT),\n3) Użycie G1 bez podania posuwu F lub pominięcie korekcji długości G43 H..',
      'W edytorze poniżej znajduje się uszkodzony program napisany przez początkującą osobę. Zawiera on dokładnie te trzy błędy! Zdiagnozuj je i napraw tak, aby wyfrezować odcinek od (X20, Y50) do (X80, Y50) na głębokości Z = -4 mm bez żadnego błędu.',
    ],
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.14: Znajdz i napraw 3 bledy w ponizszym programie!)
G21 G90 G17 G54
T1 M6
(BLAD 1: Brak wlaczenia obrotow wrzeciona S3000 M3!)

(BLAD 2: Brak korekcji dlugosci G43 H1!)
G0 X20 Y50 Z5

(BLAD 3: Zjazd w material na G0 zamiast G1 z posuwem F!)
G0 Z-4
G1 X80 Y50 F350
G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Zajrzyj do karty „🔍 Diagnostyka” i napraw wszystkie 3 błędy w kodzie: 1) dodaj włączenie wrzeciona (np. S3000 M3), 2) dodaj korekcję długości dla T1 (G43 H1), 3) zamień kolizyjny zjazd „G0 Z-4” na ruch roboczy z posuwem (np. „G1 Z-4 F200”).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Wszystkie błędy i kolizje zostały naprawione (zielony status OK)',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 50 },
        expectedZMm: -4,
        toleranceMm: 0.5,
        descriptionPl: 'Rowek wzdłuż Y=50 został poprawnie wyfrezowany na głębokość Z = -4 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Zaraz po „T1 M6” dopisz linię: S3000 M3',
      'Podpowiedź 2/3: Przed zjazdem w materiał dopisz korekcję długości: G43 H1 Z20 (lub dodaj G43 H1 do linii G0 X20 Y50 Z5).',
      'Podpowiedź 3/3: Zamień linię „G0 Z-4” na „G1 Z-4 F200”.',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3000 M3
G43 H1 Z20
G0 X20 Y50 Z5
G1 Z-4 F200
G1 X80 Y50 F350
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Po dodaniu S3000 M3, korekcji G43 H1 oraz zmianie G0 Z-4 na G1 Z-4 F200 wszystkie błędy znikają, a frez bezpiecznie wykonuje rowek.',
    quiz: [
      {
        id: 'q_m1_14',
        questionPl: 'Który przycisk w symulatorze (i na prawdziwej maszynie w trybie Single Block) pozwala wykonać program pojedyncza linia po linii, aby bezpiecznie wyłapać błąd?',
        optionsPl: [
          'Przycisk pracy krokowej („Następna linia ▶” / Single Block)',
          'Przycisk przyspieszenia symulacji do 10x',
          'Wyłącznik oświetlenia kabiny',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Tryb krokowy (Single Block / Następna linia) wykonuje po jednym bloku programu naraz, co pozwala operatorowi skontrolować pozycję narzędzia przed wejściem w materiał.',
      },
    ],
  },
];
