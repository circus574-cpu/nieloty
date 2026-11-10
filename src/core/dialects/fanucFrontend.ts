/**
 * Lexer i parser dialektu bazowego Fanuc / Haas (ISO 6983) do Kanonicznej Reprezentacji Pośredniej (IR).
 *
 * Zgodnie z kontraktem Etapu 0 (Reguła 5 i 6):
 * - IR przechowuje wartości liczbowe DOSŁOWNIE z programu (bez przeliczania G20/G21).
 * - Parametry cyklu wiertarskiego (retractPlaneR, finalDepthZ, Q, P) w IRCycleParams są opcjonalne,
 *   gdy blok korzysta z modalnego wywołania cyklu.
 * - Kody G28 oraz G53 są jawnie zgłaszane jako UNSUPPORTED_FEATURE.
 */

import type {
  CannedCycleMode,
  CoolantState,
  CutterCompMode,
  CycleReturnMode,
  DiagnosticMessage,
  DistanceMode,
  LengthCompMode,
  LinearOrArcMotionMode,
  PlaneMode,
  SpindleState,
  UnitMode,
} from '../types/common';
import type {
  IRBlock,
  IRParseResult,
  IRTargetAxes,
} from '../types/ir';
import type { WorkOffsetCode } from '../types/machine';

interface ParsedWord {
  letter: string;
  value: number;
  rawNumberText: string;
  columnStart: number;
  columnEnd: number;
}

/**
 * Usuwa komentarze nawiasowe (...) oraz średnikowe (;...) z pojedynczej linii,
 * zwracając czysty tekst kodu oraz treść komentarza i ewentualne błędy niezamkniętego nawiasu.
 */
function stripCommentsFromLine(
  rawLine: string,
  lineNumber: number
): {
  codeText: string;
  commentText: string | undefined;
  diagnostics: DiagnosticMessage[];
} {
  const diagnostics: DiagnosticMessage[] = [];
  const comments: string[] = [];
  let codeChars = '';
  let inParen = false;
  let currentComment = '';
  let parenStartCol = 1;

  for (let i = 0; i < rawLine.length; i++) {
    const ch = rawLine[i]!;
    if (!inParen && ch === ';') {
      const semiComment = rawLine.slice(i + 1).trim();
      if (semiComment.length > 0) {
        comments.push(semiComment);
      }
      break;
    }

    if (ch === '(') {
      if (inParen) {
        diagnostics.push({
          lineNumber,
          columnStart: i + 1,
          columnEnd: i + 2,
          severity: 'ERROR',
          code: 'SYNTAX_UNCLOSED_COMMENT',
          messagePl: `Linia ${lineNumber}: Zagnieżdżony lub niezamknięty nawias komentarza '('.`,
          hintPl: 'Zamknij poprzedni komentarz nawiasem ")" przed otwarciem kolejnego.',
        });
      }
      inParen = true;
      currentComment = '';
      parenStartCol = i + 1;
      codeChars += ' ';
      continue;
    }

    if (ch === ')') {
      if (!inParen) {
        diagnostics.push({
          lineNumber,
          columnStart: i + 1,
          columnEnd: i + 2,
          severity: 'ERROR',
          code: 'SYNTAX_UNCLOSED_COMMENT',
          messagePl: `Linia ${lineNumber}: Napotkano nawias zamykający ')' bez wcześniejszego otwarcia '('.`,
          hintPl: 'Usuń nadmiarowy nawias ")" lub dodaj "(" na początku komentarza.',
        });
      } else {
        inParen = false;
        const trimmed = currentComment.trim();
        if (trimmed.length > 0) {
          comments.push(trimmed);
        }
      }
      codeChars += ' ';
      continue;
    }

    if (inParen) {
      currentComment += ch;
    } else {
      codeChars += ch;
    }
  }

  if (inParen) {
    diagnostics.push({
      lineNumber,
      columnStart: parenStartCol,
      columnEnd: rawLine.length + 1,
      severity: 'ERROR',
      code: 'SYNTAX_UNCLOSED_COMMENT',
      messagePl: `Linia ${lineNumber}: Niezamknięty komentarz nawiasowy '(' (brak ')' przed końcem linii).`,
      hintPl: 'Dopisz nawias zamykający ")" na końcu komentarza w tej linii.',
    });
  }

  return {
    codeText: codeChars,
    commentText: comments.length > 0 ? comments.join(' | ') : undefined,
    diagnostics,
  };
}

const VALID_ADDRESS_LETTERS = new Set([
  'N', 'G', 'M', 'X', 'Y', 'Z', 'A', 'C',
  'I', 'J', 'K', 'R', 'F', 'S', 'T', 'H', 'D', 'P', 'Q', 'O',
]);

/**
 * Dzieli oczyszczony z komentarzy wiersz G-code na słowa adresowe (litera + liczba).
 */
function tokenizeWords(
  codeText: string,
  lineNumber: number
): { words: ParsedWord[]; diagnostics: DiagnosticMessage[] } {
  const words: ParsedWord[] = [];
  const diagnostics: DiagnosticMessage[] = [];
  const len = codeText.length;
  let i = 0;

  while (i < len) {
    const ch = codeText[i]!;
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Znak % (początek/koniec taśmy programu)
    if (ch === '%') {
      i++;
      continue;
    }

    const colStart = i + 1;
    if (!/[a-zA-Z]/.test(ch)) {
      // Nieoczekiwany znak spoza alfabetu (np. cyfra bez litery adresu lub symbol specjalny)
      let j = i + 1;
      while (j < len && !/\s/.test(codeText[j]!) && !/[a-zA-Z]/.test(codeText[j]!)) {
        j++;
      }
      const badToken = codeText.slice(i, j);
      diagnostics.push({
        lineNumber,
        columnStart: colStart,
        columnEnd: j + 1,
        severity: 'ERROR',
        code: 'SYNTAX_UNKNOWN_WORD',
        messagePl: `Linia ${lineNumber}: Nieprawidłowy zapis "${badToken}" bez litery adresowej (np. X, Y, Z, G).`,
        hintPl: 'Każda liczba w kodzie G musi być poprzedzona literą określającą jej znaczenie, np. X10 lub G1.',
      });
      i = j;
      continue;
    }

    const letter = ch.toUpperCase();
    i++;

    // Pomiń ewentualne spacje między literą a liczbą (np. "X 10")
    while (i < len && (codeText[i] === ' ' || codeText[i] === '\t')) {
      i++;
    }

    // Odczytaj liczbę (opcjonalny znak +/-, cyfry, kropka dziesiętna)
    const numStart = i;
    if (i < len && (codeText[i] === '+' || codeText[i] === '-')) {
      i++;
    }
    let hasDigits = false;
    let hasDot = false;
    while (i < len) {
      const c = codeText[i]!;
      if (c >= '0' && c <= '9') {
        hasDigits = true;
        i++;
      } else if (c === '.' && !hasDot) {
        hasDot = true;
        i++;
      } else {
        break;
      }
    }

    const rawNumberText = codeText.slice(numStart, i);
    const colEnd = i + 1;

    if (!VALID_ADDRESS_LETTERS.has(letter)) {
      diagnostics.push({
        lineNumber,
        columnStart: colStart,
        columnEnd: colEnd,
        severity: 'ERROR',
        code: 'SYNTAX_UNKNOWN_WORD',
        messagePl: `Linia ${lineNumber}: Nieznana litera adresowa "${letter}${rawNumberText}".`,
        hintPl: 'Sprawdź literówkę. Dozwolone adresy to m.in. G, M, X, Y, Z, I, J, K, R, F, S, T, H, D, P, Q, N.',
      });
      continue;
    }

    if (!hasDigits) {
      diagnostics.push({
        lineNumber,
        columnStart: colStart,
        columnEnd: colEnd,
        severity: 'ERROR',
        code: 'SYNTAX_MISSING_NUMBER',
        messagePl: `Linia ${lineNumber}: Brak wartości liczbowej po literze "${letter}".`,
        hintPl: `Podaj liczbę zaraz po literze ${letter} (użyj kropki jako separatora dziesiętnego, np. ${letter}10.5).`,
      });
      continue;
    }

    const value = Number(rawNumberText);
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      diagnostics.push({
        lineNumber,
        columnStart: colStart,
        columnEnd: colEnd,
        severity: 'ERROR',
        code: 'SYNTAX_MISSING_NUMBER',
        messagePl: `Linia ${lineNumber}: Nieprawidłowa liczba "${rawNumberText}" przy adresie "${letter}".`,
        hintPl: 'Użyj poprawnego zapisu liczbowego z kropką dziesiętną (np. 12.5).',
      });
      continue;
    }

    words.push({
      letter,
      value,
      rawNumberText,
      columnStart: colStart,
      columnEnd: colEnd,
    });
  }

  return { words, diagnostics };
}

/** Przelicza parametr P postoju czasowego (G4 / G82) na sekundy */
function parseDwellParameterP(value: number, rawText: string): number {
  // Jeśli zapisano z kropką dziesiętną (np. P1.5) lub małą liczbę (P2), traktujemy jako sekundy.
  // Jeśli zapisano liczbę całkowitą >= 100 (np. P1000, P500 w konwencji Fanuc ms), dzielimy przez 1000.
  if (rawText.includes('.')) {
    return value;
  }
  if (Math.abs(value) >= 100) {
    return value / 1000;
  }
  return value;
}

/**
 * Parsuje tekst programu w dialekcie Fanuc / Haas do Kanonicznej Reprezentacji Pośredniej (IR).
 */
export function parseFanucToIR(sourceText: string): IRParseResult {
  const lines = sourceText.split(/\r?\n/);
  const blocks: IRBlock[] = [];
  const syntaxDiagnostics: DiagnosticMessage[] = [];
  let programName: string | undefined;

  // Lekki stan pomocniczy parsera do rozróżniania znaczenia słowa R/Z w wywołaniach modalnych (łuk vs cykl)
  let trackedCycleMode: CannedCycleMode = 'G80';

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNumber = idx + 1;
    const rawLine = lines[idx]!;

    const { codeText, commentText, diagnostics: commentDiags } = stripCommentsFromLine(rawLine, lineNumber);
    syntaxDiagnostics.push(...commentDiags);

    const { words, diagnostics: wordDiags } = tokenizeWords(codeText, lineNumber);
    syntaxDiagnostics.push(...wordDiags);

    if (words.length === 0 && !commentText) {
      continue;
    }

    const block: IRBlock = {
      sourceLine: lineNumber,
      rawText: rawLine,
    };
    if (commentText) {
      block.comment = commentText;
    }

    // Śledzenie grup modalnych wewnątrz pojedynczego bloku w celu wykrycia konfliktów (np. G0 G1, G90 G91)
    let seenGroup01Motion: string | null = null;
    let seenGroup09Cycle: string | null = null;
    let seenGroup02Plane: PlaneMode | null = null;
    let seenGroup03Distance: DistanceMode | null = null;
    let seenGroup06Units: UnitMode | null = null;
    let seenGroup07CutterComp: CutterCompMode | null = null;
    let seenGroup08LengthComp: LengthCompMode | null = null;
    let seenGroup10CycleReturn: CycleReturnMode | null = null;
    let seenGroup14WorkOffset: WorkOffsetCode | null = null;
    let seenSpindleM: SpindleState | null = null;
    let seenCoolantM: CoolantState | null = null;
    let hasG4Dwell = false;

    // Tymczasowe zmienne dla parametrów geometrycznych w bieżącej linii
    const axes: IRTargetAxes = {};
    let hasAxes = false;
    let valI: number | undefined;
    let valJ: number | undefined;
    let valK: number | undefined;
    let valR: number | undefined;
    let valQ: number | undefined;
    let valP: number | undefined;
    let rawPText = '';
    let valH: number | undefined;
    let valD: number | undefined;

    for (const w of words) {
      switch (w.letter) {
        case 'O': {
          programName = `O${Math.trunc(w.value).toString().padStart(4, '0')}`;
          break;
        }
        case 'N': {
          block.blockNumberN = Math.trunc(w.value);
          break;
        }
        case 'G': {
          // Obsługa kodów G (znormalizowanych, np. G00 -> G0, G01 -> G1)
          const gCodeNum = w.value;
          if (gCodeNum === 0 || gCodeNum === 1 || gCodeNum === 2 || gCodeNum === 3) {
            const codeStr = `G${gCodeNum}` as LinearOrArcMotionMode;
            if (seenGroup01Motion !== null || (seenGroup09Cycle !== null && seenGroup09Cycle !== 'G80')) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt kodów ruchu (${seenGroup01Motion ?? seenGroup09Cycle} oraz ${codeStr}) w jednym bloku.`,
                hintPl: 'W jednej linii możesz podać tylko jeden kod określający rodzaj ruchu (np. albo G0, albo G1).',
              });
            }
            seenGroup01Motion = codeStr;
            block.setMotionMode = codeStr;
          } else if (gCodeNum === 4) {
            hasG4Dwell = true;
          } else if (gCodeNum === 17 || gCodeNum === 18 || gCodeNum === 19) {
            const planeStr = `G${gCodeNum}` as PlaneMode;
            if (seenGroup02Plane !== null && seenGroup02Plane !== planeStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt wyboru płaszczyzny (${seenGroup02Plane} oraz ${planeStr}) w jednym bloku.`,
                hintPl: 'Wybierz tylko jedną płaszczyznę roboczą (G17 = XY, G18 = ZX, G19 = YZ).',
              });
            }
            seenGroup02Plane = planeStr;
            block.setPlane = planeStr;
          } else if (gCodeNum === 20 || gCodeNum === 21) {
            const unitStr = `G${gCodeNum}` as UnitMode;
            if (seenGroup06Units !== null && seenGroup06Units !== unitStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Jednoczesne wywołanie cali (G20) i milimetrów (G21) w jednej linii.`,
                hintPl: 'Zostaw tylko jeden kod jednostek na początku programu (w Polsce standardem jest G21 – milimetry).',
              });
            }
            seenGroup06Units = unitStr;
            block.setUnits = unitStr;
          } else if (gCodeNum === 28 || gCodeNum === 53) {
            syntaxDiagnostics.push({
              lineNumber,
              columnStart: w.columnStart,
              columnEnd: w.columnEnd,
              severity: 'ERROR',
              code: 'UNSUPPORTED_FEATURE',
              messagePl: `Linia ${lineNumber}: Polecenie G${gCodeNum} (odwołanie do układu maszynowego / punktu referencyjnego) nie jest obsługiwane w uproszczonym modelu kursowym.`,
              hintPl: 'Zamiast G28/G53 użyj bezpiecznego odjazdu w układzie przedmiotu, np. G90 G0 Z50.',
            });
          } else if (gCodeNum === 40 || gCodeNum === 41 || gCodeNum === 42) {
            const compStr = `G${gCodeNum}` as CutterCompMode;
            if (seenGroup07CutterComp !== null && seenGroup07CutterComp !== compStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt kodów korekcji promienia (${seenGroup07CutterComp} oraz ${compStr}) w jednym bloku.`,
                hintPl: 'Włącz korekcję promienia (G41 lub G42) w bloku dojazdu, a odwołaj (G40) w osobnym bloku odjazdu.',
              });
            }
            seenGroup07CutterComp = compStr;
          } else if (gCodeNum === 43 || gCodeNum === 44 || gCodeNum === 49) {
            const lenStr = `G${gCodeNum}` as LengthCompMode;
            if (seenGroup08LengthComp !== null && seenGroup08LengthComp !== lenStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt kodów korekcji długości (${seenGroup08LengthComp} oraz ${lenStr}) w jednym bloku.`,
                hintPl: 'Użyj tylko jednego kodu z grupy korekcji długości narzędzia (np. G43 H1 albo G49).',
              });
            }
            seenGroup08LengthComp = lenStr;
          } else if (gCodeNum >= 54 && gCodeNum <= 59 && Number.isInteger(gCodeNum)) {
            const wcsStr = `G${gCodeNum}` as WorkOffsetCode;
            if (seenGroup14WorkOffset !== null && seenGroup14WorkOffset !== wcsStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Wybrano dwa różne układy współrzędnych (${seenGroup14WorkOffset} oraz ${wcsStr}) w jednym bloku.`,
                hintPl: 'Podaj tylko jeden punkt zerowy przedmiotu (np. G54) w danej linii.',
              });
            }
            seenGroup14WorkOffset = wcsStr;
            block.setWorkOffset = wcsStr;
          } else if (gCodeNum === 80 || gCodeNum === 81 || gCodeNum === 82 || gCodeNum === 83) {
            const cycStr = `G${gCodeNum}` as CannedCycleMode;
            if (
              (seenGroup09Cycle !== null && seenGroup09Cycle !== cycStr) ||
              (seenGroup01Motion !== null && cycStr !== 'G80')
            ) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt cyklu wiertarskiego (${cycStr}) z innym kodem ruchu (${seenGroup09Cycle ?? seenGroup01Motion}) w jednej linii.`,
                hintPl: 'Cykl stały (G81-G83) oraz jego odwołanie (G80) zapisuj w osobnych liniach od ruchów G0-G3.',
              });
            }
            seenGroup09Cycle = cycStr;
            if (cycStr === 'G80') {
              block.cancelCycleG80 = true;
            }
          } else if (gCodeNum === 90 || gCodeNum === 91) {
            const distStr = `G${gCodeNum}` as DistanceMode;
            if (seenGroup03Distance !== null && seenGroup03Distance !== distStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Jednoczesne użycie trybu bezwzględnego (G90) i przyrostowego (G91) w jednym bloku.`,
                hintPl: 'Wybierz jeden tryb wymiarowania dla bloku: G90 (współrzędne względem punktu zerowego) lub G91 (przyrosty).',
              });
            }
            seenGroup03Distance = distStr;
            block.setDistanceMode = distStr;
          } else if (gCodeNum === 98 || gCodeNum === 99) {
            const retStr = `G${gCodeNum}` as CycleReturnMode;
            if (seenGroup10CycleReturn !== null && seenGroup10CycleReturn !== retStr) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Konflikt poziomów powrotu cyklu (G98 oraz G99) w jednym bloku.`,
                hintPl: 'Wybierz albo G98 (powrót do Z początkowego), albo G99 (powrót do poziomu R).',
              });
            }
            seenGroup10CycleReturn = retStr;
            block.setCycleReturnMode = retStr;
          } else {
            syntaxDiagnostics.push({
              lineNumber,
              columnStart: w.columnStart,
              columnEnd: w.columnEnd,
              severity: 'ERROR',
              code: 'UNSUPPORTED_FEATURE',
              messagePl: `Linia ${lineNumber}: Nieobsługiwane polecenie G${w.rawNumberText}.`,
              hintPl: 'W Module 1 obsługiwane są kody: G0-G4, G17-G19, G20-G21, G40-G44, G49, G54-G59, G80-G83, G90-G91, G98-G99.',
            });
          }
          break;
        }
        case 'M': {
          const mNum = w.value;
          if (mNum === 3 || mNum === 4 || mNum === 5) {
            const spState: SpindleState =
              mNum === 3 ? 'M3_CW' : mNum === 4 ? 'M4_CCW' : 'M5_STOP';
            if (seenSpindleM !== null && seenSpindleM !== spState) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Sprzeczne komendy wrzeciona (M3/M4/M5) w jednej linii.`,
                hintPl: 'Podaj tylko jedną komendę stanu wrzeciona w danym bloku (np. M3 aby włączyć obroty prawe).',
              });
            }
            seenSpindleM = spState;
            block.setSpindleState = spState;
          } else if (mNum === 6) {
            block.executeToolChangeM6 = true;
          } else if (mNum === 8 || mNum === 9) {
            const coolState: CoolantState = mNum === 8 ? 'M8_FLOOD' : 'M9_OFF';
            if (seenCoolantM !== null && seenCoolantM !== coolState) {
              syntaxDiagnostics.push({
                lineNumber,
                columnStart: w.columnStart,
                columnEnd: w.columnEnd,
                severity: 'ERROR',
                code: 'CONFLICTING_GCODES_IN_BLOCK',
                messagePl: `Linia ${lineNumber}: Sprzeczne komendy chłodziwa (M8 oraz M9) w jednej linii.`,
                hintPl: 'Użyj M8 (włączenie chłodziwa) lub M9 (wyłączenie chłodziwa) w osobnych blokach.',
              });
            }
            seenCoolantM = coolState;
            block.setCoolantState = coolState;
          } else if (mNum === 2 || mNum === 30) {
            block.endProgram = mNum === 2 ? 'M2' : 'M30';
          } else {
            syntaxDiagnostics.push({
              lineNumber,
              columnStart: w.columnStart,
              columnEnd: w.columnEnd,
              severity: 'ERROR',
              code: 'UNSUPPORTED_FEATURE',
              messagePl: `Linia ${lineNumber}: Nieobsługiwane polecenie pomocnicze M${w.rawNumberText}.`,
              hintPl: 'Obsługiwane kody M to: M3, M4, M5 (wrzeciono), M6 (wymiana narzędzia), M8, M9 (chłodziwo), M2, M30 (koniec programu).',
            });
          }
          break;
        }
        case 'X':
          axes.x = w.value;
          hasAxes = true;
          break;
        case 'Y':
          axes.y = w.value;
          hasAxes = true;
          break;
        case 'Z':
          axes.z = w.value;
          hasAxes = true;
          break;
        case 'A':
          axes.a = w.value;
          hasAxes = true;
          break;
        case 'C':
          axes.c = w.value;
          hasAxes = true;
          break;
        case 'I':
          valI = w.value;
          break;
        case 'J':
          valJ = w.value;
          break;
        case 'K':
          valK = w.value;
          break;
        case 'R':
          valR = w.value;
          break;
        case 'Q':
          valQ = w.value;
          break;
        case 'P':
          valP = w.value;
          rawPText = w.rawNumberText;
          break;
        case 'F':
          block.setFeedRate = w.value;
          break;
        case 'S':
          block.setSpindleSpeed = w.value;
          break;
        case 'T':
          block.selectToolPocket = Math.trunc(w.value);
          break;
        case 'H':
          valH = Math.trunc(w.value);
          break;
        case 'D':
          valD = Math.trunc(w.value);
          break;
      }
    }

    // Obsługa korekcji długości G43 / G44 / G49 oraz rejestru H
    if (seenGroup08LengthComp !== null || valH !== undefined) {
      block.setLengthComp = {
        mode: seenGroup08LengthComp ?? undefined,
        registerH: valH,
      };
    }

    // Obsługa korekcji promienia G40 / G41 / G42 oraz rejestru D
    if (seenGroup07CutterComp !== null || valD !== undefined) {
      block.setCutterComp = {
        mode: seenGroup07CutterComp ?? undefined,
        registerD: valD,
      };
    }

    // Obsługa G4 (postój czasowy)
    if (hasG4Dwell) {
      let dwellSec: number | undefined;
      if (valP !== undefined) {
        dwellSec = parseDwellParameterP(valP, rawPText);
      } else if (axes.x !== undefined) {
        dwellSec = axes.x;
        delete axes.x;
        hasAxes =
          axes.y !== undefined ||
          axes.z !== undefined ||
          axes.a !== undefined ||
          axes.c !== undefined;
      }

      if (dwellSec === undefined || dwellSec < 0) {
        syntaxDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'DWELL_NEGATIVE_TIME',
          messagePl: `Linia ${lineNumber}: Polecenie postoju czasowego G4 wymaga nieujemnego czasu (parametr P lub X).`,
          hintPl: 'Podaj czas postoju w sekundach (np. G4 P1.5 lub G4 X2) albo w milisekundach (np. G4 P1500).',
        });
      } else {
        block.dwellSeconds = dwellSec;
      }
    }

    // Aktualizacja śledzonego stanu cyklu vs ruchu na potrzeby interpretacji słów R, Z, Q, P
    if (block.cancelCycleG80) {
      trackedCycleMode = 'G80';
    }
    if (block.setMotionMode) {
      trackedCycleMode = 'G80';
    }
    if (seenGroup09Cycle && seenGroup09Cycle !== 'G80') {
      trackedCycleMode = seenGroup09Cycle as Exclude<CannedCycleMode, 'G80'>;
    }

    // Rozstrzygnięcie parametrów cyklu vs łuku/ruchu
    const isCycleBlock =
      (seenGroup09Cycle !== null && seenGroup09Cycle !== 'G80') ||
      (trackedCycleMode !== 'G80' &&
        !block.cancelCycleG80 &&
        !block.setMotionMode &&
        (hasAxes || valR !== undefined || valQ !== undefined || valP !== undefined));

    if (isCycleBlock && trackedCycleMode !== 'G80') {
      const cycleParams: IRBlock['cycleSpec'] = {
        cycle: trackedCycleMode,
      };
      if (valR !== undefined) {
        cycleParams.retractPlaneR = valR;
      }
      if (axes.z !== undefined) {
        cycleParams.finalDepthZ = axes.z;
        delete axes.z;
      }
      if (valQ !== undefined) {
        cycleParams.peckIncrementQ = valQ;
      }
      if (valP !== undefined && !hasG4Dwell) {
        cycleParams.dwellSecondsP = parseDwellParameterP(valP, rawPText);
      }
      block.cycleSpec = cycleParams;
      if (
        axes.x !== undefined ||
        axes.y !== undefined ||
        axes.a !== undefined ||
        axes.c !== undefined
      ) {
        block.targetAxes = axes;
      }
    } else {
      if (hasAxes) {
        block.targetAxes = axes;
      }

      const hasIJK = valI !== undefined || valJ !== undefined || valK !== undefined;

      if (hasIJK && valR !== undefined) {
        syntaxDiagnostics.push({
          lineNumber,
          severity: 'ERROR',
          code: 'ARC_MIXED_IJK_AND_R',
          messagePl: `Linia ${lineNumber}: W jednym bloku łuku podano jednocześnie parametry środka (I/J/K) oraz promień (R).`,
          hintPl: 'Zdefiniuj łuk G2/G3 za pomocą samego promienia R albo samych wektorów środka I, J, K.',
        });
      } else if (hasIJK) {
        block.arcSpec = {
          kind: 'IJK_INCREMENTAL',
          i: valI,
          j: valJ,
          k: valK,
        };
      } else if (valR !== undefined) {
        block.arcSpec = {
          kind: 'RADIUS',
          r: valR,
        };
      }
    }

    blocks.push(block);
  }

  return {
    ir: {
      sourceDialect: 'FANUC_HAAS',
      programName,
      blocks,
    },
    syntaxDiagnostics,
  };
}
