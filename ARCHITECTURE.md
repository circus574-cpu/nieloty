# Architektura i Plan Projektu (Etap 0)

## 1. Podział warstw i potok przetwarzania (Pipeline)

Projekt realizuje architekturę warstwową z rygorystycznym oddzieleniem:
1. **Frontendu dialektu (`src/core/dialects/`)**: Parsuje kod źródłowy (Fanuc/Haas, a w dalszych etapach Siemens Sinumerik, Heidenhain TNC, GRBL) do **Kanonicznej Reprezentacji Pośredniej (`CanonicalProgramIR`)** oraz umożliwia tłumaczenie programu między dialektami linia po linii.
2. **Czystego interpretera kinematycznego (`src/core/gcode/`)**: Przyjmuje `CanonicalProgramIR`, `MachineConfig` oraz `ValidationPolicy`. Zwraca czystą geometrię ruchów wierzchołka narzędzia (`MotionSegment[]`), zdarzenia maszynowe, migawki linii oraz błędy składniowe, geometryczne i krańcówek osi. **Nie posiada żadnej zależności od modelu materiału ani DOM.**
3. **Analizatora materiału i kolizji (`src/core/simulation/materialAnalyzer.ts` – funkcja `analyzeToolpathMaterial(input: MaterialAnalysisInput): MaterialAnalysisResult`)**: Przyjmuje wygenerowane ruchy (`segments: MotionSegment[]`), definicję surówki (`stock: WorkpieceStock`), listę fizycznych narzędzi (`tools: ToolDefinition[]`), wymienny model materiału (`materialModel: IMaterialModel` z konfigurowalną rozdzielczością: domyślnie `0.5 mm`, min. `0.25 mm`) oraz `validationPolicy: ValidationPolicy`. Wylicza ubytek materiału oraz błędy technologiczne i kolizje (`RAPID_COLLISION_IN_MATERIAL`, `SPINDLE_OFF_DURING_CUT`, `CUT_BELOW_WORKPIECE_BOTTOM`).
4. **Warstwy dydaktycznej (`src/curriculum/`)**: Scenariusze lekcji (Moduł 0: A–E, Moduł 1: 1–14, spis lekcji Modułów 2–4), sprawdzacze zadań (`TaskGrader`) oceniające wynik symulacji, 3-poziomowe podpowiedzi, słownik pojęć i zasady BHP.
5. **Warstwy 3D (`src/simulator3d/`) i UI (`src/ui/`)**: Scena `three.js` (sama próbkująca łuki z ich reprezentacji analitycznej), edytor `CodeMirror 6`, układ Mobile-First i bezpieczny zapis postępu (`localStorage` z fallbackiem).

## 2. Wybór bibliotek i licencje

| Biblioteka | Licencja | Zastosowanie |
| :--- | :--- | :--- |
| `typescript` (`^5.6.3`) | Apache-2.0 | Statyczne typowanie całego rdzenia, geometrii 5D i stanów modalnych |
| `vite` (`^5.4.10`) | MIT | Bundler SPA i serwer deweloperski bez zewnętrznego backendu |
| `three` (`^0.169.0`) | MIT | Wizualizacja 3D maszyny, ścieżek narzędzia i dynamicznej siatki surówki |
| `@codemirror/*` (`^6.x`) | MIT | Mobilny i dostępny edytor kodu G z podświetlaniem błędów |
| `vitest` (`^2.1.4`) | MIT | Testy jednostkowe interpretera, analizatora materiału i sprawdzaczy zadań |
