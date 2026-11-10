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
];
