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
      '1. INTERPOLACJA KOŁOWA: G2 (ZGODNIE Z ZEGAREM) I G3 (PRZECIWNIE DO ZEGARA)\nCzęści mechaniczne rzadko mają wyłącznie ostre naroża. Do jazdy po łuku kołowym służą dwa polecenia:\n• **G2** (Clockwise – CW): ruch po łuku zgodnie ze wskazówkami zegara.\n• **G3** (Counter-Clockwise – CCW): ruch po łuku przeciwnie do wskazówek zegara (patrząc z góry na stół w płaszczyźnie G17).',
      '2. DWA SPOSOBY OPISU ŁUKU: PROMIEŃ R ALBO WEKTORY ŚRODKA I, J\nW bloku `G2` lub `G3` zawsze podajemy współrzędne punktu KOŃCOWEGO łuku (`X`, `Y`) oraz informację o jego krzywiźnie na jeden z dwóch sposobów:\n• **Zapis promieniowy `R`** (np. `G3 X80 Y40 R20`): najwygodniejszy przy zaokrąglaniu naroży o kącie do 180°.\n• **Zapis wektorowy `I, J`** (np. `G3 X80 Y40 I0 J20`): gdzie `I` (wzdłuż X) oraz `J` (wzdłuż Y) to przyrostowe odległości od punktu POCZĄTKOWEGO łuku do ŚRODKA okręgu!',
      '3. KIEDY MUSIMY UŻYĆ I ORAZ J ZAMIAST R?\nZa pomocą parametru `R` nie da się zaprogramować pełnego okręgu 360° (ponieważ punkt startowy i końcowy są w tym samym miejscu, więc okrąg mógłby leżeć z dowolnej strony). Pełny okrąg 360° programujemy zawsze za pomocą wektorów `I` oraz `J`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G2', meaningPl: 'Ruch po łuku zgodnie z ruchem wskazówek zegara (CW)', examplePl: 'G2 X80 Y40 R20' },
      { codeOrSymbol: 'G3', meaningPl: 'Ruch po łuku przeciwnie do wskazówek zegara (CCW)', examplePl: 'G3 X80 Y40 R20' },
      { codeOrSymbol: 'R...', meaningPl: 'Promień łuku w milimetrach (dla łuków do 180°)', examplePl: 'R20 = łuk o promieniu 20 mm' },
      { codeOrSymbol: 'I... J...', meaningPl: 'Odległość w X (I) oraz w Y (J) od punktu startu łuku do środka okręgu', examplePl: 'I0 J20 = środek 20 mm powyżej punktu startu' },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku interpolacji łukowej G3:',
      lineCode: 'G3 X80 Y40 R20',
      parts: [
        { token: 'G3', explanationPl: 'Łuk przeciwnie do ruchu wskazówek zegara (CCW)' },
        { token: 'X80 Y40', explanationPl: 'Współrzędne punktu KOŃCOWEGO łuku' },
        { token: 'R20', explanationPl: 'Promień łuku równy 20 mm (równoważnie: I0 J20 ze startu X60 Y20)' },
      ],
    },
    stepByStepGuidePl: [
      'Narzędzie stoi na końcu dolnego odcinka w punkcie `X60 Y20` na głębokości `Z-4`.',
      'Pomiędzy linią `G1 X60 Y20 F350` a linią `G1 X80 Y60` dopisz blok łuku przeciwnie do zegara: `G3 X80 Y40 R20` (lub `G3 X80 Y40 I0 J20`).',
      'Zwróć uwagę, że w kolejnej linii (`G1 X80 Y60`) wracamy do `G1`, bo `G3` również jest kodem modalnym!',
      'Kliknij „✔ Sprawdź zadanie”.',
    ],
    commonMistakeWarningPl:
      'Po zakończeniu łuku `G2` lub `G3` koniecznie wpisz ponownie `G1` (lub `G0`) w kolejnej linii prostoliniowej! Jeśli o tym zapomnisz, sterownik spróbuje wykonać kolejny odcinek prosty jako łuk i zgłosi błąd promienia.',
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
      '1. TRYB BEZWZGLĘDNY G90 (ABSOLUTE POSITIONING)\nDo tej pory pracowaliśmy w trybie `G90` (wymiarowanie bezwzględne), w którym każda współrzędna `X, Y, Z` oznacza pozycję liczoną od stałego punktu zerowego przedmiotu `(0, 0, 0)`.',
      '2. TRYB PRZYROSTOWY G91 (INCREMENTAL POSITIONING)\nCzasami na rysunku wymiary podane są „łańcuchowo” (od jednego narożnika do następnego, np. „przesuń o +20 mm w prawo i +15 mm w górę”). Wtedy możemy przełączyć sterownik w tryb `G91`. W trybie `G91` wpisanie `G1 X20 Y15` oznacza: „przesuń narzędzie o 20 mm w X oraz o 15 mm w Y względem miejsca, w którym teraz stoisz”.',
      '3. ZASADA BEZPIECZEŃSTWA PO WYJŚCIU Z G91\nPo zakończeniu sekcji przyrostowej `G91` zawsze jak najszybciej wróć do trybu bezwzględnego `G90` przed wykonaniem odjazdu w osi Z (np. `G90 G0 Z20`), aby przypadkiem nie pomylić wysokości!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G90', meaningPl: 'Wymiarowanie bezwzględne (współrzędne liczone od zera detalu G54)', examplePl: 'G90 G0 X20 Y20' },
      { codeOrSymbol: 'G91', meaningPl: 'Wymiarowanie przyrostowe (przesunięcie liczone od aktualnej pozycji narzędzia)', examplePl: 'G91 G1 X20 Y0 (przesuń o +20 mm w X)' },
      { codeOrSymbol: 'G90 G0 Z20', meaningPl: 'Bezpieczny powrót do trybu bezwzględnego i wyjazd na Z = 20 mm', examplePl: 'Stosowany zawsze po zakończeniu sekwencji G91' },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór ruchu przyrostowego G91:',
      lineCode: 'G91 G1 X20 Y15 F350',
      parts: [
        { token: 'G91', explanationPl: 'Tryb przyrostowy (licz od bieżącego miejsca)' },
        { token: 'X20 Y15', explanationPl: 'Przesuń o +20 mm w prawo i +15 mm w głąb względem aktualnej pozycji' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym narzędzie w trybie `G91` dotarło już do punktu `(X60, Y35)`.',
      'Dopisz ruch o `+15 mm` w osi Y: `G1 X0 Y15` (dotrzesz do `X60 Y50`).',
      'Następnie dopisz ruch o `+20 mm` w osi X: `G1 X20 Y0` (dotrzesz do `X80 Y50`).',
      'Na końcu przywróć tryb bezwzględny i wyjedź w górę: `G90 G0 Z20`.',
    ],
    commonMistakeWarningPl:
      'Pozostawienie aktywnego `G91` pod koniec programu to klasyczna pułapka: jeśli w trybie `G91` wpiszesz `G0 Z-2`, a potem powtórzysz cykl w pętli, narzędzie za każdym razem będzie zjeżdżać o kolejne 2 mm głębiej!',
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
      '1. SKĄD MASZYNA WIE, GDZIE LEŻY DETAL? (TABELA G54–G59)\nPrzed uruchomieniem programu operator mierzy sondą położenie narożnika detalu i wpisuje je do tabeli punktów zerowych w sterowniku pod kodami od `G54` do `G59` (zajrzyj do karty „🛠 Tabele T / H / D / G54”!).',
      '2. PRACA NA WIELU IMADŁACH JEDNOCZEŚNIE\nStandardowo pierwsza sztuka korzysta z bazy `G54`. Jeśli na stole zamocujemy dwa imadła obok siebie (np. pierwsze w `G54`, a drugie przesunięte w prawo w `G55`), możemy wykonać obróbkę w `G54`, a następnie wpisać `G55` i powtórzyć dokładnie te same współrzędne na drugiej sztuce!',
      '3. CO ROBI SAMO WPISANIE G55?\nSamo wpisanie `G55` nie powoduje jeszcze fizycznego ruchu osi maszyny – przełącza jedynie układ odniesienia dla wszystkich kolejnych współrzędnych `X, Y, Z`.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G54', meaningPl: 'Pierwszy (podstawowy) układ współrzędnych przedmiotu obrabianego (WCS #1)', examplePl: 'G54 (domyślna baza w 90% programów)' },
      { codeOrSymbol: 'G55', meaningPl: 'Drugi układ współrzędnych przedmiotu (np. drugie imadło na stole)', examplePl: 'G55 G0 X30 Y40 Z5' },
      { codeOrSymbol: 'G56–G59', meaningPl: 'Kolejne bazy przedmiotowe od #3 do #6 w tabeli sterownika', examplePl: 'Stosowane przy obróbce wielostanowiskowej' },
    ],
    anatomyBreakdown: {
      titlePl: 'Przełączenie bazy na drugie imadło (G55):',
      lineCode: 'G55 G0 X30 Y40 Z5',
      parts: [
        { token: 'G55', explanationPl: 'Aktywuj drugi punkt zerowy przedmiotu z tabeli offsetów' },
        { token: 'G0 X30 Y40 Z5', explanationPl: 'Dojedź do punktu (30, 40, 5) liczonego już od narożnika drugiego detalu (G55)!' },
      ],
    },
    stepByStepGuidePl: [
      'Zauważ, że pierwsza operacja w bazie `G54` kończy się bezpiecznym odjazdem `G0 Z20`.',
      'Pod komentarzem zadania wpisz w nowej linii `G55`.',
      'W kolejnej linii wpisz `G0 X30 Y40 Z5` i kliknij „✔ Sprawdź zadanie”.',
    ],
    commonMistakeWarningPl:
      'Zawsze odjedź narzędziem wysoko w osi Z (`G0 Z20`) PRZED przełączeniem z `G54` na `G55` i ruchem w XY – inaczej frez przejedzie do drugiego imadła na wysokości obróbki, uderzając w szczęki!',
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
      '1. MAGAZYN NARZĘDZIOWY (TOOL MAGAZINE)\nFrezarka CNC posiada magazyn narzędziowy, w którym czeka kilka różnych narzędzi. W naszej maszynie (sprawdź kartę „🛠 Tabele T / H / D / G54”) mamy:\n• `T1`: Frez walcowo-czołowy Ø10 mm (długość H1 = 50 mm),\n• `T2`: Frez fazujący stożkowy Ø8 mm 90° (długość H2 = 45 mm),\n• `T3`: Wiertło kręte Ø6 mm (długość H3 = 60 mm),\n• `T4`: Frez walcowo-czołowy Ø6 mm (długość H4 = 40 mm).',
      '2. RÓŻNICA MIĘDZY SŁOWEM T A ROZKAZEM M6\nSamo wpisanie `T2` jedynie obraca karuzelę magazynu i przygotowuje narzędzie nr 2 do wymiany. Dopiero komenda `M6` (Tool Change) wykonuje fizyczną wymianę narzędzia we wrzecionie! Najczęściej zapisujemy je razem w jednym bloku: `T2 M6`.',
      '3. PROCEDURA BEZPIECZNEJ WYMIANY NARZĘDZIA\nZawsze przed wymianą narzędzia `M6` upewnij się, że poprzednie narzędzie wyjechało bezpiecznie w górę nad detal (`G0 Z30`), a po wymianie uruchom obroty `S... M3` i włącz korekcję długości dla nowego narzędzia (`G43 H2`).',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'T1..T4', meaningPl: 'Wybór numeru gniazda narzędzia w magazynie', examplePl: 'T2 = wybierz narzędzie nr 2' },
      { codeOrSymbol: 'M6', meaningPl: 'Fizyczna wymiana narzędzia we wrzecionie (Tool Change)', examplePl: 'T2 M6 = zamontuj narzędzie T2 we wrzecionie' },
      { codeOrSymbol: 'G43 H2', meaningPl: 'Włączenie korekcji długości dla narzędzia T2', examplePl: 'G43 H2 Z20' },
    ],
    anatomyBreakdown: {
      titlePl: 'Sekwencja wymiany narzędzia na T2:',
      lineCode: 'T2 M6',
      parts: [
        { token: 'T2', explanationPl: 'Wskaż narzędzie nr 2 (Frez fazujący Ø8 mm) w magazynie' },
        { token: 'M6', explanationPl: 'Wykonaj wymianę narzędzia we wrzecionie' },
      ],
    },
    stepByStepGuidePl: [
      'Po zakończeniu pracy narzędziem `T1` i odjeździe `G0 Z30` dopisz linię wymiany: `T2 M6`.',
      'W kolejnych liniach włącz obroty i korekcję długości dla T2: `S3500 M3` oraz `G43 H2 Z20`.',
      'Dojedź nad punkt nawiercenia fazy `G0 X50 Y20 Z5`, zjedź roboczo `G1 Z-3 F200` i wyjedź `G0 Z25`.',
    ],
    commonMistakeWarningPl:
      'Wpisanie samego `T2` bez `M6` to bardzo częsty błąd: program jedzie dalej starym narzędziem `T1`, które nadal tkwi we wrzecionie!',
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
      '1. DLACZEGO KAŻDE NARZĘDZIE WYSTAJE NA INNĄ DŁUGOŚĆ?\nKażde narzędzie zamocowane w oprawce wystaje z wrzeciona na inną długość fizyczną (nasze `T1` ma `50 mm`, `T2` ma `45 mm`, a długie wiertło `T3` aż `60 mm`). Bez włączonej korekcji długości (stan `G49`) sterownik traktuje współrzędną Z jako położenie CZOŁA WRZECIONA (Spindle Gauge Line). Gdybyś bez korekcji napisał `G0 Z10`, czoło wrzeciona zjechałoby na `Z10`, więc czubek 60-milimetrowego wiertła `T3` wbiłby się na `Z = -50 mm`, niszcząc detal i imadło!',
      '2. JAK DZIAŁA G43 H..?\nPolecenie `G43 H3` włącza dodatnią korekcję długości i pobiera z rejestru `H3` w sterowniku zmierzoną długość narzędzia `T3` (`60 mm`). Dzięki temu sterownik podnosi wrzeciono o 60 mm wyżej i wierzchołek wiertła (Tool Tip Center) trafia dokładnie w zaprogramowane Z!',
      '3. ZŁOTA ZASADA: NUMER T MUSI RÓWNAĆ SIĘ NUMEROWI H\nDla `T1` używamy `G43 H1`, dla `T2` używamy `G43 H2`, a dla `T3` używamy `G43 H3`.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G43 H...', meaningPl: 'Włączenie dodatniej korekcji długości narzędzia z rejestru H', examplePl: 'G43 H3 G0 Z10' },
      { codeOrSymbol: 'G49', meaningPl: 'Odwołanie korekcji długości (maszyna pozycjonuje samo czoło wrzeciona!)', examplePl: 'Nigdy nie zbliżaj się do detalu z aktywnym G49!' },
      { codeOrSymbol: 'T3 -> H3', meaningPl: 'Zgodność numeru narzędzia T z numerem rejestru wysokości H', examplePl: 'T3 M6 ... G43 H3' },
    ],
    anatomyBreakdown: {
      titlePl: 'Bezpieczny dojazd z aktywacją korekcji długości G43 H3:',
      lineCode: 'G43 H3 G0 X50 Y40 Z10',
      parts: [
        { token: 'G43', explanationPl: 'Włącz kompensację długości narzędzia' },
        { token: 'H3', explanationPl: 'Pobierz długość z rejestru nr 3 (60 mm dla wiertła T3)' },
        { token: 'G0 X50 Y40 Z10', explanationPl: 'Ustaw czubek wiertła bezpiecznie 10 mm nad płytką' },
      ],
    },
    stepByStepGuidePl: [
      'Zwróć uwagę na czerwoną kolizję w oknie 3D spowodowaną przez `G49 G0 X50 Y40 Z10`.',
      'W tej linii zamień słowo `G49` na `G43 H3` (ponieważ pracujemy wiertłem `T3`).',
      'Kliknij „✔ Sprawdź zadanie” i zobacz, że wiertło zatrzymuje się na `Z10` i wierci otwór na `Z-10`.',
    ],
    commonMistakeWarningPl:
      'Wpisanie `T3 M6`, a pod spodem zostawienie `G43 H1` (skopiowanego z pierwszego narzędzia) to najczęstsza przyczyna ciężkich kolizji na frezarkach CNC!',
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
      '1. PO CO NAM KOREKCJA PROMIENIA NARZĘDZIA (G41 / G42)?\nNasz frez `T1` ma średnicę `Ø10 mm`, czyli promień `R = 5 mm`. Gdyby środek frezu pojechał dokładnie po krawędzi wymiaru z rysunku, bok frezu zebrałby o 5 mm materiału za dużo! Zamiast ręcznie przeliczać wszystkie współrzędne na kartce, używamy korekcji promienia narzędzia (Cutter Radius Compensation).',
      '2. KODY G41 (LEWO), G42 (PRAWO) ORAZ G40 (ODWOŁANIE)\n• **G41 D1**: odsuwa narzędzie w **LEWO** od zaprogramowanego kierunku ruchu o promień z rejestru `D1` (`5 mm`). Gdy okrążamy zewnętrzny kontur kostki zgodnie ze wskazówkami zegara, lewa strona to właśnie strona zewnętrzna!\n• **G42 D1**: odsuwa narzędzie w **PRAWO** od kierunku ruchu.\n• **G40**: odwołuje korekcję promienia.',
      '3. ODCINEK DOJAZDOWY I WYJAZDOWY W RUCHU G1\nWłączenie korekcji (`G41`/`G42`) oraz jej odwołanie (`G40`) musi nastąpić na prostoliniowym odcinku dojazdowym `G1` (nie wolno włączać `G41` w ruchu szybkim `G0` ani w łuku `G2`/`G3`!). Na ekranie 3D zielona przerywana linia pokaże zaprogramowany kontur, a niebieska – odsuniętą ścieżkę środka frezu.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G41 D...', meaningPl: 'Korekcja promienia narzędzia LEWOSTRONNA (patrząc w kierunku ruchu)', examplePl: 'G1 G41 D1 X20 Y20 F350' },
      { codeOrSymbol: 'G42 D...', meaningPl: 'Korekcja promienia narzędzia PRAWOSTRONNA (patrząc w kierunku ruchu)', examplePl: 'G1 G42 D1 X20 Y20 F350' },
      { codeOrSymbol: 'G40', meaningPl: 'Odwołanie korekcji promienia (powrót środka frezu na linię programu)', examplePl: 'G1 G40 X5 Y5' },
    ],
    anatomyBreakdown: {
      titlePl: 'Włączenie korekcji lewostronnej na odcinku dojazdowym G1:',
      lineCode: 'G1 G41 D1 X20 Y20 F350',
      parts: [
        { token: 'G1', explanationPl: 'Prostoliniowy odcinek dojazdowy (Lead-in)' },
        { token: 'G41 D1', explanationPl: 'Odsuń oś frezu w lewo o promień z rejestru D1 (5 mm)' },
        { token: 'X20 Y20 F350', explanationPl: 'Punkt narożnika konturu i posuw skrawania' },
      ],
    },
    stepByStepGuidePl: [
      'Znajdź w edytorze linię dojazdową `G1 X20 Y20 F350`.',
      'Dopisz w niej `G41 D1`, aby otrzymać: `G1 G41 D1 X20 Y20 F350`.',
      'Przełącz kamerę na „Góra (XY)” i zobacz zielony kontur oraz odsuniętą o 5 mm niebieską ścieżkę środka frezu!',
    ],
    commonMistakeWarningPl:
      'Próba włączenia `G41` w ruchu szybkim `G0` lub zapomnienie o wyłączeniu `G40` przed podniesieniem osi Z wywoła alarm sterownika!',
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
      '1. PO CO STOSUJEMY CYKLE STAŁE WIERCENIA (CANNED CYCLES)?\nGdy mamy do wywiercenia 10 otworów, pisanie dla każdego z osobna dojazdu `G0`, wiercenia `G1` i wycofania `G0` byłoby żmudne. Dlatego sterowniki CNC mają wbudowane cykle wiertarskie:\n• **G81**: wiercenie zwykłe (wjazd w dół na Z i natychmiastowy wyjazd w górę),\n• **G82**: wiercenie z postojem czasowym `P` na dnie (wygładza dno otworu),\n• **G83**: wiercenie głębokie skokowe (Peck Drilling): wiertło wchodzi skokami co `Q` milimetrów i za każdym razem wycofuje się do góry, żeby wyrzucić wióry z otworu!',
      '2. PARAMETRY CYKLU (X, Y, Z, R, Q, F) ORAZ G98 / G99\nW wywołaniu cyklu podajemy: `X, Y` (środek pierwszego otworu), `Z` (dno otworu, np. `Z-15`), `R` (płaszczyznę bezpiecznego zbliżenia nad materiałem, np. `R2`), `Q` (skok dla `G83`, np. `Q5`) oraz `F` (posuw wiercenia). Kody `G98` (powrót do początkowego Z) i `G99` (powrót do poziomu R) sterują wysokością przejazdu między otworami.',
      '3. MODALNOŚĆ CYKLU I ODWOŁANIE G80\nCykl jest modalny! W kolejnych liniach wpisujesz TYLKO współrzędne kolejnych otworów (np. `X50 Y40`, `X80 Y40`), a maszyna sama wierci otwór w każdym punkcie! Po ostatnim otworze obowiązkowo odwołujemy cykl kodem `G80`.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G81 / G82 / G83', meaningPl: 'Cykle stałe wiercenia: zwykłe (G81), z postojem P (G82), głębokie skokowe co Q (G83)', examplePl: 'G98 G83 X20 Y40 Z-15 R2 Q5 F160' },
      { codeOrSymbol: 'G98 / G99', meaningPl: 'Wysokość wycofania między otworami: do Z początkowego (G98) lub do płaszczyzny R (G99)', examplePl: 'G98 = bezpiecznie wysoko nad łapami dociskowymi' },
      { codeOrSymbol: 'G80', meaningPl: 'Odwołanie (zakończenie) aktywnego cyklu wiertarskiego', examplePl: 'G80 (zawsze po ostatnim otworze!)' },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór cyklu wiercenia głębokiego G83:',
      lineCode: 'G98 G83 X20 Y40 Z-15 R2 Q5 F160',
      parts: [
        { token: 'G98 G83', explanationPl: 'Powrót do Z początkowego + cykl wiercenia skokowego' },
        { token: 'X20 Y40 Z-15', explanationPl: 'Pozycja pierwszego otworu i głębokość dna Z = -15 mm' },
        { token: 'R2 Q5 F160', explanationPl: 'Poziom zbliżenia R = 2 mm, skok łamania wióra Q = 5 mm, posuw F = 160 mm/min' },
      ],
    },
    stepByStepGuidePl: [
      'Pod linią `G98 G83 X20 Y40 Z-15 R2 Q5 F160` dopisz współrzędne drugiego otworu: `X50 Y40`.',
      'W kolejnej linii (przed `G80`) dopisz współrzędne trzeciego otworu: `X80 Y40`.',
      'Kliknij „✔ Sprawdź zadanie” i obejrzyj skokowe wiercenie wszystkich 3 otworów w 3D!',
    ],
    commonMistakeWarningPl:
      'Jeśli po ostatnim otworze zapomnisz wpisać `G80`, maszyna przy każdym kolejnym ruchu `X` lub `Y` będzie próbowała wywiercić niechciany otwór!',
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
      '1. KOMPLETNA TECHNOLOGIA TRZYNARZĘDZIOWA (T1 -> T2 -> T3)\nCzas połączyć poznane umiejętności w jeden program wielonarzędziowy! W prawdziwym warsztacie niemal każda część wymaga użycia kilku narzędzi po kolei.',
      '2. KOLEJNOŚĆ OPERACJI W TYM ZADANIU\n• **Narzędzie T1** (Frez walcowy Ø10 mm, `H1`): frezuje poziomy kanał od `(X25, Y40)` do `(X75, Y40)` na głębokości `Z = -5 mm`.\n• **Narzędzie T2** (Frez fazujący Ø8 mm, `H2`): wykonuje nawiercenie pod fazę w dwóch punktach `(X25, Y20)` oraz `(X75, Y20)` na głębokości `Z = -3 mm`.\n• **Narzędzie T3** (Wiertło Ø6 mm, `H3`): wierci w tych samych dwóch punktach `(X25, Y20)` oraz `(X75, Y20)` otwory na głębokość `Z = -14 mm`.',
      '3. STAŁY SCHEMAT BLOKU KAŻDEGO NARZĘDZIA\nBezpieczny odjazd w Z -> `T.. M6` -> `S.. M3 M8` -> `G43 H.. Z20` -> obróbka -> `G80` (jeśli był cykl) -> odjazd `G0 Z30 M9`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'T1 M6 ... G43 H1', meaningPl: 'Sekcja 1: Frez walcowy Ø10 mm', examplePl: 'Frezowanie kanału wzdłuż Y40' },
      { codeOrSymbol: 'T2 M6 ... G43 H2', meaningPl: 'Sekcja 2: Frez fazujący Ø8 mm (90°)', examplePl: 'Nawiercenie wejść pod otwory (Spot Drilling)' },
      { codeOrSymbol: 'T3 M6 ... G43 H3', meaningPl: 'Sekcja 3: Wiertło kręte Ø6 mm', examplePl: 'G98 G83 X25 Y20 Z-14 R2 Q5 F160' },
    ],
    stepByStepGuidePl: [
      'Na końcu programu dopisz wymianę na trzecie narzędzie i obroty: `T3 M6`, `S2400 M3 M8` oraz `G43 H3 Z20`.',
      'Uruchom cykl wiercenia głębokiego w pierwszym otworze: `G98 G83 X25 Y20 Z-14 R2 Q5 F160` i w kolejnej linii podaj drugi otwór: `X75 Y20`.',
      'Odwołaj cykl `G80`, odjedź `G0 Z30 M9` i zakończ program `M5` oraz `M30`.',
    ],
    commonMistakeWarningPl:
      'Zawsze wykonuj nawiercanie nawiertakiem/fazownikiem (`T2`) PRZED wierceniem długim wiertłem krętym (`T3`) – stożkowe zagłębienie centruje wiertło i zapobiega jego ześlizgnięciu na boki!',
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
      '1. JAK DIAGNOZOWAĆ BŁĘDY W PROGRAMIE CNC?\nNawet doświadczeni programiści CNC popełniają literówki. Dlatego zanim uruchomisz program na maszynie, sprawdzasz go w symulatorze, korzystając z karty „🔍 Diagnostyka” oraz przycisku pracy krokowej „Następna linia ▶”.',
      '2. TRZY NAJGROŹNIEJSZE BŁĘDY POCZĄTKUJĄCYCH\n1) Zjazd w materiał ruchem szybkim `G0` zamiast `G1` (błąd `RAPID_COLLISION_IN_MATERIAL`),\n2) Zapomnienie o włączeniu wrzeciona `M3` przed skrawaniem (błąd `SPINDLE_OFF_DURING_CUT`),\n3) Pominięcie korekcji długości `G43 H..` (błąd `MISSING_LENGTH_COMPENSATION`).',
      '3. ZADANIE DIAGNOSTYCZNE\nW edytorze poniżej znajduje się uszkodzony program zawierający dokładnie te 3 błędy! Zdiagnozuj je i napraw tak, aby wyfrezować odcinek od `(X20, Y50)` do `(X80, Y50)` na głębokości `Z = -4 mm` bez żadnego błędu.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'SPINDLE_OFF_DURING_CUT', meaningPl: 'Próba skrawania przy nieruchomym wrzecionie (brak S... M3)', examplePl: 'Rozwiązanie: dopisz S3000 M3 po wymianie T1 M6' },
      { codeOrSymbol: 'MISSING_LENGTH_COMPENSATION', meaningPl: 'Brak aktywnej korekcji długości narzędzia G43 H..', examplePl: 'Rozwiązanie: dopisz G43 H1 Z20 przed zjazdem do detalu' },
      { codeOrSymbol: 'RAPID_COLLISION_IN_MATERIAL', meaningPl: 'Wjazd w materiał ruchem szybkim G0 zamiast G1', examplePl: 'Rozwiązanie: zamień G0 Z-4 na G1 Z-4 F200' },
    ],
    stepByStepGuidePl: [
      'Otwórz zakładkę „🔍 Diagnostyka” i przeczytaj komunikaty błędów.',
      'Po linii `T1 M6` dopisz uruchomienie obrotów: `S3000 M3` oraz korekcję wysokości: `G43 H1 Z20`.',
      'Zamień błędną linię `G0 Z-4` na ruch roboczy z posuwem: `G1 Z-4 F200`, a następnie kliknij „✔ Sprawdź zadanie”.',
    ],
    commonMistakeWarningPl:
      'Nigdy nie ignoruj ostrzeżeń w zakładce „🔍 Diagnostyka” – nawet pojedynczy brak `M3` lub `G43` na prawdziwej maszynie kończy się złamaniem narzędzia w pierwszej sekundzie programu!',
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

  // =========================================================================
  // LEKCJA 1.15
  // =========================================================================
  {
    id: 'M1_15',
    moduleId: 'MODULE_1',
    orderIndex: 15,
    titlePl: 'Lekcja 1.15: Planowanie powierzchni czołowej „zygzakiem” (Face Milling)',
    shortSubtitlePl: 'Zbieranie równej warstwy naddatku z powierzchni detalu z zakładką boczną ae (Stepover)',
    theoryParagraphsPl: [
      '1. PO CO PLANUJEMY POWIERZCHNIĘ CZOŁOWĄ (FACE MILLING)?\nSurowa kostka ucięta na pile ma nierówną, utlenioną powierzchnię górną. Dlatego pierwszą operacją na frezarce jest zawsze **planowanie powierzchni czołowej** (zebranie cienkiej warstwy np. `1–2 mm` na całej szerokości), aby uzyskać idealnie płaską bazę `Z = 0`.',
      '2. SZEROKOŚĆ SKRAWANIA ae (STEPOVER) – DLACZEGO PRZEJAZDY MUSZĄ NA SIEBIE NACHODZIĆ?\nNasz frez `T1` ma średnicę `Ø10 mm`. Gdybyśmy robili przejazdy równoległe dokładnie co `10 mm`, pomiędzy ścieżkami zostałyby cienkie grzbiety („grzebienie”) nieskrawanego metalu. Dlatego w przemyśle stosuje się zakładkę boczną `ae = 60%–80%` średnicy frezu (dla frezu `Ø10 mm` przesuwamy się w osi Y co `8 mm`!).',
      '3. STRATEGIA ZYGZAK (ZIG-ZAG) I ZJAZD POZA MATERIAŁEM\nW planowaniu narzędzie wjeżdża na głębokość `Z-2` poza obrysem lub przy krawędzi, jedzie w prawo (`X85`), przesuwa się o krok boczny w Y (`+8 mm`), wraca w lewo (`X15`), znów przesuwa się w Y (`+8 mm`) i jedzie w prawo (`X85`).',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'ae (Stepover)', meaningPl: 'Szerokość skrawania (krok boczny między równoległymi przejściami frezu)', examplePl: 'Dla frezu Ø10 mm stosujemy krok boczny 7–8 mm (70–80% D)' },
      { codeOrSymbol: 'ap (Depth of Cut)', meaningPl: 'Głębokość skrawania w osi Z podczas jednego przejścia', examplePl: 'G1 Z-2 F200 (zebranie warstwy 2 mm)' },
      { codeOrSymbol: 'Strategia Zig-Zag', meaningPl: 'Frezowanie naprzemienne w prawo (X+) i w lewo (X-) po przesunięciu o krok w Y', examplePl: 'X85 -> Y40 -> X15 -> Y48 -> X85' },
    ],
    anatomyBreakdown: {
      titlePl: 'Przejście równoległe z krokiem bocznym 8 mm w osi Y:',
      lineCode: 'G1 Y40 F400',
      parts: [
        { token: 'G1 Y40', explanationPl: 'Przesunięcie boczne z Y32 na Y40 (krok ae = 8 mm, czyli 80% średnicy frezu Ø10)' },
        { token: 'F400', explanationPl: 'Posuw roboczy planowania' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym frez wykonał tylko pierwsze przejście wzdłuż `Y32` (od `X15` do `X85` na głębokości `Z-2`).',
      'Dopisz przesunięcie boczne na środek płytki `G1 Y40 F400` i przejazd powrotny w lewo: `G1 X15 Y40`.',
      'Następnie dopisz kolejny krok boczny `G1 Y48` i przejazd w prawo: `G1 X85 Y48`, po czym kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Nigdy nie ustawiaj kroku bocznego `ae` równego 100% średnicy frezu – każde minimalne bicie oprawki zostawi na powierzchni wyczuwalny pod palcem próg!',
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.15: Planowanie powierzchni czolowej zygzakiem na Z-2)
G21 G90 G17 G54
T1 M6
S3200 M3 M8
G43 H1 Z20

(Wejscie na Z-2 i pierwsze przejscie wzdluz Y32 od X15 do X85)
G0 X15 Y32 Z5
G1 Z-2 F200
G1 X85 Y32 F400

(ZADANIE: Wykonaj kolejne dwa przejscia zygzakiem co 8 mm w osi Y:)
(1. Przesun sie na Y40 i przejedz w lewo do X15 Y40)
(2. Przesun sie na Y48 i przejedz w prawo do X85 Y48)


G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'Dokończ planowanie środkowego pasa płytki na głębokości Z = -2 mm strategią zygzak (z krokiem bocznym 8 mm w osi Y): z punktu (X85, Y32) przejdź na Y40 i przefrezuj pas do (X15, Y40), a następnie przejdź na Y48 i przefrezuj pas do (X85, Y48).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Planowanie wykonane bez błędów i kolizji',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 40 },
        expectedZMm: -2,
        toleranceMm: 0.5,
        descriptionPl: 'Środek płytki (X50 Y40) został splanowany na wysokość Z = -2 mm',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 48 },
        expectedZMm: -2,
        toleranceMm: 0.5,
        descriptionPl: 'Trzeci pas (X50 Y48) został splanowany na wysokość Z = -2 mm',
      },
      {
        kind: 'MINIMUM_REMOVED_VOLUME',
        minVolumeMm3: 3000,
        descriptionPl: 'Zebrano co najmniej 3000 mm³ materiału podczas planowania trzech pasów',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Stoisz w X85 Y32 na Z-2. Najpierw przesuń się na drugi pas: G1 Y40 F400, a potem jedź w lewo: G1 X15 Y40.',
      'Podpowiedź 2/3: Teraz przesuń się na trzeci pas: G1 Y48, a potem jedź w prawo: G1 X85 Y48.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20 M9” cztery linie:\nG1 Y40 F400\nG1 X15 Y40\nG1 Y48\nG1 X85 Y48',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3200 M3 M8
G43 H1 Z20
G0 X15 Y32 Z5
G1 Z-2 F200
G1 X85 Y32 F400
G1 Y40 F400
G1 X15 Y40
G1 Y48
G1 X85 Y48
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Trzy nakładające się przejścia (na Y32, Y40 i Y48) frezem Ø10 mm tworzą idealnie płaską powierzchnię na głębokości Z = -2 mm bez pozostawiania grzbietów między ścieżkami.',
    quiz: [
      {
        id: 'q_m1_15',
        questionPl: 'Dlaczego podczas planowania powierzchni frezem Ø10 mm kolejne przejścia równoległe przesuwamy o ok. 7–8 mm zamiast o pełne 10 mm?',
        optionsPl: [
          'Aby sąsiednie przejścia nachodziły na siebie (zakładka ae) i nie pozostawiały nieskrawanych grzbietów na powierzchni',
          'Ponieważ maszyna nie potrafi przesuwać się o liczby dziesiętne',
          'Aby wydłużyć czas postoju wrzeciona',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Szerokość skrawania ae na poziomie 70–80% średnicy narzędzia gwarantuje gładkie połączenie sąsiednich ścieżek.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.16
  // =========================================================================
  {
    id: 'M1_16',
    moduleId: 'MODULE_1',
    orderIndex: 16,
    titlePl: 'Lekcja 1.16: Frezowanie kieszeni prostokątnej (Pocket Milling)',
    shortSubtitlePl: 'Wybieranie materiału od środka na zewnątrz na głębokość Z = -5 mm',
    theoryParagraphsPl: [
      '1. CZYM RÓŻNI SIĘ KIESZEŃ (POCKET) OD OBWODU?\nGdy wycinamy sam obwód dużej ramki, w środku zostaje niewycięta „wyspa” metalu! Aby wybrać całą zamkniętą wnękę (kieszeń prostokątną), frez musi najpierw wybrać materiał ze środka, a następnie objechać ścianki boczne kieszeni.',
      '2. STRATEGIA OD ŚRODKA NA ZEWNĄTRZ (INSIDE-OUT SPIRAL)\nNajbezpieczniejsza metoda wybierania kieszeni polega na zagłębieniu się w pobliżu środka kieszeni (`X50 Y40`), a następnie zataczaniu coraz szerszych pętli prostokątnych aż do docelowego wymiaru ścianek.',
      '3. ZADANIE PRAKTYCZNE\nW kodzie startowym frez `T1` (`Ø10 mm`) wszedł w środek kieszeni `(X35..X65, Y40)` na głębokość `Z = -5 mm`. Dopisz obwiedniowy objazd poszerzający kieszeń po prostokącie: `(X30, Y32)` -> `(X70, Y32)` -> `(X70, Y48)` -> `(X30, Y48)` -> `(X30, Y32)`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Pocket Milling', meaningPl: 'Frezowanie kieszeni (wybieranie całego materiału z wnętrza zamkniętego konturu)', examplePl: 'Rozpoczęcie od środka i rozszerzanie pętli na zewnątrz' },
      { codeOrSymbol: 'Środek -> Obwód', meaningPl: 'Usunięcie rdzenia środkowego zapobiega zakleszczeniu odpadu w kieszeni', examplePl: 'Najpierw przejazd przez Y40, potem pętla Y32..Y48' },
    ],
    anatomyBreakdown: {
      titlePl: 'Zamknięcie zewnętrznej pętli kieszeni na głębokości Z-5:',
      lineCode: 'G1 X70 Y48 F380',
      parts: [
        { token: 'G1', explanationPl: 'Ruch roboczy na stałej głębokości Z = -5 mm' },
        { token: 'X70 Y48', explanationPl: 'Prawy górny narożnik ścieżki środka frezu w kieszeni' },
        { token: 'F380', explanationPl: 'Posuw roboczy przy wybieraniu kieszeni' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym frez wybrał już środkowy rdzeń kieszeni od `X30 Y40` do `X70 Y40` na głębokości `Z-5` i przesunął się do narożnika `X70 Y32`.',
      'Dopisz dolną ściankę kieszeni: `G1 X30 Y32 F380`.',
      'Dopisz lewą ściankę: `G1 X30 Y48` oraz górną ściankę: `G1 X70 Y48` i zamknij obwód `G1 X70 Y32`.',
      'Kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Gdybyś objechał sam obwód dużej kieszeni bez wybrania jej środka, odcięty w środku kawałek metalu zostałby wyrwany przez obracający się frez i złamałby narzędzie!',
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.16: Frezowanie kieszeni prostokatnej od srodka na zewnatrz na Z-5)
G21 G90 G17 G54
T1 M6
S3200 M3 M8
G43 H1 Z20

(1. Wybranie srodkowego rdzenia kieszeni wzdluz Y40 na Z-5)
G0 X30 Y40 Z5
G1 Z-5 F180
G1 X70 Y40 F380
G1 X70 Y32

(2. ZADANIE: Objedz petle zewnetrzna kieszeni na Z-5:)
(   do X30 Y32 -> do X30 Y48 -> do X70 Y48 -> zamknij w X70 Y32!)


G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'Po wybraniu środkowego rdzenia kieszeni (wzdłuż Y40 na głębokości Z = -5 mm) dokończ zewnętrzną pętlę kieszeni prostokątnej, prowadząc frez przez punkty: (X30, Y32) -> (X30, Y48) -> (X70, Y48) -> (X70, Y32).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Kieszeń wybrana bez błędów i kolizji',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 40 },
        expectedZMm: -5,
        toleranceMm: 0.5,
        descriptionPl: 'Środek kieszeni (X50 Y40) ma dno na Z = -5 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 48, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wybrano lewy górny narożnik kieszeni (X30 Y48 Z-5)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 48, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wybrano prawy górny narożnik kieszeni (X70 Y48 Z-5)',
      },
      {
        kind: 'MINIMUM_REMOVED_VOLUME',
        minVolumeMm3: 5000,
        descriptionPl: 'Usunięto pełną objętość materiału kieszeni (min. 5000 mm³)',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Narzędzie stoi w prawym dolnym narożniku pętli (X70 Y32 Z-5). Pojedź w lewo: G1 X30 Y32 F380.',
      'Podpowiedź 2/3: Następnie pojedź w górę: G1 X30 Y48 oraz w prawo: G1 X70 Y48.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20 M9” linie:\nG1 X30 Y32 F380\nG1 X30 Y48\nG1 X70 Y48\nG1 X70 Y32',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3200 M3 M8
G43 H1 Z20
G0 X30 Y40 Z5
G1 Z-5 F180
G1 X70 Y40 F380
G1 X70 Y32
G1 X30 Y32 F380
G1 X30 Y48
G1 X70 Y48
G1 X70 Y32
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Wybieranie od środka (Y40) na zewnątrz (Y32..Y48) usuwa najpierw rdzeń materiału, a następnie obrabia obwód kieszeni na pełną głębokość Z = -5 mm.',
    quiz: [
      {
        id: 'q_m1_16',
        questionPl: 'Dlaczego przy frezowaniu zamkniętej kieszeni zaczynamy wybieranie od środka i rozszerzamy ścieżkę ku ściankom zewnętrznym?',
        optionsPl: [
          'Aby wyfrezować całą objętość wnęki i nie pozostawić w środku luźnego odciętego rdzenia metalu',
          'Ponieważ frez nie potrafi skręcać w pobliżu krawędzi płytki',
          'Aby zmniejszyć prędkość obrotową wrzeciona',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Strategia od środka na zewnątrz (Inside-Out) zamienia cały materiał kieszeni w bezpieczne wióry i chroni narzędzie przed zakleszczeniem odpadu.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.17
  // =========================================================================
  {
    id: 'M1_17',
    moduleId: 'MODULE_1',
    orderIndex: 17,
    titlePl: 'Lekcja 1.17: Interpolacja śrubowa – wejście po helisie (G3 X.. Y.. I.. J.. Z..)',
    shortSubtitlePl: 'Jak łagodnie wkręcać się frezem w lity metal po spirali bez pionowego wbijania',
    theoryParagraphsPl: [
      '1. DLACZEGO FREZY NIE LUBIĄ PIONOWEGO WBIJANIA (PLUNGING)?\nFrez walcowo-czołowy (End Mill) to nie wiertło! Na samym środku swojego czoła ma znacznie gorsze odprowadzanie wiórów. Pionowe wbijanie się frezem prosto w dół w stal lub twarde aluminium wywołuje ogromny opór i przegrzewa ostrza.',
      '2. INTERPOLACJA ŚRUBOWA (HELICAL INTERPOLATION – HELISA)\nZamiast wbijać się pionowo, przemysłowi programiści stosują **wejście śrubowe po helisie**: w jednym bloku łączymy pełny okrąg `G3` (lub `G2`) z jednoczesnym zjazdem w osi `Z`, np.:\n`G3 X60 Y40 I-10 J0 Z-4 F250`\nNarzędzie zatacza okrąg wokół punktu `(X50, Y40)` i jednocześnie płynnie schodzi po łagodnej pochylni od `Z0` do `Z-4`!',
      '3. WYRÓWNANIE DNA PO HELISIE\nPo wkręceniu się helisą na docelową głębokość `Z-4` wykonujemy jeszcze jeden pełny okrąg na stałej wysokości `Z-4` (`G3 X60 Y40 I-10 J0 F350`), aby wyrównać pochyłe dno kieszeni kołowej.',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G3 X.. Y.. I.. J.. Z..', meaningPl: 'Interpolacja śrubowa (jednoczesny ruch po okręgu XY i zjazd w osi Z)', examplePl: 'G3 X60 Y40 I-10 J0 Z-4 F250' },
      { codeOrSymbol: 'Skok helisy (Pitch)', meaningPl: 'Obniżenie w osi Z przypadające na jeden pełny obrót 360°', examplePl: 'Zjazd z Z0 na Z-4 w jednym obrocie = skok 4 mm/obrót' },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku interpolacji śrubowej (helisy 360°):',
      lineCode: 'G3 X60 Y40 I-10 J0 Z-4 F250',
      parts: [
        { token: 'G3 X60 Y40', explanationPl: 'Pełny obrót CCW wracający do punktu (60, 40) w XY' },
        { token: 'I-10 J0', explanationPl: 'Środek okręgu leży 10 mm w lewo (w X50 Y40)' },
        { token: 'Z-4', explanationPl: 'Jednoczesne płynne obniżenie osi Z do -4 mm podczas zataczania okręgu!' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym frez dojechał do punktu `(X60, Y40)` i dotknął powierzchni `Z0`.',
      'Dopisz wejście śrubowe po helisie na głębokość `Z-4`: `G3 X60 Y40 I-10 J0 Z-4 F250`.',
      'W kolejnej linii dopisz pełny okrąg wyrównujący dno na `Z-4`: `G3 X60 Y40 I-10 J0 F350` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Pamiętaj, że przy pełnym obrocie 360° po helisie musimy użyć wektorów środka `I, J` (nie `R`), ponieważ współrzędne `X, Y` początku i końca obrotu są takie same!',
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.17: Interpolacja srubowa - wejscie po helisie G3 z osia Z)
G21 G90 G17 G54
T1 M6
S3400 M3 M8
G43 H1 Z20

(Dojazd do punktu startowego okregu X60 Y40 i zblizenie do powierzchni Z0)
G0 X60 Y40 Z5
G1 Z0 F200

(ZADANIE: Wkrec sie po helisie G3 o pelny obrot do X60 Y40 ze srodkiem I-10 J0 na glebokosc Z-4,)
(a nastepnie wykonaj drugi obrot G3 X60 Y40 I-10 J0 na stalej glebokosci Z-4, aby wyrownac dno!)


G1 X50 Y40 F300
G0 Z20 M9
M5
M30`,
    taskDescriptionPl:
      'Z punktu (X60, Y40, Z0) wykonaj wejście śrubowe (helisę) przeciwnie do wskazówek zegara (G3) wokół środka (X50, Y40 – czyli z wektorem I-10 J0) schodząc na głębokość Z = -4 mm, a następnie wykonaj pełny okrąg wyrównujący dno na Z = -4 mm.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Helisa wykonana płynnie bez błędów i kolizji',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CCW',
        expectedRadiusMm: 10,
        toleranceMm: 0.5,
        descriptionPl: 'Użyto ruchu kołowego/śrubowego G3 o promieniu 10 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 40, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wyrównano dno kieszeni kołowej na pełnej głębokości Z = -4 mm (przejście przez X40 Y40 Z-4)',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Pierwszy obrót schodzi z Z0 na Z-4: wpisz „G3 X60 Y40 I-10 J0 Z-4 F250”.',
      'Podpowiedź 2/3: Drugi obrót jedzie płasko na Z-4, aby wyrównać dno: wpisz „G3 X60 Y40 I-10 J0 F350”.',
      'Podpowiedź 3/3: Dopisz przed „G1 X50 Y40 F300” dwie linie:\nG3 X60 Y40 I-10 J0 Z-4 F250\nG3 X60 Y40 I-10 J0 F350',
    ],
    solutionCode: `G21 G90 G17 G54
T1 M6
S3400 M3 M8
G43 H1 Z20
G0 X60 Y40 Z5
G1 Z0 F200
G3 X60 Y40 I-10 J0 Z-4 F250
G3 X60 Y40 I-10 J0 F350
G1 X50 Y40 F300
G0 Z20 M9
M5
M30`,
    solutionExplanationPl:
      'Pierwszy blok G3 z parametrem Z-4 tworzy śrubową rampę wejściową (helisę), a drugi blok G3 na stałej wysokości Z-4 wybiera pochyłą resztkę materiału z dna.',
    quiz: [
      {
        id: 'q_m1_17',
        questionPl: 'Jaka jest główna zaleta wejścia w materiał po linii śrubowej (helisie G2/G3 z osią Z) w porównaniu z pionowym wbijaniem się frezu?',
        optionsPl: [
          'Frez zagłębia się łagodnie pod małym kątem i swobodnie wyrzuca wióry na boki, co drastycznie zmniejsza obciążenie ostrzy',
          'Pozwala skrawać przy wyłączonym wrzecionie M5',
          'Zastępuje wymianę narzędzia M6',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Wejście po helisie (Helical Ramping) to podstawowa technika przemysłowa chroniąca czoło frezu przed przegrzaniem i wykruszeniem.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 1.18
  // =========================================================================
  {
    id: 'M1_18',
    moduleId: 'MODULE_1',
    orderIndex: 18,
    titlePl: 'Lekcja 1.18: Fazowanie ostrych krawędzi konturu frezem stożkowym T2 (Chamfering)',
    shortSubtitlePl: 'Jak gratować i ścinać krawędzie na gotowo bezpośrednio na maszynie CNC',
    theoryParagraphsPl: [
      '1. DLACZEGO FAZUJEMY KRAWĘDZIE NA MASZYNIE CNC?\nJak pamiętasz z Modułu 0, niewykończona krawędź po frezie walcowym jest ostra jak brzytwa i ma zadziory (Burrs). Zamiast skrobać każdą sztukę ręcznie pilnikiem, używamy **frezu fazującego stożkowego 90° (`T2`)**, który objeżdża krawędź i zostawia idealną, równą fazkę (np. `1.5 × 45°`).',
      '2. PROWADZENIE STOŻKA PO KRAWĘDZI\nPonieważ frez `T2` ma stożkowy czubek o kącie `90°` (`45°` na stronę), zagłębienie go na `Z = -1.5 mm` wzdłuż krawędzi ścina narożnik pod kątem `45°`!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze narzędzie `T2` (`G43 H2`) wykonało już fazę wzdłuż dolnej krawędzi od `(X20, Y20)` do `(X80, Y20)` na głębokości `Z = -1.5 mm`. Dopisz fazowanie prawej krawędzi do `(X80, Y60)` oraz górnej krawędzi do `(X20, Y60)`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'T2 (Chamfer Mill 90°)', meaningPl: 'Frez stożkowy do wykonywania faz 45° i gratowania krawędzi', examplePl: 'T2 M6 ... G43 H2' },
      { codeOrSymbol: 'C1.5 (1.5 × 45°)', meaningPl: 'Faza o szerokości 1.5 mm pod kątem 45°', examplePl: 'G1 Z-1.5 F200' },
    ],
    anatomyBreakdown: {
      titlePl: 'Fazowanie krawędzi frezem stożkowym T2:',
      lineCode: 'G1 X80 Y60 F450',
      parts: [
        { token: 'G1 X80 Y60', explanationPl: 'Przejazd stożkiem T2 wzdłuż prawej krawędzi na głębokości Z = -1.5 mm' },
        { token: 'F450', explanationPl: 'Wyższy posuw wykańczający zapewniający gładką fazkę bez przypaleń' },
      ],
    },
    stepByStepGuidePl: [
      'Narzędzie `T2` stoi na końcu dolnej fazy w punkcie `X80 Y20` na głębokości `Z-1.5`.',
      'Dopisz fazowanie prawej krawędzi w górę: `G1 X80 Y60 F450`.',
      'Dopisz fazowanie górnej krawędzi w lewo: `G1 X20 Y60` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Przy fazowaniu zawsze upewnij się, że aktywny jest rejestr wysokości `H2` dla frezu fazującego `T2` – pomyłka w osi Z nawet o `1 mm` sprawi, że faza będzie dwa razy szersza niż na rysunku!',
    machineConfig: MILL_3AXIS_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 0,
    starterCode: `(Lekcja 1.18: Fazowanie ostrych krawedzi konturu frezem stozkowym T2)
G21 G90 G17 G54
T2 M6 (Frez fazujacy fi 8 mm 90 stopni)
S4000 M3 M8
G43 H2 Z20

(Wejscie na Z-1.5 i fazowanie dolnej krawedzi od X20 Y20 do X80 Y20)
G0 X20 Y20 Z5
G1 Z-1.5 F200
G1 X80 Y20 F450

(ZADANIE: Dokończ fazowanie prawej krawędzi do X80 Y60)
(oraz górnej krawędzi do X20 Y60 na głębokości Z-1.5!)


G0 Z25 M9
M5
M30`,
    taskDescriptionPl:
      'Używając narzędzia T2 (Frez fazujący 90°, G43 H2) na głębokości Z = -1.5 mm, dokończ fazowanie konturu z punktu (X80, Y20) przez punkt (X80, Y60) do punktu (X20, Y60).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Fazowanie wykonane bez błędów i kolizji',
      },
      {
        kind: 'USED_TOOL_POCKETS',
        requiredPockets: [2],
        requireInOrder: false,
        descriptionPl: 'Użyto frezu fazującego T2',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 60, z: -1.5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Sfazowano prawą krawędź do narożnika X80 Y60 na Z = -1.5 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 20, y: 60, z: -1.5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Sfazowano górną krawędź do narożnika X20 Y60 na Z = -1.5 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Stoisz w X80 Y20 na Z-1.5. Pojedź wzdłuż prawej krawędzi: G1 X80 Y60 F450.',
      'Podpowiedź 2/3: Następnie pojedź wzdłuż górnej krawędzi: G1 X20 Y60.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z25 M9” dwie linie:\nG1 X80 Y60 F450\nG1 X20 Y60',
    ],
    solutionCode: `G21 G90 G17 G54
T2 M6
S4000 M3 M8
G43 H2 Z20
G0 X20 Y20 Z5
G1 Z-1.5 F200
G1 X80 Y20 F450
G1 X80 Y60 F450
G1 X20 Y60
G0 Z25 M9
M5
M30`,
    solutionExplanationPl:
      'Stożkowy frez fazujący T2 prowadzony na głębokości Z = -1.5 mm ścina ostre krawędzie pod kątem 45°, dzięki czemu detal wychodzi z maszyny bezpieczny i gotowy do montażu.',
    quiz: [
      {
        id: 'q_m1_18',
        questionPl: 'Dlaczego szerokość fazy wykonywanej frezem stożkowym 90° (T2) zależy bezpośrednio od głębokości zejścia w osi Z?',
        optionsPl: [
          'Ponieważ ścianka boczna stożka jest nachylona pod kątem 45°, więc każde 1 mm głębiej w Z poszerza ścięcie krawędzi',
          'Ponieważ frez T2 zmienia swoją średnicę pod wpływem chłodziwa M8',
          'Szerokość fazy nie zależy od osi Z',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Przy kącie wierzchołkowym 90° (45° na stronę) zagłębienie stożka w osi Z przekłada się w stosunku 1:1 na szerokość ścięcia krawędzi.',
      },
    ],
  },
];
