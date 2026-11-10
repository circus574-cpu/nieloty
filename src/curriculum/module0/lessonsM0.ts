/**
 * Moduł 0: Przygotowanie dla osoby zupełnie początkującej (bez doświadczenia):
 * - Lekcja 0.0 (M0_0): „Witaj w CNC” – prostym językiem, bez wzorów (czym jest CNC, przykłady z życia,
 *   różnica frezarka/tokarka, droga od rysunku do gotowej części i czego nauczysz się w kursie).
 * - Lekcja 0.1 (M0_1): Podstawowe pojęcia (oś, współrzędna, narzędzie, wrzeciono) wyjaśnione
 *   jeszcze przed rysunkiem technicznym.
 * - Lekcja 0.A (M0_A): Czytanie prostego rysunku technicznego (widoki, wymiary, Ø, R).
 * - Lekcja 0.B (M0_B): Tolerancje podstawowe – co znaczy ± i dlaczego ma znaczenie.
 * - Lekcja 0.C (M0_C): Pomiary warsztatowe – suwmiarka i mikrometr.
 * - Lekcja 0.D (M0_D): Podstawy skrawania – narzędzia, materiały, obroty S i posuw F.
 * - Lekcja 0.E (M0_E): Budowa maszyny, jak czytać linijkę kodu CNC (słowa i bloki) oraz BHP.
 */

import type { LessonDefinition } from '../../core/types/curriculum';

export const MODULE_0_LESSONS: LessonDefinition[] = [
  // =========================================================================
  // LEKCJA 0.0: WITAJ W CNC! (PROSTYM JĘZYKIEM, BEZ WZORÓW)
  // =========================================================================
  {
    id: 'M0_0',
    moduleId: 'MODULE_0',
    orderIndex: 0,
    titlePl: 'Lekcja 0.0: Witaj w CNC! (Wstęp prostym językiem)',
    shortSubtitlePl: 'Czym jest CNC, przykłady z codziennego życia, frezarka a tokarka, droga od rysunku do gotowej części i plan kursu',
    theoryParagraphsPl: [
      '1. CZYM JEST CNC? (BEZ TRUDNYCH SŁÓW I BEZ WZORÓW)\nWyobraź sobie rzeźbiarza, który bierze pełną kostkę metalu lub drewna i odcina z niej po kawałku wszystko, co zbędne, aż powstanie gotowy przedmiot. Dawniej robił to człowiek ręcznie na maszynie z korbkami. Dzisiaj robi to obrabiarka CNC (skrót od angielskiego Computer Numerical Control – komputerowe sterowanie numeryczne). To po prostu bardzo dokładna maszyna warsztatowa sterowana przez komputer: wpisujemy do niej listę prostych poleceń (gdzie i jak szybko ma pojechać), a maszyna sama wycina kształt z metalu z dokładnością lepszą niż grubość ludzkiego włosa!',
      '2. PRZYKŁADY Z ŻYCIA – GDZIE CODZIENNIE DOTYKASZ CZĘŚCI Z MASZYN CNC?\nRozejrzyj się wokół siebie – prawie każdy nowoczesny przedmiot powstał dzięki maszynom CNC:\n• Twój smartfon i laptop: aluminiowa obudowa telefonu jest wyfrezowana z jednego kawałka metalu na frezarce CNC.\n• Rower i samochód: zębatki, korby, tarcze hamulcowe, felgi aluminiowe, tłoki i głowica silnika są obrabiane na maszynach CNC.\n• Przedmioty z plastiku (np. klocki LEGO, butelki, obudowy pilota): sam plastik wtryskuje się do stalowych form, a te precyzyjne stalowe formy zostały wcześniej wycięte właśnie na frezarkach CNC!\n• Medycyna i dom: tytanowe śruby ortopedyczne, implanty zębów, krany łazienkowe czy zawiasy meblowe.',
      '3. FREZARKA A TOKARKA – JAKA JEST RÓŻNICA?\nW warsztacie CNC spotkasz dwie główne maszyny, które różnią się jedną prostą rzeczą – TYM, CO SIĘ KRĘCI:\n• FREZARKA (Milling Machine): kawałek metalu (np. płaska kostka) jest przykręcony NIERUCHOMO do stołu w imadle, a nad nim szybko kręci się narzędzie przypominające wiertło (nazywane frezem), które jeździ w boki i w dół, wycinając rowki, kieszenie i kształty. (To właśnie frezarkę widzisz w oknie 3D po prawej stronie!).\n• TOKARKA (Lathe): służy do robienia części okrągłych (wałków, tulejek, śrub, pierścieni). Tutaj jest odwrotnie: to okrągły wałek metalu kręci się bardzo szybko jak wałek w wiertarce, a nieruchomy nóż tokarski podjeżdża do niego z boku i zestruguje nadmiar metalu.',
      '4. JAK WYGLĄDA DROGA OD RYSUNKU DO GOTOWEJ CZĘŚCI? (4 PROSTE KROKI)\nKażda część w warsztacie powstaje w czterech krokach:\nKrok 1 (Rysunek): Konstruktor rysuje na kartce lub ekranie kształt części i pisze, jakie ma mieć wymiary w milimetrach.\nKrok 2 (Program): Programista zapisuje krótką listę ruchów dla maszyny (np. „przesuń się 50 mm w prawo, zjedź 3 mm w dół”).\nKrok 3 (Maszyna): Operator wkłada surowy kawałek metalu do imadła, zamyka osłonę i naciska zielony przycisk START.\nKrok 4 (Pomiar): Po kilku minutach wyjmujemy gotową, błyszczącą część i sprawdzamy suwmiarką, czy wymiary zgadzają się z rysunkiem.',
      '5. CZEGO NAUCZYSZ SIĘ W TYM KURSIE KROK PO KROKU?\nNie musisz mieć żadnego doświadczenia ani znać matematyki wyższej! Pójdziemy bardzo spokojnie:\n• W Module 0 (teraz): poznasz 4 podstawowe słowa warsztatowe (oś, współrzędna, wrzeciono, narzędzie), nauczysz się czytać prosty rysunek techniczny, zrozumiesz po co jest tolerancja wymiaru, zmierzysz część wirtualną suwmiarką i zobaczysz, jak maszyna tnie metal.\n• W Module 1 (Frezarka 3-osiowa): napiszesz swoje pierwsze prawdziwe programy od jednej prostej linijki ruchu aż po wycinanie kieszeni, łuków i wiercenie otworów w symulatorze 3D.\n• W kolejnych modułach: poznasz też tokarkę CNC oraz maszyny 4- i 5-osiowe.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'CNC',
        meaningPl: 'Maszyna warsztatowa sterowana komputerem – wycina części z metalu według zapisanej listy ruchów',
        examplePl: 'Frezarka CNC (do kostek i płyt) oraz Tokarka CNC (do wałków i tulejek)',
      },
      {
        codeOrSymbol: 'Frezarka',
        meaningPl: 'Przedmiot stoi nieruchomo w imadle, a szybko kręci się narzędzie (frez) jadące nad nim',
        examplePl: 'Wycinanie obudowy telefonu, płaskich płytek, kieszeni i otworów',
      },
      {
        codeOrSymbol: 'Tokarka',
        meaningPl: 'Przedmiot (okrągły wałek) szybko się kręci, a nieruchomy nóż zbliża się do niego i zbiera metal',
        examplePl: 'Toczenie osi koła rowerowego, sworznia, tulejki, pierścienia',
      },
      {
        codeOrSymbol: 'Droga w 4 krokach',
        meaningPl: '1. Rysunek z wymiarami -> 2. Program ruchów -> 3. Wycięcie w maszynie -> 4. Pomiar suwmiarką',
        examplePl: 'Od surowej kostki aluminium do gotowej części w kilka minut',
      },
    ],
    interactiveDemos3D: [
      {
        labelPl: '🎬 Kliknij i zobacz na żywo w 3D: Jak frezarka CNC wycina gotową część z kostki aluminium!',
        descriptionPl: 'Po kliknięciu spójrz na okno 3D po prawej stronie i naciśnij zielony przycisk „▶ Start” pod sceną 3D, aby obejrzeć animację obróbki.',
        gcode: `(POKAZ POWITALNY: Jak maszyna CNC wycina ramke i wierci otwory)
T1 M6
G21 G90 G17 G54
S3200 M3 M8
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F250
G1 X80 Y20 F450
G1 X80 Y60
G1 X20 Y60
G1 X20 Y20
G0 Z20
T3 M6
S2800 M3
G43 H3 Z20
G99 G81 X35 Y40 Z-12 R3 F200
X65 Y40
G80
G0 Z25 M9
M5
M30`,
      },
    ],
    stepByStepGuidePl: [
      'Przeczytaj spokojnie 5 krótkich punktów wprowadzenia powyżej (zero wzorów, czyste podstawy).',
      'Kliknij przycisk „🎬 Kliknij i zobacz na żywo w 3D” powyżej, a potem kliknij „▶ Start” pod oknem 3D po prawej stronie, żeby zobaczyć maszynę w akcji.',
      'Rozwiąż krótkie ćwiczenie powitalne poniżej i kliknij „Następna lekcja ▶”, aby przejść do poznania 4 podstawowych słów warsztatowych.',
    ],
    taskDescriptionPl:
      'W prostym ćwiczeniu powitalnym poniżej odpowiedz na 3 pytania sprawdzające różnicę między frezarką a tokarką oraz kolejność powstawania części.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Na frezarce nieruchomo w imadle stoi obrabiana kostka, a kręci się narzędzie (frez).',
      'Podpowiedź 2/3: Na tokarce kręci się okrągły przedmiot (wałek), a nóż tokarski się nie obraca.',
      'Podpowiedź 3/3: Pracę nad nową częścią zawsze zaczynamy od spojrzenia na rysunek z wymiarami, a kończymy pomiarem gotowego detalu.',
    ],
    solutionExplanationPl:
      'Brawo! Pierwszy krok za Tobą. Wiesz już, czym jest CNC, gdzie spotykamy części z tych maszyn na co dzień i czym różni się frezarka od tokarki. W następnej lekcji poznamy 4 najważniejsze słowa: oś, współrzędną, wrzeciono i narzędzie!',
    quiz: [
      {
        id: 'q_m0_0',
        questionPl: 'Chcesz wykonać idealnie okrągły metalowy wałek (np. ośkę do koła). Na której maszynie CNC przedmiot będzie się obracał wokół własnej osi?',
        optionsPl: [
          'Na tokarce CNC (wałek szybko się kręci w uchwycie, a nóż tokarski zbiera materiał)',
          'Na drukarce biurowej',
          'Na żadnej – maszyny CNC potrafią robić tylko kwadratowe pudełka',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'Tokarka CNC wprawia okrągły wałek w ruch obrotowy, dzięki czemu nóż tokarski może błyskawicznie wytoczyć idealnie okrągłe stopnie, stożki i tulejki.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.1: PODSTAWOWE POJĘCIA (OŚ, WSPÓŁRZĘDNA, NARZĘDZIE, WRZECIONO)
  //             – JESZCZE PRZED RYSUNKIEM TECHNICZNYM!
  // =========================================================================
  {
    id: 'M0_1',
    moduleId: 'MODULE_0',
    orderIndex: 1,
    titlePl: 'Lekcja 0.1: Cztery podstawowe pojęcia – Oś, Współrzędna, Wrzeciono i Narzędzie',
    shortSubtitlePl: 'Zrozum te 4 słowa, zanim spojrzysz na pierwszy rysunek techniczny lub kod programu',
    theoryParagraphsPl: [
      'Zanim nauczymy się czytać rysunki techniczne i pisać polecenia dla maszyny, wyjaśnijmy po ludzku cztery słowa, których używa każdy operator CNC w każdym zdaniu: WRZECIONO, NARZĘDZIE, OŚ oraz WSPÓŁRZĘDNA.',
      '1. WRZECIONO (Spindle) – „SILNIK, KTÓRY KRĘCI”\nSpójrz na okno 3D po prawej stronie: nad niebieską kostką metalu wisi pionowa szara głowica. W jej wnętrzu znajduje się WRZECIONO, czyli bardzo mocny, precyzyjny silnik elektryczny (jak w profesjonalnej wiertarce, tylko 20 razy mocniejszy i sztywniejszy). Zadaniem wrzeciona na frezarce jest trzymanie narzędzia i kręcenie nim z dużą prędkością (np. 3000 obrotów na minutę).',
      '2. NARZĘDZIE (Tool) – „TO, CO TNIE METAL (FREZ LUB WIERTŁO)”\nW dolnej części wrzeciona zamocowane jest wymienne NARZĘDZIE skrawające – czyli niezwykle twardy, ostry kawałek metalu, który bezpośrednio dotyka naszej kostki i ścina ją na drobne wióry. Na frezarce używamy dwóch głównych narzędzi:\n• FREZ (Endmill) – wygląda trochę jak wiertło, ale ma płaski spód i ostre krawędzie po bokach. Dzięki temu potrafi ciąć metal jadąc w BOK (w lewo, w prawo, do przodu i do tyłu), wycinając rowki, schodki i kieszenie.\n• WIERTŁO (Drill) – ma czubek zakończony w szpic (stożek) i potrafi robić tylko jedno: zjeżdżać pionowo W DÓŁ, wiercąc okrągły otwór.',
      '3. OŚ (Axis: X, Y, Z) – „KIERUNEK RUCHU W PRZESTRZENI”\nAby narzędzie mogło dotrzeć w każde miejsce naszej kostki, maszyna ma prowadnice, po których jeździ w trzech kierunkach. Każdy taki kierunek nazywamy OSIĄ i oznaczamy jedną literą:\n• Oś X (czerwona strzałka) = ruch poziomy W LEWO (X-) i W PRAWO (X+).\n• Oś Y (zielona strzałka) = ruch poziomy DO SIEBIE / DO PRZODU (Y-) i OD SIEBIE / W GŁĄB MASZYNY (Y+).\n• Oś Z (niebieska strzałka) = ruch pionowy W DÓŁ w stronę metalu (Z-) i W GÓRĘ w powietrze (Z+).',
      '4. WSPÓŁRZĘDNA (Coordinate) – „DOKŁADNY ADRES W MILIMETRACH OD NAROŻNIKA (0, 0, 0)”\nSkąd maszyna wie, JAK DALEKO w prawo lub w dół ma pojechać? Umawiamy się z maszyną, że lewy przedni GÓRNY narożnik naszej kostki (oznaczony w 3D żółtą kulką) to nasz PUNKT ZEROWY, w którym X = 0, Y = 0 oraz Z = 0. Od tego narożnika mierzymy odległość w milimetrach – i tę liczbę nazywamy WSPÓŁRZĘDNĄ!\nPrzykład: Nasza kostka ma 100 mm szerokości (w X) i 80 mm głębokości (w Y). Jeśli powiesz maszynie: „Jedź do współrzędnych X = 50, Y = 40, Z = 10”, to czubek frezu ustawi się: 50 mm w prawo od lewego brzegu, 40 mm w głąb od przedniego brzegu (czyli dokładnie nad samym środkiem kostki!) oraz 10 mm w powietrzu nad jej górną powierzchnią. Natomiast Z = -4 oznacza zjazd 4 mm w głąb materiału!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Wrzeciono (Spindle)',
        meaningPl: 'Obrotowa głowica maszyny (silnik), w której mocujemy narzędzie i która wprawia je w wirowanie',
        examplePl: 'Kręci frezem z prędkością np. 3000 obrotów na minutę',
      },
      {
        codeOrSymbol: 'Narzędzie (Tool)',
        meaningPl: 'Ostry element skrawający metal włożony do wrzeciona: Frez (tnie w bok i w dół) lub Wiertło (wierci tylko w dół)',
        examplePl: 'Frez Ø10 mm (średnica 10 mm) lub Wiertło Ø6 mm',
      },
      {
        codeOrSymbol: 'Oś (X, Y, Z)',
        meaningPl: 'Jeden z trzech kierunków ruchu maszyny: X = lewo/prawo, Y = przód/tył, Z = góra/dół',
        examplePl: 'Z+ podnosi narzędzie w górę (bezpiecznie), Z- opuszcza je w dół (w metal)',
      },
      {
        codeOrSymbol: 'Współrzędna (np. X50 Y40 Z10)',
        meaningPl: 'Dokładna odległość w milimetrach liczona od narożnika zerowego (0, 0, 0) naszej kostki',
        examplePl: 'X50 Y40 = środek kostki 100×80 mm; Z10 = 10 mm nad kostką; Z-4 = 4 mm w głąb kostki',
      },
    ],
    interactiveDemos3D: [
      {
        labelPl: '🎬 Kliknij i zobacz w 3D: Ruch wzdłuż osi X (w prawo), osi Y (w głąb) i osi Z (w górę)',
        descriptionPl: 'Zobacz na własne oczy, jak wrzeciono z narzędziem przesuwa się po współrzędnych nad kostką 100 × 80 mm.',
        gcode: `(POKAZ 4 PODSTAWOWYCH POJEC: Osie X, Y, Z i Wspolrzedne)
T1 M6
G21 G90 G17 G54
S3000 M3
G43 H1 Z20
(1. Start nad punktem zerowym X0 Y0 na wysokości Z10 mm nad kostką)
G0 X0 Y0 Z10
(2. Ruch wzdłuż osi X w prawo do współrzędnej X100)
G1 X100 Y0 Z10 F800
(3. Ruch wzdłuż osi Y w głąb do współrzędnej Y80)
G1 X100 Y80 Z10 F800
(4. Przejazd nad sam środek kostki X50 Y40 i zjazd osią Z na Z2)
G1 X50 Y40 Z2 F800
G0 Z25
M5
M30`,
      },
    ],
    stepByStepGuidePl: [
      'Przeczytaj opis 4 pojęć powyżej i spójrz na żółtą kulkę z trzema kolorowymi strzałkami (Czerwona = X, Zielona = Y, Niebieska = Z) w narożniku kostki 3D po prawej stronie.',
      'Kliknij na górze tego panelu kartę „🕹 Ręczny ruch (JOG)” i kliknij kilka razy przyciski X+, Y+ oraz Z+, żeby samodzielnie przesunąć wrzeciono nad kostką!',
      'Wróć do karty „🎓 Lekcja i zadanie” i rozwiąż ćwiczenie sprawdzające 4 podstawowe pojęcia poniżej.',
    ],
    commonMistakeWarningPl:
      'Zapamiętaj jedną rzecz o współrzędnej Z (wysokości): ponieważ poziom Z = 0 leży na GÓRNEJ ściance kostki, każda liczba dodatnia (np. Z10) oznacza, że narzędzie wisi bezpiecznie W POWIETRZU nad kostką. Każda liczba z minusem (np. Z-3) oznacza, że narzędzie wjechało 3 mm W GŁĄB METALU!',
    taskDescriptionPl:
      'W interaktywnym ćwiczeniu poniżej połącz cztery podstawowe pojęcia (Wrzeciono, Narzędzie, Oś, Współrzędna) z ich znaczeniem i wskaż, gdzie znajduje się punkt X = 50, Y = 40, Z = 10.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Wrzeciono to silnik obracający narzędziem, a Narzędzie (frez lub wiertło) to element, który skrawa metal.',
      'Podpowiedź 2/3: Osie określają kierunki ruchu: X to lewo/prawo, Y to przód/tył (w głąb), a Z to góra/dół.',
      'Podpowiedź 3/3: Współrzędne X50 Y40 Z10 na kostce 100×80 mm oznaczają punkt nad samym środkiem kostki, 10 mm w powietrzu nad jej górną powierzchnią.',
    ],
    solutionExplanationPl:
      'Świetnie! Znasz już 4 fundamenty CNC: Wrzeciono (obraca), Narzędzie (frezuje lub wierci), Osie X/Y/Z (kierunki w przestrzeni) oraz Współrzędne (dokładny adres w milimetrach od punktu zerowego 0,0,0). Teraz czytanie rysunku technicznego w następnej lekcji będzie dla Ciebie całkowicie zrozumiałe!',
    quiz: [
      {
        id: 'q_m0_1',
        questionPl: 'Nasza kostka ma wymiary 100 mm (w osi X) na 80 mm (w osi Y), a punkt zerowy (0, 0, 0) leży w jej lewym przednim górnym narożniku. Gdzie znajdzie się czubek frezu przy współrzędnych X = 50, Y = 40, Z = -3?',
        optionsPl: [
          'Dokładnie w środku kostki (50 mm w prawo, 40 mm w głąb), zagłębiony na 3 mm wewnątrz metalu',
          '3 mm w powietrzu nad lewym narożnikiem kostki',
          'Poza stołem maszyny',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'X=50 to połowa ze 100 mm, Y=40 to połowa z 80 mm (czyli środek płytki), a ujemna współrzędna Z=-3 oznacza zagłębienie na 3 mm poniżej górnej powierzchni (Z=0).',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.A: CZYTANIE PROSTEGO RYSUNKU TECHNICZNEGO
  // =========================================================================
  {
    id: 'M0_A',
    moduleId: 'MODULE_0',
    orderIndex: 2,
    titlePl: 'Lekcja 0.A: Czytanie prostego rysunku technicznego',
    shortSubtitlePl: 'Widoki (rzuty), wymiary w milimetrach, średnica Ø, promień R i odczytywanie współrzędnych',
    theoryParagraphsPl: [
      '1. PO CO JEST RYSUNEK TECHNICZNY?\nZanim maszyna CNC wytnie jakąkolwiek część, operator bierze do ręki rysunek techniczny (Technical Drawing). To prosty plan części: zamiast opisywać przedmiot długim tekstem, pokazujemy go z dwóch stron jednocześnie:\n• WIDOK Z GÓRY (płaszczyzna osi X oraz Y) – patrzymy na płytkę prosto z góry, dzięki czemu widzimy jej szerokość (X), głębokość (Y) oraz położenie otworów.\n• WIDOK Z PRZODU / BOKU (płaszczyzna osi X oraz Z) – patrzymy na płytkę z boku z poziomu stołu, dzięki czemu widzimy jej grubość (wysokość w osi Z).',
      '2. MILIMETRY, ŚREDNICA (Ø) ORAZ PROMIEŃ (R)\n• MILIMETRY (mm): Na rysunkach maszynowych wszystkie wymiary podaje się ZAWSZE w milimetrach. Dlatego przy liczbie „100” konstruktor nie pisze „100 mm” – sama liczba 100 oznacza 100 milimetrów (czyli 10 centymetrów).\n• ŚREDNICA Ø (czyt. „fi”): Kółko przekreślone ukośną kreską przed liczbą (np. „Ø12”) oznacza ŚREDNICĘ okrągłego otworu lub wałka (czyli szerokość kółka mierzoną przez sam środek od krawędzi do krawędzi: 12 mm).\n• PROMIEŃ R (np. „R8”): Litera R oznacza PROMIEŃ zaokrąglenia naroża lub łuku (odległość od środka kółka do jego brzegu). Pamiętaj: promień R to zawsze dokładnie połowa średnicy Ø (np. dla otworu Ø12 promień wynosi R = 6 mm!).',
      '3. JAK Z RYSUNKU ODCZYTAĆ WSPÓŁRZĘDNE (X, Y) ŚRODKA OTWORU?\nPrzez każdy otwór na rysunku przechodzą dwie cienkie linie przerywane (nazywane osiami symetrii), które przecinają się w samym środku kółka, tworząc mały krzyżyk „+”. Aby dowiedzieć się, jakie współrzędne (X, Y) ma ten otwór:\n1) Szukasz wymiaru poziomego od lewej krawędzi płytki (X=0) do pionowej kreski krzyżyka – na naszym rysunku poniżej to 30 mm, więc współrzędna otworu to X = 30.\n2) Szukasz wymiaru pionowego od dolnej krawędzi płytki (Y=0) do poziomej kreski krzyżyka – na naszym rysunku poniżej to 50 mm, więc współrzędna otworu to Y = 50!',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Liczba (np. 100)',
        meaningPl: 'Wymiar wyrażony zawsze w milimetrach (100 = 100 mm)',
        examplePl: 'Płytka 100 × 80 × 20 ma 100 mm w X, 80 mm w Y i 20 mm grubości w Z',
      },
      {
        codeOrSymbol: 'Ø (np. Ø12)',
        meaningPl: 'Średnica (Diameter) okrągłego otworu lub wałka mierzona przez środek',
        examplePl: 'Ø12 oznacza otwór o średnicy 12 mm (jego promień to połowa, czyli 6 mm)',
      },
      {
        codeOrSymbol: 'R (np. R10)',
        meaningPl: 'Promień (Radius) łuku lub zaokrąglonego naroża',
        examplePl: 'R10 oznacza zaokrąglenie naroża promieniem 10 mm',
      },
      {
        codeOrSymbol: 'Krzyżyk osi w kółku',
        meaningPl: 'Punkt przecięcia dwóch linii osiowych wskazujący dokładny środek otworu (X, Y)',
        examplePl: 'Wymiar 30 w poziomie i 50 w pionie daje współrzędne środka X=30, Y=50',
      },
    ],
    stepByStepGuidePl: [
      'Spójrz na rysunek techniczny na ciemnym tle poniżej: po lewej stronie widzisz płytkę z góry (osie X i Y), a po prawej z przodu (grubość Z = 20).',
      'Odczytaj na dole rysunku całkowitą szerokość płytki (100) i wpisz ją w pierwsze pole.',
      'Odczytaj liczbę stojącą po znaku średnicy Ø przy otworze (Ø12 -> wpisz 12) oraz odległości środka otworu od lewej krawędzi (X = 30) i od dolnej krawędzi (Y = 50), a następnie kliknij „Sprawdź odczyt rysunku”.',
    ],
    commonMistakeWarningPl:
      'Najczęstszy błąd początkujących to pomylenie średnicy Ø z promieniem R. Zapamiętaj prosty obrazek: Średnica Ø to całe koło rowerowe od opony do opony, a Promień R to jedna szprycha od środka piasty do opony (czyli połowa średnicy)!',
    taskDescriptionPl:
      'Przyjrzyj się interaktywnemu rysunkowi technicznemu płytki 100 × 80 mm o grubości 20 mm poniżej. Odczytaj z rysunku i wpisz w formularzu: 1) całkowitą szerokość płytki w osi X, 2) średnicę otworu Ø, 3) współrzędne (X oraz Y) środka otworu liczone od lewego dolnego narożnika.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Szerokość całkowita płytki to najdłuższa pozioma linia wymiarowa na dole widoku z góry (100).',
      'Podpowiedź 2/3: Szukaj symbolu kółka przekreślonego kreską (Ø) – przy otworze widnieje napis Ø12 (wpisz 12).',
      'Podpowiedź 3/3: Od lewej krawędzi do osi otworu wymiar poziomy wynosi X = 30 mm, a od dolnej krawędzi wymiar pionowy wynosi Y = 50 mm.',
    ],
    solutionExplanationPl:
      'Prawidłowe odczyty z rysunku to: Szerokość X = 100 mm, Grubość Z = 20 mm, Średnica otworu = 12 mm (zapis Ø12), a środek otworu leży w punkcie X = 30 mm, Y = 50 mm.',
    quiz: [
      {
        id: 'q_m0a_1',
        questionPl: 'Co oznacza zapis „Ø16” na rysunku technicznym?',
        optionsPl: [
          'Otwór lub wałek o średnicy 16 milimetrów (czyli promieniu 8 mm)',
          'Zaokrąglenie o promieniu 16 centymetrów',
          'Głębokość wiercenia równą 16 cali',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'Symbol Ø (fi) oznacza zawsze średnicę (Diameter), a domyślną jednostką w dokumentacji maszynowej jest milimetr (mm).',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.B: TOLERANCJE PODSTAWOWE
  // =========================================================================
  {
    id: 'M0_B',
    moduleId: 'MODULE_0',
    orderIndex: 3,
    titlePl: 'Lekcja 0.B: Tolerancje podstawowe – co znaczy ± i dlaczego ma znaczenie',
    shortSubtitlePl: 'Wymiar nominalny, wymiary graniczne i kontrola jakości detalu',
    theoryParagraphsPl: [
      '1. DLACZEGO ŻADNA CZĘŚĆ NIE MA WYMIARU IDEALNEGO?\nW świecie rzeczywistym żadna maszyna nie potrafi wykonać części o wymiarze idealnie równym 50,000000 mm. Narzędzie delikatnie się ściera, metal rozszerza się od ciepła podczas cięcia, a maszyna ma minimalne ugięcia. Dlatego konstruktor na rysunku określa TOLERANCJĘ WYMIAROWĄ (Dimensional Tolerance), czyli dopuszczalny margines błędu, w którym wykonana część nadal idealnie pasuje do reszty urządzenia.',
      '2. CO OZNACZA ZAPIS „50 ±0,1”? (LICZENIE W PAMIĘCI W 5 SEKUND)\nRozszyfrujmy zapis „50 ±0,1”:\n• Liczba 50 to WYMIAR NOMINALNY (docelowy) – to ten wymiar wpisujemy do programu CNC.\n• Znak „±0,1” (plus/minus jedna dziesiąta milimetra) mówi nam, że gotowa część może być o 0,1 mm mniejsza albo o 0,1 mm większa od 50 mm:\n  - DOLNY WYMIAR GRANICZNY (najmniejszy dopuszczalny): 50,0 - 0,1 = 49,90 mm.\n  - GÓRNY WYMIAR GRANICZNY (największy dopuszczalny): 50,0 + 0,1 = 50,10 mm.\nKażda sztuka, która po zmierzeniu ma od 49,90 mm do 50,10 mm włącznie, jest DOBRA! Jeśli sztuka ma 49,82 mm (jest za mała) albo 50,18 mm (jest za duża), wykracza poza tolerancję i jest odrzucana jako BRAK.',
      '3. PASOWANIA (LUŹNE VS. CIASNE) ORAZ GŁADKOŚĆ POWIERZCHNI (Ra)\nDlaczego niektóre wymiary mają szeroką tolerancję (±0,2 mm), a inne bardzo wąską (±0,01 mm)? Jeśli wycinamy zwykłą zewnętrzną ściankę obudowy, która z niczym się nie styka, wystarcza ±0,2 mm. Jeśli jednak robimy gniazdo pod precyzyjne łożysko kulkowe, wymiar musi być trafiony z dokładnością do jednej setnej milimetra (±0,01 mm), a ścianka musi być bardzo gładka (niska chropowatość oznaczana na rysunku symbolem Ra, np. Ra 0.8 lub Ra 1.6).',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Wymiar nominalny (np. 50)',
        meaningPl: 'Idealny wymiar z rysunku, w który celujemy pisząc program CNC',
        examplePl: 'Dla 50 ±0,1 w programie celujemy w 50,0 mm',
      },
      {
        codeOrSymbol: '±0,1 (Odchyłka)',
        meaningPl: 'Dopuszczalny margines błędu w górę (+0,1 mm) i w dół (-0,1 mm)',
        examplePl: 'Dolna granica = 49,90 mm; Górna granica = 50,10 mm',
      },
      {
        codeOrSymbol: 'Sztuka DOBRA vs. BRAK',
        meaningPl: 'Dobra mieści się między dolną a górną granicą; Brak wystaje poza ten przedział',
        examplePl: '49,95 mm = DOBRA; 49,82 mm = BRAK (za mała)',
      },
      {
        codeOrSymbol: 'Ra (Chropowatość)',
        meaningPl: 'Określa jak gładka ma być powierzchnia po obróbce (im mniejsza liczba, tym gładsza ścianka)',
        examplePl: 'Ra 3.2 = zwykłe frezowanie; Ra 0.8 = gładkie wykańczanie',
      },
    ],
    stepByStepGuidePl: [
      'Dla wymiaru 50,0 ±0,1 mm oblicz w pamięci najmniejszy dopuszczalny wymiar (50,0 - 0,1 = 49,90 mm) oraz największy dopuszczalny wymiar (50,0 + 0,1 = 50,10 mm).',
      'W stanowisku kontroli jakości poniżej zaznacz dla każdej z 4 zmierzonych sztuk, czy mieści się w przedziale [49,90 .. 50,10] mm, i kliknij „Sprawdź kontrolę jakości”.',
    ],
    commonMistakeWarningPl:
      'Pamiętaj o różnicy między wałkiem za dużym a za małym: jeśli zewnętrzny wymiar wyjdzie o 0,1 mm ZA DUŻY (np. 50,18 mm), detal można uratować – puszczamy frez jeszcze raz z drobną korektą i ścinamy nadmiar. Jeśli jednak wytniesz o 0,1 mm ZA DUŻO i wymiar wyjdzie ZA MAŁY (49,82 mm) – metalu nie da się już dokleić i część idzie na złom!',
    taskDescriptionPl:
      'W interaktywnym stanowisku kontroli jakości poniżej sprawdzamy wałki o wymiarze z rysunku 50,0 ±0,1 mm. Zaklasyfikuj 4 zmierzone sztuki jako „Dobra (w tolerancji)” albo „Brak (poza tolerancją)”.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Dolny wymiar graniczny to 50,0 - 0,1 = 49,90 mm. Górny wymiar graniczny to 50,0 + 0,1 = 50,10 mm.',
      'Podpowiedź 2/3: Sztuki o wymiarach 49,95 mm oraz 50,10 mm mieszczą się w przedziale [49,90 .. 50,10] – są DOBRE.',
      'Podpowiedź 3/3: Sztuki o wymiarach 49,82 mm (za mała) oraz 50,18 mm (za duża) leżą poza przedziałem – to BRAKI (poza tolerancją).',
    ],
    solutionExplanationPl:
      'Dla wymiaru 50,0 ±0,1 mm dopuszczalny przedział to od 49,90 mm do 50,10 mm włącznie. Detale 49,95 mm i 50,10 mm są poprawne, natomiast 49,82 mm i 50,18 mm przekraczają dopuszczalną odchyłkę.',
    quiz: [
      {
        id: 'q_m0b_1',
        questionPl: 'Na rysunku widnieje wymiar 30 ±0,05. Która ze zmierzonych części jest wykonana poprawnie?',
        optionsPl: [
          '29,92 mm',
          '29,96 mm',
          '30,08 mm',
        ],
        correctOptionIndex: 1,
        explanationPl:
          'Przedział dopuszczalny dla 30 ±0,05 mm wynosi od 29,95 mm do 30,05 mm. Wymiar 29,96 mm mieści się w tym zakresie.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.C: POMIARY WARSZTATOWE – SUWMIARKA I MIKROMETR
  // =========================================================================
  {
    id: 'M0_C',
    moduleId: 'MODULE_0',
    orderIndex: 4,
    titlePl: 'Lekcja 0.C: Pomiary warsztatowe – suwmiarka i mikrometr',
    shortSubtitlePl: 'Interaktywny odczyt skali głównej, noniusza i bębna mikrometru',
    theoryParagraphsPl: [
      '1. CZYM MIERZYMY GOTOWĄ CZĘŚĆ PO WYJĘCIU Z MASZYNY?\nZwykła szkolna linijka ma kreski co 1 milimetr – w warsztacie CNC to o wiele za mało! Dlatego operator używa dwóch precyzyjnych przyrządów pomiarowych:\n• SUWMIARKA (Vernier Caliper) – uniwersalny przyrząd z przesuwnymi szczękami: dolne szczęki mierzą grubość i szerokość kostki z zewnątrz, górne ostre szczęki wchodzą do środka otworu i mierzą jego średnicę, a wysuwany z końca pręcik mierzy głębokość otworów. Dokładność suwmiarki to zazwyczaj 0,05 mm (pół dziesiątej milimetra).\n• MIKROMETR (Micrometer) – przyrząd w kształcie podkowy z precyzyjnym bębnem śrubowym, służący do najdokładniejszych pomiarów z dokładnością do 0,01 mm (jednej setnej milimetra!).',
      '2. JAK ODCZYTAĆ WYNIK Z SUWMIARKI I MIKROMETRU W DWA KROKI?\n• Na SUWMIARCE: Krok 1 – spójrz na kreskę „0” na dolnym ruchomym suwaku (noniuszu) i sprawdź, ile pełnych milimetrów minęła na głównej linijce (np. stoi tuż za kreską 24 mm). Krok 2 – sprawdź na suwaku, która kreska dziesiętna pokrywa się z kreską na górze (np. połowa, czyli 0,50 mm -> razem 24,50 mm).\n• Na MIKROMETRZE: Na poziomej tulei odczytujemy pełne milimetry (np. 12 mm), a na obrotowym bębnie z 50 kreskami odczytujemy setne części milimetra (np. 35 kresek = 0,35 mm -> razem 12,35 mm).',
      '3. CO ROBI OPERATOR, GDY WYMIAR JEST O 0,03 MM ZA DUŻY?\nGdy zmierzysz gotową część i zobaczysz, że przez lekkie przytępienie frezu ścianka wyszła o 0,03 mm za gruba, nie musisz przepisywać programu od nowa! W zakładce „🛠 Tabele T / H / D / G54” wpisujesz w kolumnie „Zużycie (Wear)” drobną poprawkę dla narzędzia, a maszyna automatycznie przesunie tor ruchu o te 0,03 mm.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'Suwmiarka',
        meaningPl: 'Mierzy wymiary zewnętrzne (szczęki dolne), otwory (szczęki górne) i głębokość (pręt) z dokładnością do 0,05 mm',
        examplePl: 'Ustawienie na 24,50 mm = 24 pełne mm + połowa milimetra na noniuszu',
      },
      {
        codeOrSymbol: 'Mikrometr',
        meaningPl: 'Najdokładniejszy ręczny przyrząd warsztatowy – mierzy z dokładnością do 0,01 mm (1/100 milimetra)',
        examplePl: 'Ustawienie na 12,35 mm = 12 mm na tulei + 35 setnych na bębnie',
      },
      {
        codeOrSymbol: 'Czystość pomiaru',
        meaningPl: 'Przed przyłożeniem szczęk zawsze wycieramy detal z wiórów i chłodziwa',
        examplePl: 'Jeden opiłek pod szczęką suwmiarki fałszuje pomiar o 0,1 mm!',
      },
    ],
    stepByStepGuidePl: [
      'W interaktywnym symulatorze poniżej użyj suwaka lub przycisków przy suwmiarce, aby ustawić jej rozwarcie dokładnie na 24,50 mm.',
      'Następnie użyj suwaka lub przycisków przy mikrometrze, aby ustawić wskazanie na 12,35 mm, i kliknij przycisk zatwierdzający pomiar.',
    ],
    commonMistakeWarningPl:
      'Nigdy nie mierz części podczas gdy znajduje się ona w ruchu ani zanim ostygnie po bardzo ciężkiej obróbce na sucho – gorący metal rozszerza się termicznie, a po ostygnięciu na stole kontroli jakości wymiar skurczy się o kilka setnych milimetra!',
    taskDescriptionPl:
      'W interaktywnym symulatorze pomiarowym poniżej: 1) przesuń suwak wirtualnej suwmiarki na wymiar 24,50 mm, 2) ustaw bęben mikrometru na wymiar 12,35 mm i zatwierdź pomiar.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Na suwmiarce ustaw suwak tak, aby wskazanie wyniosło dokładnie 24,50 mm.',
      'Podpowiedź 2/3: Na mikrometrze ustaw bęben tak, aby wskazanie wyniosło 12,35 mm.',
      'Podpowiedź 3/3: Możesz użyć wygodnych przycisków „-0,05 / +0,05 mm” oraz „-0,01 / +0,01 mm” obok suwaków.',
    ],
    solutionExplanationPl:
      'Suwmiarka ustawiona na 24,50 mm pokazuje 24 pełne milimetry przed zerem noniusza oraz pokrycie się kreski „5” (0,50 mm) na noniuszu. Mikrometr na 12,35 mm odsłania kreskę 12 mm na tulei oraz wskazuje 35 na skali obwodowej bębna.',
    quiz: [
      {
        id: 'q_m0c_1',
        questionPl: 'Który przyrząd warsztatowy zapewnia dokładniejszy pomiar średnicy precyzyjnego wałka?',
        optionsPl: [
          'Zwykła linijka biurowa (dokładność ok. 1 mm)',
          'Suwmiarka uniwersalna (dokładność ok. 0,05 mm)',
          'Mikrometr zewnętrzny (dokładność 0,01 mm)',
        ],
        correctOptionIndex: 2,
        explanationPl:
          'Mikrometr zewnętrzny pozwala mierzyć z dokładnością do 0,01 mm (jednej setnej milimetra) i posiada sprzęgło cierne zapewniające stały docisk pomiarowy.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.D: PODSTAWY SKRAWANIA – NARZĘDZIA, MATERIAŁY, OBROTY S I POSUW F
  // =========================================================================
  {
    id: 'M0_D',
    moduleId: 'MODULE_0',
    orderIndex: 5,
    titlePl: 'Lekcja 0.D: Podstawy skrawania – narzędzia, materiały, obroty S i posuw F',
    shortSubtitlePl: 'Intuicja pracy narzędzia: dlaczego posuw nie może być ani za szybki, ani za wolny',
    theoryParagraphsPl: [
      '1. JAK NARZĘDZIE TNIE METAL? DWA NAJWAŻNIEJSZE PARAMETRY: OBROTY (S) I POSUW (F)\nWyobraź sobie krojenie chleba lub wiercenie w ścianie: aby ostrze czysto wchodziło w materiał, musisz pogodzić ze sobą dwie prędkości, które zawsze podajemy w programie CNC:\n• OBROTY WRZECIONA – litera S (Spindle Speed): mówi, jak szybko kręci się frez wokół własnej osi. Podajemy ją w obrotach na minutę (obr./min, po angielsku RPM). Przykład: zapis „S3200” oznacza, że frez wykonuje 3200 obrotów w ciągu jednej minuty!\n• POSUW ROBOCZY – litera F (Feed Rate): mówi, jak szybko obracający się frez przesuwa się do przodu przez materiał. Podajemy go w milimetrach na minutę (mm/min). Przykład: zapis „F400” oznacza, że frez sunie przez metal z prędkością 400 milimetrów na minutę.',
      '2. DLACZEGO POSUW NIE MOŻE BYĆ ANI ZA SZYBKI, ANI ZA WOLNY?\n• Co się stanie, jeśli pojedziesz ZA SZYBKO (ogromny posuw F przy niskich obrotach S)? Każde ostrze frezu będzie musiało jednorazowo wyrwać zbyt gruby kawał metalu. Narzędzie nie wytrzyma takiego naporu i PĘKNIE (złamie się)!\n• Co się stanie, jeśli pojedziesz ZA WOLNO (ledwo pełznący posuw F przy ogromnych obrotach S)? To pułapka, o której nie wie wielu początkujących! Ostrze zamiast wgryzać się w metal i ścinać wiór (który zabiera ze sobą gorąco!), zaczyna ślizgać się i TRZEĆ po powierzchni jak papier ścierny. Od tarcia wydziela się ogromna temperatura, aluminium topi się i zakleja ostrza, a frez błyskawicznie się pali!',
      '3. MIĘKKIE ALUMINIUM VS. TWARDA STAL ORAZ ROLA CHŁODZIWA (M8)\n• Miękkie materiały (aluminium, tworzywa sztuczne) obrabiamy na WYSOKICH obrotach S i szybkim posuwie F.\n• Twarde materiały (stal konstrukcyjna, stal nierdzewna) obrabiamy na NIŻSZYCH obrotach S i wolniejszym posuwie, aby nie przegrzać ostrza.\n• Podczas skrawania polewamy narzędzie białym płynem z dysz – to CHŁODZIWO (emulsja wodno-olejowa włączana w kodzie poleceniem M8), które chłodzi frez, smaruje ostrza i zmywa ostre wióry ze stołu.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'S (np. S3200)',
        meaningPl: 'Spindle Speed – prędkość obrotowa wrzeciona w obrotach na minutę [obr./min]',
        examplePl: 'S3200 M3 = kręć wrzecionem w prawo z prędkością 3200 obr./min',
      },
      {
        codeOrSymbol: 'F (np. F400)',
        meaningPl: 'Feed Rate – prędkość posuwu narzędzia w materiale w milimetrach na minutę [mm/min]',
        examplePl: 'G1 X80 F400 = jedź w materiale do X=80 z prędkością 400 mm/min',
      },
      {
        codeOrSymbol: 'Za duży posuw F',
        meaningPl: 'Przeciążenie mechaniczne ostrza -> wyłamanie zęba lub pęknięcie całego frezu',
        examplePl: 'Czerwona strefa przeciążenia na wskaźniku poniżej',
      },
      {
        codeOrSymbol: 'Za mały posuw F',
        meaningPl: 'Tarcie zamiast ścinania wióra -> przegrzanie, stępienie ostrza i zaklejenie frezu',
        examplePl: 'Żółta strefa tarcia na wskaźniku poniżej',
      },
    ],
    stepByStepGuidePl: [
      'Spójrz na interaktywny symulator skrawania poniżej – możesz w nim bezpiecznie przesuwać suwak obrotów S oraz suwak posuwu F.',
      'Upewnij się, że wybrany jest materiał „Aluminium”, a następnie ustaw suwaki (np. S około 3200 obr./min oraz F około 400 mm/min) tak, aby wskaźnik pokazał zielony komunikat „Zdrowy wiór – stabilna obróbka”.',
    ],
    commonMistakeWarningPl:
      'Na tym kursie w każdej lekcji podajemy Ci zawsze bezpieczne, sprawdzone wartości S oraz F – nie musisz ich zgadywać! Najważniejsze, abyś pamiętał: przed wejściem narzędzia w metal wrzeciono MUSI się obracać (M3), a ruch roboczy (G1) MUSI mieć podaną prędkość posuwu (F).',
    taskDescriptionPl:
      'Użyj interaktywnego symulatora skrawania poniżej. Wybierz materiał „Aluminium” i ustaw suwaki obrotów S oraz posuwu F tak, aby wskaźnik obciążenia znalazł się w zielonej strefie „Zdrowy wiór – stabilna obróbka”.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Jeśli ustawisz obroty S zbyt nisko przy dużym posuwie F, obciążenie ostrza przekroczy 100% (ryzyko złamania frezu!).',
      'Podpowiedź 2/3: Jeśli ustawisz posuw F zbyt nisko przy ogromnych obrotach S, narzędzie będzie tarło i przegrzewało detal.',
      'Podpowiedź 3/3: Dla aluminium i frezu Ø10 mm ustaw obroty S w okolicach 3000–3500 obr./min oraz posuw F w przedziale 300–500 mm/min.',
    ],
    solutionExplanationPl:
      'Dla frezu Ø10 mm w aluminium optymalne parametry w naszym symulatorze to ok. S = 3200 obr./min oraz F = 400 mm/min – każde ostrze zbiera wtedy równomierny wiór, który odprowadza ciepło ze strefy skrawania.',
    quiz: [
      {
        id: 'q_m0d_1',
        questionPl: 'Co stanie się, jeśli frez wejdzie w lity metal z ogromnym posuwem F przy zbyt niskich obrotach wrzeciona S?',
        optionsPl: [
          'Ostrze narzędzia zostanie przeciążone i frez pęknie (ulegnie złamaniu)',
          'Powierzchnia wyjdzie lustrzanie gładka',
          'Maszyna automatycznie zamieni aluminium w stal',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'Zbyt duży posuw na jeden obrót powoduje gwałtowny wzrost siły skrawania i ukruszenie lub złamanie frezu.',
      },
    ],
  },

  // =========================================================================
  // LEKCJA 0.E: BUDOWA MASZYNY, JAK CZYTAĆ G-CODE I ZASADY BHP
  // =========================================================================
  {
    id: 'M0_E',
    moduleId: 'MODULE_0',
    orderIndex: 6,
    titlePl: 'Lekcja 0.E: Budowa maszyny, jak czytać pierwszą linijkę G-code i zasady BHP',
    shortSubtitlePl: 'Ostatni krok przed Modułem 1: jak rozszyfrować zapis „G1 X80 Y40 Z-4 F300” w 10 sekund',
    theoryParagraphsPl: [
      '1. JAK WYGLĄDA JĘZYK G-CODE? (LITERA + LICZBA = SŁOWO)\nW następnej lekcji (Moduł 1 – Lekcja 1.1) zobaczysz swój pierwszy prawdziwy program CNC. Żeby nic Cię w nim nie zaskoczyło, poznaj tajemnicę jego budowy:\n• Program czyta się zwykłymi linijkami od góry do dołu. Jedna linijka nazywa się BLOKIEM.\n• W każdej linijce stoją krótkie SŁOWA oddzielone spacjami, np.: „G1 X80 Y40 Z-4 F300”.\n• Każde słowo składa się z WIELKIEJ LITERY (mówiącej CO ustawiamy) oraz LICZBY (mówiącej ILE milimetrów lub jaki numer rozkazu).\n• Wszystko, co jest napisane w nawiasach okrągłych, np. (Mój pierwszy ruch), to komentarz dla człowieka – maszyna całkowicie go ignoruje!',
      '2. SŁOWNICZEK 7 NAJWAŻNIEJSZYCH KODÓW, KTÓRE SPOTKASZ W MODULE 1:\n• G0 = Ruch szybki w powietrzu (Rapid) – maszyna przestawia narzędzie najszybciej jak potrafi nad detalem (żółta linia przerywana w 3D).\n• G1 = Ruch roboczy po linii prostej (Linear Cut) – maszyna jedzie spokojnie z zadaną prędkością F i skrawa materiał (niebieska linia ciągła w 3D).\n• X, Y, Z = Współrzędne punktu docelowego w milimetrach (np. X80 Y40 Z-4).\n• F = Prędkość posuwu w mm/min (np. F300).\n• S oraz M3 / M5 = Obroty wrzeciona: „S3000 M3” włącza obroty wrzeciona (3000 obr./min), a „M5” zatrzymuje wrzeciono.\n• T1 M6 = Wybierz narzędzie nr 1 z magazynu (T1) i zamontuj je we wrzecionie (M6).\n• M30 = Koniec programu i przewinięcie go na początek.',
      '3. ZASADY BEZPIECZEŃSTWA (BHP) PRZY PRAWDZIWEJ MASZYNIE CNC\n1) Nigdy nie otwieraj osłony kabiny podczas pracy wrzeciona i zawsze noś okulary ochronne.\n2) NIGDY nie pracuj przy wirujących elementach w rękawiczkach materiałowych, z luźnymi rękawami ani rozpuszczonymi długimi włosami (wirujące wrzeciono może je wciągnąć).\n3) Przy pierwszym uruchomieniu nowego programu zawsze sprawdzaj go najpierw na symulatorze 3D i używaj trybu pojedynczych linii (przycisk „Następna linia ▶” pod widokiem 3D) oraz miej pod ręką czerwony przycisk awaryjny E-Stop / zatrzymanie posuwu Feed Hold.',
    ],
    cheatSheetRows: [
      {
        codeOrSymbol: 'G0 vs. G1',
        meaningPl: 'G0 = szybki dojazd WYŁĄCZNIE w powietrzu; G1 = kontrolowany ruch roboczy skrawający materiał',
        examplePl: 'G0 X20 Y40 Z5 (w powietrzu) -> G1 Z-4 F200 (wejście w metal)',
      },
      {
        codeOrSymbol: 'T1 M6',
        meaningPl: 'T1 wybiera narzędzie nr 1 (Frez Ø10 mm), a M6 każe maszynie włożyć je do wrzeciona',
        examplePl: 'Zawsze na początku programu przed włączeniem obrotów',
      },
      {
        codeOrSymbol: 'S3000 M3 / M5',
        meaningPl: 'S3000 ustawia 3000 obr./min, M3 włącza obrót wrzeciona w prawo, a M5 je wyłącza',
        examplePl: 'S3000 M3 na starcie obróbki; M5 na końcu przed M30',
      },
      {
        codeOrSymbol: 'M8 / M9 oraz M30',
        meaningPl: 'M8 = włącz chłodziwo, M9 = wyłącz chłodziwo; M30 = koniec programu',
        examplePl: 'Ostatnia linia każdego programu to M30',
      },
    ],
    anatomyBreakdown: {
      titlePl: 'Zobacz, jak czyta się pojedynczą linijkę kodu CNC (słowo po słowie):',
      lineCode: 'G1 X80 Y40 Z-4 F300 (Wyfrezuj rowek do punktu X80 Y40)',
      parts: [
        { token: 'G1', explanationPl: 'Jedź ruchem roboczym po linii prostej (skrawaj materiał)' },
        { token: 'X80', explanationPl: 'Dojedź do współrzędnej X = 80 mm od lewej krawędzi' },
        { token: 'Y40', explanationPl: 'Dojedź do współrzędnej Y = 40 mm od przedniej krawędzi' },
        { token: 'Z-4', explanationPl: 'Na głębokości 4 mm wewnątrz materiału (4 mm poniżej górnej ścianki Z0)' },
        { token: 'F300', explanationPl: 'Z prędkością posuwu 300 milimetrów na minutę' },
        { token: '(Wyfrezuj...)', explanationPl: 'Komentarz w nawiasie – opis dla Ciebie, ignorowany przez maszynę' },
      ],
    },
    stepByStepGuidePl: [
      'Przejrzyj „Rozbiór pojedynczej linijki kodu CNC” powyżej – zobacz, że każde słowo to po prostu jedna litera i liczba!',
      'W interaktywnym ćwiczeniu poniżej odpowiedz na 3 pytania podsumowujące Moduł 0.',
      'Po kliknięciu „Następna lekcja ▶” przejdziesz prosto do Lekcji 1.1 w Module 1, gdzie samodzielnie wykonasz swój pierwszy ruch na frezarce 3D!',
    ],
    taskDescriptionPl:
      'W interaktywnym schemacie poniżej odpowiedz poprawnie na 3 pytania dopasowujące elementy maszyny, znaczenie kodów oraz zasady BHP, aby ukończyć Moduł 0 i przejść do Modułu 1!',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Na frezarce obraca się narzędzie (frez/wiertło), natomiast na tokarce obraca się obrabiany przedmiot (wałek w uchwycie).',
      'Podpowiedź 2/3: Za ruch pionowy (góra/dół) na pionowej frezarce 3-osiowej odpowiada oś Z.',
      'Podpowiedź 3/3: Czerwony przycisk grzybkowy (E-Stop / Awaryjny Stop) służy do natychmiastowego zatrzymania maszyny w sytuacji zagrożenia.',
    ],
    solutionExplanationPl:
      'Brawo! Ukończyłaś/ukończyłeś cały Moduł 0. Znasz już 4 podstawowe pojęcia (wrzeciono, narzędzie, oś, współrzędna), potrafisz czytać rysunek techniczny, rozumiesz tolerancje i przyrządy pomiarowe, wiesz czym są obroty S i posuw F oraz potrafisz rozszyfrować linijkę G-code. Czas na Lekcję 1.1 i Twój pierwszy własny ruch maszyną 3D!',
    quiz: [
      {
        id: 'q_m0e_1',
        questionPl: 'Co oznacza linijka kodu „G1 X80 Y40 F300” w programie CNC?',
        optionsPl: [
          'Jedź po linii prostej ruchem roboczym (G1) do punktu X = 80 mm, Y = 40 mm z prędkością posuwu 300 mm/min (F300)',
          'Wymień narzędzie na numer 80 i wyłącz maszynę',
          'Zatrzymaj wrzeciono na 300 sekund',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'G1 oznacza ruch roboczy prostoliniowy, X80 i Y40 to współrzędne docelowe w milimetrach, a F300 określa prędkość posuwu 300 mm/min.',
      },
    ],
  },
];
