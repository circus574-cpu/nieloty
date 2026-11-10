import { describe, expect, it } from 'vitest';
import { interpretGCode } from '../core/gcode/interpreter';
import {
  DEFAULT_MILL_STOCK,
  MILL_3AXIS_MACHINE,
  STRICT_VALIDATION_POLICY,
} from '../core/machines/presets';
import { HeightmapMaterialModel } from '../core/simulation/heightmapModel';
import { analyzeToolpathMaterial } from '../core/simulation/materialAnalyzer';
import { CNC_GLOSSARY } from '../curriculum/glossary';
import { gradeLessonTask } from '../curriculum/grader';
import { MODULE_0_LESSONS } from '../curriculum/module0/lessonsM0';
import { MODULE_1_LESSONS } from '../curriculum/module1/lessonsM1';
import { SYLLABUS_MODULES_2_TO_4 } from '../curriculum/modules2to4/syllabusM2toM4';
import { SafeProgressStore } from '../storage/progressStore';

function evaluateGCodeForLesson(lessonId: string, sourceCode: string) {
  const lesson = MODULE_1_LESSONS.find((l) => l.id === lessonId);
  if (!lesson || !lesson.solutionCode || !lesson.starterCode) {
    throw new Error(`Lekcja ${lessonId} nie posiada zadania G-code`);
  }

  const machineConfig = lesson.machineConfig ?? MILL_3AXIS_MACHINE;
  const stock = lesson.stock ?? DEFAULT_MILL_STOCK;
  const prismaticStock =
    stock.kind === 'PRISMATIC' ? stock : DEFAULT_MILL_STOCK;
  const validationPolicy = lesson.validationPolicy ?? STRICT_VALIDATION_POLICY;

  const interp = interpretGCode({
    sourceText: sourceCode,
    machineConfig,
    validationPolicy,
    initialActiveToolPocket: lesson.initialActiveToolPocket ?? 1,
  });

  const material = analyzeToolpathMaterial({
    segments: interp.segments,
    stock: prismaticStock,
    tools: machineConfig.tools,
    materialModel: new HeightmapMaterialModel(prismaticStock, {
      resolutionMm: 0.5,
    }),
    validationPolicy,
  });

  return gradeLessonTask(lesson.assertions, interp, material);
}

describe('TaskGrader - sprawdzanie zadań po wyniku symulacji (Moduł 1: Lekcje 1-14)', () => {
  for (const lesson of MODULE_1_LESSONS) {
    it(`Lekcja ${lesson.id} (${lesson.titlePl}): wzorcowe rozwiązanie zalicza 100% kryteriów, a kod startowy nie zalicza`, () => {
      expect(lesson.solutionCode).toBeDefined();
      expect(lesson.starterCode).toBeDefined();

      // 1. Wzorcowe rozwiązanie (solutionCode) musi zaliczyć wszystkie asercje
      const solutionGrade = evaluateGCodeForLesson(
        lesson.id,
        lesson.solutionCode!
      );
      if (!solutionGrade.passedAll) {
        const failedMsg = solutionGrade.checks
          .filter((c) => !c.passed)
          .map((c) => c.feedbackPl)
          .join(' | ');
        throw new Error(
          `Wzorcowe rozwiązanie lekcji ${lesson.id} nie przeszło walidacji: ${failedMsg}`
        );
      }
      expect(solutionGrade.passedAll).toBe(true);

      // 2. Kod startowy (starterCode) z luką lub celowym błędem nie może zaliczać zadania od razu
      const starterGrade = evaluateGCodeForLesson(
        lesson.id,
        lesson.starterCode!
      );
      expect(starterGrade.passedAll).toBe(false);
    });
  }

  it('Akceptuje alternatywne zapisy tego samego ruchu (I/J zamiast R w lekcji M1_06)', () => {
    const lesson06 = MODULE_1_LESSONS.find((l) => l.id === 'M1_06')!;
    // Zamieniamy R20 na równoważny zapis wektorowy I0 J20 w rozwiązaniu lekcji M1_06
    const altArcCode = lesson06.solutionCode!.replace('R20', 'I0 J20');
    const result = evaluateGCodeForLesson('M1_06', altArcCode);
    expect(result.passedAll).toBe(true);
  });

  it('Akceptuje programowanie absolutne G90 zamiast przyrostowego G91 w lekcji M1_07', () => {
    const altAbsoluteCode = `
(LEKCJA 1.7 - ALTERNATYWNE ROZWIAZANIE W G90 BEZ G91)
T1 M6
G21 G90 G17 G54
S3000 M3 M8
G43 H1 Z20
G0 X20 Y20 Z5
G1 Z-4 F200
G1 X40 Y20 F350
G1 X40 Y35
G1 X60 Y35
G1 X60 Y50
G1 X80 Y50
G0 Z20 M9
M5
M30
`;
    const result = evaluateGCodeForLesson('M1_07', altAbsoluteCode);
    expect(result.passedAll).toBe(true);
  });
});

describe('SafeProgressStore oraz kompletność struktury kursu (Moduł 0, Słowniczek, Sylabus M2-M4)', () => {
  it('Bezpiecznie przełącza się na pamięć RAM i pilnuje blokady rozwiązania przed 3 podpowiedziami', () => {
    const store = new SafeProgressStore('M0_A');
    expect(store.getCurrentLessonId()).toBe('M0_A');

    // Próba odkrycia rozwiązania przed odblokowaniem 3 podpowiedzi musi zostać zignorowana
    store.revealSolution('M1_01');
    expect(store.getLessonRecord('M1_01').solutionRevealed).toBe(false);

    // Odblokowujemy kolejno 3 podpowiedzi
    expect(store.unlockNextHint('M1_01')).toBe(1);
    expect(store.unlockNextHint('M1_01')).toBe(2);
    store.revealSolution('M1_01');
    expect(store.getLessonRecord('M1_01').solutionRevealed).toBe(false);

    expect(store.unlockNextHint('M1_01')).toBe(3);
    store.revealSolution('M1_01');
    expect(store.getLessonRecord('M1_01').solutionRevealed).toBe(true);

    // Zaliczenie lekcji i zliczanie postępu
    store.markTaskCompleted('M1_01');
    expect(store.getCompletedLessonsCount(['M0_A', 'M1_01', 'M1_02'])).toBe(1);
  });

  it('Posiada kompletny Moduł 0 (7 lekcji: 0.0, 0.1 oraz A-E), Moduł 1 (14 lekcji), Słowniczek oraz Sylabus M2-M4 (3 moduły)', () => {
    expect(MODULE_0_LESSONS.length).toBe(7);
    expect(MODULE_0_LESSONS[0]?.id).toBe('M0_0');
    expect(MODULE_0_LESSONS[1]?.id).toBe('M0_1');
    expect(MODULE_1_LESSONS.length).toBe(14);
    expect(CNC_GLOSSARY.length).toBeGreaterThanOrEqual(12);
    expect(SYLLABUS_MODULES_2_TO_4.length).toBe(3);

    for (const lesson of [...MODULE_0_LESSONS, ...MODULE_1_LESSONS]) {
      expect(lesson.quiz.length).toBeGreaterThan(0);
      expect(lesson.theoryParagraphsPl.length).toBeGreaterThan(0);
    }
  });
});
