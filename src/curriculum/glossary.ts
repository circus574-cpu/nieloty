/**
 * Słownik pojęć CNC dostępny z poziomu każdej lekcji.
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
      'Główny obracający się element maszyny. Na frezarce wrzeciono obraca narzędziem (frezem lub wiertłem), a na tokarce obraca przedmiotem obrabianym.',
    examplePl: 'Polecenie S3000 M3 uruchamia wrzeciono z prędkością 3000 obrotów na minutę w prawo.',
  },
  {
    id: 'posuw',
    termPl: 'Posuw roboczy (F)',
    termEn: 'Feed Rate',
    shortDefinitionPl:
      'Prędkość, z jaką narzędzie przesuwa się wzdłuż materiału podczas skrawania. Na frezarce podawana najczęściej w milimetrach na minutę (mm/min).',
    examplePl: 'F300 oznacza, że frez przesuwa się o 300 mm w ciągu jednej minuty (czyli 5 mm na sekundę).',
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
    termPl: 'Układ współrzędnych maszyny (MCS)',
    termEn: 'Machine Coordinate System',
    shortDefinitionPl:
      'Stały, fabryczny układ odniesienia obrabiarki określony przez jej wyłączniki krańcowe (punkt bazowy maszyny).',
    examplePl: 'Tabela G54–G59 mówi sterownikowi, gdzie w układzie maszyny (MCS) leży narożnik naszego przedmiotu.',
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
    id: 'korekcja_dlugosci',
    termPl: 'Korekcja długości narzędzia (G43 H..)',
    termEn: 'Tool Length Compensation',
    shortDefinitionPl:
      'Funkcja informująca sterownik, o ile milimetrów dane narzędzie wystaje z oprawki wrzeciona (wartość zapisana w rejestrze H).',
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
    id: 'cykl_staly',
    termPl: 'Cykl stały wiertarski (G81, G82, G83)',
    termEn: 'Canned Cycle',
    shortDefinitionPl:
      'Gotowy podprogram w sterowniku, który jednym poleceniem realizuje dojazd, wiercenie otworu na głębokość Z i szybki wyjazd powrotny.',
    examplePl: 'G83 wierci głęboki otwór skokami co Q milimetrów, wycofując wiertło w celu wyrzucenia wiórów.',
  },
  {
    id: 'noniusz',
    termPl: 'Noniusz (skala pomocnicza)',
    termEn: 'Vernier Scale',
    shortDefinitionPl:
      'Dodatkowa podziałka na suwaku suwmiarki, która pozwala odczytać ułamki milimetra (np. z dokładnością do 0,05 mm lub 0,02 mm).',
    examplePl: 'Patrzymy, która kreska noniusza pokrywa się idealnie z dowolną kreską skali głównej.',
  },
  {
    id: 'tolerancja',
    termPl: 'Tolerancja wymiarowa',
    termEn: 'Dimensional Tolerance',
    shortDefinitionPl:
      'Dopuszczalny zakres odchyłki wymiaru wykonanej części od wymiaru idealnego z rysunku (np. ±0,1 mm).',
    examplePl: 'Dla wymiaru 40 ±0,1 mm poprawna część może mieć od 39,90 mm do 40,10 mm.',
  },
];
