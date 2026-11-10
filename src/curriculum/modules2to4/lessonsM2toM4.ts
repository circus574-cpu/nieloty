/**
 * Kompletne scenariusze lekcji dla Modułów 2, 3 i 4:
 * - Moduł 2 (M2_01..M2_04): Tokarka CNC z głowicą rewolwerową (osie X i Z, T0101, G96/G97/G50, wałek wielostopniowy)
 * - Moduł 3 (M3_01..M3_04): Frezarka 4-osiowa z podzielnicą (oś obrotowa A wokół osi X, indeksowanie 3+1 i ruch śrubowy 4-osiowy)
 * - Moduł 4 (M4_01..M4_04): Frezarka 5-osiowa (osie obrotowe A i C, obróbka 3+2, TCPM/RTCP G43.4 oraz porównanie 4 dialektów:
 *   Fanuc/Haas, Siemens Sinumerik, Heidenhain Klartext i GRBL/LinuxCNC).
 */

import {
  DEFAULT_MILL_STOCK,
  EARLY_LESSON_VALIDATION_POLICY,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../../core/machines/presets';
import type { LessonDefinition } from '../../core/types/curriculum';
import type { MachineConfig } from '../../core/types/machine';

/** Rozszerzona konfiguracja maszyny z opisem edukacyjnym dla Modułu 2 (symulacja profili tokarskich X/Z w przestrzeni 3D) */
const MODULE_2_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'lathe-2axis-edu-sim',
  name: 'Tokarka CNC – profil X/Z w symulatorze 3D (Moduł 2)',
};

/** Konfiguracja maszyny dla Modułu 3 (Frezarka 4-osiowa z osią obrotową A) */
const MODULE_3_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'mill-4axis-edu',
  name: 'Frezarka 4-osiowa CNC z podzielnicą A (Moduł 3)',
  limits: {
    ...MILL_3AXIS_MACHINE.limits,
    a: { min: -360, max: 360 },
  },
};

/** Konfiguracja maszyny dla Modułu 4 (Frezarka 5-osiowa ze stołem uchylno-obrotowym A i C) */
const MODULE_4_MACHINE: MachineConfig = {
  ...MILL_3AXIS_MACHINE,
  id: 'mill-5axis-edu',
  name: 'Frezarka 5-osiowa CNC z kołyską A i tarczą C (Moduł 4)',
  limits: {
    ...MILL_3AXIS_MACHINE.limits,
    a: { min: -120, max: 120 },
    c: { min: -360, max: 360 },
  },
};

// ============================================================================
// MODUŁ 2: TOKARKA CNC Z GŁOWICĄ REWOLWEROWĄ (OSIE X I Z)
// ============================================================================
export const MODULE_2_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 2.1
  // ==========================================================================
  {
    id: 'M2_01',
    moduleId: 'MODULE_2',
    orderIndex: 1,
    titlePl: 'Lekcja 2.1: Kinematyka tokarki CNC – dlaczego obraca się detal, a oś X liczy średnicę',
    shortSubtitlePl: 'Układ współrzędnych tokarki (osie X i Z) oraz zasada wymiarowania średnicowego',
    theoryParagraphsPl: [
      '1. ODWRÓCENIE RÓL: NA TOKARCE OBRACA SIĘ PRZEDMIOT, A NIE NARZĘDZIE!\nNa frezarce (Moduł 1) detal stał nieruchomo w imadle, a wrzeciono kręciło frezem. Na tokarce CNC jest dokładnie odwrotnie: walcowy pręt (wałek) jest zaciśnięty w trójszczękowym uchwycie tokarskim i wiruje z dużą prędkością, natomiast nieruchomy nóż tokarski zbliża się do niego i zdziera kolejne warstwy metalu.',
      '2. TYLKO DWIE OSIE PODSTAWOWE: OŚ Z (DŁUGOŚĆ) ORAZ OŚ X (ŚREDNICA)\nKlasyczna tokarka CNC używa dwóch osi:\n• Oś Z pokrywa się dokładnie z osią obrotu wrzeciona (wzdłuż długości wałka). Punkt Z0 ustawia się na prawym czole wałka. Ruch w stronę uchwytu tokarskiego (w głąb wałka) to zawsze Z ujemne (np. Z-30).\n• Oś X jest prostopadła do osi wrzeciona i odpowiada za ŚREDNICĘ wałka (ruch poprzeczny noża). Oś obrotu wałka (sam środek) to X0.',
      '3. PUŁAPKA POCZĄTKUJĄCEGO: WYMIAROWANIE ŚREDNICOWE W OSI X!\nPonieważ wałek obraca się wokół własnej osi, zbliżenie noża tokarskiego o 1 mm do osi obrotu zbiera 1 mm materiału „od góry” i jednocześnie 1 mm „od dołu” obracającego się wałka! Dlatego na tokarkach CNC oś X programuje się bezpośrednio na ŚREDNICĘ (Diameter Programming). Jeśli wałek ma średnicę Ø60 mm i wpiszesz X56, nóż przesunie się fizycznie o 2 mm w głąb materiału (głębokość skrawania ap = 2 mm na stronę), a gotowy wałek będzie miał średnicę dokładnie 56 mm.',
      '4. JAK ĆWICZYMY PROFILE TOKARSKIE W NASZYM SYMULATORZE 3D?\nAbyś mógł obserwować ścieżkę noża i zdejmowanie warstwy w jednym spójnym środowisku 3D bez błędów nieobsługiwanych kodów, w zadaniach Modułu 2 odwzorowujemy przekrój wzdłużny toczenia w płaszczyźnie osi X (w zakresie X20..X90) oraz osi Z (głębokość Z-2..Z-8) wzdłuż stałej linii środkowej Y40. Dzięki temu każde przejście G0/G1/G2/G3 możesz zbadać krokowo w 3D!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Oś Z (tokarka)',
        meaningPl: 'Oś wzdłużna (równoległa do osi wrzeciona). Z0 to prawe czoło wałka, Z- to ruch w stronę uchwytu',
        examplePl: 'G1 Z-40 F150 (toczenie wzdłużne na długość 40 mm)',
      },
      {
        codeOrSymbol: 'Oś X (średnicowo)',
        meaningPl: 'Oś poprzeczna określająca ŚREDNICĘ detalu w milimetrach (X0 = oś obrotu wrzeciona)',
        examplePl: 'X50 oznacza średnicę Ø50 mm (promień 25 mm)',
      },
      {
        codeOrSymbol: 'ap = (D0 - D1) / 2',
        meaningPl: 'Głębokość skrawania na stronę (warstwa zbierana przez nóż) to połowa różnicy średnic',
        examplePl: 'Przejście z Ø60 na Ø56 to ap = 2 mm na stronę',
      },
      {
        codeOrSymbol: 'G18 (płaszczyzna XZ)',
        meaningPl: 'Domyślna płaszczyzna robocza na tokarce CNC (osie X oraz Z)',
        examplePl: 'Łuki G2/G3 na tokarce leżą w płaszczyźnie XZ',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku wzdłużnego przejścia tokarskiego w osiach X i Z:',
      lineCode: 'G1 X80 Z-4 F200',
      parts: [
        { token: 'G1', explanationPl: 'Ruch roboczy prostoliniowy ze skrawaniem materiału' },
        { token: 'X80', explanationPl: 'Współrzędna docelowa w osi X (wzdłuż profilu toczonego stopnia)' },
        { token: 'Z-4', explanationPl: 'Pozycja w osi Z (głębokość warstwy skrawanej Z = -4 mm)' },
        { token: 'F200', explanationPl: 'Prędkość posuwu roboczego (200 mm/min w symulatorze; na tokarce często G95 F0.2 mm/obr.)' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz do edytora kodu G-code poniżej: narzędzie najpierw podjeżdża nad początek profilu w punkcie X20 Y40 Z5.',
      'Następnie zagłębia się ruchem roboczym G1 na Z-4 mm i wykonuje przejście tylko do X50.',
      'Zmień współrzędną docelową w linii „G1 X50 Y40 Z-4 F200” z X50 na X85, aby wytoczyć pełną długość odcinka od X20 do X85 na głębokości Z-4.',
      'Kliknij „✔ Sprawdź zadanie”, aby zweryfikować trajektorię w symulatorze!',
    ],
    commonMistakeWarningPl:
      'Najczęstszy błąd początkującego tokarza CNC: chęć zmniejszenia średnicy wałka o 2 mm i wpisanie średnicy mniejszej o 1 mm (lub odwrotnie – pomylenie promienia ze średnicą). Zawsze pamiętaj: na tokarce X oznacza ŚREDNICĘ (2 × promień)!',
    machineConfig: MODULE_2_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: EARLY_LESSON_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 2.1: Osie X i Z - profil wzdłużny)
T1 M6
G21 G90 G17 G54
S1800 M3
G43 H1 Z20

(Dojazd nad poczatek profilu w osi X20 przy Y40)
G0 X20 Y40 Z5
G1 Z-4 F150

(Zadanie: wydluz przejscie robocze w osi X z X50 do X85 na glebokosci Z-4)
G1 X50 Y40 Z-4 F200

G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Zmodyfikuj ruch roboczy G1 w programie tak, aby narzędzie po wejściu w materiał w punkcie (X20, Y40, Z-4) przetoczyło wzdłużny odcinek aż do punktu końcowego X = 85 mm, Y = 40 mm, Z = -4 mm.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów składniowych i bez kolizji G0 z materiałem',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 20, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie rozpoczęło skrawanie w punkcie początkowym X20 Y40 Z-4',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 85, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie przetoczyło profil ruchem roboczym G1 do punktu X85 Y40 Z-4',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Zwróć uwagę na linię „G1 X50 Y40 Z-4 F200”. Obecnie narzędzie zatrzymuje się w połowie detalu na X50.',
      'Podpowiedź 2/3: Zmień w tej linii współrzędną X50 na X85, pozostawiając Y40, Z-4 oraz F200.',
      'Podpowiedź 3/3: Wpisz: G1 X85 Y40 Z-4 F200 (przed linią G0 Z20) i kliknij przycisk sprawdzania zadania.',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S1800 M3
G43 H1 Z20
G0 X20 Y40 Z5
G1 Z-4 F150
G1 X85 Y40 Z-4 F200
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Ruch roboczy G1 X85 Y40 Z-4 F200 prowadzi wierzchołek narzędzia wzdłuż osi X od X20 do X85 na stałej głębokości Z-4 mm, symulując wzdłużne przejście tokarskie.',
    quiz: [
      {
        id: 'q_m2_01',
        questionPl: 'Wałek na tokarce CNC ma średnicę Ø50 mm. Nóż tokarski zbiera warstwę o głębokości ap = 1.5 mm na stronę. Jaką współrzędną X należy zaprogramować?',
        optionsPl: [
          'X48.5 (bo 50 - 1.5 = 48.5)',
          'X47 (bo zebranie 1.5 mm na stronę zmniejsza średnicę o 2 × 1.5 = 3 mm)',
          'X23.5 (bo wpisujemy promień wałka)',
        ],
        correctOptionIndex: 1,
        explanationPl: 'Na tokarce CNC oś X programujemy średnicowo. Zebranie 1.5 mm warstwy z obracającego się wałka zmniejsza jego średnicę o 3.0 mm (po 1.5 mm z każdej strony osi obrotu), czyli z Ø50 mm na X47.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 2.2
  // ==========================================================================
  {
    id: 'M2_02',
    moduleId: 'MODULE_2',
    orderIndex: 2,
    titlePl: 'Lekcja 2.2: Głowica rewolwerowa i wywołanie narzędzia na tokarce (zapis T0101)',
    shortSubtitlePl: 'Jak działa rewolwer narzędziowy i dlaczego na tokarce słowo T ma cztery cyfry',
    theoryParagraphsPl: [
      '1. GŁOWICA REWOLWEROWA (TOOL TURRET) ZAMIAST MAGAZYNU Z ŁAPĄ\nNa frezarce wymiana narzędzia trwa kilka sekund: ramię podaje oprawkę z magazynu do wrzeciona za pomocą rozkazu „T1 M6”, a w kolejnej linii włączamy korekcję długości „G43 H1”. Na tokarce CNC narzędzia (noże do toczenia zgrubnego, wykańczającego, wytaczaki, przecinaki) są zamocowane na stałe wokół obrotowej tarczy nazywanej GŁOWICĄ REWOLWEROWĄ (Turret). Obrót tarczy do właściwego gniazda trwa ułamek sekundy!',
      '2. TAJEMNICA CZTEROCYFROWEGO KODU T0101 (FANUC / HAAS LATHE)\nW tokarkach ze sterowaniem Fanuc lub Haas nie pisze się osobno M6 ani G43 H1. Zamiast tego stosuje się czterocyfrowe słowo T, np. „T0101” lub „T0202”:\n• Pierwsze dwie cyfry (01) to NUMER GNIAZDA w głowicy rewolwerowej (obróć tarczę na nóż nr 1).\n• Drugie dwie cyfry (01) to NUMER KOREKTORA GEOMETRII I ZUŻYCIA (odpowiednik H i D z frezarki, zawierający wysięg noża w osi X, w osi Z oraz promień naroża płytki R).',
      '3. KOREKCJA ZUŻYCIA PŁYTKI (WEAR OFFSET) W CODZIENNEJ PRACY OPERATORA\nKiedy płytka węglikowa na nożu tokarskim lekko się stępi (zetrze o 0.03 mm), ztoczony wałek wychodzi o 0.06 mm za gruby na średnicy. Operator nie zmienia wtedy programu G-code! Wchodzi w tabelę „Offset / Wear” dla korektora 01 i wpisuje w kolumnie X wartość -0.06 mm. Przy kolejnym wywołaniu T0101 sterownik sam przesunie nóż o 0.03 mm bliżej osi wałka.',
      '4. ZAPIS W NASZYM SYMULATORZE 3D\nW naszym wspólnym symulatorze 3D wywołujemy narzędzie nr 1 (zgrubne) i narzędzie nr 2 (wykańczające) za pomocą standardowych poleceń „T1 M6” + „G43 H1” oraz „T2 M6” + „G43 H2”, umieszczając w komentarzu ich odpowiednik tokarski `(T0101)` oraz `(T0202)`. Dzięki temu przećwiczysz kompletną dwunarzędziową obróbkę: przejście zgrubne i wykańczające!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'T0101 (tokarka Fanuc)',
        meaningPl: 'Obróć głowicę rewolwerową na narzędzie nr 01 i wczytaj korektor geometryczny/zużycia nr 01',
        examplePl: 'T0101 (odpowiednik T1 M6 + G43 H1 na frezarce)',
      },
      {
        codeOrSymbol: 'T0100',
        meaningPl: 'Narzędzie nr 01 z odwołaniem korektora (00 = wyzerowanie kompensacji przed odjazdem do bazy)',
        examplePl: 'G0 X150 Z100 T0100',
      },
      {
        codeOrSymbol: 'T2 M6 + G43 H2',
        meaningPl: 'Pobranie drugiego narzędzia (wykańczającego) wraz z jego korekcją długości H2 w symulatorze',
        examplePl: 'T2 M6 w jednej linii, G43 H2 Z20 w kolejnej linii',
      },
      {
        codeOrSymbol: 'Naddatek wykańczający',
        meaningPl: 'Cienka warstwa materiału (np. 1 mm w osi Z) zostawiona po obróbce zgrubnej dla drugiego noża',
        examplePl: 'T1 toczy na Z-4, a T2 wykańcza na gotowo na Z-5',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Porównanie wywołania noża wykańczającego na tokarce (T0202) i w symulatorze:',
      lineCode: 'T2 M6 (Tokarka: T0202 - noz wykanczajacy)',
      parts: [
        { token: 'T2 M6', explanationPl: 'Zmień aktywne narzędzie na nr 2 (w tokarce Fanuc pierwsze dwie cyfry: T02..)' },
        { token: 'G43 H2', explanationPl: 'Wczytaj korektor długości nr 2 (w tokarce Fanuc drugie dwie cyfry: ..02)' },
        { token: '(T0202)', explanationPl: 'Zapis łączony na tokarce: gniazdo 02 + korektor 02' },
      ],
    },
    stepByStepGuidePl: [
      'Przeanalizuj kod startowy: narzędzie T1 (zgrubne) wykonuje przejście od X20 do X80 na głębokości Z-4 mm, zostawiając 1 mm naddatku.',
      'Po odjeździe na Z20 w kodzie brakuje wywołania drugiego narzędzia T2 (wykańczającego) oraz przejścia na gotową głębokość Z-5 mm.',
      'Dopisz wymianę na narzędzie drugie (`T2 M6`), włączenie korekcji długości (`G43 H2 Z20`), włączenie wrzeciona (`S2400 M3`), a następnie dojazd `G0 X20 Y40 Z5`, wejście `G1 Z-5 F120` i przejście wykańczające `G1 X80 Y40 Z-5 F150`.',
      'Pamiętaj o bezpiecznym odjeździe `G0 Z20` przed `M30` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'Błąd krytyczny na hali: wpisanie na tokarce T0201 zamiast T0202! Głowica obróci się wtedy na nóż nr 2, ale sterownik wczyta długość noża nr 1 – jeśli nóż nr 2 wystaje bardziej, uderzy z pełną prędkością w obracający się wałek!',
    machineConfig: MODULE_2_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 2.2: Obróbka zgrubna T1 / T0101 i wykanczajaca T2 / T0202)
(--- OPERACJA 1: ZGRUBNA T1 / T0101 na Z-4 ---)
T1 M6 (Tokarka: T0101 - noz zgrubny)
G21 G90 G17 G54
S1800 M3
G43 H1 Z20

G0 X20 Y40 Z5
G1 Z-4 F150
G1 X80 Y40 Z-4 F250
G0 Z20

(--- OPERACJA 2: WYKANCZAJACA T2 / T0202 na Z-5 ---)
(Zadanie: wywolaj T2 M6, wlacz G43 H2 Z20 oraz S2400 M3,)
(a nastepnie zbierz naddatek od X20 Y40 do X80 Y40 na glebokosci Z-5!)


M5
M30`,
    taskDescriptionPl:
      'Po przejściu zgrubnym narzędziem T1 (na głębokości Z = -4 mm) dodaj operację wykańczającą narzędziem T2 (odpowiednik T0202 na tokarce): wymień narzędzie na T2 (T2 M6), aktywuj korekcję długości H2 (G43 H2 Z20), a następnie wykonaj przejście robocze G1 na głębokości Z = -5 mm od punktu (X20, Y40, Z-5) do punktu (X80, Y40, Z-5).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i z poprawną korekcją długości dla obu narzędzi',
      },
      {
        kind: 'USED_TOOL_POCKETS',
        requiredPockets: [1, 2],
        requireInOrder: true,
        descriptionPl: 'Użyto kolejno narzędzia zgrubnego T1, a następnie narzędzia wykańczającego T2',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'LENGTH_COMP', mode: 'G43', registerH: 2 },
        descriptionPl: 'Aktywowano korektor długości H2 (G43 H2) dla drugiego narzędzia T2',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -5, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano przejście wykańczające ruchem roboczym G1 do punktu X80 Y40 Z-5',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Po linii „G0 Z20” kończącej pracę pierwszego narzędzia wpisz wymianę na drugie narzędzie: T2 M6, a pod nią: S2400 M3 oraz G43 H2 Z20.',
      'Podpowiedź 2/3: Następnie podjedź ruchem szybkim nad początek ścieżki: G0 X20 Y40 Z5 i zagłęb się na gotowy wymiar: G1 Z-5 F120.',
      'Podpowiedź 3/3: Dodaj przejście wykańczające: G1 X80 Y40 Z-5 F150 oraz odjazd bezpieczeństwa: G0 Z20 przed M5 i M30.',
    ],
    solutionCode: `(Lekcja 2.2: Obróbka zgrubna T1 / T0101 i wykanczajaca T2 / T0202)
T1 M6
G21 G90 G17 G54
S1800 M3
G43 H1 Z20

G0 X20 Y40 Z5
G1 Z-4 F150
G1 X80 Y40 Z-4 F250
G0 Z20

T2 M6
S2400 M3
G43 H2 Z20
G0 X20 Y40 Z5
G1 Z-5 F120
G1 X80 Y40 Z-5 F150
G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Pierwsze narzędzie (T1 z korektorem H1, odpowiednik T0101) wykonuje przejście zgrubne na Z-4 mm, a drugie narzędzie (T2 z korektorem H2, odpowiednik T0202) zbiera 1 mm naddatku wykańczającego na Z-5 mm.',
    quiz: [
      {
        id: 'q_m2_02',
        questionPl: 'Co oznaczają poszczególne cyfry w tokarskim rozkazie wywołania narzędzia T0303 (sterowanie Fanuc/Haas)?',
        optionsPl: [
          'Obróć wrzeciono o 303 stopnie',
          'Wybierz narzędzie w gnieździe nr 03 głowicy rewolwerowej i uaktywnij korektor geometrii/zużycia nr 03',
          'Włącz obroty 303 obr./min na 3 sekundy',
        ],
        correctOptionIndex: 1,
        explanationPl: 'W czterocyfrowym zapisie T0303 pierwsze dwie cyfry (03) wybierają pozycję narzędzia w głowicy rewolwerowej, a dwie ostatnie (03) wczytują przypisany mu rejestr korekcyjny.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 2.3
  // ==========================================================================
  {
    id: 'M2_03',
    moduleId: 'MODULE_2',
    orderIndex: 3,
    titlePl: 'Lekcja 2.3: Planowanie czoła wałka oraz stała prędkość skrawania G96, G97 i limit G50',
    shortSubtitlePl: 'Dlaczego przy zbliżaniu noża do środka wałka obroty wrzeciona muszą rosnąć',
    theoryParagraphsPl: [
      '1. PIERWSZA OPERACJA NA KAŻDYM WAŁKU: PLANOWANIE CZOŁA (FACING)\nSurowy pręt ucięty na pile taśmowej ma nierówną, chropowatą prawą ściankę. Dlatego obróbkę tokarską zaczyna się od PLANOWANIA CZOŁA: nóż ustawia się na Z0 i zjeżdża w dół wzdłuż osi X (od zewnętrznej średnicy wałka aż do samego środka X0, a nawet ~0.8 mm poniżej osi, np. X-0.8, żeby na środku nie został mały „cycek”!).',
      '2. FIZYKA TOCZENIA: DLACZEGO STAŁE OBROTY (G97) NIE WYSTARCZĄ PRZY PLANOWANIU?\nWyobraź sobie karuzelę: dziecko siedzące na zewnętrznym brzegu pędzi z ogromną prędkością liniową, ale osoba stojąca w samym środku karuzeli prawie w ogóle się nie przemieszcza! Dokładnie to samo dzieje się podczas planowania czoła wałka: przy stałych obrotach wrzeciona (np. G97 S1000) prędkość skrawania Vc na średnicy Ø80 mm jest duża, ale gdy nóż zbliża się do środka wałka (X → 0), prędkość liniowa spada niemal do zera i płytka zamiast skrawać zaczyna wyrywać metal.',
      '3. ROZWIĄZANIE: STAŁA PRĘDKOŚĆ SKRAWANIA G96 ORAZ LIMIT OBROTÓW G50 (FANUC) / G92 / LIMS\nDlatego na tokarce CNC używa się pary rozkazów:\n• `G50 S3000` (w niektórych sterownikach `G92 S3000`, w Sinumeriku `LIMS=3000`) – ustawia BEZWZGLĘDNY LIMIT maksymalnych obrotów wrzeciona (np. 3000 obr./min).\n• `G96 S180 M3` – włącza STAŁĄ PRĘDKOŚĆ SKRAWANIA (Constant Surface Speed – CSS) równą Vc = 180 m/min. W miarę jak nóż jedzie w stronę środka wałka (X maleje), sterownik sam płynnie przyspiesza obroty wrzeciona ze wzoru n = (1000 × Vc) / (π × X), zatrzymując wzrost dokładnie na bezpiecznym limicie G50 S3000!',
      '4. KIEDY WRACAMY DO STAŁYCH OBROTÓW G97?\nGdy wiercisz otwór w osi wałka (wierzchołek wiertła stoi stale w punkcie X0) albo gdy gwintujesz wałek, rozkazem `G97 S1200` przełączasz tokarkę z powrotem na stałe obroty w obr./min (RPM). W poniższym ćwiczeniu wykonamy dwuprzejściowe planowanie i profilowanie (z komentarzami technologicznymi G50 i G96), aby utrwalić kolejność ruchów!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G96 S180',
        meaningPl: 'Stała prędkość skrawania (CSS – Constant Surface Speed): S oznacza prędkość Vc = 180 m/min',
        examplePl: 'Sterownik sam zwiększa obroty RPM, gdy średnica X maleje',
      },
      {
        codeOrSymbol: 'G50 S3000 (lub G92)',
        meaningPl: 'Ograniczenie maksymalnych obrotów wrzeciona na tokarce (ochrona przed rozbiegnięciem przy X → 0)',
        examplePl: 'Zawsze programuj G50 S... PRZED włączeniem G96!',
      },
      {
        codeOrSymbol: 'G97 S1500',
        meaningPl: 'Stałe obroty wrzeciona w obr./min (RPM) – używane do wiercenia, gwintowania i odjazdów',
        examplePl: 'G97 S1500 M3',
      },
      {
        codeOrSymbol: 'G95 vs G94',
        meaningPl: 'G95 = posuw w mm na obrót (np. F0.2 mm/obr. na tokarce), G94 = posuw w mm na minutę',
        examplePl: 'W symulatorze 3D używamy posuwu minutowego (np. F200)',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Wzorcowy nagłówek prędkości skrawania na tokarce przemysłowej Fanuc:',
      lineCode: 'G50 S3000 / G96 S180 M3',
      parts: [
        { token: 'G50 S3000', explanationPl: 'Ustaw bezpieczny sufit prędkości wrzeciona na 3000 obr./min' },
        { token: 'G96', explanationPl: 'Włącz tryb stałej prędkości skrawania (Constant Surface Speed w m/min)' },
        { token: 'S180', explanationPl: 'Utrzymuj stałą prędkość liniową materiału Vc = 180 m/min pod ostrzem noża' },
        { token: 'M3', explanationPl: 'Uruchom obroty wrzeciona' },
      ],
    },
    stepByStepGuidePl: [
      'W edytorze zobaczysz przygotowane pierwsze przejście planujące od zewnętrznej krawędzi X85 do środka X20 (w linii Y40 na głębokości Z-2).',
      'Po pierwszym przejściu narzędzie wycofuje się na Z5 i wraca nad X85 Y40.',
      'Twoim zadaniem jest dopisanie drugiego, dokładnego przejścia planującego na głębokości Z-4: zjedź w osi X od X85 Y40 Z-4 aż do punktu X20 Y40 Z-4.',
      'Kliknij „✔ Sprawdź zadanie”, aby potwierdzić splanowanie obu warstw!',
    ],
    commonMistakeWarningPl:
      'Włączenie G96 bez wcześniejszego limitu G50 S... podczas planowania czoła do X0 spowoduje, że przy dojeździe noża do środka wałka wrzeciono rozkręci się do maksymalnych obrotów konstrukcyjnych maszyny – przy dużym detalu siła odśrodkowa może wyrwać go ze szczęk uchwytu!',
    machineConfig: MODULE_2_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 2.3: Planowanie czola i stala predkosc skrawania)
(Tokarka przemyslowa: G50 S3000 - limit max obrotow 3000 RPM)
(Tokarka przemyslowa: G96 S180 M3 - stala predkosc Vc = 180 m/min)
T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

(1. Pierwsze przejscie od zewnatrz X85 do srodka X20 na Z-2)
G0 X85 Y40 Z5
G1 Z-2 F150
G1 X20 Y40 Z-2 F220
G0 Z5

(2. Zadanie: wroc szybko G0 nad X85 Y40 Z5, zagleb sie G1 na Z-4)
(i wykonaj drugie przejscie planujace G1 do punktu X20 Y40 Z-4!)
G0 X85 Y40 Z5


G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Dokończ program dwuprzejściowego planowania: po powrocie narzędzia nad punkt (X85, Y40, Z5) zagłęb się ruchem roboczym G1 na głębokość Z = -4 mm i wykonaj drugie przejście skrawające G1 od X85 do punktu końcowego (X20, Y40, Z-4).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak błędów i kolizji (powrót nad materiałem odbywa się na bezpiecznej wysokości Z5)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 20, y: 40, z: -2, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano pierwsze przejście robocze na głębokości Z-2 do X20 Y40',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 85, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Zagłębiono narzędzie na Z-4 w punkcie początkowym X85 Y40',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 20, y: 40, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano drugie przejście planujące G1 do punktu X20 Y40 Z-4',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Narzędzie stoi już w punkcie „G0 X85 Y40 Z5”. Najpierw opuść je ruchem roboczym na głębokość Z-4: G1 Z-4 F150.',
      'Podpowiedź 2/3: Następnie przejedź ruchem roboczym G1 w stronę środka do współrzędnej X20 przy Y40 i Z-4.',
      'Podpowiedź 3/3: Dopisz pod „G0 X85 Y40 Z5” dwie linie:\nG1 Z-4 F150\nG1 X20 Y40 Z-4 F220',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

G0 X85 Y40 Z5
G1 Z-2 F150
G1 X20 Y40 Z-2 F220
G0 Z5

G0 X85 Y40 Z5
G1 Z-4 F150
G1 X20 Y40 Z-4 F220

G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Między kolejnymi przejściami tokarskimi narzędzie najpierw odskakuje od materiału (G0 Z5), wraca ruchem szybkim nad początek profilu (G0 X85 Y40 Z5), a następnie wchodzi na nową głębokość skrawania (G1 Z-4) i wykonuje przejście do X20.',
    quiz: [
      {
        id: 'q_m2_03',
        questionPl: 'Dlaczego przed włączeniem stałej prędkości skrawania (G96) na tokarce CNC obowiązkowo programuje się kod G50 S... (np. G50 S3000)?',
        optionsPl: [
          'Aby ustawić temperaturę chłodziwa na 50 stopni',
          'Aby ograniczyć maksymalne obroty wrzeciona, gdy nóż zbliża się do osi obrotu wałka (X → 0)',
          'Aby wyzerować licznik wykonanych detali',
        ],
        correctOptionIndex: 1,
        explanationPl: 'W trybie G96 sterownik zwiększa obroty wrzeciona wraz ze zmniejszaniem się średnicy X. Bez limitu G50 S... przy X dążącym do zera obroty wzrosłyby do niebezpiecznego maksimum maszyny.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 2.4
  // ==========================================================================
  {
    id: 'M2_04',
    moduleId: 'MODULE_2',
    orderIndex: 4,
    titlePl: 'Lekcja 2.4: Toczenie konturu wielostopniowego z fazą i zaokrągleniem (G1, G2/G3)',
    shortSubtitlePl: 'Łączenie odcinków prostoliniowych, stożków (faz) i łuków R na profilu wałka',
    theoryParagraphsPl: [
      '1. JAK POWSTAJE WAŁEK WIELOSTOPNIOWY ZE STOŻKIEM I PROMIENIEM?\nRzeczywiste części maszynowe (osie, czopy pod łożyska, sworznie) rzadko mają jedną średnicę na całej długości. Zazwyczaj składają się z kilku stopni połączonych:\n• FAZĄ (stożkiem) – wykonywaną jednoczesnym ruchem liniowym G1 w dwóch osiach,\n• ZAOKRĄGLENIEM NAROŻA (promieniem przejścia pod łożysko) – wykonywanym interpolacją kołową G2 lub G3 z parametrem R.',
      '2. PROGRAMOWANIE STOŻKA I FAZY ZA POMOCĄ G1\nAby wytoczyć stożek lub fazę wejściową, wystarczy podać w jednym bloku `G1` obie współrzędne końca skosu. Maszyna zsynchronizuje napęd obu osi tak, że wierzchołek noża pojedzie idealnie po linii skośnej od punktu początkowego do końcowego.',
      '3. ZAOKRĄGLENIA NAROŻY ZA POMOCĄ G2 / G3 R...\nPrzejścia łukowe zmniejszają koncentrację naprężeń w wałku (dzięki czemu wałek nie pęka pod obciążeniem). Zapis `G2 X... Y... R15` (lub na tokarce w płaszczyźnie XZ: `G2 X... Z... R...`) płynnie łączy dwa sąsiednie odcinki konturu łukiem o zadanym promieniu.',
      '4. ZADANIE PODSUMOWUJĄCE MODUŁ 2\nW tym zadaniu poprowadzisz narzędzie wzdłuż trzystopniowego profilu z łukiem przejściowym R15 na głębokości Z = -4 mm: najpierw odcinek prosty od (X20, Y30) do (X50, Y30), następnie łuk prawoskrętny G2 o promieniu R15 do punktu (X65, Y45), i na końcu drugi stopień prostoliniowy G1 do punktu (X85, Y45).',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Faza / stożek (G1)',
        meaningPl: 'Jednoczesny ruch w dwóch osiach tworzy skos lub powierzchnię stożkową',
        examplePl: 'G1 X50 Y30 Z-4 F200',
      },
      {
        codeOrSymbol: 'G2 ... R15',
        meaningPl: 'Zaokrąglenie przejścia między stopniami wałka łukiem zgodnym z ruchem wskazówek zegara',
        examplePl: 'G2 X65 Y45 R15 F180',
      },
      {
        codeOrSymbol: 'TNRC (G41/G42 na tokarce)',
        meaningPl: 'Kompensacja promienia naroża płytki tokarskiej (Tool Nose Radius Compensation)',
        examplePl: 'Zapobiega błędom kształtu na stożkach i łukach wywołanym zaokrąglonym czubkiem noża',
      },
      {
        codeOrSymbol: 'Cykle G71 / G70',
        meaningPl: 'W przemyśle kontur zgrubny toczy się cyklem G71, a wykańczający cyklem G70 po tym samym opisie profilu',
        examplePl: 'Pozwala opisać docelowy kształt wałka tylko raz w programie',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku przejścia łukowego między dwoma stopniami profilu:',
      lineCode: 'G2 X65 Y45 R15 F180',
      parts: [
        { token: 'G2', explanationPl: 'Interpolacja kołowa (łuk prawoskrętny CW łączący pierwszy i drugi stopień)' },
        { token: 'X65 Y45', explanationPl: 'Współrzędne punktu końcowego łuku na początku drugiego stopnia' },
        { token: 'R15', explanationPl: 'Promień zaokrąglenia naroża R = 15 mm' },
        { token: 'F180', explanationPl: 'Posuw roboczy na łuku (180 mm/min)' },
      ],
    },
    stepByStepGuidePl: [
      'W kodzie startowym narzędzie wykonuje już pierwszy stopień prostoliniowy od (X20, Y30, Z-4) do (X50, Y30, Z-4).',
      'Z punktu (X50, Y30, Z-4) dopisz przejście łukowe G2 o promieniu R15 do punktu (X65, Y45): `G2 X65 Y45 R15 F180`.',
      'Następnie dopisz drugi stopień prostoliniowy G1 z punktu (X65, Y45) do punktu końcowego (X85, Y45): `G1 X85 Y45 Z-4 F200`.',
      'Kliknij „✔ Sprawdź zadanie”, aby obejrzeć gotowy profil ze stopniem łukowym!',
    ],
    commonMistakeWarningPl:
      'Pamiętaj, że kod G2 jest MODALNY! Po wykonaniu łuku G2 musisz w następnej linii jawnie wpisać z powrotem `G1`, zanim zaczniesz kolejny prostoliniowy stopień wałka (X85 Y45).',
    machineConfig: MODULE_2_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 2.4: Profil wielostopniowy z zaokragleniem R15)
T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

(1. Dojazd i pierwszy stopien prostoliniowy do X50 Y30 Z-4)
G0 X20 Y30 Z5
G1 Z-4 F150
G1 X50 Y30 Z-4 F200

(2. Zadanie: dopisz luk G2 do punktu X65 Y45 o promieniu R15,)
(a nastepnie drugi stopien prostoliniowy G1 do punktu X85 Y45 Z-4!)


G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Uzupełnij kontur wielostopniowy na głębokości Z = -4 mm: z punktu (X50, Y30, Z-4) wykonaj łuk prawoskrętny G2 o promieniu R = 15 mm do punktu (X65, Y45, Z-4), a następnie przejedź odcinkiem prostym G1 do punktu końcowego (X85, Y45, Z-4).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów geometrycznych łuku i bez kolizji',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CW',
        expectedRadiusMm: 15,
        toleranceMm: 0.5,
        descriptionPl: 'Wykonano przejście łukowe G2 o promieniu R = 15 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 65, y: 45, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Narzędzie przeszło przez koniec łuku w punkcie X65 Y45 Z-4',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 85, y: 45, z: -4, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        descriptionPl: 'Wykonano drugi stopień prostoliniowy G1 do punktu X85 Y45 Z-4',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Po linii „G1 X50 Y30 Z-4 F200” dodaj blok łuku prawoskrętnego G2 kończącego się w X65 Y45 z promieniem R15.',
      'Podpowiedź 2/3: Po łuku G2 koniecznie przełącz maszynę z powrotem na ruch prostoliniowy G1 i pojedź do X85 Y45.',
      'Podpowiedź 3/3: Wpisz przed „G0 Z20” dwie linie:\nG2 X65 Y45 R15 F180\nG1 X85 Y45 Z-4 F200',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

G0 X20 Y30 Z5
G1 Z-4 F150
G1 X50 Y30 Z-4 F200
G2 X65 Y45 R15 F180
G1 X85 Y45 Z-4 F200

G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Blok G2 X65 Y45 R15 F180 tworzy ćwierćokrąg o promieniu 15 mm łączący pierwszy stopień (Y30) z drugim stopniem (Y45), po czym G1 X85 Y45 Z-4 F200 wykańcza drugi stopień wałka.',
    quiz: [
      {
        id: 'q_m2_04',
        questionPl: 'Co stanie się, jeśli po bloku łukowym „G2 X65 Y45 R15” wpiszesz w kolejnej linii samo „X85 Y45” bez słowa G1?',
        optionsPl: [
          'Maszyna automatycznie przełączy się na ruch prostoliniowy G1',
          'Sterownik zgłosi błąd (brak R/I/J dla łuku), ponieważ kod G2 jest modalny i nadal pozostaje aktywny',
          'Maszyna zatrzyma wrzeciono',
        ],
        correctOptionIndex: 1,
        explanationPl: 'Kody ruchu G0, G1, G2, G3 należą do tej samej grupy modalnej. Dopóki nie wpiszesz G1, sterownik oczekuje w kolejnych blokach parametrów łuku G2.',
      },
    ],
  },
];

// ============================================================================
// MODUŁ 3: FREZARKA 4-OSIOWA (DODATKOWA OŚ OBROTOWA A WOKÓŁ OSI X)
// ============================================================================
export const MODULE_3_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 3.1
  // ==========================================================================
  {
    id: 'M3_01',
    moduleId: 'MODULE_3',
    orderIndex: 1,
    titlePl: 'Lekcja 3.1: Czym jest czwarta oś (oś obrotowa A)? Obróbka indeksowana 3+1',
    shortSubtitlePl: 'Podzielnica CNC na stole frezarki, reguła prawej dłoni i kąty obrotu A',
    theoryParagraphsPl: [
      '1. PO CO FREZARCE CZWARTA OŚ?\nNa zwykłej frezarce 3-osiowej (X, Y, Z) narzędzie podchodzi do materiału wyłącznie od góry. Jeśli musisz wyfrezować kieszeń z przodu, z tyłu i od spodu kostki, operator musi aż 4 razy otwierać drzwi maszyny, odkręcać imadło, obracać detal ręcznie i bazować go od nowa. Każde przepięcie to strata czasu i ryzyko przesunięcia wymiarów!',
      '2. PODZIELNICA CNC – OŚ OBROTOWA A (WOKÓŁ OSI X)\nProblem ten rozwiązuje zamontowanie na stole frezarki czwartej osi – tzw. PODZIELNICY CNC (Rotary Table / 4th Axis). W standardzie ISO osie obrotowe nazywamy literami A, B, C przypisanymi odpowiednio do osi liniowych X, Y, Z:\n• Oś A obraca przedmiot wokół osi X,\n• Oś B obraca wokół osi Y,\n• Oś C obraca wokół osi Z.\nWspółrzędną osi A podaje się zawsze w STOPNIACH KĄTOWYCH (np. `A0`, `A90`, `A180`, `A-45`).',
      '3. REGUŁA PRAWEJ DŁONI I OBRÓBKA INDEKSOWANA 3+1\nSkąd wiedzieć, w którą stronę obróci się podzielnica przy `A90`? Wyciągnij prawą dłoń i skieruj kciuk w stronę dodatniej osi X+ (w prawo). Zgięte palce pokażą kierunek dodatniego obrotu A+! Najpopularniejszy sposób pracy na 4 osiach to tzw. OBRÓBKA INDEKSOWANA 3+1: najpierw przy bezpiecznie uniesionym narzędziu (np. `Z20`) podzielnica obraca detal na zadany kąt (`G0 A90`), zaciska hamulec hydrauliczny, a następnie frez obrabia ściankę zwykłymi ruchami X, Y, Z.',
      '4. ZADANIE PRAKTYCZNE: PIERWSZE INDEKSOWANIE OSI A\nW edytorze poniżej narzędzie stoi na bezpiecznej wysokości Z20. Twoim zadaniem jest obrócenie osi A na kąt `A90` (90 stopni), podjechanie nad środek ścianki (X50, Y40, Z5) i wykonanie rowka roboczego G1 na głębokości Z-3 mm od X30 do X70 przy ustawionym kącie A = 90°.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'A (oś obrotowa)',
        meaningPl: 'Czwarta oś CNC obracająca detal wokół osi X; wartość podawana w stopniach (°)',
        examplePl: 'G0 A90 (obróć podzielnicę na kąt 90 stopni)',
      },
      {
        codeOrSymbol: 'Obróbka 3+1 (indeksowana)',
        meaningPl: 'Oś A ustawia kąt w powietrzu i blokuje hamulec, po czym frez skrawa w 3 osiach X, Y, Z',
        examplePl: 'G0 Z25 -> G0 A90 -> G1 Z-3 F200',
      },
      {
        codeOrSymbol: 'Reguła prawej dłoni',
        meaningPl: 'Kciuk prawej ręki wskazuje X+, a zgięte palce kierunek obrotu dodatniego A+',
        examplePl: 'A0 = góra, A90 = ścianka boczna (90°), A180 = spód detalu',
      },
      {
        codeOrSymbol: 'Baza Z0 w 4 osiach',
        meaningPl: 'W przemyśle Z0 i Y0 często ustawia się dokładnie w osi obrotu uchwytu podzielnicy',
        examplePl: 'Dzięki temu obrót osi A nie przesuwa bazy względem środka obrotu',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bezpiecznego indeksowania czwartej osi i ruchu roboczego:',
      lineCode: 'G0 X30 Y40 Z5 A90',
      parts: [
        { token: 'G0', explanationPl: 'Ruch szybki pozycjonujący (zawsze wykonywany nad detalem przy Z > 0!)' },
        { token: 'X30 Y40', explanationPl: 'Pozycja początkowa nad obrabianą ścianką w płaszczyźnie XY' },
        { token: 'Z5', explanationPl: 'Bezpieczna wysokość 5 mm nad powierzchnią detalu' },
        { token: 'A90', explanationPl: 'Kąt ustawienia osi obrotowej A równy 90.0°' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na kod startowy: w linii „G0 X30 Y40 Z5 A0” podzielnica pozostaje na kącie A0 zamiast obrócić się na ściankę boczną A90.',
      'Zmień w tej linii `A0` na `A90`, aby ustawić oś obrotową pod kątem 90 stopni.',
      'Następnie w kolejnej części dopisz ruch roboczy: `G1 X70 Y40 Z-3 A90 F250`, aby wyfrezować rowek od X30 do X70 przy kącie A90.',
      'Kliknij „✔ Sprawdź zadanie”, aby sprawdzić pozycję X, Y, Z oraz kąt osi A!',
    ],
    commonMistakeWarningPl:
      'NIGDY nie obracaj osi A (`G0 A90`), gdy frez znajduje się wewnątrz materiału (`Z < 0`)! Obracający się detal uderzy w bok frezu i natychmiast go złamie. Zawsze najpierw wycofaj oś Z wysoko w górę (np. `G0 Z20`), i dopiero wtedy zmieniaj kąt A!',
    machineConfig: MODULE_3_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 3.1: Czwarta os obrotowa A - indeksowanie 3+1)
T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

(1. Zadanie: zmien kat z A0 na A90 przy bezpiecznym dojezdzie nad detal)
G0 X30 Y40 Z5 A0

(2. Zagłębienie w materiał na Z-3 i wyfrezowanie rowka do X70 przy A90:)
G1 Z-3 F150
G1 X50 Y40 Z-3 F250

G0 Z20
M5
M30`,
    taskDescriptionPl:
      'Zmień kąt indeksowania podzielnicy z A0 na A = 90° oraz wydłuż ruch roboczy G1 na głębokości Z = -3 mm tak, aby frez wyfrezował rowek od punktu (X30, Y40, Z-3, A90) do punktu końcowego (X70, Y40, Z-3, A90).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i bez kolizji podczas indeksowania osi A',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 40, z: -3, a: 90, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Narzędzie weszło w materiał w punkcie X30 Y40 Z-3 przy kącie podzielnicy A = 90°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -3, a: 90, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wyfrezowano rowek ruchem G1 do punktu X70 Y40 Z-3 przy kącie A = 90°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: W linii „G0 X30 Y40 Z5 A0” zamień A0 na A90. Od tego momentu oś A jest ustawiona modalnie na 90 stopni.',
      'Podpowiedź 2/3: W linii „G1 X50 Y40 Z-3 F250” zamień X50 na X70 (możesz też jawnie dopisać A90).',
      'Podpowiedź 3/3: Poprawne linie to:\nG0 X30 Y40 Z5 A90\nG1 Z-3 F150\nG1 X70 Y40 Z-3 A90 F250',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

G0 X30 Y40 Z5 A90
G1 Z-3 F150
G1 X70 Y40 Z-3 A90 F250

G0 Z20
M5
M30`,
    solutionExplanationPl:
      'Po bezpiecznym ustawieniu kąta A90 na wysokości Z5, oś A pozostaje zablokowana na 90°, a ruchy G1 Z-3 i G1 X70 Y40 Z-3 wykonują obróbkę na wybranej ściance.',
    quiz: [
      {
        id: 'q_m3_01',
        questionPl: 'Wokół której osi liniowej obraca się czwarta oś oznaczana w kodzie ISO literą A?',
        optionsPl: [
          'Wokół osi X',
          'Wokół osi Y',
          'Wokół osi Z',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Zgodnie ze standardem ISO osie obrotowe A, B, C są przyporządkowane alfabetycznie do osi liniowych X, Y, Z: oś A obraca wokół X, oś B wokół Y, a oś C wokół Z.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 3.2
  // ==========================================================================
  {
    id: 'M3_02',
    moduleId: 'MODULE_3',
    orderIndex: 2,
    titlePl: 'Lekcja 3.2: Obróbka wielostronna kostki – indeksowanie A0, A90 i A180',
    shortSubtitlePl: 'Frezowanie trzech ścianek detalu w jednym zamocowaniu z bezpiecznym odjazdem Z',
    theoryParagraphsPl: [
      '1. OBRÓBKA WIELOSTRONNA W JEDNYM ZAMOCOWANIU (DONE-IN-ONE)\nNajwiększą zaletą frezarki 4-osiowej jest możliwość obrobienia trzech lub czterech ścianek detalu (co 90°: `A0`, `A90`, `A180`, `A270`) w jednym cyklu automatycznym. Detal przez cały czas trzymany jest w tym samym uchwycie podzielnicy, dzięki czemu wzajemna prostopadłość i równoległość ścianek jest idealna co do setnej części milimetra.',
      '2. ZŁOTA SEKWENCJA BEZPIECZNEGO INDEKSOWANIA MIĘDZY ŚCIANKAMI\nZa każdym razem, gdy kończysz obróbkę jednej ścianki i chcesz obrócić detal na kolejną ściankę (np. z A0 na A90, a potem na A180), musisz bezwzględnie przestrzegać 3 kroków:\n• Krok 1: Wycofaj narzędzie w osi Z ponad obrys obracającej się kostki (tzw. średnicę obrotu / Swing Clearance, np. `G0 Z20`).\n• Krok 2: Wykonaj obrót podzielnicy na nowy kąt (`G0 A90` lub `G0 A180`).\n• Krok 3: Zjedź na wysokość zbliżenia (`G0 Z5`) i rozpocznij skrawanie (`G1 Z-3 ...`).',
      '3. CZY KĄT A JEST MODALNY?\nTak! Raz zadany kąt (np. `G0 A90`) obowiązuje we wszystkich kolejnych liniach programu, dopóki nie podasz nowej wartości `A`. Możesz jednak powtarzać `A90` lub `A180` w blokach ruchu dla pełnej czytelności programu.',
      '4. ZADANIE PRAKTYCZNE\nW kodzie startowym obrobiono już dwie ścianki: przy kącie `A0` (rowek od X25 do X75 na Y40, Z-3) oraz przy kącie `A90` (rowek od X25 do X75 na Y40, Z-3). Dopisz obróbkę trzeciej ścianki po obróceniu podzielnicy na kąt `A180`!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'A0 -> A90 -> A180 -> A270',
        meaningPl: 'Indeksowanie czterech prostopadłych ścianek kostki co 90 stopni',
        examplePl: 'Każda zmiana kąta poprzedzona odjazdem G0 Z20',
      },
      {
        codeOrSymbol: 'Średnica obrotu (Swing)',
        meaningPl: 'Narożniki obracającej się kostki opisują w powietrzu okrąg o promieniu większym niż połowa boku!',
        examplePl: 'Dlatego odjazd przed obrotem A musi być wyższy niż przy zwykłym frezowaniu (np. Z20)',
      },
      {
        codeOrSymbol: 'M10 / M11 (przemysł)',
        meaningPl: 'W wielu maszynach M10 zaciska hamulec osi A, a M11 zwalnia go przed obrotem G0 A...',
        examplePl: 'Nowoczesne sterowniki wykonują zacisk hamulca automatycznie',
      },
      {
        codeOrSymbol: 'G90 A180 vs G91 A90',
        meaningPl: 'W G90 podajemy bezwzględny kąt na tarczy (180°), w G91 przyrost kąta o kolejne +90°',
        examplePl: 'G90 G0 A180',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Sekwencja przejścia z drugiej ścianki (A90) na trzecią ściankę (A180):',
      lineCode: 'G0 Z20 -> G0 X25 Y40 A180 -> G0 Z5',
      parts: [
        { token: 'G0 Z20', explanationPl: '1. Bezpieczny odjazd w górę ponad promień obrotu naroży kostki' },
        { token: 'G0 X25 Y40 A180', explanationPl: '2. Obrót podzielnicy na kąt 180° i ustawienie nad początkiem trzeciego rowka' },
        { token: 'G0 Z5', explanationPl: '3. Zbliżenie nad obróconą ściankę przed wejściem roboczym G1' },
      ],
    },
    stepByStepGuidePl: [
      'Przeanalizuj w edytorze Operację 1 (przy kącie A0) oraz Operację 2 (przy kącie A90).',
      'Po zakończeniu Operacji 2 narzędzie wycofuje się na `G0 Z20`.',
      'Pod komentarzem Operacji 3 dopisz obrót na kąt `A180` i dojazd nad początek rowka: `G0 X25 Y40 Z5 A180`.',
      'Następnie zagłęb się na Z-3 (`G1 Z-3 F150`), wyfrezuj rowek do X75 (`G1 X75 Y40 Z-3 A180 F250`) i wycofaj narzędzie (`G0 Z20`).',
    ],
    commonMistakeWarningPl:
      'Pamiętaj o geometrii przekątnej! Kostka o szerokości 80 mm podczas obrotu o 45° unosi swój narożnik wyżej niż płaska ścianka. Dlatego przed obrotem osi A zawsze wycofuj narzędzie wysoko (np. Z20), a nie na Z1 czy Z2!',
    machineConfig: MODULE_3_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 3.2: Obrobka trzech scianek A0, A90, A180)
T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

(--- SCIANKA 1: Kat A0 ---)
G0 X25 Y40 Z5 A0
G1 Z-3 F150
G1 X75 Y40 Z-3 A0 F250
G0 Z20

(--- SCIANKA 2: Kat A90 ---)
G0 X25 Y40 Z5 A90
G1 Z-3 F150
G1 X75 Y40 Z-3 A90 F250
G0 Z20

(--- SCIANKA 3: Kat A180 ---)
(Zadanie: obroc os A na A180 i wyfrezuj taki sam rowek od X25 do X75 na Y40 Z-3!)


M5
M30`,
    taskDescriptionPl:
      'Rozbuduj program o obróbkę trzeciej ścianki przy kącie podzielnicy A = 180°: po bezpiecznym odjeździe Z20 ustaw kąt A180, dojedź do (X25, Y40, Z5, A180), zagłęb się na Z = -3 mm i wyfrezuj rowek ruchem roboczym G1 do punktu (X75, Y40, Z-3, A180), po czym wycofaj narzędzie na Z20.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Brak kolizji podczas obrotów podzielnicy (wszystkie zmiany kąta A odbywają się nad materiałem)',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 40, z: -3, a: 0, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Obrobiono pierwszą ściankę do punktu X75 Y40 Z-3 przy kącie A = 0°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 40, z: -3, a: 90, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Obrobiono drugą ściankę do punktu X75 Y40 Z-3 przy kącie A = 90°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 75, y: 40, z: -3, a: 180, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Obrobiono trzecią ściankę do punktu X75 Y40 Z-3 przy kącie A = 180°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Skopiuj strukturę czterech linii ze Ścianki 2 (A90) i wklej ją w sekcji Ścianki 3.',
      'Podpowiedź 2/3: Zmień w skopiowanych liniach kąt A90 na A180.',
      'Podpowiedź 3/3: Dopisz przed M5:\nG0 X25 Y40 Z5 A180\nG1 Z-3 F150\nG1 X75 Y40 Z-3 A180 F250\nG0 Z20',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2000 M3
G43 H1 Z20

G0 X25 Y40 Z5 A0
G1 Z-3 F150
G1 X75 Y40 Z-3 A0 F250
G0 Z20

G0 X25 Y40 Z5 A90
G1 Z-3 F150
G1 X75 Y40 Z-3 A90 F250
G0 Z20

G0 X25 Y40 Z5 A180
G1 Z-3 F150
G1 X75 Y40 Z-3 A180 F250
G0 Z20

M5
M30`,
    solutionExplanationPl:
      'Program kolejno indeksuje oś A na 0°, 90° oraz 180° przy bezpiecznie podniesionym wrzecionie (Z20), wykonując na każdej ściance identyczny rowek wzdłużny od X25 do X75 na głębokości Z-3 mm.',
    quiz: [
      {
        id: 'q_m3_02',
        questionPl: 'Dlaczego przed obrotem podzielnicy z A0 na A90 przy kostce prostopadłościennej musimy unieść narzędzie znacznie wyżej niż Z1 (np. na Z20)?',
        optionsPl: [
          'Ponieważ podczas obrotu kostki jej krawędź (narożnik) zatacza łuk o promieniu przekątnej i zahaczyłaby o nisko wiszący frez',
          'Ponieważ oś A działa tylko powyżej wysokości Z15',
          'Ponieważ na wysokości Z1 nie działa chłodziwo M8',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Odległość od osi obrotu do narożnika kostki (przekątna) jest większa niż odległość do płaskiej ścianki (połowa boku). Obracający się narożnik unosi się w górę i uderzyłby w narzędzie pozostawione tuż nad ścianką.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 3.3
  // ==========================================================================
  {
    id: 'M3_03',
    moduleId: 'MODULE_3',
    orderIndex: 3,
    titlePl: 'Lekcja 3.3: Wiercenie otworów pod różnymi kątami na obwodzie (G81 + oś A)',
    shortSubtitlePl: 'Łączenie cyklu wiertarskiego G81 z indeksowaniem kątowym podzielnicy',
    theoryParagraphsPl: [
      '1. OTWORY PROMIENIOWE NA WAŁKACH I KOŁNIERZACH\nBardzo częstym zadaniem dla 4. osi jest wiercenie otworów rozmieszczonych po obwodzie tulei, tarczy lub wałka (np. otwory smarowe co 60° albo otwory pod wkręty dociskowe pod kątem 45° i 135°). Zamiast budować drogie przyrządy kątowe, używamy wiertła T3 oraz znanego Ci z Modułu 1 cyklu wiertarskiego `G81` połączonego z obrotem osi `A`!',
      '2. JAK DZIAŁA CYKL G81 Z OSIĄ OBROTOWĄ A?\nNasz sterownik obsługuje współrzędną `A` bezpośrednio wewnątrz wywołania cyklu `G81` oraz w kolejnych liniach modalnych cyklu! Gdy aktywny jest tryb `G98` (powrót do bezpiecznej płaszczyzny początkowej Z, np. Z20), po wywierceniu pierwszego otworu wiertło wraca wysoko nad detal na Z20, w kolejnej linii obraca oś A na nowy kąt i przesuwa się do nowego X, po czym wierci kolejny otwór!',
      '3. BEZPIECZEŃSTWO G98 PRZY WIERCENIU Z INDEKSOWANIEM OSI A\nPodczas wiercenia na różnych kątach osi A zawsze używaj `G98` (powrót na wysokie Z początkowe, np. Z20), a unikaj niskiego `G99` (powrót tylko na R2), aby podczas obrotu podzielnicy między otworami krawędź detalu miała duży zapas bezpieczeństwa pod czubkiem wiertła.',
      '4. ZADANIE PRAKTYCZNE\nW edytorze zamontowano wiertło Ø6 mm (`T3 M6`, `G43 H3 Z20`). Pierwszy otwór jest wiercony cyklem `G98 G81` w punkcie (X30, Y40) na głębokość Z-8 przy kącie `A45` (45°). Dopisz w kolejnych liniach wywiercenie drugiego otworu w punkcie `X50 Y40 A90` oraz trzeciego otworu w punkcie `X70 Y40 A135` przed linią `G80`!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G98 G81 X.. Y.. Z.. R.. A.. F..',
        meaningPl: 'Cykl wiercenia z powrotem na bezpieczne Z początkowe (G98) i pozycjonowaniem kąta A',
        examplePl: 'G98 G81 X30 Y40 Z-8 R3 A45 F180',
      },
      {
        codeOrSymbol: 'X50 Y40 A90 (w cyklu)',
        meaningPl: 'Kolejny otwór w aktywnym cyklu G81: obrót na A90 w powietrzu (na Z20) i wiercenie w X50 Y40',
        examplePl: 'Wystarczy podać nowe współrzędne X, Y, A bez powtarzania G81',
      },
      {
        codeOrSymbol: 'G80',
        meaningPl: 'Odwołanie cyklu wiertarskiego po wywierceniu wszystkich otworów',
        examplePl: 'Po G80 pamiętaj o wpisaniu G0 przed kolejnym ruchem!',
      },
      {
        codeOrSymbol: 'T3 M6 + G43 H3',
        meaningPl: 'Wiertło kręte Ø6 mm w gnieździe nr 3 wraz z korektorem długości H3 = 60 mm',
        examplePl: 'Standardowe narzędzie wiertarskie w naszym magazynie',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku inicjującego cykl wiercenia pod kątem 45° na podzielnicy:',
      lineCode: 'G98 G81 X30 Y40 Z-8 R3 A45 F180',
      parts: [
        { token: 'G98', explanationPl: 'Po każdym otworze wycofuj wiertło na bezpieczną wysokość początkową (Z20) przed obrotem osi A' },
        { token: 'G81', explanationPl: 'Cykl wiercenia prostego' },
        { token: 'X30 Y40', explanationPl: 'Współrzędne środka otworu' },
        { token: 'Z-8 R3', explanationPl: 'Wierć na głębokość Z = -8 mm z poziomu zbliżenia R = 3 mm' },
        { token: 'A45 F180', explanationPl: 'Ustaw kąt podzielnicy A = 45° i wierć z posuwem 180 mm/min' },
      ],
    },
    stepByStepGuidePl: [
      'Sprawdź w edytorze linię otwierającą cykl: `G98 G81 X30 Y40 Z-8 R3 A45 F180` – wierci ona pierwszy otwór w X30 Y40 przy kącie A45.',
      'Bezpośrednio pod tą linią (przed `G80`) dopisz linię dla drugiego otworu: `X50 Y40 A90`.',
      'Pod nią (również przed `G80`) dopisz linię dla trzeciego otworu: `X70 Y40 A135`.',
      'Kliknij „✔ Sprawdź zadanie”, aby zobaczyć serię trzech otworów wywierconych pod kątami 45°, 90° i 135°!',
    ],
    commonMistakeWarningPl:
      'Nie dopisuj współrzędnych kolejnych otworów PO linii `G80`! Rozkaz `G80` wyłącza cykl wiertarski (i zeruje tryb ruchu), więc wszystkie otwory w serii muszą znajdować się pomiędzy linią `G81` a linią `G80`.',
    machineConfig: MODULE_3_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 3,
    starterCode: `(Lekcja 3.3: Wiercenie otworow pod katami A45, A90, A135)
T3 M6
G21 G90 G17 G54
S1600 M3
G43 H3 Z20

(Dojazd nad pierwszy otwor i ustawienie kata A45)
G0 X30 Y40 Z20 A45

(1. Pierwszy otwor: X30 Y40 na Z-8 przy A45)
G98 G81 X30 Y40 Z-8 R3 A45 F180

(2. Zadanie: dopisz ponizej dwa kolejne otwory w cyklu:)
(   - w punkcie X50 Y40 przy kacie A90)
(   - w punkcie X70 Y40 przy kacie A135)


G80
G0 Z20 A0
M5
M30`,
    taskDescriptionPl:
      'Uzupełnij aktywny cykl wiertarski G81 (przed linią G80) o dwa kolejne otwory o głębokości Z = -8 mm: drugi otwór w punkcie (X50, Y40) przy kącie podzielnicy A = 90° oraz trzeci otwór w punkcie (X70, Y40) przy kącie podzielnicy A = 135°.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów składniowych i bez kolizji',
      },
      {
        kind: 'USED_MODAL_FEATURE',
        feature: { type: 'CANNED_CYCLE', cycle: 'G81' },
        descriptionPl: 'Użyto cyklu wiertarskiego G81',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 40, z: -8, a: 45, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wywiercono pierwszy otwór (X30 Y40 Z-8) pod kątem A = 45°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: -8, a: 90, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wywiercono drugi otwór (X50 Y40 Z-8) pod kątem A = 90°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -8, a: 135, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wywiercono trzeci otwór (X70 Y40 Z-8) pod kątem A = 135°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Ponieważ cykl G81 jest modalny, pod linią „G98 G81 X30 Y40 Z-8 R3 A45 F180” wystarczy podawać nowe współrzędne X, Y oraz kąt A.',
      'Podpowiedź 2/3: Dla drugiego otworu wpisz „X50 Y40 A90”, a dla trzeciego „X70 Y40 A135” (przed linią G80).',
      'Podpowiedź 3/3: Cała sekcja cyklu powinna wyglądać tak:\nG98 G81 X30 Y40 Z-8 R3 A45 F180\nX50 Y40 A90\nX70 Y40 A135\nG80',
    ],
    solutionCode: `T3 M6
G21 G90 G17 G54
S1600 M3
G43 H3 Z20

G0 X30 Y40 Z20 A45
G98 G81 X30 Y40 Z-8 R3 A45 F180
X50 Y40 A90
X70 Y40 A135
G80
G0 Z20 A0
M5
M30`,
    solutionExplanationPl:
      'Dzięki trybowi G98 po każdym otworze wiertło wraca na bezpieczną wysokość Z20, obraca oś A na nowy kąt (90° oraz 135°) wraz z przejazdem w osi X (X50 oraz X70) i wierci kolejne otwory na głębokość Z-8 mm.',
    quiz: [
      {
        id: 'q_m3_03',
        questionPl: 'Dlaczego podczas wiercenia otworów na różnych ściankach kątowych osi A w cyklu G81 zaleca się tryb powrotu G98 zamiast G99?',
        optionsPl: [
          'Ponieważ G98 wycofuje wiertło wysoko na poziom początkowy Z (np. Z20) przed obrotem podzielnicy do następnego otworu',
          'Ponieważ G99 wyłącza obroty wrzeciona M5',
          'Ponieważ G98 wierci dwa razy szybciej',
        ],
        correctOptionIndex: 0,
        explanationPl: 'W trybie G98 wiertło wycofuje się przed przejazdem XY/A na bezpieczną płaszczyznę początkową (np. Z20), co chroni narzędzie przed zahaczeniem o obracający się detal.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 3.4
  // ==========================================================================
  {
    id: 'M3_04',
    moduleId: 'MODULE_3',
    orderIndex: 4,
    titlePl: 'Lekcja 3.4: Jednoczesny ruch liniowy X i obrotowy A – nacinanie linii śrubowej',
    shortSubtitlePl: 'Pełna interpolacja 4-osiowa (G1 X... A...) – jak powstają krzywki i rowki śrubowe',
    theoryParagraphsPl: [
      '1. RÓŻNICA MIĘDZY OBRÓBKĄ INDEKSOWANĄ (3+1) A PŁYNNĄ 4-OSIOWĄ (SIMULTANEOUS 4-AXIS)\nW poprzednich trzech lekcjach oś A obracała się tylko w powietrzu, a podczas skrawania stała zablokowana hamulcem (tryb 3+1). Prawdziwa obróbka 4-osiowa ciągła zaczyna się wtedy, gdy w jednym bloku roboczym `G1` wpiszesz JEDNOCZEŚNIE ruch liniowy `X` oraz obrót osi `A`, gdy frez znajduje się w materiale!',
      '2. JAK POWSTAJE ROWEK ŚRUBOWY (SPIRALA NA WALCU)?\nWyobraź sobie, że frez zagłębił się w obracający się wałek w punkcie `X20 A0` na głębokość `Z-4`. Jeśli teraz wydasz polecenie:\n`G1 X80 Y40 Z-4 A360 F300`\nto w tym samym czasie, gdy stół przesuwa się jednostajnie o 60 mm wzdłuż osi X (od X20 do X80), podzielnica wykonuje pełny obrót o 360°! Złożenie ruchu prostoliniowego i obrotowego wycina na powierzchni walca idealną LINIĘ ŚRUBOWĄ (ślimak transportowy, rowek smarowy lub krzywkę bębnową).',
      '3. POSUW ODWROTNOŚCI CZASU G93 (INVERSE TIME FEED) W PRZEMYŚLE\nCiekawostka przemysłowa: ponieważ oś X mierzy się w milimetrach, a oś A w stopniach, przy jednoczesnym ruchu X+A sterowniki przemysłowe często używają trybu `G93` (odwrotność czasu, gdzie `F` określa w jakim czasie ma zostać wykonany dany odcinek) lub przeliczają posuw na średnicę wałka.',
      '4. ZADANIE PODSUMOWUJĄCE MODUŁ 3\nW edytorze wykonaj dwuetapowy rowek śrubowy na głębokości Z = -4 mm: pierwszy półobrót (od X20 A0 do X50 A180) jest już zaprogramowany. Dopisz drugi odcinek interpolacji 4-osiowej `G1`, który przesunie narzędzie do `X80 Y40 Z-4` przy jednoczesnym obrocie do pełnego kąta `A360`!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G1 X80 A360 F300',
        meaningPl: 'Jednoczesna interpolacja liniowo-obrotowa: przesuw w X z równoczesnym obrotem osi A',
        examplePl: 'Tworzy rowek śrubowy (ślimak) na powierzchni walca',
      },
      {
        codeOrSymbol: 'Skok linii śrubowej (Pitch)',
        meaningPl: 'Droga pokonana w osi X podczas jednego pełnego obrotu osi A o 360°',
        examplePl: 'Od X20 (A0) do X80 (A360) skok wynosi 60 mm na obrót',
      },
      {
        codeOrSymbol: 'G93 (przemysł)',
        meaningPl: 'Posuw odwrotności czasu (Inverse Time Feed) stosowany w programach CAM dla płynnych 4 i 5 osi',
        examplePl: 'W naszym symulatorze używamy standardowego posuwu F w mm/min',
      },
      {
        codeOrSymbol: 'G0 A0 (po odjeździe Z)',
        meaningPl: 'Odwinięcie osi obrotowej do pozycji bazowej 0° po zakończeniu obróbki',
        examplePl: 'G0 Z20 -> G0 A0',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku jednoczesnej interpolacji 4-osiowej (ruch śrubowy X + A):',
      lineCode: 'G1 X80 Y40 Z-4 A360 F300',
      parts: [
        { token: 'G1', explanationPl: 'Skoordynowany ruch roboczy wszystkich zaprogramowanych osi' },
        { token: 'X80 Y40 Z-4', explanationPl: 'Docelowa pozycja liniowa na końcu rowka przy stałej głębokości Z = -4 mm' },
        { token: 'A360', explanationPl: 'Docelowy kąt obrotu podzielnicy (pełny obrót 360.0° zsynchronizowany z ruchem X)' },
        { token: 'F300', explanationPl: 'Prędkość posuwu roboczego' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na kod startowy: frez wchodzi w materiał w punkcie `X20 Y40 Z-4` przy kącie `A0`.',
      'Następnie linia `G1 X50 Y40 Z-4 A180 F300` wykonuje pierwszą połowę zwoju śrubowego (do X50 i kąta 180°).',
      'Dopisz bezpośrednio pod nią drugi odcinek zwoju do końca wałka i pełnego obrotu: `G1 X80 Y40 Z-4 A360 F300`.',
      'Kliknij „✔ Sprawdź zadanie”, aby zaliczyć Moduł 3!',
    ],
    commonMistakeWarningPl:
      'Przy jednoczesnym ruchu X i A nigdy nie zmieniaj znaku kąta przez pomyłkę (np. `A-360` zamiast `A360`), bo podzielnica zakręci się w przeciwną stronę i przetnie już wykonaną połowę zwoju śrubowego!',
    machineConfig: MODULE_3_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 3.4: Jednoczesny ruch X oraz A - linia srubowa)
T1 M6
G21 G90 G17 G54
S2200 M3
G43 H1 Z20

(Wejscie na poczatku linii srubowej: X20 Y40 przy kacie A0)
G0 X20 Y40 Z5 A0
G1 Z-4 F150

(1. Pierwsza polowa zwoju: przejazd do X50 z obrotem do A180)
G1 X50 Y40 Z-4 A180 F300

(2. Zadanie: dopisz druga polowe zwoju G1 do punktu X80 Y40 Z-4)
(przy jednoczesnym obrocie osi A do pelnego kata A360!)


G0 Z20
G0 A0
M5
M30`,
    taskDescriptionPl:
      'Dokończ nacinanie linii śrubowej w interpolacji 4-osiowej: po osiągnięciu punktu (X50, Y40, Z-4, A180) dopisz blok roboczy G1 przemieszczający narzędzie do punktu (X80, Y40, Z-4) z jednoczesnym obrotem osi A do kąta A = 360°.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: -4, a: 180, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano pierwszą połowę linii śrubowej do X50 Y40 Z-4 przy A = 180°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 40, z: -4, a: 360, c: 0 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano drugą połowę linii śrubowej G1 do X80 Y40 Z-4 przy A = 360°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Pod linią „G1 X50 Y40 Z-4 A180 F300” dodaj kolejny blok ruchu roboczego G1.',
      'Podpowiedź 2/3: W nowym bloku ustaw współrzędną końcową X80, Y40, Z-4 oraz kąt pełnego obrotu A360.',
      'Podpowiedź 3/3: Wpisz dokładnie: G1 X80 Y40 Z-4 A360 F300 (przed linią G0 Z20).',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2200 M3
G43 H1 Z20

G0 X20 Y40 Z5 A0
G1 Z-4 F150
G1 X50 Y40 Z-4 A180 F300
G1 X80 Y40 Z-4 A360 F300

G0 Z20
G0 A0
M5
M30`,
    solutionExplanationPl:
      'Zsynchronizowanie przyrostu X (od 20 do 50 i do 80 mm) z przyrostem kąta A (od 0° do 180° i do 360°) w blokach G1 tworzy ciągły ruch śrubowy 4-osiowy.',
    quiz: [
      {
        id: 'q_m3_04',
        questionPl: 'Jaki kształt geometryczny wytnie frez na obwodzie walca, jeśli w jednym bloku G1 zaprogramujemy jednocześnie przesuw wzdłuż osi X oraz obrót osi A (np. G1 X80 A360)?',
        optionsPl: [
          'Płaską kieszeń prostokątną',
          'Rowek śrubowy (linię śrubową / helisę na powierzchni walca)',
          'Otwór stożkowy',
        ],
        correctOptionIndex: 1,
        explanationPl: 'Złożenie jednostajnego ruchu prostoliniowego wzdłuż osi walca (X) oraz ruchu obrotowego wokół jego osi (A) daje w rezultacie linię śrubową.',
      },
    ],
  },
];

// ============================================================================
// MODUŁ 4: FREZARKA 5-OSIOWA (OSIE A I C) ORAZ PORÓWNANIE DIALEKTÓW CNC
// ============================================================================
export const MODULE_4_LESSONS: LessonDefinition[] = [
  // ==========================================================================
  // LEKCJA 4.1
  // ==========================================================================
  {
    id: 'M4_01',
    moduleId: 'MODULE_4',
    orderIndex: 1,
    titlePl: 'Lekcja 4.1: Kinematyka 5-osiowa (osie A i C) – obróbka pozycjonowana 3+2 vs płynna 5-osiowa',
    shortSubtitlePl: 'Jak działa stół uchylno-obrotowy (kołyska A + tarcza C) i dlaczego 3+2 rządzi w przemyśle',
    theoryParagraphsPl: [
      '1. CZYM JEST FREZARKA 5-OSIOWA?\nFrezarka 5-osiowa posiada trzy klasyczne osie liniowe (`X`, `Y`, `Z`) oraz DWIE osie obrotowe (najczęściej `A` oraz `C`), które pozwalają ustawić obrabiany detal pod dowolnym kątem w przestrzeni trójwymiarowej względem wrzeciona. Najpopularniejsze rozwiązanie konstrukcyjne to tzw. STÓŁ UCHYLNO-OBROTOWY (Trunnion Table):\n• Kołyska (oś A) pochyla cały stół do przodu i do tyłu wokół osi X (zazwyczaj w zakresie od -120° do +120°),\n• Tarcza obrotowa (oś C) obraca detal wokół pionowej osi stołu Z o pełne 360° (jak gramofon).',
      '2. OBRÓBKA POZYCJONOWANA 3+2 (80% ZASTOSOWAŃ W PRZEMYŚLE!)\nWielu początkujących myśli, że na maszynie 5-osiowej wszystkie 5 osi porusza się bez przerwy naraz. W rzeczywistości aż ~80% obróbki 5-osiowej w fabrykach to tzw. OBRÓBKA POZYCJONOWANA 3+2 (5-Axis Indexed / 3+2 Machining)! Polega ona na tym, że najpierw dwie osie obrotowe (`A` oraz `C`) ustawiają ukośną ściankę detalu prostopadle do wrzeciona i blokują hamulce, a następnie frez obrabia tę ściankę zwykłymi, sztywnymi i bardzo dokładnymi ruchami 3-osiowymi (`X`, `Y`, `Z`).',
      '3. POZOSTAŁE 20%: PŁYNNA OBRÓBKA 5-OSIOWA (5-AXIS SIMULTANEOUS)\nJednoczesny ruch wszystkich 5 osi (`X, Y, Z, A, C` w tym samym bloku `G1`) stosuje się tam, gdzie powierzchnia ma płynnie zmienną krzywiznę: łopatki turbin lotniczych, wirniki pomp (impellery), formy wtryskowe czy implanty medyczne.',
      '4. ZADANIE PRAKTYCZNE: PIERWSZE POZYCJONOWANIE 3+2 (A ORAZ C)\nW edytorze ustaw stół uchylno-obrotowy w orientacji 3+2: pochyl kołyskę na kąt `A-30` (-30°) oraz obróć tarczę na kąt `C90` (90°), a następnie wykonaj przejście robocze G1 na głębokości Z-3 mm od punktu (X30, Y40) do punktu (X70, Y40).',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Oś A + Oś C',
        meaningPl: 'Kołyska uchylna A (wokół osi X) + tarcza obrotowa C (wokół osi Z) tworzące stół 5-osiowy',
        examplePl: 'G0 A-30 C90 (pochyl kołyskę o -30° i obróć tarczę na 90°)',
      },
      {
        codeOrSymbol: 'Obróbka 3+2',
        meaningPl: 'Zablokowanie orientacji kątowej A i C, po którym następuje obróbka w 3 osiach X, Y, Z',
        examplePl: 'Krótsze narzędzie = mniejsze drgania i wyższa dokładność niż na maszynie 3-osiowej',
      },
      {
        codeOrSymbol: 'Obróbka 5-osiowa ciągła',
        meaningPl: 'Jednoczesna interpolacja wszystkich 5 osi (X, Y, Z, A, C) podczas skrawania krzywizn',
        examplePl: 'Stosowana przy wirnikach, turbinach i głębokich formach',
      },
      {
        codeOrSymbol: 'Krótkie narzędzie',
        meaningPl: 'Dzięki pochyleniu stołu A/C możemy podejść do głębokiej kieszeni krótkim, sztywnym frezem',
        examplePl: 'Zamiast długiego frezu Ø6 o wysięgu 100 mm używamy sztywnego frezu o wysięgu 25 mm',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór pozycjonowania stołu 5-osiowego w trybie 3+2:',
      lineCode: 'G0 X30 Y40 Z5 A-30 C90',
      parts: [
        { token: 'G0', explanationPl: 'Ruch szybki pozycjonujący nad detalem' },
        { token: 'X30 Y40 Z5', explanationPl: 'Pozycja nad początkiem obrabianej ścianki na bezpiecznej wysokości Z5' },
        { token: 'A-30', explanationPl: 'Pochylenie kołyski stołu w osi A o kąt -30 stopni' },
        { token: 'C90', explanationPl: 'Obrót tarczy stołu w osi C na kąt 90 stopni' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na kod startowy: w linii pozycjonowania wpisano kąty `A0 C0` zamiast docelowej orientacji ścianki skośnej.',
      'Zmień w linii `G0 X30 Y40 Z5 A0 C0` kąty na `A-30 C90`.',
      'Następnie w ruchu roboczym `G1` upewnij się, że narzędzie przejeżdża na głębokości Z-3 mm do punktu `X70 Y40 Z-3 A-30 C90 F250`.',
      'Kliknij „✔ Sprawdź zadanie”, aby zweryfikować orientację 5-osiową 3+2!',
    ],
    commonMistakeWarningPl:
      'W obróbce 5-osiowej 3+2 zawsze najpierw odjedź osią Z wysoko do góry (`G0 Z20`), zanim zmienisz kąty `A` oraz `C`! Jednoczesny obrót kołyski A i tarczy C przy nisko opuszczonym wrzecionie to najczęstsza przyczyna kolizji stołu z obudową wrzeciona.',
    machineConfig: MODULE_4_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 4.1: Pozycjonowanie 5-osiowe 3+2 - osie A oraz C)
T1 M6
G21 G90 G17 G54
S2200 M3
G43 H1 Z20

(1. Zadanie: ustaw orientacje 3+2 pochylajac os A na A-30 i obracajac C na C90)
G0 X30 Y40 Z5 A0 C0

(2. Wyfrezuj rowek roboczy G1 na glebokosci Z-3 od X30 do X70:)
G1 Z-3 F150
G1 X50 Y40 Z-3 F250

G0 Z20
G0 A0 C0
M5
M30`,
    taskDescriptionPl:
      'Ustaw orientację stołu 5-osiowego w trybie 3+2 na kąty A = -30° oraz C = 90°, a następnie wykonaj na głębokości Z = -3 mm przejście robocze G1 od punktu (X30, Y40, Z-3) do punktu końcowego (X70, Y40, Z-3) przy zachowaniu orientacji A-30 C90.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 40, z: -3, a: -30, c: 90 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Rozpoczęto skrawanie w punkcie X30 Y40 Z-3 przy orientacji stołu A = -30°, C = 90°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -3, a: -30, c: 90 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano przejście robocze G1 do punktu X70 Y40 Z-3 przy orientacji A = -30°, C = 90°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: W linii „G0 X30 Y40 Z5 A0 C0” zamień A0 C0 na A-30 C90.',
      'Podpowiedź 2/3: W linii „G1 X50 Y40 Z-3 F250” zamień X50 na X70 (kąty A-30 i C90 pozostają aktywne modalnie lub możesz je jawnie dopisać).',
      'Podpowiedź 3/3: Wpisz:\nG0 X30 Y40 Z5 A-30 C90\nG1 Z-3 F150\nG1 X70 Y40 Z-3 A-30 C90 F250',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2200 M3
G43 H1 Z20

G0 X30 Y40 Z5 A-30 C90
G1 Z-3 F150
G1 X70 Y40 Z-3 A-30 C90 F250

G0 Z20
G0 A0 C0
M5
M30`,
    solutionExplanationPl:
      'Blok G0 X30 Y40 Z5 A-30 C90 ustawia kołyskę A na -30° i tarczę C na 90° w powietrzu nad detalem, po czym ruchy G1 wykonują obróbkę 3+2 na pochylonej ściance.',
    quiz: [
      {
        id: 'q_m4_01',
        questionPl: 'Na czym polega obróbka pozycjonowana 3+2 na frezarce 5-osiowej?',
        optionsPl: [
          'Trzy narzędzia pracują jednocześnie z dwoma wrzecionami',
          'Dwie osie obrotowe (np. A i C) ustawiają detal pod zadanym kątem i blokują pozycję, a samo skrawanie odbywa się ruchami 3-osiowymi (X, Y, Z)',
          'Maszyna używa tylko 3 osi rano i 2 osi po południu',
        ],
        correctOptionIndex: 1,
        explanationPl: 'W trybie 3+2 osie obrotowe A i C służą do ustawienia orientacji ścianki detalu względem wrzeciona, a właściwy ruch roboczy wykonywany jest przez trzy osie liniowe X, Y, Z.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 4.2
  // ==========================================================================
  {
    id: 'M4_02',
    moduleId: 'MODULE_4',
    orderIndex: 2,
    titlePl: 'Lekcja 4.2: Pochylona płaszczyzna robocza 3+2 (G68.2 / CYCLE800 / PLANE SPATIAL)',
    shortSubtitlePl: 'Jak obrabiać dwie różne ścianki skośne detalu i czym jest transformacja układu współrzędnych',
    theoryParagraphsPl: [
      '1. PROBLEM GEOMETRYCZNY PO POCHYLENIU STOŁU O KĄTY A I C\nKiedy kołyska A pochyli stół o -45°, a tarcza C obróci go o 180°, Twój detal wraz z punktem zerowym G54 przemieszcza się w przestrzeni maszyny i stoi teraz ukośnie! Gdybyś musiał ręcznie na kalkulatorze przeliczać trygonometrię dla każdego otworu na pochylonej ściance, programowanie 5-osiowe byłoby koszmarem.',
      '2. POCHYLONA PŁASZCZYZNA ROBOCZA (TILTED WORKING PLANE – TWP)\nDlatego nowoczesne sterowniki 5-osiowe posiadają specjalną funkcję POCHYLENIA UKŁADU WSPÓŁRZĘDNYCH:\n• **Fanuc / Haas**: `G68.2 X... Y... Z... I... J... K...` (ustawia nowy, pochylony układ XY równolegle do skośnej ścianki) + `G53.1` (automatycznie obraca fizyczne osie A i C tak, aby wrzeciono stało prostopadle do tej ścianki!), a odwołanie to `G69`.\n• **Siemens Sinumerik**: `CYCLE800(...)` (cykl obrotu płaszczyzny).\n• **Heidenhain TNC**: `PLANE SPATIAL SPA... SPB... SPC... TURN`.\nDzięki temu po pochyleniu ścianki programujesz na niej kieszenie, łuki G2/G3 i wiercenie G81 dokładnie tak prosto, jakby ścianka leżała płasko na stole!',
      '3. OBRÓBKA DWÓCH PRZECIWLEGŁYCH ŚCIANEK SKOŚNYCH W JEDNYM PROGRAMIE\nW praktyce warsztatowej często obrabiamy np. lewy i prawy skos dachu formy lub dwie ukośne płaszczyzny korpusu przy orientacjach `(A-45, C90)` oraz `(A-45, C270)`. Między obiema ściankami zawsze wycofujemy narzędzie wysoko w osi Z (`G0 Z20`).',
      '4. ZADANIE PRAKTYCZNE\nW edytorze obrobiono już pierwszą ściankę skośną przy orientacji `A-45 C90` (do punktu X70 Y40 Z-4). Dopisz obróbkę drugiej, przeciwległej ścianki skośnej przy orientacji `A-45 C270`: odjedź na Z20, ustaw `G0 X30 Y40 Z5 A-45 C270`, zagłęb się na `Z-4` i wyfrezuj odcinek `G1 X70 Y40 Z-4 A-45 C270 F250`!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G68.2 + G53.1 (Fanuc)',
        meaningPl: 'Pochylenie układu współrzędnych (Tilted Working Plane) i automatyczne ustawienie osi A i C',
        examplePl: 'Odwołanie pochylonego układu następuje kodem G69',
      },
      {
        codeOrSymbol: 'CYCLE800 (Sinumerik)',
        meaningPl: 'Odpowiednik G68.2 w sterownikach Siemens Sinumerik (obrót układu i stołu uchylnego)',
        examplePl: 'CYCLE800() bez parametrów odwołuje obrót płaszczyzny',
      },
      {
        codeOrSymbol: 'PLANE SPATIAL (Heidenhain)',
        meaningPl: 'Odpowiednik G68.2 w sterownikach Heidenhain TNC (np. PLANE SPATIAL SPA-45 SPB0 SPC90 TURN)',
        examplePl: 'PLANE RESET STAY odwołuje pochylenie płaszczyzny',
      },
      {
        codeOrSymbol: 'C90 vs C270 (przy A-45)',
        meaningPl: 'Obrót tarczy C o 180° (z 90° na 270°) wystawia pod wrzeciono przeciwległą ściankę skośną',
        examplePl: 'G0 X30 Y40 Z5 A-45 C270',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Zestawienie obróbki drugiej ścianki skośnej (z komentarzem G68.2):',
      lineCode: 'G0 X30 Y40 Z5 A-45 C270',
      parts: [
        { token: 'G0 X30 Y40 Z5', explanationPl: 'Szybki dojazd nad punkt początkowy drugiej ścianki na wysokości Z5' },
        { token: 'A-45', explanationPl: 'Kołyska pochylona pod kątem -45°' },
        { token: 'C270', explanationPl: 'Tarcza obrócona na kąt 270° (przeciwległa ścianka względem C90)' },
      ],
    },
    stepByStepGuidePl: [
      'Przeanalizuj w edytorze Ściankę 1: narzędzie skrawa od X30 do X70 na głębokości Z-4 przy kątach `A-45 C90`, po czym wycofuje się na `G0 Z20`.',
      'Pod komentarzem Ścianki 2 dopisz pozycjonowanie dla drugiej ścianki skośnej: `G0 X30 Y40 Z5 A-45 C270`.',
      'Następnie zagłęb się na Z-4 (`G1 Z-4 F150`) i wykonaj przejście robocze do X70 (`G1 X70 Y40 Z-4 A-45 C270 F250`).',
      'Dodaj bezpieczny odjazd `G0 Z20` i kliknij „✔ Sprawdź zadanie”!',
    ],
    commonMistakeWarningPl:
      'W prawdziwej maszynie 5-osiowej przed wywołaniem nowej płaszczyzny `G68.2` (lub jej wyłączeniem `G69`) wrzeciono musi być wycofane wysoko nad detal, aby ruch wyrównujący `G53.1` miał swobodną przestrzeń do obrotu stołu!',
    machineConfig: MODULE_4_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 2,
    starterCode: `(Lekcja 4.2: Dwie scianki skosne w trybie 3+2)
(Przemyslowy Fanuc: G68.2 X0 Y0 Z0 I-45 J0 K90 + G53.1)
T2 M6
G21 G90 G17 G54
S2500 M3
G43 H2 Z20

(--- SCIANKA SKOSNA 1: A-45 C90 ---)
G0 X30 Y40 Z5 A-45 C90
G1 Z-4 F150
G1 X70 Y40 Z-4 A-45 C90 F250
G0 Z20

(--- SCIANKA SKOSNA 2: A-45 C270 ---)
(Zadanie: ustaw G0 X30 Y40 Z5 A-45 C270, zagleb sie G1 na Z-4)
(i wyfrezuj odcinek G1 do punktu X70 Y40 Z-4 A-45 C270!)


G0 Z20
G0 A0 C0 (Przemyslowy Fanuc: G69 - odwolanie G68.2)
M5
M30`,
    taskDescriptionPl:
      'Po obróbce pierwszej ścianki skośnej (A = -45°, C = 90°) dopisz obróbkę drugiej, przeciwległej ścianki skośnej przy orientacji A = -45°, C = 270°: dojedź do (X30, Y40, Z5, A-45, C270), zagłęb się na Z = -4 mm i wykonaj ruch roboczy G1 do punktu (X70, Y40, Z-4, A-45, C270).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -4, a: -45, c: 90 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Obrobiono pierwszą ściankę skośną do X70 Y40 Z-4 przy A = -45°, C = 90°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 30, y: 40, z: -4, a: -45, c: 270 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Zagłębiono narzędzie na drugiej ściance skośnej w X30 Y40 Z-4 przy A = -45°, C = 270°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 40, z: -4, a: -45, c: 270 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Obrobiono drugą ściankę skośną do X70 Y40 Z-4 przy A = -45°, C = 270°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Wzoruj się na trzech liniach ze Ścianki Skośnej 1, zmieniając w nich kąt C90 na C270.',
      'Podpowiedź 2/3: Najpierw ustaw pozycję i kąty: G0 X30 Y40 Z5 A-45 C270, a potem zjedź: G1 Z-4 F150.',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20” następujące linie:\nG0 X30 Y40 Z5 A-45 C270\nG1 Z-4 F150\nG1 X70 Y40 Z-4 A-45 C270 F250',
    ],
    solutionCode: `T2 M6
G21 G90 G17 G54
S2500 M3
G43 H2 Z20

G0 X30 Y40 Z5 A-45 C90
G1 Z-4 F150
G1 X70 Y40 Z-4 A-45 C90 F250
G0 Z20

G0 X30 Y40 Z5 A-45 C270
G1 Z-4 F150
G1 X70 Y40 Z-4 A-45 C270 F250
G0 Z20

G0 A0 C0
M5
M30`,
    solutionExplanationPl:
      'Po bezpiecznym wycofaniu na Z20 tarcza C obraca się z 90° na 270° przy pochylonej kołysce A-45°, wystawiając pod narzędzie T2 przeciwległą ściankę skośną.',
    quiz: [
      {
        id: 'q_m4_02',
        questionPl: 'Który kod w sterownikach Fanuc / Haas służy do zdefiniowania pochylonej płaszczyzny roboczej (Tilted Working Plane) w obróbce 3+2?',
        optionsPl: [
          'G68.2 (odwoływany kodem G69)',
          'G28 (powrót do punktu referencyjnego)',
          'G04 (postój czasowy)',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Rozkaz G68.2 definiuje pochyloną płaszczyznę roboczą (jej odpowiednikiem w Sinumeriku jest CYCLE800, a w Heidenhainie PLANE SPATIAL), natomiast G69 odwołuje to pochylenie.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 4.3
  // ==========================================================================
  {
    id: 'M4_03',
    moduleId: 'MODULE_4',
    orderIndex: 3,
    titlePl: 'Lekcja 4.3: Śledzenie wierzchołka narzędzia TCPM / RTCP (G43.4 / TRAORI) i płynny ruch 5-osiowy',
    shortSubtitlePl: 'Jak sterownik 5-osiowy utrzymuje czubek frezu w punkcie kontaktu podczas płynnego pochylania osi A i C',
    theoryParagraphsPl: [
      '1. CO SIĘ DZIEJE, GDY POCHYLASZ OŚ A BEZ FUNKCJI TCPM?\nWyobraź sobie, że trzymasz długopis czubkiem na kropce narysowanej na kartce. Jeśli teraz przechylisz nadgarstek o 30° bez przesuwania dłoni w bok, czubek długopisu ucieknie z kropki o kilka centymetrów! Dokładnie to samo dzieje się na maszynie 5-osiowej: osie obrotowe A i C obracają się wokół własnych osi stołu (tzw. Pivot Point). Bez specjalnej kompensacji każdy obrót osi A lub C podczas skrawania spowodowałby ucieczkę detalu spod czubka frezu i gigantyczną kolizję!',
      '2. MAGIA TCPM / RTCP (TOOL CENTER POINT MANAGEMENT)\nAby temu zapobiec, podczas płynnej obróbki 5-osiowej włącza się zamiast zwykłego `G43 H1` specjalny tryb ŚLEDZENIA WIERZCHOŁKA NARZĘDZIA (TCPM / RTCP):\n• **Fanuc / Haas**: `G43.4 H1` (Tool Center Point Control, odwoływany przez `G49`),\n• **Siemens Sinumerik**: `TRAORI` (Transformation Orientation, odwoływany przez `TRAFOOF`),\n• **Heidenhain TNC**: `FUNCTION TCPM` (lub `M128`, odwoływany przez `M129`).',
      '3. JAK DZIAŁA G43.4 / TRAORI / TCPM?\nGdy aktywne jest `G43.4 H1`, programujesz w kodzie G wyłącznie współrzędne czubka narzędzia na detalu (`X, Y, Z`) oraz pożądane kąty nachylenia (`A, C`). Sterownik CNC zna dokładną geometrię kołyski i długość narzędzia `H1`, więc w każdej milisekundzie ruchu sam automatycznie dokłada odpowiednie przesunięcia korygujące w osiach X, Y i Z tak, aby czubek frezu „kleił się” do zaprogramowanej ścieżki podczas płynnego obrotu stołu!',
      '4. ZADANIE PRAKTYCZNE: PŁYNNY RUCH 5-OSIOWY (X, Y, Z, A, C)\nW edytorze wykonaj płynną ścieżkę 5-osiową w dwóch segmentach `G1` na głębokości Z = -3 mm: pierwszy odcinek prowadzi od `(X20, Y30, Z-3, A0, C0)` do punktu środkowego `(X50, Y40, Z-3, A-15, C45)`. Dopisz drugi płynny odcinek 5-osiowy `G1` prowadzący do punktu końcowego `(X80, Y50, Z-3, A-30, C90)`!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G43.4 H1 (Fanuc/Haas)',
        meaningPl: 'Włączenie śledzenia wierzchołka narzędzia (TCPM / RTCP) z korektorem długości H1',
        examplePl: 'Sterownik sam kompensuje ruchy X/Y/Z podczas płynnego obrotu A i C',
      },
      {
        codeOrSymbol: 'TRAORI (Sinumerik)',
        meaningPl: 'Odpowiednik G43.4 w sterownikach Siemens Sinumerik (transformacja orientacji 5-osiowej)',
        examplePl: 'Wyłączana poleceniem TRAFOOF',
      },
      {
        codeOrSymbol: 'FUNCTION TCPM / M128',
        meaningPl: 'Odpowiednik G43.4 w sterownikach Heidenhain TNC (utrzymanie pozycji wierzchołka narzędzia)',
        examplePl: 'Wyłączana poleceniem FUNCTION RESET TCPM lub M129',
      },
      {
        codeOrSymbol: 'G1 X.. Y.. Z.. A.. C..',
        meaningPl: 'Jednoczesna interpolacja 5-osiowa: ruch w 3 osiach liniowych i 2 obrotowych naraz',
        examplePl: 'G1 X80 Y50 Z-3 A-30 C90 F300',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Rozbiór bloku jednoczesnej interpolacji wszystkich 5 osi (5-Axis Simultaneous):',
      lineCode: 'G1 X80 Y50 Z-3 A-30 C90 F300',
      parts: [
        { token: 'G1', explanationPl: 'Płynny ruch roboczy koordynujący jednocześnie wszystkie 5 napędów' },
        { token: 'X80 Y50 Z-3', explanationPl: 'Docelowa pozycja wierzchołka narzędzia w układzie przedmiotu WCS' },
        { token: 'A-30 C90', explanationPl: 'Docelowe kąty nachylenia osi obrotowych A (-30°) oraz C (90°)' },
        { token: 'F300', explanationPl: 'Prędkość posuwu wierzchołka narzędzia względem materiału' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na kod startowy: narzędzie zaczyna w punkcie `(X20, Y30, Z-3, A0, C0)` i wykonuje pierwszy płynny odcinek 5-osiowy do punktu środkowego `(X50, Y40, Z-3, A-15, C45)`.',
      'Bezpośrednio pod linią `G1 X50 Y40 Z-3 A-15 C45 F300` dopisz drugi odcinek płynnej obróbki 5-osiowej.',
      'W drugim odcinku skieruj narzędzie do punktu `X80 Y50 Z-3` przy jednoczesnej zmianie kątów do `A-30 C90` z posuwem `F300`: `G1 X80 Y50 Z-3 A-30 C90 F300`.',
      'Kliknij „✔ Sprawdź zadanie”, aby zobaczyć płynną trajektorię 5-osiową!',
    ],
    commonMistakeWarningPl:
      'W trybie płynnym 5-osiowym dokładność pomiaru długości narzędzia `H` (w `G43.4 H1`) jest krytyczna! Nawet 0.5 mm błędu wpisanej długości narzędzia spowoduje przy pochyleniu o 45° przesunięcie wierzchołka w bok w osiach X/Y!',
    machineConfig: MODULE_4_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 4.3: Plynna obrobka 5-osiowa ze sledzeniem wierzcholka TCPM)
(Przemyslowy Fanuc: G43.4 H1 / Sinumerik: TRAORI / Heidenhain: TCPM)
T1 M6
G21 G90 G17 G54
S2400 M3
G43 H1 Z20

(Poczatek sciezki 5-osiowej: X20 Y30 przy A0 C0)
G0 X20 Y30 Z5 A0 C0
G1 Z-3 F150

(1. Pierwszy odcinek 5-osiowy: ruch X/Y z plynnym pochyleniem do A-15 C45)
G1 X50 Y40 Z-3 A-15 C45 F300

(2. Zadanie: dopisz drugi odcinek 5-osiowy G1 do punktu X80 Y50 Z-3)
(przy jednoczesnym plynnym dojsciu katow do A-30 C90!)


G0 Z20
G0 A0 C0
M5
M30`,
    taskDescriptionPl:
      'Dokończ płynną ścieżkę 5-osiową: po pierwszym odcinku kończącym się w (X50, Y40, Z-3, A-15, C45) dopisz blok G1 przemieszczający wierzchołek narzędzia do punktu (X80, Y50, Z-3) z jednoczesnym płynnym obrotem osi obrotowych do kątów A = -30° oraz C = 90°.',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program wykonuje się bez błędów i kolizji',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 50, y: 40, z: -3, a: -15, c: 45 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Osiągnięto punkt pośredni X50 Y40 Z-3 przy kątach A = -15°, C = 45°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 80, y: 50, z: -3, a: -30, c: 90 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano płynny ruch 5-osiowy G1 do punktu X80 Y50 Z-3 przy kątach A = -30°, C = 90°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Pod linią „G1 X50 Y40 Z-3 A-15 C45 F300” dopisz kolejną linię G1 zawierającą wszystkie 5 współrzędnych: X, Y, Z, A, C.',
      'Podpowiedź 2/3: Docelowe współrzędne to X80, Y50, Z-3 oraz kąty A-30 i C90.',
      'Podpowiedź 3/3: Wpisz dokładnie: G1 X80 Y50 Z-3 A-30 C90 F300 (przed linią G0 Z20).',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2400 M3
G43 H1 Z20

G0 X20 Y30 Z5 A0 C0
G1 Z-3 F150
G1 X50 Y40 Z-3 A-15 C45 F300
G1 X80 Y50 Z-3 A-30 C90 F300

G0 Z20
G0 A0 C0
M5
M30`,
    solutionExplanationPl:
      'Blok G1 X80 Y50 Z-3 A-30 C90 F300 realizuje pełną 5-osiową interpolację jednoczesną, płynnie zmieniając położenie liniowe (X, Y, Z) oraz orientację kątową (A, C).',
    quiz: [
      {
        id: 'q_m4_03',
        questionPl: 'Za co odpowiada funkcja TCPM / RTCP (włączana kodem G43.4 w Fanuc/Haas, TRAORI w Sinumeriku lub FUNCTION TCPM w Heidenhainie)?',
        optionsPl: [
          'Za automatyczne przeliczanie i kompensowanie ruchów liniowych X, Y, Z podczas obrotu osi A/B/C tak, aby fizyczny czubek narzędzia podążał dokładnie za zaprogramowanym punktem na detalu',
          'Za automatyczne zamawianie nowych płytek skrawających przez internet',
          'Za pomiar twardości materiału przed obróbką',
        ],
        correctOptionIndex: 0,
        explanationPl: 'Funkcja TCPM (Tool Center Point Management) śledzi położenie wierzchołka narzędzia podczas ruchów osi obrotowych i automatycznie kompensuje przesunięcia wynikające z obrotu stołu lub głowicy.',
      },
    ],
  },

  // ==========================================================================
  // LEKCJA 4.4
  // ==========================================================================
  {
    id: 'M4_04',
    moduleId: 'MODULE_4',
    orderIndex: 4,
    titlePl: 'Lekcja 4.4: Porównanie 4 dialektów CNC – Fanuc/Haas, Sinumerik, Heidenhain i GRBL',
    shortSubtitlePl: 'Ten sam program w czterech najpopularniejszych sterownikach świata + zadanie finałowe kursu',
    theoryParagraphsPl: [
      '1. JEDEN FIZYCZNY RUCH – CZTERY RÓŻNE DIALEKTY STEROWNIKÓW!\nPrzez cały kurs poznałeś fundamenty geometrii, technologii i kodów ISO (standard **Fanuc / Haas**). Kiedy jednak wejdziesz do dowolnej narzędziowni w Europie, spotkasz obok maszyn Haas/Fanuc również obrabiarki ze sterowaniem **Siemens Sinumerik (840D / 828D / ONE)**, **Heidenhain TNC (iTNC 530 / TNC 640 / TNC7)** oraz plotery i maszyny hobbystyczne **GRBL / LinuxCNC**. Dobra wiadomość: fizyka skrawania, osie X/Y/Z/A/C, punkt zerowy i korekcja narzędzia działają na nich identycznie – różnią się tylko niektórymi słowami kluczowymi!',
      '2. PORÓWNANIE TEGO SAMEGO PROGRAMU W 4 DIALEKTACH (KONTUR Z ŁUKIEM + OTWÓR):\n\n' +
        '• **1) FANUC / HAAS (ISO G-code – używany w naszym symulatorze)**:\n' +
        '  `T1 M6`  |  `G21 G90 G17 G54`  |  `S2200 M3`  |  `G43 H1 Z20`\n' +
        '  `G0 X20 Y30 Z5` -> `G1 Z-4 F150` -> `G1 X55 Y30 F250` -> `G3 X70 Y45 R15` -> `G81 X70 Y60 Z-8 R3 F180` -> `G80` -> `M30`\n\n' +
        '• **2) SIEMENS SINUMERIK (840D / 828D – niemiecki standard przemysłowy)**:\n' +
        '  Zamiast `G43 H1` korekcja długości `D1` aktywuje się automatycznie po wymianie narzędzia `T="FREZ_10" M6 D1`! Promień łuku zapisuje się ze znakiem równości `CR=15` (Circle Radius), fazę jako `CHF=2`, zaokrąglenie naroża jako `RND=5`, a cykle wywołuje się funkcjami z nawiasami, np. `CYCLE81(3, 0, 2, -8)`:\n' +
        '  `G710 G90 G17 G54`  |  `T1 D1 M6`  |  `S2200 M3`\n' +
        '  `G0 X20 Y30 Z5` -> `G1 Z-4 F150` -> `G1 X55 Y30 F250` -> `G3 X70 Y45 CR=15` -> `MCALL CYCLE81(3, 0, 2, -8)` -> `M30`\n\n' +
        '• **3) HEIDENHAIN TNC (Klartext – król europejskich narzędziowni i 5 osi)**:\n' +
        '  Heidenhain używa dialogowego języka **Klartext**, gdzie w ogóle nie trzeba pisać kodów G! Narzędzie wywołuje się przez `TOOL CALL 1 Z S2200` (automatycznie wczytuje długość i promień z tabeli!), ruch szybki to `L ... FMAX`, ruch roboczy prosty to `L ... F250`, korekcja promienia to `RL` (lewa = G41) / `RR` (prawa = G42) / `R0` (brak = G40), a łuk o promieniu R to `CR`:\n' +
        '  `BLK FORM 0.1 Z X+0 Y+0 Z-20`  |  `BLK FORM 0.2 X+100 Y+80 Z+0`\n' +
        '  `TOOL CALL 1 Z S2200`  |  `L X+20 Y+30 Z+5 R0 FMAX M3`\n' +
        '  `L Z-4 F150` -> `L X+55 Y+30 R0 F250` -> `CR X+70 Y+45 R+15 DR+ F250` -> `CYCL DEF 200 DRILLING ...` -> `M30`\n\n' +
        '• **4) GRBL / LINUXCNC (plotery, routery CNC, maszyny warsztatowe i edukacyjne)**:\n' +
        '  Używa czystego podzbioru ISO G-code bardzo zbliżonego do Fanuca (`G0, G1, G2, G3, G17, G21, G54, G90`), ale zazwyczaj na maszynach bez automatycznego magazynu narzędzi (brak ATC), więc wymiana `M6` zatrzymuje wrzeciono do ręcznej zmiany frezu i pomiaru na czujniku wysokości (Probe `G38.2`). W podstawowym GRBL nie ma też cykli stałych `G81–G83` ani korekcji `G41/G42` – postprocesor CAM rozwija je od razu na proste odcinki `G0` i `G1`!',
      '3. TABELA SZYBKIEGO TŁUMACZENIA MIĘDZY DIALEKTAMI\nZajrzyj do poniższej Ściągawki – masz w niej zestawione najważniejsze komendy wszystkich 4 dialektów w jednym miejscu.',
      '4. ZADANIE FINAŁOWE KURSU CNC!\nNa zakończenie kursu wykonaj w symulatorze kompletny program łączący obróbkę 5-osiową 3+2 (przy orientacji `A-20 C45`), odcinek prostoliniowy `G1`, łuk lewoskrętny `G3` o promieniu `R15` oraz dojście do punktu końcowego `(X70, Y60, Z-4, A-20, C45)`. Powodzenia!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Narzędzie i długość',
        meaningPl: 'Fanuc: T1 M6 + G43 H1 | Sinumerik: T1 M6 D1 | Heidenhain: TOOL CALL 1 Z S2200 | GRBL: M6 T1 (ręcznie)',
        examplePl: 'W Sinumeriku i Heidenhainie korekcja długości włącza się automatycznie z narzędziem!',
      },
      {
        codeOrSymbol: 'Ruch szybki i roboczy',
        meaningPl: 'Fanuc/Sinumerik/GRBL: G0 oraz G1 F... | Heidenhain Klartext: L ... FMAX oraz L ... F250',
        examplePl: 'Heidenhain: L X+50 Y+40 Z-4 R0 F250',
      },
      {
        codeOrSymbol: 'Łuk o promieniu R',
        meaningPl: 'Fanuc/GRBL: G2/G3 X.. Y.. R15 | Sinumerik: G2/G3 X.. Y.. CR=15 | Heidenhain: CR X.. Y.. R+15 DR-/DR+',
        examplePl: 'W Heidenhainie DR- oznacza łuk CW (G2), a DR+ oznacza łuk CCW (G3)',
      },
      {
        codeOrSymbol: 'Korekcja promienia',
        meaningPl: 'Fanuc/Sinumerik: G41 / G42 / G40 | Heidenhain: RL / RR / R0 | GRBL: liczone w programie CAM',
        examplePl: 'Heidenhain: L X+20 Y+20 RL F200',
      },
      {
        codeOrSymbol: '5 osi: 3+2 oraz TCPM',
        meaningPl: 'Fanuc: G68.2 / G43.4 | Sinumerik: CYCLE800 / TRAORI | Heidenhain: PLANE SPATIAL / FUNCTION TCPM',
        examplePl: 'Trzy różne nazwy dokładnie tych samych funkcji matematycznych w sterowniku',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Porównanie tego samego łuku CCW (R15 do X70 Y45) w trzech sterownikach przemysłowych:',
      lineCode: 'Fanuc: G3 X70 Y45 R15 | Sinumerik: G3 X70 Y45 CR=15 | Heidenhain: CR X+70 Y+45 R+15 DR+',
      parts: [
        { token: 'G3 ... R15', explanationPl: 'Fanuc / Haas / GRBL: kod G3 (CCW) i słowo promienia R15' },
        { token: 'G3 ... CR=15', explanationPl: 'Siemens Sinumerik: kod G3 i parametr Circle Radius CR=15' },
        { token: 'CR ... R+15 DR+', explanationPl: 'Heidenhain Klartext: blok Circular Radius (CR) z kierunkiem obrotu DR+ (CCW)' },
      ],
    },
    stepByStepGuidePl: [
      'Spójrz na kod finałowego zadania w edytorze: stół ustawia się w orientacji `A-20 C45`, a narzędzie wycina pierwszy odcinek prosty od (X25, Y30, Z-4) do (X55, Y30, Z-4).',
      'Z punktu (X55, Y30, Z-4) dopisz łuk lewoskrętny `G3` o promieniu `R15` do punktu (X70, Y45, Z-4): `G3 X70 Y45 Z-4 A-20 C45 R15 F200`.',
      'Następnie przełącz z powrotem na ruch prostoliniowy `G1` i dojedź do punktu końcowego (X70, Y60, Z-4): `G1 X70 Y60 Z-4 A-20 C45 F250`.',
      'Kliknij „✔ Sprawdź zadanie”, aby ukończyć cały kurs CNC!',
    ],
    commonMistakeWarningPl:
      'Przesiadając się z Fanuca na Sinumerika lub Heidenhaina, zawsze zwracaj uwagę na znak kropki dziesiętnej i wywołanie korektora długości (`G43 H1` vs `D1` vs `TOOL CALL`). Zasada fizyczna jest jednak zawsze ta sama: sprawdź wysokość Z nad detalem na pierwszym przejeździe z ręką na potencjometrze posuwu (Feedrate Override)!',
    machineConfig: MODULE_4_MACHINE,
    stock: DEFAULT_MILL_STOCK,
    validationPolicy: STRICT_VALIDATION_POLICY,
    initialActiveToolPocket: 1,
    starterCode: `(Lekcja 4.4: Zadanie finalowe kursu - kontur 3+2 z lukiem G3)
(Fanuc: G3 X70 Y45 R15 | Sinumerik: G3 X70 Y45 CR=15 | Heidenhain: CR X+70 Y+45 R+15 DR+)
T1 M6
G21 G90 G17 G54
S2400 M3
G43 H1 Z20

(1. Ustawienie orientacji 3+2 na A-20 C45 i pierwszy odcinek G1 do X55 Y30 Z-4)
G0 X25 Y30 Z5 A-20 C45
G1 Z-4 F150
G1 X55 Y30 Z-4 A-20 C45 F250

(2. Zadanie finalowe: dopisz luk lewoskretny G3 o promieniu R15 do punktu X70 Y45 Z-4,)
(a nastepnie odcinek prosty G1 do punktu X70 Y60 Z-4 przy orientacji A-20 C45!)


G0 Z20
G0 A0 C0
M5
M30`,
    taskDescriptionPl:
      'Wykonaj zadanie finałowe kursu przy orientacji stołu A = -20°, C = 45° na głębokości Z = -4 mm: z punktu (X55, Y30, Z-4) poprowadź łuk lewoskrętny G3 o promieniu R = 15 mm do punktu (X70, Y45, Z-4), a następnie odcinek prostoliniowy G1 do punktu końcowego (X70, Y60, Z-4).',
    assertions: [
      {
        kind: 'NO_ERRORS_AND_NO_COLLISIONS',
        descriptionPl: 'Program finałowy wykonuje się bez żadnych błędów i kolizji',
      },
      {
        kind: 'USED_ARC_MOTION',
        direction: 'ARC_CCW',
        expectedRadiusMm: 15,
        toleranceMm: 0.5,
        descriptionPl: 'Wykonano łuk lewoskrętny G3 (CCW) o promieniu R = 15 mm',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 45, z: -4, a: -20, c: 45 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Narzędzie przeszło przez koniec łuku w punkcie X70 Y45 Z-4 przy orientacji A = -20°, C = 45°',
      },
      {
        kind: 'TOOLTIP_VISITED_POINT_WCS',
        targetWcs: { x: 70, y: 60, z: -4, a: -20, c: 45 },
        toleranceMm: 0.5,
        requireCuttingMotion: true,
        checkRotaryAxes: true,
        descriptionPl: 'Wykonano końcowy odcinek G1 do punktu X70 Y60 Z-4 przy orientacji A = -20°, C = 45°',
      },
    ],
    hintsPl: [
      'Podpowiedź 1/3: Po linii „G1 X55 Y30 Z-4 A-20 C45 F250” dodaj blok łuku lewoskrętnego G3 do punktu X70 Y45 Z-4 z promieniem R15.',
      'Podpowiedź 2/3: Po łuku G3 wpisz blok prostoliniowy G1 do punktu X70 Y60 Z-4 (kąty A-20 C45 są modalne lub możesz je dopisać).',
      'Podpowiedź 3/3: Dopisz przed „G0 Z20” dwie linie:\nG3 X70 Y45 Z-4 A-20 C45 R15 F200\nG1 X70 Y60 Z-4 A-20 C45 F250',
    ],
    solutionCode: `T1 M6
G21 G90 G17 G54
S2400 M3
G43 H1 Z20

G0 X25 Y30 Z5 A-20 C45
G1 Z-4 F150
G1 X55 Y30 Z-4 A-20 C45 F250
G3 X70 Y45 Z-4 A-20 C45 R15 F200
G1 X70 Y60 Z-4 A-20 C45 F250

G0 Z20
G0 A0 C0
M5
M30`,
    solutionExplanationPl:
      'Program ustawia orientację 3+2 (A-20 C45), wycina odcinek prosty do X55 Y30, przechodzi płynnie łukiem lewoskrętnym G3 o promieniu R15 do X70 Y45 i kończy kontur odcinkiem G1 do X70 Y60 na głębokości Z-4 mm.',
    quiz: [
      {
        id: 'q_m4_04',
        questionPl: 'Jak w sterowaniu Siemens Sinumerik zapisuje się promień łuku R = 15 mm w bloku interpolacji kołowej G2/G3, a jak wywołuje się narzędzie w sterowaniu Heidenhain Klartext?',
        optionsPl: [
          'W Sinumeriku: CR=15; w Heidenhainie: TOOL CALL 1 Z S2200',
          'W obu sterownikach pisze się wyłącznie G43 H1',
          'W Sinumeriku nie można programować łuków',
        ],
        correctOptionIndex: 0,
        explanationPl: 'W dialekcie Siemens Sinumerik promień łuku podaje się parametrem CR= (Circle Radius, np. G3 X70 Y45 CR=15), natomiast w dialogowym języku Heidenhain Klartext narzędzie wywołuje się poleceniem TOOL CALL <nr> Z S<obroty>.',
      },
    ],
  },
];

/** Zbiorcza tablica wszystkich 12 lekcji z Modułów 2, 3 i 4 */
export const MODULES_2_TO_4_LESSONS: LessonDefinition[] = [
  ...MODULE_2_LESSONS,
  ...MODULE_3_LESSONS,
  ...MODULE_4_LESSONS,
];
