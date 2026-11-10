/**
 * Spis lekcji dla Modułów 2, 3 i 4 oraz warstwy dialektów (zgodnie ze specyfikacją:
 * pełne scenariusze tych modułów są rozwijane w Etapie 5 po akceptacji Modułu 1).
 */

export interface SyllabusModuleOutline {
  moduleId: string;
  titlePl: string;
  machineSummaryPl: string;
  lessons: {
    code: string;
    titlePl: string;
    goalPl: string;
  }[];
}

export const SYLLABUS_MODULES_2_TO_4: SyllabusModuleOutline[] = [
  {
    moduleId: 'MODULE_2',
    titlePl: 'Moduł 2: Tokarka CNC z głowicą rewolwerową (osie X i Z)',
    machineSummaryPl:
      'Kinematyka 2-osiowa: wrzeciono obraca wałkiem, nóż tokarski porusza się wzdłuż osi Z (długość) oraz osi X (średnicowo). Głowica rewolwerowa z kilkoma narzędziami.',
    lessons: [
      {
        code: '2.1',
        titlePl: 'Kinematyka tokarki: dlaczego obraca się przedmiot, a oś X liczy średnicę',
        goalPl: 'Zrozumienie osi Z (wzdłuż wrzeciona) oraz osi X (wymiarowanie średnicowe: zebranie 1 mm na stronę zmniejsza średnicę X o 2 mm).',
      },
      {
        code: '2.2',
        titlePl: 'Głowica rewolwerowa i wywołanie narzędzia na tokarce (zapis T0101)',
        goalPl: 'Rozróżnienie numeru gniazda w rewolwerze i numeru korektora geometrycznego noża tokarskiego.',
      },
      {
        code: '2.3',
        titlePl: 'Planowanie czoła wałka (frezowanie/toczenie czołowe na Z0 do X0)',
        goalPl: 'Napisanie programu wyrównującego prawą powierzchnię czołową walca.',
      },
      {
        code: '2.4',
        titlePl: 'Toczenie wzdłużne wałka wielostopniowego z fazami i zaokrągleniami',
        goalPl: 'Wykonanie wałka o dwóch stopniach średnicy za pomocą G0, G1 oraz G2/G3.',
      },
      {
        code: '2.5',
        titlePl: 'Stała prędkość skrawania G96 vs stałe obroty G97 oraz limit obrotów G50/G92',
        goalPl: 'Zrozumienie, dlaczego przy zmniejszaniu średnicy X obroty wrzeciona rosną i dlaczego limit maksymalnych obrotów jest kluczowy dla bezpieczeństwa.',
      },
    ],
  },
  {
    moduleId: 'MODULE_3',
    titlePl: 'Moduł 3: Frezarka 4-osiowa (dodatkowa oś obrotowa A)',
    machineSummaryPl:
      'Frezarka X, Y, Z wyposażona w podzielnicę (oś obrotową A obracającą przedmiot wokół osi X).',
    lessons: [
      {
        code: '3.1',
        titlePl: 'Czym jest czwarta oś (oś A wokół osi X)? Obróbka indeksowana 3+1',
        goalPl: 'Zrozumienie kątów obrotu A (0°..360°) i pozycji punktu zerowego w osi obrotu podzielnicy.',
      },
      {
        code: '3.2',
        titlePl: 'Obróbka czterech ścianek kostki/wałka poprzez obrót A0, A90, A180, A270',
        goalPl: 'Napisanie programu wiercącego i frezującego na kilku ściankach detalu w jednym zamocowaniu.',
      },
      {
        code: '3.3',
        titlePl: 'Jednoczesny ruch liniowy X i obrotowy A – nacinanie rowka śrubowego na walcu',
        goalPl: 'Synchronizacja ruchu posuwowego X oraz obrotu A w bloku G1.',
      },
    ],
  },
  {
    moduleId: 'MODULE_4',
    titlePl: 'Moduł 4: Frezarka 5-osiowa (dwie osie obrotowe A i C)',
    machineSummaryPl:
      'Frezarka X, Y, Z ze stołem uchylno-obrotowym (kołyska A + tarcza obrotowa C).',
    lessons: [
      {
        code: '4.1',
        titlePl: 'Kinematyka 5-osiowa: różnica między obróbką pozycjonowaną 3+2 a płynną 5-osiową',
        goalPl: 'Zrozumienie dlaczego 80% obróbki 5-osiowej w przemyśle to obróbka pozycjonowana 3+2 (zablokowanie kątów A i C pod ściankę skośną).',
      },
      {
        code: '4.2',
        titlePl: 'Obróbka ścianki pochyłej w trybie 3+2 (pochylenie stołu A i obrót C)',
        goalPl: 'Ustawienie orientacji detalu pod kątem i wiercenie prostopadłe do pochyłej ścianki.',
      },
      {
        code: '4.3',
        titlePl: 'Idea śledzenia wierzchołka narzędzia (TCPM / RTCP – Tool Center Point Management)',
        goalPl: 'Zrozumienie jak sterownik 5-osiowy automatycznie kompensuje ruchy X/Y/Z podczas pochylania osi obrotowych.',
      },
    ],
  },
  {
    moduleId: 'MODULE_5',
    titlePl: 'Moduł 5: Wycinarka Laserowa / Plazmowa / Waterjet 2D CNC (osie X/Y)',
    machineSummaryPl:
      'Stalowy stół z rusztem grzebieniowym (slats), miedziana dysza tnąca, zapłon wiązki (M3/M5), przebijanie blachy (Piercing G04) i kompensacja szerokości cięcia (Kerf G41/G42).',
    lessons: [
      {
        code: '5.1',
        titlePl: 'Wycinarka laserowa i plazmowa CNC – zapłon wiązki (M3) i przebijanie blachy (Piercing G04)',
        goalPl: 'Zrozumienie specyfiki cięcia termicznego na ruszcie grzebieniowym, zapłonu M3/M5 i postoju G04 P... na przebicie blachy.',
      },
      {
        code: '5.2',
        titlePl: 'Dojścia i wyjścia styczne (Lead-in / Lead-out) – ochrona krawędzi gotowego detalu',
        goalPl: 'Wyprowadzenie punktu przebicia poza kontur nominalny za pomocą wejścia po prostej lub łuku (G1/G3).',
      },
      {
        code: '5.3',
        titlePl: 'Kompensacja szerokości szczeliny cięcia (Kerf Width G41/G42) w wycinarkach laserowych',
        goalPl: 'Zastosowanie G41/G42 z promieniem dyszy/strumienia lasera (D1) w celu zachowania wymiarów nominalnych wyciętej formatki.',
      },
      {
        code: '5.4',
        titlePl: 'Nesting i kolejność wycinania konturów: dlaczego najpierw otwory wewnętrzne, a na końcu kontur zewnętrzny',
        goalPl: 'Zaprogramowanie detalu z otworem wewnętrznym i konturem zewnętrznym z zachowaniem stabilności arkusza blachy.',
      },
    ],
  },
  {
    moduleId: 'MODULE_6',
    titlePl: 'Moduł 6: Ploter bramowy CNC / Router do drewna i kompozytów (24 000 RPM)',
    machineSummaryPl:
      'Ruchoma brama jezdna (Gantry), płyta podkładowa MDF (Spoilboard), wysokoobrotowe elektrowrzeciono 24 000 RPM, frezy grawerskie stożkowe V-Bit oraz mostki trzymające (Holding Tabs).',
    lessons: [
      {
        code: '6.1',
        titlePl: 'Specyfika plotera bramowego – wysokie obroty wrzeciona (24 000 RPM) i posuwy w drewnie/MDF',
        goalPl: 'Zrozumienie zależności prędkości skrawania i posuwu na ząb przy obróbce drewna i tworzyw bez przypalania materiału.',
      },
      {
        code: '6.2',
        titlePl: 'Grawerowanie stożkowe (V-Carving) frezem V-Bit 60°/90° na zadanej głębokości Z',
        goalPl: 'Użycie frezu stożkowego V-Bit do grawerowania ozdobnych rowków w płycie meblowej.',
      },
      {
        code: '6.3',
        titlePl: 'Mostki trzymające detal (Holding Tabs / Z-Bridges) przy rozkroju na wylot',
        goalPl: 'Zabezpieczenie wycinanego elementu przed wyrwaniem przez podniesienie frezu o wysokość mostka (np. Z-2).',
      },
      {
        code: '6.4',
        titlePl: 'Rozkrój głęboki w płytach meblowych i kompozytach – frezowanie wielowarstwowe (Step-down)',
        goalPl: 'Zaprogramowanie bezpiecznego rozkroju płyty 12 mm w trzech przejściach po 4 mm.',
      },
    ],
  },
  {
    moduleId: 'MODULE_7',
    titlePl: 'Moduł 7: Centrum Tokarsko-Frezarskie Mill-Turn (oprawki napędzane + oś C i oś Y)',
    machineSummaryPl:
      'Uchwyt tokarski 3-szczękowy pozycjonowany kątowo jako oś C, oprawki napędzane (Live Tooling), suport z osią Y prostopadłą do osi wrzeciona – kompletna obróbka w jednym zamocowaniu.',
    lessons: [
      {
        code: '7.1',
        titlePl: 'Architektura centrum Mill-Turn: wrzeciono główne jako oś C i oprawki napędzane (Live Tooling)',
        goalPl: 'Zrozumienie przełączenia wrzeciona tokarskiego w precyzyjną oś pozycjonowaną kątowo (oś C) i uruchomienia frezu napędzanego.',
      },
      {
        code: '7.2',
        titlePl: 'Wiercenie otworów na czole wałka po okręgu podziałowym (PCD) z indeksacją kątową osi C',
        goalPl: 'Użycie cyklu wiercenia G81 w połączeniu z obrotami osi C (C0, C120, C240).',
      },
      {
        code: '7.3',
        titlePl: 'Frezowanie sześciokąta pod klucz na czole wałka przy użyciu osi Y oraz osi C',
        goalPl: 'Zastosowanie osi Y do wykonania płaskich powierzchni klucza na czole detalu toczonego.',
      },
      {
        code: '7.4',
        titlePl: 'Frezowanie rowka śrubowego / krzywkowego na pobocznicy wałka – synchronizacja osi Z i osi C',
        goalPl: 'Jednoczesny ruch osi wzdłużnej Z i kątowej C w celu wyfrezowania rowka śrubowego.',
      },
    ],
  },
];
