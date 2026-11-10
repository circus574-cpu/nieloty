/**
 * Kompletny słownik pojęć CNC dostępny z poziomu każdej lekcji (Moduły 0–4).
 * Zawiera przystępne wyjaśnienia po polsku oraz odpowiedniki angielskie (w nawiasach).
 */

import type { GlossaryEntry } from '../core/types/curriculum';

export const CNC_GLOSSARY: GlossaryEntry[] = [
  {
    id: 'cnc',
    termPl: 'CNC (Sterowanie numeryczne)',
    termEn: 'Computer Numerical Control',
    shortDefinitionPl:
      'Układ komputerowy sterujący ruchami maszyny (np. frezarki lub tokarki) na podstawie programu zapisanego za pomocą liter i liczb (kodu G).',
    examplePl: 'Zamiast kręcić korbkami ręcznie, wpisujemy G1 X50 F200, a komputer sam przesuwa stół.',
  },
  {
    id: 'surówka',
    termPl: 'Surówka / Półfabrykat',
    termEn: 'Stock / Workpiece Blank',
    shortDefinitionPl:
      'Kawałek materiału (np. kostka aluminium lub wałek stali) zamocowany w maszynie przed rozpoczęciem obróbki, z którego wycinamy gotową część.',
    examplePl: 'Nasza domyślna surówka w Module 1 ma wymiary 100 × 80 × 20 mm.',
  },
  {
    id: 'wrzeciono',
    termPl: 'Wrzeciono',
    termEn: 'Spindle',
    shortDefinitionPl:
      'Główny obracający się zespół napędowy maszyny. Na frezarce wrzeciono obraca narzędziem (frezem lub wiertłem), a na tokarce obraca przedmiotem obrabianym (wałkiem).',
    examplePl: 'Polecenie S3000 M3 uruchamia wrzeciono z prędkością 3000 obrotów na minutę w prawo.',
  },
  {
    id: 'atc',
    termPl: 'Magazyn narzędzi (ATC)',
    termEn: 'Automatic Tool Changer',
    shortDefinitionPl:
      'Automatyczny magazyn karuzelowy lub łańcuchowy przechowujący oprawki z narzędziami i wymieniający je we wrzecionie na rozkaz M6.',
    examplePl: 'Blok T2 M6 pobiera z magazynu narzędzie nr 2 i montuje je we wrzecionie.',
  },
  {
    id: 'posuw',
    termPl: 'Posuw roboczy (F)',
    termEn: 'Feed Rate',
    shortDefinitionPl:
      'Prędkość, z jaką narzędzie przesuwa się wzdłuż materiału podczas skrawania. Na frezarce podawana w milimetrach na minutę (mm/min, G94), a na tokarce w mm na obrót (mm/obr, G95).',
    examplePl: 'F300 oznacza, że frez przesuwa się o 300 mm w ciągu jednej minuty (czyli 5 mm na sekundę).',
  },
  {
    id: 'obroty_s',
    termPl: 'Prędkość obrotowa wrzeciona (S)',
    termEn: 'Spindle Speed (RPM)',
    shortDefinitionPl:
      'Liczba pełnych obrotów wykonywanych przez wrzeciono w ciągu jednej minuty [obr./min]. Dobierana do średnicy narzędzia i rodzaju materiału.',
    examplePl: 'S3200 M3 włącza prawe obroty wrzeciona z prędkością 3200 obr./min.',
  },
  {
    id: 'wcs',
    termPl: 'Punkt zerowy przedmiotu (WCS: G54–G59)',
    termEn: 'Work Coordinate System / Work Offset',
    shortDefinitionPl:
      'Punkt odniesienia (X=0, Y=0, Z=0) ustawiony przez operatora na samym obrabianym detalu (np. w lewym dolnym narożniku na górnej ściance).',
    examplePl: 'Dzięki G54 wszystkie współrzędne w programie liczymy wygodnie od narożnika naszej kostki.',
  },
  {
    id: 'mcs',
    termPl: 'Układ współrzędnych maszyny (MCS / Zero Maszyny M)',
    termEn: 'Machine Coordinate System',
    shortDefinitionPl:
      'Stały, fabryczny układ odniesienia obrabiarki określony przez jej wyłączniki krańcowe i enkodery podczas bazowania (Homing).',
    examplePl: 'Tabela G54–G59 mówi sterownikowi, gdzie w układzie maszyny (MCS) leży narożnik naszego przedmiotu.',
  },
  {
    id: 'podkladki',
    termPl: 'Podkładki równoległe',
    termEn: 'Parallels',
    shortDefinitionPl:
      'Para precyzyjnie szlifowanych stalowych listew podkładanych pod obrabianą kostkę w szczękach imadła maszynowego.',
    examplePl: 'Unoszą detal ponad szczęki imadła i zostawiają wolną przestrzeń pod środkiem na wyjście wiertła.',
  },
  {
    id: 'sonda',
    termPl: 'Sonda dotykowa (pomiarowa)',
    termEn: 'Touch Probe (Renishaw / Blum)',
    shortDefinitionPl:
      'Elektroniczny czujnik z rubinową kulką mocowany we wrzecionie, służący do automatycznego pomiaru położenia ścianek detalu i zapisu bazy G54.',
    examplePl: 'Sonda dotyka lewej, przedniej i górnej ścianki kostki, automatycznie wyznaczając X0, Y0, Z0.',
  },
  {
    id: 'single_block',
    termPl: 'Tryb pojedynczego bloku (Single Block)',
    termEn: 'Single Block Mode',
    shortDefinitionPl:
      'Tryb bezpieczeństwa na pulpicie maszyny, w którym każde naciśnięcie Cycle Start wykonuje tylko jedną linijkę kodu G, po czym maszyna zatrzymuje się.',
    examplePl: 'W naszym symulatorze odpowiada mu przycisk „Następna linia ▶” pod oknem 3D.',
  },
  {
    id: 'feed_hold',
    termPl: 'Zatrzymanie posuwu (Feed Hold) i Distance To Go',
    termEn: 'Feed Hold & Distance To Go',
    shortDefinitionPl:
      'Przycisk Feed Hold natychmiast zatrzymuje ruch osi X/Y/Z (pozostawiając włączone wrzeciono), co pozwala sprawdzić na ekranie licznik pozostałej drogi (Distance To Go).',
    examplePl: 'Zatrzymujemy zjazd narzędzia 20 mm nad kostką i sprawdzamy, czy Distance To Go zgadza się z wysokością nad detalem.',
  },
  {
    id: 'modalność',
    termPl: 'Kod modalny (pamiętany)',
    termEn: 'Modal Code',
    shortDefinitionPl:
      'Polecenie, które po wpisaniu w jednej linii pozostaje aktywne w kolejnych liniach aż do momentu zastąpienia go innym kodem z tej samej grupy.',
    examplePl: 'Po wpisaniu G1 F200 w kolejnej linii wystarczy samo X50 Y20 – maszyna pamięta, że jedzie ruchem G1 z posuwem F200.',
  },
  {
    id: 'g0_g1',
    termPl: 'Ruch szybki (G0) vs Ruch roboczy (G1)',
    termEn: 'Rapid Traverse (G0) vs Linear Interpolation (G1)',
    shortDefinitionPl:
      'G0 służy wyłącznie do szybkiego przestawiania narzędzia w powietrzu (nad detalem). G1 służy do kontrolowanego skrawania materiału z wybranym posuwem F.',
    examplePl: 'Wjazd w materiał na G0 to groźna kolizja! Zawsze zatrzymaj G0 na Z2..Z5 i wejdź w materiał za pomocą G1.',
  },
  {
    id: 'g2_g3',
    termPl: 'Interpolacja kołowa – łuki (G2 / G3)',
    termEn: 'Circular Interpolation CW (G2) / CCW (G3)',
    shortDefinitionPl:
      'Ruch roboczy po łuku kołowym: G2 zgodnie z ruchem wskazówek zegara (w prawo), G3 przeciwnie do wskazówek zegara (w lewo). Krzywiznę określa promień R lub wektor środka I, J.',
    examplePl: 'G3 X80 Y40 R20 (lub G3 X80 Y40 I0 J20) wykonuje ćwiartkę łuku o promieniu 20 mm.',
  },
  {
    id: 'g90_g91',
    termPl: 'Wymiarowanie bezwzględne (G90) vs przyrostowe (G91)',
    termEn: 'Absolute (G90) vs Incremental Positioning (G91)',
    shortDefinitionPl:
      'W trybie G90 współrzędne X, Y, Z mierzone są zawsze od stałego punktu zerowego G54 (0,0,0). W trybie G91 liczby oznaczają przesunięcie o podaną wartość od aktualnej pozycji narzędzia.',
    examplePl: 'W G91 zapis G1 X20 oznacza „przesuń się o 20 mm w prawo od miejsca, w którym teraz stoisz”.',
  },
  {
    id: 'korekcja_dlugosci',
    termPl: 'Korekcja długości narzędzia (G43 H..)',
    termEn: 'Tool Length Compensation',
    shortDefinitionPl:
      'Funkcja informująca sterownik, o ile milimetrów dane narzędzie wystaje z oprawki wrzeciona (wartość zapisana w rejestrze H). Odwoływana kodem G49.',
    examplePl: 'Dla narzędzia T1 włączamy G43 H1, dzięki czemu zaprogramowane Z0 oznacza dotknięcie powierzchni detalu czubkiem frezu.',
  },
  {
    id: 'korekcja_promienia',
    termPl: 'Korekcja promienia narzędzia (G41 / G42 D..)',
    termEn: 'Cutter Radius Compensation (CRC)',
    shortDefinitionPl:
      'Automatyczne odsunięcie osi frezu od zaprogramowanego konturu o promień narzędzia (zapisany w rejestrze D): G41 w lewo, G42 w prawo, G40 odwołuje.',
    examplePl: 'Zamiast ręcznie doliczać 5 mm promienia frezu Ø10 do każdego wymiaru z rysunku, włączamy G41 D1.',
  },
  {
    id: 'wear_offset',
    termPl: 'Korekta zużycia narzędzia (Wear Offset)',
    termEn: 'Tool Wear Offset',
    shortDefinitionPl:
      'Dodatkowa kolumna w tabeli korektorów H i D służąca do drobnej korekty wymiaru (np. o 0,02 mm), gdy ostrze narzędzia ulegnie delikatnemu starciu podczas pracy.',
    examplePl: 'Pozwala utrzymać wąską tolerancję wymiarową bez modyfikowania współrzędnych w kodzie programu.',
  },
  {
    id: 'cykl_staly',
    termPl: 'Cykl stały wiertarski (G81, G82, G83 i G80)',
    termEn: 'Canned Drilling Cycle',
    shortDefinitionPl:
      'Gotowy podprogram w sterowniku, który jednym poleceniem realizuje dojazd, wiercenie otworu na głębokość Z i szybki wyjazd powrotny. Odwoływany kodem G80.',
    examplePl: 'G83 wierci głęboki otwór skokami co Q milimetrów, wycofując wiertło w celu wyrzucenia wiórów.',
  },
  {
    id: 'helisa',
    termPl: 'Interpolacja śrubowa (Helisa)',
    termEn: 'Helical Interpolation',
    shortDefinitionPl:
      'Jednoczesny ruch po okręgu w płaszczyźnie XY (G2/G3) połączony z płynnym opuszczaniem narzędzia w osi Z. Służy do łagodnego wchodzenia w metal i rozwiercania otworów frezem.',
    examplePl: 'G3 X60 Y40 I-10 J0 Z-4 F250 zatacza łuk z jednoczesnym zjazdem na głębokość Z-4 mm.',
  },
  {
    id: 'noniusz',
    termPl: 'Noniusz (skala pomocnicza suwmiarki)',
    termEn: 'Vernier Scale',
    shortDefinitionPl:
      'Dodatkowa podziałka na suwaku suwmiarki, która pozwala odczytać ułamki milimetra (np. z dokładnością do 0,05 mm lub 0,02 mm).',
    examplePl: 'Patrzymy, która kreska noniusza pokrywa się idealnie z dowolną kreską skali głównej.',
  },
  {
    id: 'tolerancja',
    termPl: 'Tolerancja wymiarowa i pasowanie (np. ±0,1, H7/g6)',
    termEn: 'Dimensional Tolerance & Fit',
    shortDefinitionPl:
      'Dopuszczalny zakres odchyłki wymiaru wykonanej części od wymiaru nominalnego z rysunku. Duża litera (np. H7) oznacza tolerancję otworu, a mała (np. g6) wałka.',
    examplePl: 'Dla wymiaru 40 ±0,1 mm poprawna część może mieć od 39,90 mm do 40,10 mm.',
  },
  {
    id: 'tokarka_xz',
    termPl: 'Osie tokarki CNC (Z oraz średnicowe X)',
    termEn: 'Lathe Axes (Z Axial & X Diameter)',
    shortDefinitionPl:
      'Na tokarce oś Z biegnie wzdłuż osi obracającego się wałka (czoło wałka to Z0), natomiast oś X jest prostopadła i wyraża bezpośrednio ŚREDNICĘ (Ø) toczonego wałka.',
    examplePl: 'Zapis G1 X30 Z-40 na tokarce oznacza wytoczenie wałka o średnicy Ø30 mm na długości 40 mm.',
  },
  {
    id: 'os_obrotowa_ac',
    termPl: 'Osie obrotowe 4- i 5-osiowe (Oś A oraz Oś C)',
    termEn: 'Rotary Axes (A-Axis & C-Axis / 3+2 Indexing)',
    shortDefinitionPl:
      'Dodatkowe osie kątowe (w stopniach): oś A obraca detal wokół osi X (podzielnica / kołyska), a oś C obraca detal wokół osi Z. Pozwalają obrabiać detal z wielu stron w jednym zamocowaniu.',
    examplePl: 'Rozkaz G0 A90 obraca podzielnicę o 90 stopni, wystawiając kolejną ściankę kostki pod wrzeciono.',
  },
];
