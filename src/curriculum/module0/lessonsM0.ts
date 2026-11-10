/**
 * Kompletne scenariusze lekcji Modułu 0 (A–E):
 * Podstawy dla osoby bez doświadczenia (rysunek techniczny, tolerancje,
 * pomiary warsztatowe suwmiarką i mikrometrem, intuicja skrawania, budowa maszyn).
 * W pełni interaktywne, bez kodu G.
 */

import type { LessonDefinition } from '../../core/types/curriculum';

export const MODULE_0_LESSONS: LessonDefinition[] = [
  {
    id: 'M0_A',
    moduleId: 'MODULE_0',
    orderIndex: 1,
    titlePl: 'Lekcja 0.A: Czytanie prostego rysunku technicznego',
    shortSubtitlePl: 'Widoki (rzuty), wymiary, średnica Ø, promień R i układ współrzędnych',
    theoryParagraphsPl: [
      'Zanim maszyna CNC wytnie jakąkolwiek część, operator bierze do ręki rysunek techniczny (Technical Drawing). To uniwersalny język inżynierów: zamiast opisywać przedmiot słowami, pokazujemy go z kilku stron jednocześnie – najczęściej w rzucie z góry (widok XY) oraz w rzucie z przodu (widok XZ).',
      'Wszystkie wymiary na polskich rysunkach maszynowych podaje się zawsze w milimetrach (mm) – dlatego przy liczbach nie dopisuje się skrótu „mm”. Symbol „Ø” (fi) przed liczbą oznacza średnicę otworu lub wałka (np. Ø10 to okrąg o średnicy 10 mm, czyli promieniu 5 mm). Litera „R” oznacza promień zaokrąglenia naroża (np. R8).',
      'Aby komputer wiedział, gdzie znajdują się poszczególne otwory i ścianki, na rysunku obieramy punkt odniesienia (0, 0) – np. lewy dolny narożnik płytki. Oś X biegnie od niego w prawo (szerokość), oś Y w górę rysunku (głębokość), a oś Z określa wysokość lub grubość płytki.',
    ],
    taskDescriptionPl:
      'Przyjrzyj się interaktywnemu rysunkowi technicznemu płytki 100 × 80 mm o grubości 20 mm poniżej. Odczytaj z rysunku i wpisz w formularzu: 1) całkowitą szerokość płytki w osi X, 2) średnicę otworu Ø, 3) współrzędne (X oraz Y) środka otworu liczone od lewego dolnego narożnika.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Szerokość całkowita płytki to najdłuższa pozioma linia wymiarowa na dole widoku z góry (100).',
      'Podpowiedź 2/3: Szukaj symbolu kółka przekreślonego kreską (Ø) – przy otworze widnieje napis Ø12.',
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
  {
    id: 'M0_B',
    moduleId: 'MODULE_0',
    orderIndex: 2,
    titlePl: 'Lekcja 0.B: Tolerancje podstawowe – co znaczy ± i dlaczego ma znaczenie',
    shortSubtitlePl: 'Wymiar nominalny, wymiary graniczne i kontrola jakości detalu',
    theoryParagraphsPl: [
      'W świecie rzeczywistym żadna maszyna nie potrafi wykonać części o wymiarze idealnie równym 50,000000 mm. Narzędzie delikatnie się zużywa, metal rozszerza się od ciepła, a wrzeciono ma minimalne drgania. Dlatego konstruktor na rysunku określa tolerancję wymiarową (Dimensional Tolerance), czyli dopuszczalny margines błędu.',
      'Zapis „50 ±0,1” oznacza, że wymiar nominalny (docelowy) to 50,0 mm, ale część będzie w pełni sprawna, jeśli jej rzeczywisty wymiar zmieści się w przedziale od 49,9 mm (dolny wymiar graniczny) do 50,1 mm (górny wymiar graniczny). Całkowita szerokość tego przedziału (tutaj 0,2 mm) nazywa się polem tolerancji.',
      'Im węższa tolerancja (np. ±0,01 mm pod łożysko), tym ostrożniej, wolniej i dokładniej musimy prowadzić obróbkę na maszynie CNC.',
    ],
    taskDescriptionPl:
      'W interaktywnym stanowisku kontroli jakości poniżej sprawdzamy wałki o wymiarze z rysunku 50,0 ±0,1 mm. Oblicz dolny i górny wymiar graniczny, a następnie zaklasyfikuj 4 zmierzone sztuki jako „Dobra (w tolerancji)” albo „Brak (poza tolerancją)”.',
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
  {
    id: 'M0_C',
    moduleId: 'MODULE_0',
    orderIndex: 3,
    titlePl: 'Lekcja 0.C: Pomiary warsztatowe – suwmiarka i mikrometr',
    shortSubtitlePl: 'Interaktywny odczyt skali głównej, noniusza i bębna mikrometru',
    theoryParagraphsPl: [
      'Po wyjęciu detalu z maszyny CNC operator musi zmierzyć, czy wymiary zgadzają się z rysunkiem. Podstawowym przyrządem w każdym warsztacie jest suwmiarka (Vernier Caliper) – służy do pomiaru wymiarów zewnętrznych (szczęki dolne), wewnętrznych (szczęki górne) oraz głębokości otworów (wysuwany pręt głębokościomierza) z dokładnością zazwyczaj do 0,05 mm lub 0,02 mm.',
      'Jak odczytujemy suwmiarkę z noniuszem (skalą pomocniczą)? Najpierw patrzymy, ile pełnych milimetrów na skali głównej minęła kreska „0” suwaka. Następnie szukamy na suwaku (noniuszu) tej kreski dziesiętnej, która pokrywa się w jedną linię z dowolną kreską skali głównej.',
      'Gdy potrzebujemy jeszcze większej precyzji (do 0,01 mm, czyli jednej setnej milimetra!), sięgamy po mikrometr (Micrometer). Jeden pełny obrót bębna mikrometru przesuwa wrzeciono o 0,50 mm, a na obwodzie bębna znajduje się 50 działek – każda po 0,01 mm.',
    ],
    taskDescriptionPl:
      'W interaktywnym symulatorze pomiarowym poniżej: 1) przesuń suwak wirtualnej suwmiarki na wymiar 24,50 mm, 2) ustaw bęben mikrometru na wymiar 12,35 mm i zatwierdź pomiar.',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Na suwmiarce ustaw suwak tak, aby zero noniusza znalazło się dokładnie w połowie między 24 mm a 25 mm (24,50 mm).',
      'Podpowiedź 2/3: Na mikrometrze 12,35 mm oznacza 12 pełnych milimetrów na tulei oraz 35 setnych milimetra (kreska 35) na bębnie.',
      'Podpowiedź 3/3: Użyj suwaków lub przycisków +/-0,05 mm przy suwmiarce oraz +/-0,01 mm przy mikrometrze, aż wyświetlane wskazania wyniosą 24,50 mm i 12,35 mm.',
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
  {
    id: 'M0_D',
    moduleId: 'MODULE_0',
    orderIndex: 4,
    titlePl: 'Lekcja 0.D: Podstawy skrawania – narzędzia, materiały, obroty i posuw',
    shortSubtitlePl: 'Intuicja pracy narzędzia: dlaczego posuw nie może być ani za szybki, ani za wolny',
    theoryParagraphsPl: [
      'Obróbka skrawaniem (Machining) polega na ścinaniu nadmiaru materiału w postaci drobnych wiórów (Chips) za pomocą ostrego klinu narzędzia. Na frezarce używamy głównie frezów walcowo-czołowych (Endmills – wycinają płaskie dna i ścianki boczne), frezów fazujących (Chamfer Mills – ścinają ostre krawędzie) oraz wierteł (Drills – wykonują otwory wyłącznie ruchem w dół).',
      'Dwa najważniejsze parametry, które wpisujemy w programie CNC, to prędkość obrotowa wrzeciona S (Spindle Speed – jak szybko kręci się frez, w obrotach na minutę: obr./min) oraz posuw F (Feed Rate – jak szybko frez przesuwa się do przodu w materiale, w mm/min).',
      'Zasada intuicyjna: miękkie materiały (tworzywa, aluminium) lubią wysokie obroty i szybszy posuw. Twarde materiały (stal, stal nierdzewna) wymagają niższych obrotów, aby nie spalić ostrza narzędzia od temperatury! Co ciekawe, zbyt wolny posuw też jest błędem – ostrze zamiast ścinać zdrowy wiór, zaczyna trzeć o materiał i błyskawicznie się tępi. (Ciekawostka dla chętnych: obroty S wynikają ze wzoru n = (1000 · Vc) / (π · D), ale na tym kursie podajemy zawsze bezpieczne, gotowe wartości!).',
    ],
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
        questionPl: 'Co stanie się, jeśli frez wejdzie w lity metal z ogromnym posuwem przy zbyt niskich obrotach wrzeciona?',
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
  {
    id: 'M0_E',
    moduleId: 'MODULE_0',
    orderIndex: 5,
    titlePl: 'Lekcja 0.E: Budowa frezarki i tokarki CNC – co się rusza i do czego służy',
    shortSubtitlePl: 'Różnica między frezowaniem a toczeniem, główne podzespoły i bezpieczeństwo BHP',
    theoryParagraphsPl: [
      'W warsztacie CNC spotkasz dwie podstawowe rodziny obrabiarek: frezarki (Milling Machines) oraz tokarki (Lathes). Główna różnica między nimi jest bardzo prosta: na FREZARCE przedmiot stoi nieruchomo w imadle na stole, a szybko obraca się narzędzie (frez). Na TOKARCE to przedmiot (wałek) obraca się szybko w uchwycie wrzeciona, a nieruchomy nóż tokarski zbliża się do niego i zbiera warstwę materiału.',
      'Kluczowe części frezarki 3-osiowej to: 1) Korpus i zamknięta kabina ochronna, 2) Stół krzyżowy (porusza się w osiach poziomych X oraz Y) z zamocowanym imadłem, 3) Głowica wrzeciona (porusza się pionowo w osi Z) z oprawką narzędziową, 4) Magazyn narzędzi (automatycznie wymienia frezy i wiertła) oraz 5) Panel sterowania z czerwonym grzybkiem awaryjnym E-Stop.',
      'Pamiętaj o BHP: prawdziwa maszyna CNC rozwija ogromne siły i prędkości. Nigdy nie otwieraj osłony podczas pracy wrzeciona, nie pracuj w rękawiczkach przy wirujących częściach i zawsze miej rękę w pobliżu przycisku zatrzymania posuwu (Feed Hold) przy pierwszym uruchomieniu nowego programu.',
    ],
    taskDescriptionPl:
      'W interaktywnym schemacie budowy maszyn poniżej odpowiedz poprawnie na 3 pytania dopasowujące elementy frezarki i tokarki, aby ukończyć Moduł 0 i odblokować programowanie w Module 1!',
    assertions: [],
    hintsPl: [
      'Podpowiedź 1/3: Na frezarce obraca się narzędzie (frez/wiertło), natomiast na tokarce obraca się obrabiany przedmiot (wałek w uchwycie).',
      'Podpowiedź 2/3: Za ruch pionowy (góra/dół) na pionowej frezarce 3-osiowej odpowiada oś Z.',
      'Podpowiedź 3/3: Czerwony przycisk grzybkowy (E-Stop / Awaryjny Stop) służy do natychmiastowego zatrzymania maszyny w sytuacji zagrożenia.',
    ],
    solutionExplanationPl:
      'Brawo! Ukończyłaś/ukończyłeś Moduł 0. Rozumiesz już rysunek techniczny, tolerancje, pomiary suwmiarką i mikrometrem, dobór obrotów i posuwu oraz budowę obrabiarek. Czas napisać pierwszy program CNC w Module 1!',
    quiz: [
      {
        id: 'q_m0e_1',
        questionPl: 'Czym różni się ruch główny (obrotowy) na frezarce od ruchu głównego na tokarce?',
        optionsPl: [
          'Na frezarce obraca się narzędzie, a na tokarce obraca się przedmiot obrabiany',
          'Na obu maszynach obraca się wyłącznie stół z imadłem',
          'Na tokarce nie ma wrzeciona',
        ],
        correctOptionIndex: 0,
        explanationPl:
          'Podczas frezowania wiruje frez zamocowany we wrzecionie, a podczas toczenia wiruje wałek zamocowany w uchwycie tokarskim.',
      },
    ],
  },
];
