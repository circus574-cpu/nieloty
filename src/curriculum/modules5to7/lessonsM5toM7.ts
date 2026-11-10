/**
 * Kompletne scenariusze lekcji dla Modułów 5, 6 i 7 (12 interaktywnych lekcji z zadaniami 3D):
 * - Moduł 5 (M5_01..M5_04): Wycinarka Laserowa / Plazmowa / Waterjet 2D CNC (LASER_CUTTER)
 *   Przebijanie blachy (Piercing G04 P...), wejścia/wyjścia styczne (Lead-in / Lead-out),
 *   kompensacja szerokości szczeliny cięcia (Kerf G41/G42) oraz kolejność wycinania (Nesting).
 * - Moduł 6 (M6_01..M6_04): Ploter bramowy CNC / Router do drewna, kompozytów i aluminium (GANTRY_ROUTER)
 *   Wysokie obroty wrzeciona (24 000 RPM), grawerowanie stożkowe V-Bit (V-Carving),
 *   mostki trzymające wycinany detal (Holding Tabs) oraz rozkrój wielowarstwowy (Step-down).
 * - Moduł 7 (M7_01..M7_04): Centrum Tokarsko-Frezarskie Mill-Turn (oprawki napędzane Live Tooling + oś C i oś Y)
 *   Przełączanie wrzeciona w oś C, wiercenie po okręgu podziałowym (G81 + oś C),
 *   frezowanie sześciokąta pod klucz (oś Y + oś C) oraz rowek śrubowy na walcu (X/Y/Z + C).
 */

import {
  DEFAULT_MILL_STOCK,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../../core/machines/presets';
import type { LessonDefinition } from '../../core/types/curriculum';
import type {
  MachineConfig,
  PrismaticStock,
  ToolDefinition,
  ToolOffsetRegister,
} from '../../core/types/machine';

/** Arkusz blachy stalowej 100 x 80 x 6 mm na ruszcie grzebieniowym dla Wycinarki Laserowej / Plazmowej */
export const LASER_SHEET_STOCK: PrismaticStock = {
  kind: 'PRISMATIC',
  sizeXMm: 100,
  sizeYMm: 80,
  sizeZMm: 6,
  minCornerInWcs: { x: 0, y: 0, z: -6 },
  materialName: 'Blacha stalowa S235JR (grubość 6 mm)',
};

/** Płyta meblowa / sklejka / kompozyt 100 x 80 x 12 mm na płycie podkładowej MDF dla Plotera Bramowego */
export const ROUTER_PANEL_STOCK: PrismaticStock = {
  kind: 'PRISMATIC',
  sizeXMm: 100,
  sizeYMm: 80,
  sizeZMm: 12,
  minCornerInWcs: { x: 0, y: 0, z: -12 },
  materialName: 'Płyta sklejka brzozowa / kompozyt Alu-Dibond (12 mm)',
};

const LASER_TOOLS: ToolDefinition[] = [
  {
    pocketNumber: 1,
    name: 'Głowica Laserowa Fiber / Plazmowa (szczelina Kerf Ø2 mm)',
    type: 'LASER_NOZZLE',
    diameterMm: 2,
    lengthMm: 40,
    flutesCount: 1,
    maxPlungeDepthMm: 10,
  },
  {
    pocketNumber: 2,
    name: 'Dysza Plazmowa HD (szczelina Kerf Ø4 mm)',
    type: 'LASER_NOZZLE',
    diameterMm: 4,
    lengthMm: 40,
    flutesCount: 1,
    maxPlungeDepthMm: 15,
  },
];

const LASER_OFFSETS: ToolOffsetRegister[] = [
  {
    registerNumber: 1,
    lengthOffsetMm: 40,
    lengthWearMm: 0,
    radiusOffsetMm: 1,
    radiusWearMm: 0,
  },
  {
    registerNumber: 2,
    lengthOffsetMm: 40,
    lengthWearMm: 0,
    radiusOffsetMm: 2,
    radiusWearMm: 0,
  },
];

/** Konfiguracja maszyny dla Modułu 5: Wycinarka Laserowa / Plazmowa / Waterjet 2D CNC */
export const LASER_CUTTER_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'laser-plasma-2d-edu',
  name: 'Wycinarka Laserowa / Plazmowa 2D CNC (Moduł 5)',
  kinematics: 'LASER_CUTTER',
  tools: LASER_TOOLS,
  toolOffsets: LASER_OFFSETS,
};

const ROUTER_TOOLS: ToolDefinition[] = [
  {
    pocketNumber: 1,
    name: 'Frez spiralny 1-ostrzowy VHM Ø6 mm (do płyt i Alu)',
    type: 'FLAT_ENDMILL',
    diameterMm: 6,
    lengthMm: 45,
    flutesCount: 1,
    maxPlungeDepthMm: 12,
  },
  {
    pocketNumber: 2,
    name: 'Frez grawerski stożkowy V-Bit Ø10 mm (kąt 90°)',
    type: 'V_BIT',
    diameterMm: 10,
    lengthMm: 40,
    flutesCount: 2,
    pointAngleDeg: 90,
    maxPlungeDepthMm: 5,
  },
];

const ROUTER_OFFSETS: ToolOffsetRegister[] = [
  {
    registerNumber: 1,
    lengthOffsetMm: 45,
    lengthWearMm: 0,
    radiusOffsetMm: 3,
    radiusWearMm: 0,
  },
  {
    registerNumber: 2,
    lengthOffsetMm: 40,
    lengthWearMm: 0,
    radiusOffsetMm: 5,
    radiusWearMm: 0,
  },
];

/** Konfiguracja maszyny dla Modułu 6: Ploter bramowy CNC (Gantry Router) */
export const GANTRY_ROUTER_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'gantry-router-edu',
  name: 'Ploter Bramowy CNC / Router 24000 RPM (Moduł 6)',
  kinematics: 'GANTRY_ROUTER',
  limits: {
    ...MILL_3AXIS_MACHINE.limits,
    maxSpindleRpm: 24000,
    maxFeedRateMmPerMin: 8000,
  },
  tools: ROUTER_TOOLS,
  toolOffsets: ROUTER_OFFSETS,
};

/** Konfiguracja maszyny dla Modułu 7: Centrum Tokarsko-Frezarskie Mill-Turn (oś C + oś Y) */
export const MILL_TURN_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'mill-turn-cy-edu',
  name: 'Centrum Tokarsko-Frezarskie Mill-Turn – osie C + Y (Moduł 7)',
  kinematics: 'MILL_TURN',
  limits: {
    ...MILL_3AXIS_MACHINE.limits,
    a: { min: -180, max: 180 },
    c: { min: -360, max: 360 },
  },
};

// ============================================================================
// MODUŁ 5: WYCINARKA LASEROWA / PLAZMOWA / WATERJET 2D CNC
// ============================================================================
export const MODULE_5_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 5.1
  // ==========================================================================
  {
    id: 'M5_01',
    moduleId: 'MODULE_5',
    orderIndex: 1,
    titlePl: 'Lekcja 5.1: Wycinarka laserowa i plazmowa CNC – zapłon wiązki (M3) i przebijanie blachy (Piercing G04)',
    shortSubtitlePl: 'Jak działa cięcie termiczne arkuszy blachy na ruszcie grzebieniowym',
    theoryParagraphsPl: [
      '1. CZYM WYCINARKA LASEROWA / PLAZMOWA RÓŻNI SIĘ OD FREZARKI?\nW wycinarce laserowej (Fiber Laser), plazmowej (Plasma Cutter) lub wodno-ściernej (Waterjet) arkusz blachy leży na stalowym **ruszcie grzebieniowym** (zobacz w oknie 3D!). Zamiast obracającego się frezu nad blachą porusza się **miedziana dysza tnąca** (`T1`), z której wystrzeliwuje skupiona wiązka światła laserowego (wraz z gazem tnącym – tlenem lub azotem) albo łuk plazmowy o temperaturze ponad `20 000 °C`!',
      '2. JAK STERUJEMY WIĄZKĄ LASERA / PLAZMY W G-CODE?\nW przemysłowych wycinarkach 2D te same kody, które znamy z frezarki, pełnią rolę sterowania palnikiem:\n• **M3** – zapłon wiązki lasera / łuku plazmowego (Beam ON / Torch ON),\n• **M5** – natychmiastowe wygaszenie wiązki przed przejazdem jałowym `G0` (Beam OFF),\n• **G04 P...** – postój czasowy na **przebicie blachy (Piercing Time)**: zanim głowica ruszy do przodu ruchem `G1`, musi przez ułamek sekundy (np. `G04 P0.5` = 0,5 s) stać w miejscu, aby wiązka przepaliła arkusz blachy na wylot!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze głowica laserowa `T1` dojechała nad punkt startowy `(X20, Y40)` i wykonała przebicie z postojem `G04 P0.5` na głębokość przelotową `Z-5`. Dopisz cięcie robocze `G1` w prawo do punktu `(X80, Y40)` z posuwem `F1200`, a następnie wygaś wiązkę (`M5`) i podnieś głowicę (`G0 Z15`)!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'M3 (w wycinarce)', meaningPl: 'Zapłon wiązki laserowej / łuku plazmowego / otwarcie zaworu Waterjet', examplePl: 'S1000 M3 (pełna moc wiązki)' },
      { codeOrSymbol: 'G04 P0.5', meaningPl: 'Czas przebijania blachy w miejscu (Pierce Delay = 0.5 sekundy)', examplePl: 'Wiązka przepala blachę na wylot przed startem ruchu G1' },
      { codeOrSymbol: 'M5 (przed G0)', meaningPl: 'Wygaszenie wiązki przed szybkim przejazdem nad arkuszem', examplePl: 'Zawsze wyłączaj wiązkę przed odjazdem!' },
    ],
    anatomyBreakdown: {
      titlePl: 'Sekwencja przebicia blachy i startu cięcia laserem:',
      lineCode: 'G04 P0.5',
      parts: [
        { token: 'G04', explanationPl: 'Postój czasowy (Dwell) w punkcie przebicia' },
        { token: 'P0.5', explanationPl: 'Czas 0.5 sekundy na przepalenie 6-milimetrowej blachy na wylot' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na ruszt grzebieniowy i miedzianą głowicę laserową w oknie 3D.',
      'Pod linią `G04 P0.5` dopisz ruch cięcia w prawo: `G1 X80 Y40 F1200`.',
      'Kliknij „✔ Sprawdź zadanie” i uruchom symulację 3D, aby zobaczyć świecącą wiązkę i pierścień iskier!',
    ],
    commonMistakeWarningPl:
      'Ruszenie ruchem `G1` natychmiast po zapłonie `M3` (bez czasu przebicia `G04`) sprawi, że wiązka nie zdąży przebić blachy na wylot, a roztopiony żużel odbije się w górę prosto w soczewkę głowicy laserowej!',
    machineConfig: LASER_CUTTER_MACHINE,
    stock: LASER_SHEET_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 5.1: Wycinarka laserowa - przebijanie G04 i ciecie)
T1 M6
G21 G90 G17 G54
G43 H1 Z15

(Dojazd nad punkt przebicia X20 Y40)
G0 X20 Y40 Z3
S1000 M3 (Zaplon wiazki lasera)
G1 Z-5 F600 (Przebicie arkusza blachy)
G04 P0.5 (Czas przebijania 0.5 s)

(ZADANIE: Dopisz ciecie robocze G1 do punktu X80 Y40 z posuwem F1200!)


G0 Z15
M5
M30`,
    taskDescriptionPl:
      'Po przebiciu arkusza blachy w punkcie (X20, Y40, Z-5) i postoju G04 P0.5 dopisz cięcie robocze G1 do punktu (X80, Y40) z posuwem F1200.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Cięcie laserowe wykonane bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Przecięto arkusz blachy do punktu X80 Y40 na Z = -5 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Głowica po przebiciu stoi w X20 Y40 na Z-5.',
      'Podpowiedź 2/3: Użyj ruchu prostoliniowego G1 do współrzędnej X80 Y40.',
      'Podpowiedź 3/3: Dopisz linię: G1 X80 Y40 F1200',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z15
G0 X20 Y40 Z3
S1000 M3
G1 Z-5 F600
G04 P0.5
G1 X80 Y40 F1200
G0 Z15
M5
M30`,
    solutionExplanationPl:
      'Po postoju G04 P0.5 na przebicie blachy głowica laserowa przecina arkusz wzdłuż osi X do punktu X80 Y40.',
    quiz: [
      {
        id: 'q_m5_01',
        questionPl: 'Po co w programach na wycinarki laserowe i plazmowe stosuje się postój czasowy G04 P... tuż po zapłonie wiązki?',
        optionsPl: [
          'Aby wiązka zdążyła przepalić arkusz blachy na wylot (Piercing) zanim głowica ruszy wzdłuż konturu',
          'Aby ostudzić soczewkę do temperatury ujemnej',
          'Aby zmienić grubość blachy',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Czas przebijania (Pierce Delay) gwarantuje pełne przebicie materiału przed rozpoczęciem ruchu roboczego G1.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 5.2
  // ==========================================================================
  {
    id: 'M5_02',
    moduleId: 'MODULE_5',
    orderIndex: 2,
    titlePl: 'Lekcja 5.2: Wejście i wyjście w kontur (Lead-In / Lead-Out) – jak uniknąć krateru na krawędzi',
    shortSubtitlePl: 'Dlaczego nigdy nie przebijamy blachy bezpośrednio na linii gotowego detalu',
    theoryParagraphsPl: [
      '1. PROBLEM KRATERU PRZEBIJANIA (PIERCE BLOWOUT)\nW miejscu, w którym wiązka lasera lub plazmy przebija blachę, powstaje okrągłe nadtopienie (krater o średnicy większej niż normalna szczelina cięcia). Gdybyś przebił blachę bezpośrednio na krawędzi wycinanego detalu, na gotowej części zostałby brzydki wżer!',
      '2. DOBIEG (LEAD-IN) I WYBIEG (LEAD-OUT)\nDlatego w technologii cięcia 2D stosujemy **dobieg (Lead-In)**:\n• Przebijamy blachę kilka milimetrów **w odpadzie (poza konturem)** – np. w punkcie `(X15, Y15)`,\n• Wjeżdżamy łagodnym łukiem stycznym `G3` (lub odcinkiem `G1`) w właściwą linię konturu w punkcie `(X20, Y20)`,\n• Objeżdżamy kontur i wyjeżdżamy z powrotem w odpad (**Lead-Out**). Dzięki temu cała skaza przebicia zostaje w złomie!',
      '3. ZADANIE PRAKTYCZNE\nGłowica przebiła blachę w odpadzie w punkcie `(X15, Y15, Z-5)`. Dopisz łuk wejściowy (Lead-In) `G3 X20 Y20 R5 F1000`, a następnie wytnij dwie krawędzie detalu: `G1 X20 Y60 F1400` oraz `G1 X80 Y60`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Lead-In (Dobieg)', meaningPl: 'Krótki odcinek lub łuk łączący punkt przebicia w odpadzie z krawędzią detalu', examplePl: 'G3 X20 Y20 R5 (styczne wejście po łuku)' },
      { codeOrSymbol: 'Lead-Out (Wybieg)', meaningPl: 'Krótki wyjazd poza kontur po zamknięciu obrysu przed wygaszeniem wiązki', examplePl: 'Zapobiega powstaniu wypustki na końcu cięcia' },
      { codeOrSymbol: 'Odpad vs Detal', meaningPl: 'Dla obrysu zewnętrznego przebijamy na zewnątrz, a dla otworu – wewnątrz otworu!', examplePl: 'Skaza przebicia zawsze zostaje w złomie' },
    ],
    anatomyBreakdown: {
      titlePl: 'Łukowe wejście styczne (Arc Lead-In) z odpadu w kontur:',
      lineCode: 'G3 X20 Y20 R5 F1000',
      parts: [
        { token: 'G3', explanationPl: 'Łuk przeciwnie do wskazówek zegara (płynne wejście bez zatrzymania osi)' },
        { token: 'X20 Y20', explanationPl: 'Punkt styku z właściwą krawędzią detalu' },
        { token: 'R5', explanationPl: 'Promień dobiegu 5 mm ze startu w odpadzie (X15 Y15)' },
      ],
    },
    stepByStepGuidePl: [
      'Głowica przebiła blachę w odpadzie w punkcie `(X15, Y15)` na `Z-5`.',
      'Dopisz łuk wejściowy Lead-In do narożnika konturu: `G3 X20 Y20 R5 F1000`.',
      'Następnie dopisz lewą krawędź: `G1 X20 Y60 F1400` oraz górną krawędź: `G1 X80 Y60` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Przy wycinaniu otworu wewnętrznego (który wypadnie na złom) dobieg Lead-In umieszczamy WEWNĄTRZ otworu, a przy wycinaniu obrysu zewnętrznego detalu – NA ZEWNĄTRZ detalu!',
    machineConfig: LASER_CUTTER_MACHINE,
    stock: LASER_SHEET_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 5.2: Wejscie w kontur po luku Lead-In z odpadu)
T1 M6
G21 G90 G17 G54
G43 H1 Z15

(Przebicie blachy w odpadzie w punkcie X15 Y15)
G0 X15 Y15 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4

(ZADANIE: Wjedz lukiem G3 X20 Y20 R5 F1000 w kontur,)
(a nastepnie wytnij odcinek G1 do X20 Y60 F1400 oraz G1 do X80 Y60!)


G0 Z15
M5
M30`,
    taskDescriptionPl:
      'Z punktu przebicia w odpadzie (X15, Y15, Z-5) wykonaj łuk wejściowy (Lead-In) G3 do punktu (X20, Y20) o promieniu R5, a następnie wytnij dwie krawędzie prostoliniowe G1 do (X20, Y60) oraz (X80, Y60).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Ścieżka z dobiegiem Lead-In wykonana bez błędów',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CCW',
        expectedRadiusMm: 5,
        toleranceMm: 0.5,
        descriptionPl: 'Wykonano łuk wejściowy Lead-In G3 o promieniu 5 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 60, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wycięto krawędź konturu do punktu X80 Y60 Z-5',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Najpierw wprowadź wiązkę łukiem do (20, 20): G3 X20 Y20 R5 F1000',
      'Podpowiedź 2/3: Pamiętaj o przełączeniu z G3 na G1 dla prostych krawędzi: G1 X20 Y60 F1400',
      'Podpowiedź 3/3: Dopisz trzy linie:\nG3 X20 Y20 R5 F1000\nG1 X20 Y60 F1400\nG1 X80 Y60',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z15
G0 X15 Y15 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4
G3 X20 Y20 R5 F1000
G1 X20 Y60 F1400
G1 X80 Y60
G0 Z15
M5
M30`,
    solutionExplanationPl:
      'Przebicie odbywa się w punkcie (15, 15) poza detalem, a łuk G3 R5 płynnie wprowadza wiązkę stycznie w krawędź X=20 bez pozostawiania śladu na gotowej części.',
    quiz: [
      {
        id: 'q_m5_02',
        questionPl: 'Gdzie powinien znajdować się punkt przebicia blachy (Pierce Point) oraz dobieg Lead-In podczas wycinania okrągłego otworu wewnątrz detalu?',
        optionsPl: [
          'Wewnątrz wycinanego otworu (w krążku, który wypadnie na złom)',
          'Na zewnątrz otworu (w materiale gotowego detalu)',
          'Dokładnie na linii okręgu',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Ponieważ środek otworu jest odpadem, umieszczamy przebicie wewnątrz otworu, chroniąc ściankę w gotowym detalu.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 5.3
  // ==========================================================================
  {
    id: 'M5_03',
    moduleId: 'MODULE_5',
    orderIndex: 3,
    titlePl: 'Lekcja 5.3: Szerokość szczeliny cięcia (Kerf Width) i kompensacja G41 / G42',
    shortSubtitlePl: 'Jak skompensować średnicę strumienia plazmy lub strugi wodnej Waterjet',
    theoryParagraphsPl: [
      '1. CZYM JEST SZCZELINA CIĘCIA (KERF WIDTH)?\nStrumień plazmy lub struga wodno-ścierna Waterjet ma swoją fizyczną grubość (np. dysza plazmowa `T2` wypala szczelinę o szerokości `4 mm`, czyli promień wiązki w rejestrze `D2` wynosi `2 mm`). Gdyby środek dyszy jechał po wymiarze z rysunku, gotowy detal byłby mniejszy o `2 mm` z każdej strony!',
      '2. KOMPENSACJA SZCZELINY CIĘCIA (G41 D2 / G42 D2)\nDokładnie tak samo jak przy frezowaniu, w wycinarkach CNC włączamy na odcinku dojazdowym (Lead-In) korekcję promienia wiązki `G41 D2` (gdy objeżdżamy obrys zewnętrzny zgodnie ze wskazówkami zegara). Sterownik sam odsuwa oś palnika o połowę szerokości szczeliny (`2 mm`) na zewnątrz!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze używamy głowicy plazmowej `T2` (`D2 = 2 mm`). W linii dobiegu `G1 X20 Y20 F1000` włącz lewostronną kompensację szczeliny `G41 D2`, aby zewnętrzny obrys wycinanej płytki miał dokładny wymiar!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Kerf (Szczelina cięcia)', meaningPl: 'Szerokość materiału wytopionego przez wiązkę lasera/plazmy lub wypłukanego przez Waterjet', examplePl: 'Laser: 0.2–0.4 mm, Waterjet: ~1.0 mm, Plazma: 2.0–4.0 mm' },
      { codeOrSymbol: 'G41 D2', meaningPl: 'Odsunięcie osi palnika w lewo o połowę szerokości szczeliny z rejestru D2', examplePl: 'G1 G41 D2 X20 Y20 F1000' },
      { codeOrSymbol: 'G40', meaningPl: 'Wyłączenie kompensacji szczeliny na odcinku wybiegu (Lead-Out)', examplePl: 'G1 G40 X10 Y10' },
    ],
    anatomyBreakdown: {
      titlePl: 'Dobieg z włączeniem kompensacji szczeliny plazmowej G41 D2:',
      lineCode: 'G1 G41 D2 X20 Y20 F1000',
      parts: [
        { token: 'G1', explanationPl: 'Prostoliniowy odcinek dobiegu (Lead-In)' },
        { token: 'G41 D2', explanationPl: 'Kompensacja lewostronna o promień strumienia plazmy z rejestru D2 (2 mm)' },
        { token: 'X20 Y20', explanationPl: 'Narożnik konturu z rysunku technicznego' },
      ],
    },
    stepByStepGuidePl: [
      'Znajdź w kodzie linię dobiegu `G1 X20 Y20 F1000`.',
      'Dopisz w niej `G41 D2`, otrzymując: `G1 G41 D2 X20 Y20 F1000`.',
      'Kliknij „✔ Sprawdź zadanie” i zobacz w widoku z góry (XY) odsuniętą ścieżkę palnika!',
    ],
    commonMistakeWarningPl:
      'W wycinarkach plazmowych zużycie dyszy poszerza szczelinę cięcia (Kerf). Operator koryguje to w tabeli `D` bez zmieniania programu G-code!',
    machineConfig: LASER_CUTTER_MACHINE,
    stock: LASER_SHEET_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 2,
    starterCode: `(Lekcja 5.3: Kompensacja szczeliny ciecia plazmowego G41 D2)
T2 M6 (Dysza plazmowa o szerokosci szczeliny 4 mm -> D2 = 2 mm)
G21 G90 G17 G54
G43 H2 Z15

G0 X10 Y10 Z3
S1000 M3
G1 Z-5 F600
G04 P0.5

(ZADANIE: W ponizszej linii dobiegu Lead-In wlacz kompensacje G41 D2!)
G1 X20 Y20 F1000

G1 X20 Y60
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20
G1 G40 X10 Y10
G0 Z15
M5
M30`,
    taskDescriptionPl:
      'W linii dobiegu do narożnika (X20, Y20) włącz lewostronną kompensację szerokości szczeliny cięcia plazmowego G41 D2.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Kompensacja szczeliny cięcia wykonana bez błędów',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'CUTTER_COMP', mode: 'G41', registerD: 2 },
        descriptionPl: 'Aktywowano kompensację szczeliny G41 z rejestrem D2',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 18, y: 60, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Oś dyszy została odsunięta o 2 mm w lewo (do X18 Y60)',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Znajdź linię „G1 X20 Y20 F1000”.',
      'Podpowiedź 2/3: Dodaj do niej słowa „G41 D2”.',
      'Podpowiedź 3/3: Linia powinna mieć postać: G1 G41 D2 X20 Y20 F1000',
    ],
    solutionCode: `T2 M6
G21 G90 G17 G54
G43 H2 Z15
G0 X10 Y10 Z3
S1000 M3
G1 Z-5 F600
G04 P0.5
G1 G41 D2 X20 Y20 F1000
G1 X20 Y60
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20
G1 G40 X10 Y10
G0 Z15
M5
M30`,
    solutionExplanationPl:
      'Dzięki G41 D2 oś palnika plazmowego porusza się o 2 mm na zewnątrz od linii wymiarowej, dzięki czemu krawędź wytopionej szczeliny pokrywa się z wymiarem rysunkowym.',
    quiz: [
      {
        id: 'q_m5_03',
        questionPl: 'Jeśli strumień plazmy wypala szczelinę (Kerf) o całkowitej szerokości 3.0 mm, jaką wartość promienia wpisujemy do rejestru D w sterowniku?',
        optionsPl: [
          '1.5 mm (połowę szerokości szczeliny)',
          '3.0 mm',
          '6.0 mm',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Kompensacja promieniowa G41/G42 odsuwa środek wiązki o połowę szerokości szczeliny (promień = średnica / 2 = 1.5 mm).',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 5.4
  // ==========================================================================
  {
    id: 'M5_04',
    moduleId: 'MODULE_5',
    orderIndex: 4,
    titlePl: 'Lekcja 5.4: Kolejność wycinania (Najpierw otwory wewnętrzne, potem obrys zewnętrzny)',
    shortSubtitlePl: 'Dlaczego wycięcie obrysu zewnętrznego na początku zniszczy dokładność otworów',
    theoryParagraphsPl: [
      '1. ŻELAZNA REGUŁA WYCINANIA ARKUSZY (INSIDE-FIRST RULE)\nWyobraź sobie, że wycinasz z arkusza blachy podkładkę z otworem w środku. Co się stanie, jeśli najpierw wytniesz jej zewnętrzny obrys? Wycięta podkładka straci połączenie z resztą arkusza, przekrzywi się lub zapadnie między żebra rusztu grzebieniowego! Gdy głowica pojedzie potem wycinać otwór wewnętrzny, trafi w krzywo leżący detal lub uderzy w podniesioną krawędź blachy!',
      '2. PRAWIDŁOWA SEKWENCJA TECHNOLOGICZNA\n1) **Krok 1**: Wytnij wszystkie otwory i wycięcia wewnętrzne (gdy detal jest jeszcze sztywno połączony z całym arkuszem blachy),\n2) **Krok 2**: Dopiero na samym końcu wytnij obrys zewnętrzny odcinający detal od arkusza!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze wycięto już środkowy otwór okrągły wokół `(X50, Y40)`. Dopisz teraz wycięcie zewnętrznego konturu prostokątnego: zamknij prawą ściankę `G1 X80 Y20` oraz dolną ściankę `G1 X20 Y20` na głębokości `Z-5`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Etap 1: Otwory wewn.', meaningPl: 'Wycinane jako pierwsze, gdy arkusz leży nieruchomo i płasko na ruszcie', examplePl: 'G3 X60 Y40 I-10 J0 (otwór Ø20 mm)' },
      { codeOrSymbol: 'Etap 2: Kontur zewn.', meaningPl: 'Wycinany zawsze na samym końcu programu (odcięcie gotowej części)', examplePl: 'Obrys zewnętrzny 20..80 x 20..60' },
    ],
    anatomyBreakdown: {
      titlePl: 'Wycięcie pełnego otworu wewnętrznego z wejściem ze środka:',
      lineCode: 'G3 X60 Y40 I-10 J0 F1100',
      parts: [
        { token: 'G3 X60 Y40', explanationPl: 'Pełny okrąg 360° zaczynający się i kończący w X60 Y40' },
        { token: 'I-10 J0', explanationPl: 'Środek otworu w X50 Y40 (promień 10 mm)' },
      ],
    },
    stepByStepGuidePl: [
      'Przeanalizuj Sekcję 1 w edytorze: głowica przebija blachę w samym środku otworu `(X50, Y40)`, dojeżdża do `(X60, Y40)` i wycina otwór `G3 X60 Y40 I-10 J0`.',
      'W Sekcji 2 (Obrys zewnętrzny) wycięto już boki do punktu `(X80, Y60)`.',
      'Dopisz brakujące dwie krawędzie zamykające obrys zewnętrzny: `G1 X80 Y20` oraz `G1 X20 Y20`, i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Nigdy nie zostawiaj zapalonej wiązki `M3` podczas szybkiego przejazdu `G0` pomiędzy otworem wewnętrznym a obrysem zewnętrznym – przetniesz gotowy detal na pół!',
    machineConfig: LASER_CUTTER_MACHINE,
    stock: LASER_SHEET_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 5.4: Kolejnosc wycinania - 1. Otwor wewnetrzny, 2. Obrys zewnetrzny)
T1 M6
G21 G90 G17 G54
G43 H1 Z15

(--- 1. NAJPIERW OTWOR WEWNETRZNY w X50 Y40 ---)
G0 X50 Y40 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4
G1 X60 Y40 F1100
G3 X60 Y40 I-10 J0 F1100
M5
G0 Z15

(--- 2. NASTEPNIE OBRYS ZEWNETRZNY 20..80 x 20..60 ---)
G0 X20 Y20 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4
G1 X20 Y60 F1400
G1 X80 Y60

(ZADANIE: Dokoncz wycinanie obrysu zewnetrznego:)
(przejedz G1 do X80 Y20, a nastepnie zamknij kontur w X20 Y20!)


M5
G0 Z15
M30`,
    taskDescriptionPl:
      'Po wycięciu otworu wewnętrznego i dwóch pierwszych krawędzi obrysu zewnętrznego (do X80 Y60 na Z-5) dokończ odcinanie detalu, dopisując cięcie G1 przez punkt (X80, Y20) do punktu początkowego (X20, Y20).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Wycinanie otworu i konturu wykonane bez błędów',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CCW',
        expectedRadiusMm: 10,
        toleranceMm: 0.5,
        descriptionPl: 'Wycięto otwór wewnętrzny o promieniu 10 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 20, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wycięto prawą krawędź obrysu do X80 Y20 Z-5',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 20, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Zamknięto dolną krawędź obrysu zewnętrznego (przejście przez X50 Y20 Z-5)',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Głowica stoi w prawym górnym narożniku obrysu (X80 Y60 Z-5).',
      'Podpowiedź 2/3: Pojedź w dół do prawego dolnego narożnika: G1 X80 Y20, a potem w lewo: G1 X20 Y20.',
      'Podpowiedź 3/3: Dopisz przed „M5” dwie linie:\nG1 X80 Y20\nG1 X20 Y20',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
G43 H1 Z15
G0 X50 Y40 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4
G1 X60 Y40 F1100
G3 X60 Y40 I-10 J0 F1100
M5
G0 Z15
G0 X20 Y20 Z3
S1000 M3
G1 Z-5 F600
G04 P0.4
G1 X20 Y60 F1400
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20
M5
G0 Z15
M30`,
    solutionExplanationPl:
      'Najpierw wycinany jest otwór wewnętrzny w nieruchomym arkuszu, po czym wiązka jest wygaszana (M5), głowica przejeżdża nad narożnik zewnętrzny i odcina gotową część.',
    quiz: [
      {
        id: 'q_m5_04',
        questionPl: 'Dlaczego w wycinarkach laserowych i plazmowych zawsze wycinamy otwory wewnętrzne PRZED obrysem zewnętrznym detalu?',
        optionsPl: [
          'Ponieważ po odcięciu obrysu zewnętrznego detal może się przesunąć lub przechylić na ruszcie, co uniemożliwiłoby dokładne wycięcie otworów',
          'Ponieważ wiązka lasera na początku programu potrafi jeździć tylko po okręgach',
          'Kolejność nie ma żadnego znaczenia',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Dopóki obrys zewnętrzny nie jest przecięty, detal stanowi jedną całość z ciężkim arkuszem blachy i nie może zmienić pozycji.',
      },
    ],
  },
];

// ============================================================================
// MODUŁ 6: PLOTER BRAMOWY CNC / ROUTER (DREWNO, KOMPOZYTY, ALUMINIUM)
// ============================================================================
export const MODULE_6_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 6.1
  // ==========================================================================
  {
    id: 'M6_01',
    moduleId: 'MODULE_6',
    orderIndex: 1,
    titlePl: 'Lekcja 6.1: Ploter bramowy CNC (Gantry Router) – wysokie obroty (18 000 RPM) i duże posuwy',
    shortSubtitlePl: 'Dlaczego przy pracy w drewnie, płytach MDF i tworzywach zbyt wolny posuw przypala materiał',
    theoryParagraphsPl: [
      '1. BUDOWA PLOTERA BRAMOWEGO CNC (GANTRY ROUTER)\nSpójrz na okno 3D: zamiast małego imadła widzisz szeroki stół z **płytą podkładową MDF (Spoilboard)** oraz ruchomą **bramę jezdną (Gantry Bridge)**, która przesuwa się wzdłuż osi `Y`! Plotery bramowe służą do obróbki dużych arkuszy sklejki, płyt meblowych, tworzyw sztucznych (PMMA/pleksi, poliwęglan) oraz płyt aluminiowych i kompozytowych (Alu-Dibond).',
      '2. WYSOKOOBROTOWE WRZECIONO (18 000 – 24 000 OBR./MIN) I ZASADA CHŁODZENIA WIÓREM\nPlotery CNC mają elektrowrzeciona kręcące się z prędkością aż `18 000 – 24 000 obr./min` (`S18000`) i używają specjalnych frezów 1- lub 2-ostrzowych (`T1`). Uwaga: przy tak wysokich obrotach musimy zadawać **duży posuw roboczy** (`F1500 – F3000 mm/min`)! Jeśli pojedziesz zbyt wolno, frez zamiast ścinać wiór będzie tarł w jednym miejscu, powodując **przypalenie drewna** albo **stopienie i nawinięcie pleksi na frez**!',
      '3. ZADANIE PRAKTYCZNE\nUżywając frezu spiralnego `T1` (`Ø6 mm`) przy obrotach `S18000 M3`, dokończ frezowanie prostokątnego rowka ozdobnego we froncie meblowym na głębokości `Z = -4 mm` z wysokim posuwem `F2000`: z punktu `(X80, Y60)` przejedź do `(X80, Y20)` i zamknij ramkę w `(X20, Y20)`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'S18000 – S24000', meaningPl: 'Typowe obroty elektrowrzeciona na ploterze CNC', examplePl: 'S18000 M3' },
      { codeOrSymbol: 'F1500 – F3000', meaningPl: 'Szybki posuw roboczy dopasowany do wysokich obrotów wrzeciona', examplePl: 'G1 X80 Y60 F2000 (zapobiega przypalaniu drewna i topieniu tworzyw)' },
      { codeOrSymbol: 'Spoilboard (MDF)', meaningPl: 'Płyta podkładowa na stole plotera, w którą frez może lekko wejść przy wycinaniu na wylot', examplePl: 'Chroni metalowy stół maszyny' },
    ],
    anatomyBreakdown: {
      titlePl: 'Parametry skrawania dla plotera CNC (wysokie S i wysokie F):',
      lineCode: 'S18000 M3 ... G1 X80 Y60 F2000',
      parts: [
        { token: 'S18000 M3', explanationPl: '18 000 obr./min elektrowrzeciona' },
        { token: 'F2000', explanationPl: 'Posuw 2000 mm/min zapewniający właściwy gruby wiór (fz ≈ 0.11 mm)' },
      ],
    },
    stepByStepGuidePl: [
      'Zwróć uwagę w oknie 3D na aluminiową bramę plotera poruszającą się nad płytą.',
      'W kodzie wykonano już dwie pierwsze ścianki ramki do punktu `(X80, Y60)` na `Z-4`.',
      'Dopisz dwie kolejne ścianki zamykające ramkę: `G1 X80 Y20` oraz `G1 X20 Y20`, a następnie kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Zmniejszenie posuwu `F` przy obrotach `18 000 RPM` w sklejce lub MDF z obawy o narzędzie przynosi odwrotny skutek: tarcie błyskawicznie rozhartowuje i tępi ostrze frezu oraz powoduje dymienie materiału!',
    machineConfig: GANTRY_ROUTER_MACHINE,
    stock: ROUTER_PANEL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 6.1: Ploter bramowy CNC - frezowanie ramki we froncie na Z-4)
T1 M6 (Frez 1-ostrzowy VHM fi 6 mm)
G21 G90 G17 G54
S18000 M3
G43 H1 Z20

G0 X20 Y20 Z5
G1 Z-4 F800
G1 X20 Y60 F2000
G1 X80 Y60

(ZADANIE: Dokoncz frezowanie ramki na Z-4:)
(przejedz G1 do X80 Y20, a nastepnie do X20 Y20!)


G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Na ploterze bramowym CNC dokończ frezowanie ozdobnej ramki na głębokości Z = -4 mm z posuwem F2000, prowadząc frez T1 z punktu (X80, Y60) przez (X80, Y20) do (X20, Y20).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Frezowanie na ploterze wykonane bez błędów',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 20, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wyfrezowano prawy bok ramki do X80 Y20 Z-4',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 20 },
        expectedZMm: -4,
        toleranceMm: 0.5,
        descriptionPl: 'Dolny rowek ramki (X50 Y20) ma głębokość Z = -4 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Frez stoi w prawym górnym narożniku ramki (X80 Y60 Z-4).',
      'Podpowiedź 2/3: Pojedź w dół do X80 Y20, a następnie w lewo do X20 Y20.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20” dwie linie:\nG1 X80 Y20\nG1 X20 Y20',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S18000 M3
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F800
G1 X20 Y60 F2000
G1 X80 Y60
G1 X80 Y20
G1 X20 Y20
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Brama plotera prowadzi wysokoobrotowe wrzeciono po obwodzie ramki z posuwem 2000 mm/min, zapewniając czyste krawędzie bez przypaleń.',
    quiz: [
      {
        id: 'q_m6_01',
        questionPl: 'Co stanie się podczas frezowania pleksi (PMMA) lub drewna przy obrotach 18 000 obr./min, jeśli ustawimy zbyt mały posuw roboczy (np. F100 zamiast F2000)?',
        optionsPl: [
          'Ostrze będzie trzeć w miejscu zamiast odbierać ciepło z wiórem, co stopi tworzywo na frezie lub przypali drewno',
          'Wrzeciono zacznie kręcić się w drugą stronę',
          'Powierzchnia stanie się zimniejsza',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Wysokie obroty wymagają odpowiednio dużego posuwu, aby każde przejście ostrza ścinało właściwej grubości wiór odprowadzający ciepło.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 6.2
  // ==========================================================================
  {
    id: 'M6_02',
    moduleId: 'MODULE_6',
    orderIndex: 2,
    titlePl: 'Lekcja 6.2: Grawerowanie stożkowe V-Bit (V-Carving) – sterowanie szerokością linii osią Z',
    shortSubtitlePl: 'Jak za pomocą jednego frezu stożkowego 90° rzeźbić cienkie i szerokie linie ozdobne',
    theoryParagraphsPl: [
      '1. JAK DZIAŁA GRAWEROWANIE V-CARVING?\nFrez grawerski **V-Bit (`T2`)** ma kształt ostrego stożka o kącie `90°` (`45°` na stronę). Oznacza to, że dla kąta `90°` **szerokość wyfrezowanego rowka na powierzchni płyty wynosi dokładnie `2 × głębokość Z`**!\n• Gdy jedziesz na głębokości `Z = -1 mm`, szerokość linii wynosi `2 mm`.\n• Gdy płynnie zjeżdżasz na `Z = -4 mm`, linia rozszerza się do `8 mm`!\n• Gdy w narożniku litery wyjeżdżasz po skosie do `Z = 0`, uzyskujesz ostry jak brzytwa szeryf (narożnik kaligraficzny)!',
      '2. RUCH 3-OSIOWY G1 X... Y... Z...\nW technice V-Carving oś `Z` zmienia się płynnie jednocześnie z ruchem w `X` i `Y`, dzięki czemu rowek dynamicznie zwęża się i rozszerza.',
      '3. ZADANIE PRAKTYCZNE\nW edytorze frez V-Bit `T2` wyrzeźbił już pierwsze ramię wzoru od `(X20, Y40, Z-1)` do głębokiego środka `(X50, Y40, Z-4)`. Dopisz drugie ramię, które płynnie spłyca rowek od środka do `(X80, Y40, Z-1)` (`G1 X80 Y40 Z-1 F1200`), a także pionowy grawer od `(X50, Y20, Z-1)` przez `(X50, Y40, Z-4)` do `(X50, Y60, Z-1)`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'V-Bit 90° (T2)', meaningPl: 'Frez stożkowy, dla którego szerokość śladu = 2 × głębokość |Z|', examplePl: 'Z-1 -> szerokość 2 mm; Z-4 -> szerokość 8 mm' },
      { codeOrSymbol: 'G1 X80 Y40 Z-1', meaningPl: 'Jednoczesny ruch w XY i płynne unoszenie osi Z (zwężanie graweru)', examplePl: 'Efekt pędzla kaligraficznego w 3D' },
    ],
    anatomyBreakdown: {
      titlePl: 'Płynna zmiana szerokości graweru ruchem 3-osiowym (X, Y, Z):',
      lineCode: 'G1 X80 Y40 Z-1 F1200',
      parts: [
        { token: 'G1 X80 Y40', explanationPl: 'Ruch w poziomie do prawego końca wzoru' },
        { token: 'Z-1', explanationPl: 'Płynne spłycenie z Z-4 do Z-1 (linia zwęża się z 8 mm do 2 mm!)' },
      ],
    },
    stepByStepGuidePl: [
      'Narzędzie `T2` stoi w głębokim środku wzoru `(X50, Y40, Z-4)`.',
      'Dopisz płynne wyjście w prawo na głębokość `Z-1`: `G1 X80 Y40 Z-1 F1200`.',
      'Zauważ, że pionowe ramię rozety jest już poniżej w kodzie – kliknij „✔ Sprawdź zadanie” i obejrzyj zmienną szerokość rowka w 3D!',
    ],
    commonMistakeWarningPl:
      'Do grawerowania V-Carving płyta musi leżeć idealnie płasko – jeśli sklejka jest wygięta w łuk o `1 mm`, litery w jednym rogu będą o `2 mm` szersze niż w drugim!',
    machineConfig: GANTRY_ROUTER_MACHINE,
    stock: ROUTER_PANEL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 2,
    starterCode: `(Lekcja 6.2: Grawerowanie stozkowe V-Carving frezem V-Bit 90 stopni)
T2 M6 (Frez grawerski V-Bit 90 stopni)
G21 G90 G17 G54
S18000 M3
G43 H2 Z20

(1. Poziome ramie rozety: z Z-1 w X20 Y40 schodzimy na Z-4 w srodku X50 Y40)
G0 X20 Y40 Z5
G1 Z-1 F600
G1 X50 Y40 Z-4 F1200

(ZADANIE: Dopisz plynnym ruchem G1 wyjscie w prawo do punktu X80 Y40 na glebokosc Z-1!)


(2. Pionowe ramie rozety ze zmiennym Z)
G0 Z10
G0 X50 Y20
G1 Z-1 F600
G1 X50 Y40 Z-4 F1200
G1 X50 Y60 Z-1 F1200

G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Dokończ poziome ramię grawerowanej rozety frezem V-Bit T2: z punktu środkowego (X50, Y40, Z-4) wykonaj płynny ruch 3-osiowy G1 do punktu (X80, Y40, Z-1).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Grawerowanie V-Bit wykonane bez błędów',
      },
      {
        kind: 'USED_TOOL_POCKETS',
        requiredPockets: [2],
        requireInOrder: false,
        descriptionPl: 'Użyto frezu stożkowego V-Bit T2',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -1, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wyprowadzono prawe ramię rozety do punktu X80 Y40 Z-1',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Frez T2 stoi w środku rozety w X50 Y40 Z-4.',
      'Podpowiedź 2/3: Podaj w jednej linii G1 docelowe X80, Y40 oraz Z-1.',
      'Podpowiedź 3/3: Dopisz linię: G1 X80 Y40 Z-1 F1200',
    ],
    solutionCode: `T2 M6
G21 G90 G17 G54
S18000 M3
G43 H2 Z20
G0 X20 Y40 Z5
G1 Z-1 F600
G1 X50 Y40 Z-4 F1200
G1 X80 Y40 Z-1 F1200
G0 Z10
G0 X50 Y20
G1 Z-1 F600
G1 X50 Y40 Z-4 F1200
G1 X50 Y60 Z-1 F1200
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Jednoczesna interpolacja osi X i Z sprawia, że stożkowy frez V-Bit 90° płynnie zmienia szerokość wycinanego rowka z 8 mm w środku do 2 mm na końcach ramion.',
    quiz: [
      {
        id: 'q_m6_02',
        questionPl: 'Jaką szerokość na powierzchni płyty będzie miał rowek wyfrezowany frezem stożkowym V-Bit o kącie 90° na głębokości Z = -3 mm?',
        optionsPl: [
          '6 mm (2 × 3 mm)',
          '3 mm',
          '1.5 mm',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Dla kąta wierzchołkowego 90° (45° na każdą stronę) promień na powierzchni jest równy głębokości, więc całkowita szerokość rowka wynosi 2 × |Z| = 6 mm.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 6.3
  // ==========================================================================
  {
    id: 'M6_03',
    moduleId: 'MODULE_6',
    orderIndex: 3,
    titlePl: 'Lekcja 6.3: Wycinanie z arkusza z mostkami trzymającymi (Holding Tabs)',
    shortSubtitlePl: 'Jak zapobiec wyrwaniu odciętego detalu przez wirujący frez na ploterze',
    theoryParagraphsPl: [
      '1. NIEBEZPIECZEŃSTWO LUŹNEGO DETALU PRZY WYCINANIU NA WYLOT\nGdy na ploterze bramowym wycinasz mniejszy detal z dużego arkusza sklejki lub aluminium, arkusz jest przykręcony tylko na brzegach. W chwili gdy frez domknie obwód na pełnej głębokości, odcięty detal w środku staje się całkowicie luźny – obracający się z prędkością `18 000 RPM` frez natychmiast go podbije, uszkadzając krawędź lub łamiąc narzędzie!',
      '2. MOSTKI PODTRZYMUJĄCE (HOLDING TABS / BRIDGES)\nAby temu zapobiec, na ostatnim przejściu zostawiamy 2 lub 4 krótkie **mostki trzymające (Tabs)**:\n• Frez jedzie na pełnej głębokości (np. `Z = -10 mm`),\n• Przed mostkiem podnosi się na chwilę wyżej (np. na `Z = -6 mm`, zostawiając 4-milimetrową zakładkę materiału),\n• Przejeżdża `10 mm` nad mostkiem i z powrotem zagłębia się na `Z = -10 mm`!\nPo zdjęciu arkusza z maszyny mostki odcina się jednym ruchem nożyka lub dłuta.',
      '3. ZADANIE PRAKTYCZNE\nW edytorze wycinamy dolną ściankę detalu na głębokości `Z = -10 mm` od `(X20, Y20)` do `(X80, Y20)`. Na odcinku od `X45` do `X55` zaprogramuj mostek trzymający na wysokości `Z = -6 mm`: podjedź na `Z-10` do `X45 Y20`, unieś się `G1 Z-6`, przejedź nad mostkiem do `X55 Y20`, opuść z powrotem `G1 Z-10` i dokończ ściankę do `X80 Y20`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Holding Tab (Mostek)', meaningPl: 'Krótki nieprzecięty do końca fragment obrysu utrzymujący detal w arkuszu', examplePl: 'Szerokość 8–10 mm, wysokość 2–4 mm od dna' },
      { codeOrSymbol: 'Z-10 -> Z-6 -> Z-10', meaningPl: 'Sekwencja ominięcia mostka w osi Z podczas jazdy wzdłuż krawędzi', examplePl: 'G1 X45 Y20 -> G1 Z-6 -> G1 X55 Y20 -> G1 Z-10' },
    ],
    anatomyBreakdown: {
      titlePl: 'Sekwencja wykonania mostka trzymającego (Holding Tab) między X45 a X55:',
      lineCode: 'G1 X45 Y20 -> G1 Z-6 -> G1 X55 Y20 -> G1 Z-10',
      parts: [
        { token: 'G1 X45 Y20', explanationPl: 'Dojazd na pełnej głębokości Z-10 do początku mostka' },
        { token: 'G1 Z-6 ... G1 X55 Y20', explanationPl: 'Uniesienie frezu na Z-6 i przejazd nad 10-milimetrowym mostkiem' },
        { token: 'G1 Z-10', explanationPl: 'Ponowne zagłębienie na Z-10 za mostkiem' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym frez stoi w narożniku `(X20, Y20)` na głębokości `Z-10`.',
      'Dopisz dojazd do początku mostka: `G1 X45 Y20 F1800`, następnie uniesienie `G1 Z-6 F800`, przejazd nad mostkiem `G1 X55 Y20 F1800` i zejście `G1 Z-10 F800`.',
      'Na końcu dokończ dolną krawędź do `G1 X80 Y20 F1800` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Nigdy nie umieszczaj mostków trzymających w samych narożnikach detalu – w narożniku bardzo trudno je później czysto odciąć i oszlifować. Zawsze umieszczaj je na środku prostych krawędzi!',
    machineConfig: GANTRY_ROUTER_MACHINE,
    stock: ROUTER_PANEL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 6.3: Wycinanie z mostkiem trzymajacym Holding Tab miedzy X45 a X55)
T1 M6
G21 G90 G17 G54
S18000 M3
G43 H1 Z20

(Frezujemy lewa, gorna i prawa scianke na Z-10 oraz wracamy do X20 Y20)
G0 X20 Y20 Z5
G1 Z-10 F800
G1 X20 Y60 F1800
G1 X80 Y60
G0 Z5
G0 X20 Y20
G1 Z-10 F800

(ZADANIE: Przejedz dolna krawedzia z X20 Y20 do X80 Y20 z mostkiem na Z-6 miedzy X45 a X55:)
(1. G1 X45 Y20 F1800)
(2. G1 Z-6 F800 -> G1 X55 Y20 F1800 -> G1 Z-10 F800)
(3. G1 X80 Y20 F1800)


G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Wyfrezuj dolną krawędź od (X20, Y20) do (X80, Y20) na głębokości Z = -10 mm, pozostawiając pośrodku (między X45 a X55) mostek trzymający (Holding Tab) na wysokości Z = -6 mm.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Ścieżka z mostkiem trzymającym wykonana bez błędów',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 32, y: 20 },
        expectedZMm: -10,
        toleranceMm: 0.5,
        descriptionPl: 'Krawędź przed mostkiem (X32 Y20) wycięta na pełną głębokość Z = -10 mm',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 20 },
        expectedZMm: -6,
        toleranceMm: 0.5,
        descriptionPl: 'W środku krawędzi (X50 Y20) pozostawiono mostek trzymający na wysokości Z = -6 mm',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 68, y: 20 },
        expectedZMm: -10,
        toleranceMm: 0.5,
        descriptionPl: 'Krawędź za mostkiem (X68 Y20) wycięta na pełną głębokość Z = -10 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Najpierw dojedź na Z-10 do X45: G1 X45 Y20 F1800, po czym unieś frez: G1 Z-6 F800.',
      'Podpowiedź 2/3: Przejedź nad mostkiem: G1 X55 Y20 F1800 i zjedź z powrotem: G1 Z-10 F800.',
      'Podpowiedź 3/3: Dokończ krawędź: G1 X80 Y20 F1800.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S18000 M3
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-10 F800
G1 X20 Y60 F1800
G1 X80 Y60
G0 Z5
G0 X20 Y20
G1 Z-10 F800
G1 X45 Y20 F1800
G1 Z-6 F800
G1 X55 Y20 F1800
G1 Z-10 F800
G1 X80 Y20 F1800
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Podniesienie frezu z Z-10 na Z-6 na odcinku od X45 do X55 pozostawia 4-milimetrowy mostek materiału, który bezpiecznie trzyma wycinany element w arkuszu.',
    quiz: [
      {
        id: 'q_m6_03',
        questionPl: 'Jaki jest główny cel stosowania mostków trzymających (Holding Tabs) podczas wycinania detali z arkusza na ploterze CNC?',
        optionsPl: [
          'Utrzymanie wycinanego detalu w arkuszu do końca obróbki, aby luźny element nie został wyrwany i uszkodzony przez wirujący frez',
          'Przyspieszenie wymiany narzędzia M6',
          'Zwiększenie chropowatości powierzchni górnej',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Mostki trzymające zapobiegają przesunięciu lub wyrzuceniu odciętego elementu w ostatniej fazie wycinania.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 6.4
  // ==========================================================================
  {
    id: 'M6_04',
    moduleId: 'MODULE_6',
    orderIndex: 4,
    titlePl: 'Lekcja 6.4: Rozkrój wielowarstwowy na głębokość (Step-Down: Z-5 → Z-10)',
    shortSubtitlePl: 'Dlaczego smukłym frezem Ø6 mm zbieramy grubą płytę w dwóch przejściach',
    theoryParagraphsPl: [
      '1. ZASADA MAKSYMALNEJ GŁĘBOKOŚCI PRZEJŚCIA (STEP-DOWN)\nPraktyczna reguła dla ploterów CNC mówi, że pojedyncza głębokość skrawania `ap` przy wycinaniu rowka pełną średnicą frezu nie powinna przekraczać `1 × D` (czyli dla frezu `Ø6 mm` maksymalnie `5–6 mm` na jedno przejście). Próba przecięcia twardej płyty `10–12 mm` na raz smukłym frezem `Ø6 mm` powoduje ugięcie narzędzia i jego złamanie!',
      '2. OBWÓD W DWÓCH WARSTWACH (Z-5, A POTEM Z-10)\nDlatego programujemy wycinanie warstwami:\n• **Warstwa 1 (`Z = -5 mm`)**: objeżdżamy cały kontur na połowie głębokości,\n• **Warstwa 2 (`Z = -10 mm`)**: bez wyjeżdżania w górę zagłębiamy się w narożniku startowym na `Z = -10 mm` i powtarzamy objazd konturu!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze wykonano już pełny objazd konturu `(25..75 × 25..55)` na pierwszej warstwie `Z = -5 mm`. Dopisz w punkcie `(X25, Y25)` zejście na drugą warstwę `G1 Z-10 F800` i powtórz objazd wszystkich czterech ścianek na głębokości `Z = -10 mm`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'ap <= 1 × D', meaningPl: 'Bezpieczna głębokość jednego przejścia dla smukłego frezu walcowego', examplePl: 'Dla frezu Ø6 mm: warstwa 5 mm (Z-5, potem Z-10)' },
      { codeOrSymbol: 'Step-Down', meaningPl: 'Kolejne zejście w osi Z w punkcie początkowym konturu bez podnoszenia wrzeciona', examplePl: 'Po zamknięciu pętli na Z-5 od razu G1 Z-10 F800' },
    ],
    anatomyBreakdown: {
      titlePl: 'Zejście na drugą warstwę głębokości po zamknięciu pierwszej pętli:',
      lineCode: 'G1 Z-10 F800',
      parts: [
        { token: 'G1 Z-10', explanationPl: 'Zejście z pierwszej warstwy (Z-5) na drugą warstwę (Z-10) w narożniku X25 Y25' },
        { token: 'F800', explanationPl: 'Łagodniejszy posuw pionowego zagłębiania' },
      ],
    },
    stepByStepGuidePl: [
      'Pierwsza pętla na `Z-5` kończy się w punkcie `(X25, Y25)`.',
      'Dopisz zejście na drugą warstwę: `G1 Z-10 F800`.',
      'Powtórz 4 odcinki konturu: `G1 X25 Y55 F2000`, `G1 X75 Y55`, `G1 X75 Y25`, `G1 X25 Y25` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Przy wycinaniu wielowarstwowym nigdy nie wyłączaj odciągu wiórów (szczotki odpylającej) – jeśli wióry z pierwszej warstwy zostaną w wąskim rowku, podczas drugiego przejścia na `Z-10` frez będzie je ponownie mielił i zakleszczy się!',
    machineConfig: GANTRY_ROUTER_MACHINE,
    stock: ROUTER_PANEL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 6.4: Rozkroj wielowarstwowy - Warstwa 1: Z-5, Warstwa 2: Z-10)
T1 M6
G21 G90 G17 G54
S18000 M3
G43 H1 Z20

(--- WARSTWA 1: Glebokosc Z-5 ---)
G0 X25 Y25 Z5
G1 Z-5 F800
G1 X25 Y55 F2000
G1 X75 Y55
G1 X75 Y25
G1 X25 Y25

(--- WARSTWA 2: ZADANIE - zejdz na Z-10 i powtorz objazd 4 bokow konturu! ---)


G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Po wykonaniu pierwszej warstwy konturu na Z = -5 mm (w punktach 25..75 x 25..55), zjedź w narożniku (X25, Y25) na głębokość Z = -10 mm i powtórz pełny objazd wszystkich czterech boków.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Rozkrój dwuwarstwowy wykonany bez błędów',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 55, z: -10, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wycięto drugą warstwę do narożnika X75 Y55 na Z = -10 mm',
      },
      {
        kind: 'SURFACE_HEIGHT_AT_POINT',
        pointXY: { x: 50, y: 25 },
        expectedZMm: -10,
        toleranceMm: 0.5,
        descriptionPl: 'Dolna krawędź konturu (X50 Y25) ma docelową głębokość Z = -10 mm',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Stoisz w X25 Y25 na Z-5. Najpierw zjedź głębiej: G1 Z-10 F800.',
      'Podpowiedź 2/3: Następnie powtórz cztery linie ruchu z Warstwy 1.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20” linie:\nG1 Z-10 F800\nG1 X25 Y55 F2000\nG1 X75 Y55\nG1 X75 Y25\nG1 X25 Y25',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S18000 M3
G43 H1 Z20
G0 X25 Y25 Z5
G1 Z-5 F800
G1 X25 Y55 F2000
G1 X75 Y55
G1 X75 Y25
G1 X25 Y25
G1 Z-10 F800
G1 X25 Y55 F2000
G1 X75 Y55
G1 X75 Y25
G1 X25 Y25
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Podział obróbki na dwie warstwy po 5 mm chroni smukły frez Ø6 mm przed nadmiernym ugięciem bocznym.',
    quiz: [
      {
        id: 'q_m6_04',
        questionPl: 'Dlaczego przy wycinaniu głębokich konturów smukłym frezem walcowym dzielimy głębokość na kilka warstw (Step-Down)?',
        optionsPl: [
          'Aby zmniejszyć siły boczne działające na frez, uniknąć jego ugięcia i złamania oraz ułatwić wyrzucanie wiórów z wąskiego rowka',
          'Ponieważ sterownik CNC nie obsługuje liczb mniejszych niż -5',
          'Aby zużyć więcej prądu',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Zbyt duża głębokość skrawania na jedno przejście powoduje drgania (chatter), pogorszenie jakości ścianki i ryzyko złamania narzędzia.',
      },
    ],
  },
];

// ============================================================================
// MODUŁ 7: CENTRUM TOKARSKO-FREZARSKIE MILL-TURN (OŚ C + OŚ Y + LIVE TOOLING)
// ============================================================================
export const MODULE_7_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 7.1
  // ==========================================================================
  {
    id: 'M7_01',
    moduleId: 'MODULE_7',
    orderIndex: 1,
    titlePl: 'Lekcja 7.1: Centrum Tokarsko-Frezarskie (Mill-Turn) – napędzane oprawki i oś obrotowa C',
    shortSubtitlePl: 'Jak wytoczyć wałek i wyfrezować na nim rowki wpustowe w jednym zamocowaniu bez przekładania na frezarkę',
    theoryParagraphsPl: [
      '1. CZYM JEST CENTRUM TOKARSKO-FREZARSKIE (MILL-TURN)?\nW klasycznym warsztacie wałek najpierw toczono na tokarce, a potem zdejmowano i zanoszono na frezarkę, żeby wyfrezować rowek pod wpust lub wywiercić otwory w kołnierzu. Każde przepięcie detalu między dwiema maszynami to strata czasu i utrata współosiowości! Nowoczesne centrum **Mill-Turn** łączy obie maszyny w jedną:\n• Główny **uchwyt 3-szczękowy** (zobacz go pod detalem w oknie 3D!) potrafi przełączyć się z szybkiego wirowania tokarskiego w precyzyjną **oś obrotową `C`** pozycjonowaną co `0.001°`!\n• W głowicy rewolwerowej zamontowane są **oprawki napędzane (Live Tooling)** z własnym silnikiem, który obraca frezem lub wiertłem!',
      '2. INDEKSOWANIE OSI C (C0 -> C180)\nGdy uchwyt tokarski pracuje w trybie osi `C`, podanie w kodzie `G0 C180` obraca uchwyt z detalem dokładnie o `180°` (zobacz w symulatorze 3D, jak obracają się szczęki uchwytu!).',
      '3. ZADANIE PRAKTYCZNE\nW edytorze napędzany frez `T1` wyfrezował już pierwszy rowek wpustowy przy kącie uchwytu `C0` (od `X30 Y40` do `X70 Y40` na `Z-4`). Po odjeździe `G0 Z20` obróć uchwyt tokarski o pół obrotu (`G0 X30 Y40 Z5 C180`), zagłęb się na `Z-4` i wyfrezuj symetryczny rowek po drugiej stronie wałka (`G1 X70 Y40 Z-4 C180 F300`)!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Live Tooling', meaningPl: 'Oprawka napędzana w głowicy tokarki pozwalająca wiercić i frezować przy zatrzymanym wrzecionie głównym', examplePl: 'W przemysłowych Fanucach uruchamiana kodem M133 / M3' },
      { codeOrSymbol: 'Oś C (0°..360°)', meaningPl: 'Tryb pozycjonowania kątowego wrzeciona tokarki (uchwytu 3-szczękowego)', examplePl: 'G0 C180 (obrót detalu o 180°)' },
      { codeOrSymbol: 'Done-in-One', meaningPl: 'Kompletna obróbka toczenia i frezowania w jednym zamocowaniu bez przekładania części', examplePl: 'Idealna współosiowość toczenia i frezowania' },
    ],
    anatomyBreakdown: {
      titlePl: 'Pozycjonowanie narzędzia napędzanego z obrotem uchwytu na C180:',
      lineCode: 'G0 X30 Y40 Z5 C180',
      parts: [
        { token: 'G0 X30 Y40 Z5', explanationPl: 'Dojazd napędzanego frezu nad początek drugiego rowka' },
        { token: 'C180', explanationPl: 'Obrót uchwytu 3-szczękowego z detalem na kąt 180°' },
      ],
    },
    stepByStepGuidePl: [
      'Zwróć uwagę na 3-szczękowy uchwyt tokarski pod detalem w oknie 3D.',
      'Pod komentarzem drugiego rowka dopisz: `G0 X30 Y40 Z5 C180`.',
      'Następnie zjedź `G1 Z-4 F180` i wyfrezuj rowek `G1 X70 Y40 Z-4 C180 F300`, po czym kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Na prawdziwym centrum Mill-Turn przed obróceniem osi `C` na nowy kąt zawsze wycofaj narzędzie napędzane poza obrys detalu (`G0 Z20`), aby obracające się szczęki lub detal nie uderzyły w oprawkę!',
    machineConfig: MILL_TURN_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 7.1: Centrum Mill-Turn - dwa symetryczne rowki wpustowe C0 i C180)
T1 M6 (Oprawka napedzana Live Tool - frez fi 10 mm)
G21 G90 G17 G54
S3000 M3
G43 H1 Z20

(--- Rowek wpustowy 1 przy kacie uchwytu C0 ---)
G0 X30 Y40 Z5 C0
G1 Z-4 F180
G1 X70 Y40 Z-4 C0 F300
G0 Z20

(--- ZADANIE: Obroc uchwyt na C180 i wyfrezuj drugi rowek od X30 Y40 do X70 Y40 na Z-4! ---)


G0 Z20
G0 C0
M5
M30`,
    taskDescriptionPl:
      'Po wyfrezowaniu pierwszego rowka wpustowego przy C = 0°, obróć uchwyt tokarski na kąt C = 180° (G0 X30 Y40 Z5 C180), zagłęb się na Z = -4 mm i wyfrezuj drugi rowek do (X70, Y40, Z-4, C180).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Operacja Mill-Turn wykonana bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wyfrezowano pierwszy rowek przy C = 0°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -4, a: 0, c: 180 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wyfrezowano drugi rowek po obróceniu uchwytu na C = 180°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Najpierw ustaw pozycję i obróć oś C na 180 stopni: G0 X30 Y40 Z5 C180',
      'Podpowiedź 2/3: Następnie zagłęb frez: G1 Z-4 F180',
      'Podpowiedź 3/3: Dopisz przejście robocze: G1 X70 Y40 Z-4 C180 F300',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3000 M3
G43 H1 Z20
G0 X30 Y40 Z5 C0
G1 Z-4 F180
G1 X70 Y40 Z-4 C0 F300
G0 Z20
G0 X30 Y40 Z5 C180
G1 Z-4 F180
G1 X70 Y40 Z-4 C180 F300
G0 Z20
G0 C0
M5
M30`,
    solutionExplanationPl:
      'Indeksowanie osi C o 180° pozwala wykonać dwa idealnie symetryczne rowki wpustowe na wałku w jednym zamocowaniu tokarskim.',
    quiz: [
      {
        id: 'q_m7_01',
        questionPl: 'Co oznacza termin „Live Tooling” (narzędzia napędzane) w centrach tokarsko-frezarskich Mill-Turn?',
        optionsPl: [
          'Oprawki w głowicy rewolwerowej posiadające własny napęd obrotowy do wiercenia i frezowania przy zatrzymanym lub pozycjonowanym osiowo (oś C) uchwycie tokarskim',
          'Noże tokarskie świecące w ciemności',
          'Ręczne pilniki używane przez operatora',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Narzędzia napędzane (Live Tooling) w połączeniu z osią C zmieniają tokarkę w pełnoprawne centrum obróbcze.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 7.2
  // ==========================================================================
  {
    id: 'M7_02',
    moduleId: 'MODULE_7',
    orderIndex: 2,
    titlePl: 'Lekcja 7.2: Wiercenie kołnierza po okręgu podziałowym (Cykl G81 + oś C: 0°, 90°, 180°, 270°)',
    shortSubtitlePl: 'Jak wywiercić 4 otwory na obwodzie tarczy bez przeliczania współrzędnych X i Y',
    theoryParagraphsPl: [
      '1. WIERCENIE OTWORÓW NA OKRĘGU PODZIAŁOWYM W MILL-TURN\nNa klasycznej frezarce 3-osiowej, aby wywiercić 4 otwory rozmieszczone co `90°` na kołnierzu, musiałbyś wyznaczyć współrzędne `(X, Y)` dla każdego otworu osobno. Na centrum **Mill-Turn** z osią `C` jest to wielokrotnie prostsze: napędzane wiertło `T3` staje w jednym stałym promieniu, a pomiędzy otworami **obracamy sam uchwyt z tarczą o kolejne `90°`** (`C0` → `C90` → `C180` → `C270`)!',
      '2. POŁĄCZENIE CYKLU G81 Z INDEKSOWANIEM OSI C\nUruchamiamy modalny cykl wiercenia `G98 G81 X75 Y40 Z-12 R3 C0 F180`, a w kolejnych blokach podajemy kolejne pozycje kątowe osi `C`!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze wywiercono już dwa pierwsze otwory przy kątach `C0` (w `X75 Y40`) oraz `C90` (w `X50 Y65`). Dopisz dwa kolejne otwory kołnierza: dla kąta `C180` w punkcie `X25 Y40 C180` oraz dla kąta `C270` w punkcie `X50 Y15 C270` przed odwołaniem `G80`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'C0, C90, C180, C270', meaningPl: 'Podział kątowy pełnego obrotu tarczy na 4 równe części co 90°', examplePl: '360° / 4 otwory = skok 90°' },
      { codeOrSymbol: 'G98 G81 ... C...', meaningPl: 'Cykl wiercenia osiowego wyzwalany dla kolejnych położeń kątowych kołnierza', examplePl: 'Zawsze odwoływany kodem G80' },
    ],
    anatomyBreakdown: {
      titlePl: 'Kolejny otwór na kołnierzu z indeksem kątowym C180:',
      lineCode: 'X25 Y40 C180',
      parts: [
        { token: 'X25 Y40', explanationPl: 'Pozycja otworu na obwodzie kołnierza' },
        { token: 'C180', explanationPl: 'Obrót uchwytu 3-szczękowego na kąt 180° przed wywierceniem otworu' },
      ],
    },
    stepByStepGuidePl: [
      'Pod linią `X50 Y65 C90` dopisz trzeci otwór kołnierza: `X25 Y40 C180`.',
      'W kolejnej linii (przed `G80`) dopisz czwarty otwór kołnierza: `X50 Y15 C270`.',
      'Kliknij „✔ Sprawdź zadanie” i obserwuj w 3D obrót szczęk uchwytu przy każdym otworze!',
    ],
    commonMistakeWarningPl:
      'Przy wierceniu na kołnierzu zawsze stosuj `G98` (powrót do wysokiego Z początkowego), aby podczas obrotu uchwytu `C` wiertło znajdowało się wysoko ponad wystającymi szczękami uchwytu tokarskiego!',
    machineConfig: MILL_TURN_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 3,
    starterCode: `(Lekcja 7.2: Wiercenie 4 otworow na kolnierzu - G81 + os C co 90 stopni)
T3 M6 (Napedzane wiertlo fi 6 mm)
G21 G90 G17 G54
S2500 M3 M8
G43 H3 Z20

G0 X75 Y40 Z15 C0
(Otwor 1 przy C0 oraz Otwor 2 przy C90)
G98 G81 X75 Y40 Z-12 R3 C0 F180
X50 Y65 C90

(ZADANIE: Dopisz w cyklu G81 dwa kolejne otwory kolnierza:)
(1. X25 Y40 C180)
(2. X50 Y15 C270)


G80
G0 Z25 C0 M9
M5
M30`,
    taskDescriptionPl:
      'W aktywnym cyklu wiercenia G81 dopisz dwa brakujące otwory kołnierza dla kątów C = 180° (X25 Y40 C180) oraz C = 270° (X50 Y15 C270).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Wiercenie kołnierza wykonane bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 25, y: 40, z: -12, a: 0, c: 180 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wywiercono trzeci otwór kołnierza w X25 Y40 Z-12 przy C = 180°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 15, z: -12, a: 0, c: 270 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wywiercono czwarty otwór kołnierza w X50 Y15 Z-12 przy C = 270°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Cykl G81 jest modalny – wystarczy dopisać dwie linie przed G80.',
      'Podpowiedź 2/3: Pierwsza linia to: X25 Y40 C180',
      'Podpowiedź 3/3: Druga linia to: X50 Y15 C270',
    ],
    solutionCode: `T3 M6
G21 G90 G17 G54
S2500 M3 M8
G43 H3 Z20
G0 X75 Y40 Z15 C0
G98 G81 X75 Y40 Z-12 R3 C0 F180
X50 Y65 C90
X25 Y40 C180
X50 Y15 C270
G80
G0 Z25 C0 M9
M5
M30`,
    solutionExplanationPl:
      'Połączenie modalnego cyklu G81 z indeksowaniem osi C (0°, 90°, 180°, 270°) pozwala błyskawicznie wykonać siatkę otworów na kołnierzu wałka.',
    quiz: [
      {
        id: 'q_m7_02',
        questionPl: 'O jaki kąt w osi C musimy indeksować uchwyt tokarski pomiędzy kolejnymi otworami, jeśli chcemy wywiercić 6 równomiernie rozmieszczonych otworów na kołnierzu?',
        optionsPl: [
          'Co 60° (360° / 6 = 60°)',
          'Co 45°',
          'Co 100°',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Pełny okrąg ma 360°, więc dla 6 symetrycznych otworów skok kątowy wynosi 360° / 6 = 60°.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 7.3
  // ==========================================================================
  {
    id: 'M7_03',
    moduleId: 'MODULE_7',
    orderIndex: 3,
    titlePl: 'Lekcja 7.3: Frezowanie płaszczyzn pod klucz płaski (Oś Y + indeksowanie osi C)',
    shortSubtitlePl: 'Jak użyć dodatkowej osi Y na tokarce Mill-Turn do frezowania kwadratu lub sześciokąta',
    theoryParagraphsPl: [
      '1. PO CO W TOKARCE MILL-TURN JEST OŚ Y?\nKlasyczna tokarka ma tylko dwie osie liniowe: `X` i `Z`. Aby jednak napędzany frez mógł przejechać płasko w poprzek czopa wałka i wyfrezować **ściankę pod klucz płaski (Wrench Flat)** lub **sześciokąt śruby**, głowica rewolwerowa na centrum Mill-Turn posiada dodatkową **oś liniową `Y`**!',
      '2. FREZOWANIE ŚCIANEK CO 90° LUB 60°\nFrezujemy pierwszą płaską ściankę przejazdem osi `Y` od `Y20` do `Y60` przy `C0`, następnie wycofujemy narzędzie, obracamy uchwyt na `C90` (lub `C60` dla sześciokąta) i powtarzamy przejazd osi `Y`!',
      '3. ZADANIE PRAKTYCZNE\nW edytorze wyfrezowano już dwie ścianki pod klucz przy `C0` (wzdłuż `X25`, od `Y20` do `Y60` na `Z-6`) oraz przy `C90` (wzdłuż `Y65`, od `X25` do `X75` na `Z-6`). Dopisz trzecią ściankę przy kącie `C180`: ustaw `G0 X75 Y20 Z5 C180`, zjedź `G1 Z-6 F200` i przefrezuj ściankę ruchem osi Y: `G1 X75 Y60 Z-6 C180 F350`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'Oś Y w Mill-Turn', meaningPl: 'Dodatkowa oś poprzeczna głowicy rewolwerowej umożliwiająca frezowanie płaskich ścianek na wałku', examplePl: 'G1 Y60 F350 (przejazd płaski w poprzek wałka)' },
      { codeOrSymbol: 'G12.1 / TRANSMIT', meaningPl: 'Alternatywna interpolacja biegunowa (X+C) na tokarkach bez fizycznej osi Y', examplePl: 'Przelicza ruch X i obrót C na linię prostą' },
    ],
    anatomyBreakdown: {
      titlePl: 'Frezowanie ścianki pod klucz przejazdem w osi Y przy C180:',
      lineCode: 'G1 X75 Y60 Z-6 C180 F350',
      parts: [
        { token: 'G1 X75 Y60', explanationPl: 'Przejazd wzdłuż osi Y od Y20 do Y60 na stałym wymiarze X75' },
        { token: 'Z-6 C180', explanationPl: 'Głębokość ścianki 6 mm przy zablokowanym uchwycie na kącie 180°' },
      ],
    },
    stepByStepGuidePl: [
      'Pod komentarzem Ścianki 3 ustaw pozycję początkową i kąt uchwytu `C180`: `G0 X75 Y20 Z5 C180`.',
      'Zagłęb frez na `Z-6`: `G1 Z-6 F200`.',
      'Przefrezuj płaską ściankę pod klucz ruchem w osi Y: `G1 X75 Y60 Z-6 C180 F350` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Podczas frezowania płaszczyzn pod klucz na centrum Mill-Turn upewnij się, że włączony jest hamulec wrzeciona osi `C` (w przemyśle kod `M14` / `M68`) – zablokowanie tarczy hamulcowej usztywnia uchwyt podczas ciężkiego frezowania!',
    machineConfig: MILL_TURN_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 7.3: Frezowanie plaszczyzn pod klucz - os Y + indeksowanie C)
T1 M6
G21 G90 G17 G54
S3200 M3
G43 H1 Z20

(--- Scianka 1 przy C0 ---)
G0 X25 Y20 Z5 C0
G1 Z-6 F200
G1 X25 Y60 Z-6 C0 F350
G0 Z20

(--- Scianka 2 przy C90 ---)
G0 X25 Y65 Z5 C90
G1 Z-6 F200
G1 X75 Y65 Z-6 C90 F350
G0 Z20

(--- Scianka 3 przy C180 - ZADANIE ---)
(Dojedz G0 X75 Y20 Z5 C180, zagleb sie G1 Z-6 F200)
(i przefrezuj scianke G1 X75 Y60 Z-6 C180 F350!)


G0 Z20
G0 C0
M5
M30`,
    taskDescriptionPl:
      'Dopisz obróbkę trzeciej ścianki pod klucz przy kącie uchwytu C = 180°: dojedź do (X75, Y20, Z5, C180), zjedź na Z = -6 mm i przefrezuj płaszczyznę ruchem G1 do (X75, Y60, Z-6, C180).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Frezowanie ścianek pod klucz wykonane bez błędów',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 20, z: -6, a: 0, c: 180 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Zagłębiono frez na początku trzeciej ścianki (X75 Y20 Z-6, C180)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 60, z: -6, a: 0, c: 180 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wyfrezowano trzecią ściankę pod klucz do X75 Y60 Z-6 przy C = 180°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Ustaw narzędzie i obróć oś C na 180°: G0 X75 Y20 Z5 C180',
      'Podpowiedź 2/3: Zjedź na głębokość ścianki: G1 Z-6 F200',
      'Podpowiedź 3/3: Wykonaj przejazd wzdłuż osi Y: G1 X75 Y60 Z-6 C180 F350',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S3200 M3
G43 H1 Z20
G0 X25 Y20 Z5 C0
G1 Z-6 F200
G1 X25 Y60 Z-6 C0 F350
G0 Z20
G0 X25 Y65 Z5 C90
G1 Z-6 F200
G1 X75 Y65 Z-6 C90 F350
G0 Z20
G0 X75 Y20 Z5 C180
G1 Z-6 F200
G1 X75 Y60 Z-6 C180 F350
G0 Z20
G0 C0
M5
M30`,
    solutionExplanationPl:
      'Współpraca osi liniowej Y oraz indeksowania osi C pozwala wyfrezować wielokąt pod klucz bezpośrednio na wytoczonym czopie wałka.',
    quiz: [
      {
        id: 'q_m7_03',
        questionPl: 'Która funkcja sterownika pozwala wyfrezować płaską ściankę lub sześciokąt na tokarce z osią C, która NIE posiada fizycznej osi liniowej Y?',
        optionsPl: [
          'Interpolacja współrzędnych biegunowych (G12.1 w Fanuc / TRANSMIT w Sinumerik), która przelicza ruch osi X i obrót osi C na prostoliniowy tor',
          'Wyłączenie chłodziwa M9',
          'Zmiana jednostek na cale G20',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Gdy tokarka nie ma osi Y, funkcja G12.1 (Polar Coordinate Interpolation) synchronizuje posuw X z obrotem C tak, aby frez wycinał płaskie ścianki.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 7.4
  // ==========================================================================
  {
    id: 'M7_04',
    moduleId: 'MODULE_7',
    orderIndex: 4,
    titlePl: 'Lekcja 7.4: Interpolacja cylindryczna (G07.1 / TRACYL) – rowek krzywkowy z płynnym obrotem osi C',
    shortSubtitlePl: 'Jednoczesny ruch posuwowy narzędzia i obrót uchwytu C podczas skrawania',
    theoryParagraphsPl: [
      '1. INTERPOLACJA CYLINDRYCZNA (CYLINDRICAL INTERPOLATION – G07.1 / TRACYL)\nW poprzednich lekcjach oś `C` obracała się tylko wtedy, gdy narzędzie było wycofane w powietrze (obróbka indeksowana). A co, jeśli będziemy **obracać oś `C` jednocześnie z ruchem roboczym `G1` narzędzia skrawającego w materiale**? W ten sposób powstają **rowki krzywkowe (Cam Grooves)**, prowadnice śrubowe i ślimaki podajników!',
      '2. ZROZUMIENIE SYNCHRONIZACJI RUCHU LINIOWEGO Z KĄTEM C\nGdy w jednym bloku `G1` podamy np. `G1 X80 Y60 Z-5 C360 F400`, sterownik płynnie zsynchronizuje ruch liniowy głowicy z obrotem uchwytu tokarskiego aż do kąta `360°`.',
      '3. ZADANIE PRAKTYCZNE\nW edytorze narzędzie `T4` (`Ø6 mm`) wyfrezowało już pierwszą połowę rowka krzywkowego od `(X20, Y20, Z-5, C0)` do `(X50, Y40, Z-5, C180)`. Dopisz drugą połowę krzywki z jednoczesnym obrotem uchwytu do pełnego obrotu `C360`: `G1 X80 Y60 Z-5 C360 F400`!',
    ],
    cheatSheetRows: [
      { codeOrSymbol: 'G07.1 (Fanuc) / TRACYL', meaningPl: 'Interpolacja cylindryczna (rozwinięcie pobocznicy walca na płaską mapę X/Z + C)', examplePl: 'Pozwala programować łuki G2/G3 na powierzchni walca' },
      { codeOrSymbol: 'G1 X80 Y60 Z-5 C360', meaningPl: 'Jednoczesny ruch liniowy głowicy i obrót osi C do 360°', examplePl: 'Wytwarzanie krzywki bębnowej w jednym zamocowaniu' },
    ],
    anatomyBreakdown: {
      titlePl: 'Jednoczesna interpolacja liniowo-kątowa z osią C:',
      lineCode: 'G1 X80 Y60 Z-5 C360 F400',
      parts: [
        { token: 'G1 X80 Y60 Z-5', explanationPl: 'Ruch roboczy frezu T4 na głębokości Z = -5 mm' },
        { token: 'C360', explanationPl: 'Jednoczesny płynny obrót uchwytu tokarskiego z 180° do 360°' },
      ],
    },
    stepByStepGuidePl: [
      'Narzędzie `T4` stoi w połowie rowka krzywkowego w punkcie `(X50, Y40, Z-5, C180)`.',
      'Dopisz drugi odcinek z obrotem do `C360`: `G1 X80 Y60 Z-5 C360 F400`.',
      'Kliknij „✔ Sprawdź zadanie” i obejrzyj w 3D jednoczesny ruch wrzeciona i obrót 3-szczękowego uchwytu tokarskiego!',
    ],
    commonMistakeWarningPl:
      'Przy jednoczesnej interpolacji z osią `C` używaj frezów walcowych o średnicy równej szerokości rowka krzywkowego lub stosuj kompensację w ramach funkcji `G07.1` / `TRACYL`, aby ścianki boczne krzywki nie zostały podcięte!',
    machineConfig: MILL_TURN_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 4,
    starterCode: `(Lekcja 7.4: Rowek krzywkowy - jednoczesna interpolacja z osia obrotowa C)
T4 M6 (Frez walcowy fi 6 mm)
G21 G90 G17 G54
S3500 M3 M8
G43 H4 Z20

G0 X20 Y20 Z5 C0
G1 Z-5 F200

(Pierwsza polowa krzywki: do X50 Y40 Z-5 z obrotem uchwytu do C180)
G1 X50 Y40 Z-5 C180 F400

(ZADANIE: Dopisz druga polowe krzywki ruchem G1 do punktu X80 Y60 Z-5 z obrotem do C360!)


G0 Z20 M9
G0 C0
M5
M30`,
    taskDescriptionPl:
      'Dokończ nacinanie rowka krzywkowego narzędziem T4 na głębokości Z = -5 mm: z punktu (X50, Y40, Z-5, C180) wykonaj jednoczesny ruch G1 do punktu (X80, Y60, Z-5) z obrotem uchwytu do C = 360°.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Interpolacja z osią C wykonana bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: -5, a: 0, c: 180 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano pierwszą część krzywki do X50 Y40 Z-5 przy C = 180°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 60, z: -5, a: 0, c: 360 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano drugą część krzywki do X80 Y60 Z-5 przy C = 360°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Stoisz w X50 Y40 Z-5 przy C180.',
      'Podpowiedź 2/3: Podaj w jednej linii G1 współrzędne końcowe X80 Y60 Z-5 oraz kąt C360.',
      'Podpowiedź 3/3: Dopisz linię: G1 X80 Y60 Z-5 C360 F400',
    ],
    solutionCode: `T4 M6
G21 G90 G17 G54
S3500 M3 M8
G43 H4 Z20
G0 X20 Y20 Z5 C0
G1 Z-5 F200
G1 X50 Y40 Z-5 C180 F400
G1 X80 Y60 Z-5 C360 F400
G0 Z20 M9
G0 C0
M5
M30`,
    solutionExplanationPl:
      'Synchronizacja ruchu liniowego z obrotem osi C (0° -> 180° -> 360°) pozwala wykonywać złożone rowki śrubowe i krzywkowe w jednym zamocowaniu na centrum Mill-Turn.',
    quiz: [
      {
        id: 'q_m7_04',
        questionPl: 'Jak nazywa się funkcja przemysłowych sterowników CNC (G07.1 w Fanuc / TRACYL w Sinumerik) służąca do programowania rowków krzywkowych na rozwiniętej powierzchni walca z udziałem osi C?',
        optionsPl: [
          'Interpolacja cylindryczna (Cylindrical Interpolation)',
          'Korekcja zużycia długościowego',
          'Bazowanie referencyjne G28',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Interpolacja cylindryczna pozwala programować kontury i łuki na pobocznicy walca tak, jakby powierzchnia walca została rozwinięta na płaszczyznę.',
      },
    ],
  },
];

export const MODULES_5_TO_7_LESSONS: LessonDefinition[] = [
  ...MODULE_5_LESSONS,
  ...MODULE_6_LESSONS,
  ...MODULE_7_LESSONS,
];
