/**
 * Bezpieczny magazyn postępu kursanta w przeglądarce (SafeProgressStore).
 * Zapisuje stan w localStorage, a w przypadku zablokowanego dostępu (np. tryb prywatny,
 * restrykcyjne ustawienia prywatności lub środowisko testowe Node.js)
 * płynnie przełącza się na pamięć ulotną RAM bez rzucania błędów.
 */

export interface LessonProgressRecord {
  lessonId: string;
  taskCompleted: boolean;
  quizCompleted: boolean;
  unlockedHintsCount: number; // 0..3 (po 3 odblokowuje się pełne rozwiązanie)
  solutionRevealed: boolean;
  savedUserCode?: string;
}

export interface CourseProgressState {
  currentLessonId: string;
  lessons: Record<string, LessonProgressRecord>;
}

const STORAGE_KEY = 'cnc_kurs_progress_v1';

export class SafeProgressStore {
  private memoryFallback: CourseProgressState;
  private isLocalStorageAvailable = false;

  constructor(defaultLessonId = 'M0_A') {
    this.memoryFallback = {
      currentLessonId: defaultLessonId,
      lessons: {},
    };
    this.isLocalStorageAvailable = this.checkLocalStorage();
    const loaded = this.readFromStorage();
    if (loaded) {
      this.memoryFallback = loaded;
    }
  }

  public isPersistent(): boolean {
    return this.isLocalStorageAvailable;
  }

  public getCurrentLessonId(): string {
    return this.memoryFallback.currentLessonId;
  }

  public setCurrentLessonId(lessonId: string): void {
    this.memoryFallback.currentLessonId = lessonId;
    this.writeToStorage();
  }

  public getLessonRecord(lessonId: string): LessonProgressRecord {
    const existing = this.memoryFallback.lessons[lessonId];
    if (existing) {
      return { ...existing };
    }
    return {
      lessonId,
      taskCompleted: false,
      quizCompleted: false,
      unlockedHintsCount: 0,
      solutionRevealed: false,
    };
  }

  public markTaskCompleted(lessonId: string): void {
    const rec = this.getLessonRecord(lessonId);
    rec.taskCompleted = true;
    this.memoryFallback.lessons[lessonId] = rec;
    this.writeToStorage();
  }

  public markQuizCompleted(lessonId: string): void {
    const rec = this.getLessonRecord(lessonId);
    rec.quizCompleted = true;
    this.memoryFallback.lessons[lessonId] = rec;
    this.writeToStorage();
  }

  public unlockNextHint(lessonId: string): number {
    const rec = this.getLessonRecord(lessonId);
    if (rec.unlockedHintsCount < 3) {
      rec.unlockedHintsCount += 1;
    }
    this.memoryFallback.lessons[lessonId] = rec;
    this.writeToStorage();
    return rec.unlockedHintsCount;
  }

  public revealSolution(lessonId: string): void {
    const rec = this.getLessonRecord(lessonId);
    if (rec.unlockedHintsCount >= 3) {
      rec.solutionRevealed = true;
      this.memoryFallback.lessons[lessonId] = rec;
      this.writeToStorage();
    }
  }

  public saveUserCode(lessonId: string, code: string): void {
    const rec = this.getLessonRecord(lessonId);
    rec.savedUserCode = code;
    this.memoryFallback.lessons[lessonId] = rec;
    this.writeToStorage();
  }

  public getCompletedLessonsCount(allLessonIds: string[]): number {
    let count = 0;
    for (const id of allLessonIds) {
      if (this.memoryFallback.lessons[id]?.taskCompleted) {
        count++;
      }
    }
    return count;
  }

  public resetAllProgress(defaultLessonId = 'M0_A'): void {
    this.memoryFallback = {
      currentLessonId: defaultLessonId,
      lessons: {},
    };
    this.writeToStorage();
  }

  private checkLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__cnc_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private readFromStorage(): CourseProgressState | null {
    if (!this.isLocalStorageAvailable) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CourseProgressState;
      if (parsed && typeof parsed.currentLessonId === 'string' && parsed.lessons) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  private writeToStorage(): void {
    if (!this.isLocalStorageAvailable) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.memoryFallback)
      );
    } catch {
      this.isLocalStorageAvailable = false;
    }
  }
}
