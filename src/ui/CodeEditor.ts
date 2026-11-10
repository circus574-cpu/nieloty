/**
 * Edytor kodu G-code oparty na CodeMirror 6:
 * - Obsługa dotyku (wirtualne klawiatury na smartfonach) oraz skrótów klawiszowych,
 * - Kolorowanie składni G-code (kody G, M, osie X/Y/Z, parametry łuków I/J/K/R, technologia F/S/T/H/D, komentarze),
 * - Dekoracje linii błędów (ERROR), ostrzeżeń (WARNING) oraz aktualnie wykonywanej linii (Active Step),
 * - Dwukierunkowa synchronizacja klikniętej linii ze sceną 3D.
 */

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  EditorState,
  RangeSetBuilder,
  StateEffect,
  StateField,
} from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  EditorView,
  keymap,
  lineNumbers,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view';
import type { DiagnosticMessage } from '../core/types/common';

interface LineHighlightState {
  activeLine: number | null;
  errorLines: Set<number>;
  warningLines: Set<number>;
}

const setLineHighlightsEffect = StateEffect.define<LineHighlightState>();

const activeLineDeco = Decoration.line({ class: 'cm-gcode-active-line' });
const errorLineDeco = Decoration.line({ class: 'cm-gcode-error-line' });
const warningLineDeco = Decoration.line({ class: 'cm-gcode-warning-line' });

const lineHighlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decos, tr) {
    decos = decos.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setLineHighlightsEffect)) {
        const builder = new RangeSetBuilder<Decoration>();
        const { activeLine, errorLines, warningLines } = e.value;
        const doc = tr.state.doc;

        for (let lineNo = 1; lineNo <= doc.lines; lineNo++) {
          const lineObj = doc.line(lineNo);
          if (errorLines.has(lineNo)) {
            builder.add(lineObj.from, lineObj.from, errorLineDeco);
          } else if (warningLines.has(lineNo)) {
            builder.add(lineObj.from, lineObj.from, warningLineDeco);
          }
          if (activeLine === lineNo) {
            builder.add(lineObj.from, lineObj.from, activeLineDeco);
          }
        }
        decos = builder.finish();
      }
    }
    return decos;
  },
  provide: (f) => EditorView.decorations.from(f),
});

/**
 * Lekki plugin kolorujący tokeny G-code w widocznych liniach edytora.
 */
const gcodeSyntaxPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.buildDecos(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecos(update.view);
      }
    }
    buildDecos(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>();
      const tokenRegex =
        /(\([^)\n]*\)?|;[^\n]*)|([Gg]\d+(?:\.\d+)?)|([Mm]\d+)|([XxYyZzAaCc][+-]?\d*\.?\d+)|([IiJjKkRrQqPp][+-]?\d*\.?\d+)|([FfSsTtHhDd][+-]?\d*\.?\d+)|([NnOo]\d+)/g;

      for (const { from, to } of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);
        let match: RegExpExecArray | null;
        while ((match = tokenRegex.exec(text)) !== null) {
          const start = from + match.index;
          const end = start + match[0].length;
          let cls = 'cm-tok-word';
          if (match[1]) cls = 'cm-tok-comment';
          else if (match[2]) cls = 'cm-tok-gcode';
          else if (match[3]) cls = 'cm-tok-mcode';
          else if (match[4]) cls = 'cm-tok-axis';
          else if (match[5]) cls = 'cm-tok-arc';
          else if (match[6]) cls = 'cm-tok-tech';
          else if (match[7]) cls = 'cm-tok-block';

          builder.add(start, end, Decoration.mark({ class: cls }));
        }
      }
      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

export interface CodeEditorCallbacks {
  onChange: (newCode: string) => void;
  onCursorLineChange?: (lineNumber: number) => void;
}

export class CodeEditor {
  private view: EditorView;
  private currentActiveLine: number | null = null;
  private currentErrorLines = new Set<number>();
  private currentWarningLines = new Set<number>();

  constructor(
    container: HTMLElement,
    initialCode: string,
    callbacks: CodeEditorCallbacks
  ) {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        callbacks.onChange(update.state.doc.toString());
      }
      if (update.selectionSet && callbacks.onCursorLineChange) {
        const pos = update.state.selection.main.head;
        const lineNo = update.state.doc.lineAt(pos).number;
        callbacks.onCursorLineChange(lineNo);
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineHighlightField,
        gcodeSyntaxPlugin,
        updateListener,
        EditorView.contentAttributes.of({
          'aria-label': 'Edytor programu G-code CNC',
          spellcheck: 'false',
          autocapitalize: 'characters',
        }),
      ],
    });

    container.innerHTML = '';
    this.view = new EditorView({
      state,
      parent: container,
    });
  }

  public getValue(): string {
    return this.view.state.doc.toString();
  }

  public setValue(newCode: string): void {
    const current = this.getValue();
    if (current === newCode) return;
    this.view.dispatch({
      changes: { from: 0, to: current.length, insert: newCode },
    });
  }

  public setDiagnostics(diagnostics: DiagnosticMessage[]): void {
    this.currentErrorLines.clear();
    this.currentWarningLines.clear();

    for (const d of diagnostics) {
      if (d.severity === 'ERROR') {
        this.currentErrorLines.add(d.lineNumber);
      } else if (d.severity === 'WARNING') {
        this.currentWarningLines.add(d.lineNumber);
      }
    }
    this.dispatchHighlightEffect();
  }

  public setActiveExecutionLine(lineNumber: number | null): void {
    if (this.currentActiveLine === lineNumber) return;
    this.currentActiveLine = lineNumber;
    this.dispatchHighlightEffect();
  }

  public scrollToLine(lineNumber: number): void {
    const doc = this.view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines) return;
    const line = doc.line(lineNumber);
    this.view.dispatch({
      selection: { anchor: line.from },
      effects: EditorView.scrollIntoView(line.from, { y: 'center' }),
    });
    this.view.focus();
  }

  private dispatchHighlightEffect(): void {
    this.view.dispatch({
      effects: setLineHighlightsEffect.of({
        activeLine: this.currentActiveLine,
        errorLines: new Set(this.currentErrorLines),
        warningLines: new Set(this.currentWarningLines),
      }),
    });
  }
}
