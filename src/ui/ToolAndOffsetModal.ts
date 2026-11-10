/**
 * Panel przeglądania i edycji:
 * 1. Fizycznego magazynu narzędzi (ToolDefinition: średnica, długość fizyczna, typ),
 * 2. Tabeli korektorów w sterowniku (ToolOffsetRegister: H - długość, D - promień),
 * 3. Tabeli punktów zerowych przedmiotu (G54–G59).
 *
 * Pozwala kursantowi eksperymentować m.in. z rozbieżnością między fizyczną długością narzędzia
 * a wartością wpisaną w rejestrze H lub D (Reguła 4 z Etapu 0).
 */

import type { MachineConfig, WorkOffsetCode } from '../core/types/machine';

export class ToolAndOffsetPanel {
  private container: HTMLElement;
  private config: MachineConfig;
  private onConfigChange: (updated: MachineConfig) => void;

  constructor(
    container: HTMLElement,
    config: MachineConfig,
    onConfigChange: (updated: MachineConfig) => void
  ) {
    this.container = container;
    this.config = config;
    this.onConfigChange = onConfigChange;
    this.render();
  }

  public setMachineConfig(config: MachineConfig): void {
    this.config = config;
    this.render();
  }

  public render(): void {
    const toolsRows = this.config.tools
      .map(
        (t) => `
        <tr>
          <td><strong>T${t.pocketNumber}</strong></td>
          <td>${t.name}</td>
          <td>Ø${t.diameterMm.toFixed(1)} mm <em>(R=${(t.diameterMm / 2).toFixed(1)})</em></td>
          <td>${t.lengthMm.toFixed(1)} mm</td>
          <td>${t.flutesCount}</td>
        </tr>
      `
      )
      .join('');

    const offsetsRows = this.config.toolOffsets
      .map(
        (reg) => `
        <tr>
          <td><strong>H${reg.registerNumber} / D${reg.registerNumber}</strong></td>
          <td>
            <input
              type="number"
              step="0.5"
              class="table-num-input"
              data-reg="${reg.registerNumber}"
              data-field="lengthOffsetMm"
              value="${reg.lengthOffsetMm}"
              aria-label="Korekcja długości H${reg.registerNumber} w mm"
            /> mm
          </td>
          <td>
            <input
              type="number"
              step="0.1"
              class="table-num-input"
              data-reg="${reg.registerNumber}"
              data-field="radiusOffsetMm"
              value="${reg.radiusOffsetMm}"
              aria-label="Korekcja promienia D${reg.registerNumber} w mm"
            /> mm
          </td>
        </tr>
      `
      )
      .join('');

    const wcsCodes: WorkOffsetCode[] = ['G54', 'G55', 'G56', 'G57', 'G58', 'G59'];
    const wcsRows = wcsCodes
      .map((code) => {
        const w = this.config.workOffsets[code];
        return `
          <tr>
            <td><strong>${code}</strong></td>
            <td>${w.x.toFixed(1)} mm</td>
            <td>${w.y.toFixed(1)} mm</td>
            <td>${w.z.toFixed(1)} mm</td>
          </tr>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="tables-panel-content">
        <div class="table-section">
          <h4>1. Fizyczny magazyn narzędzi w maszynie (ToolDefinition)</h4>
          <p class="table-hint">
            To są rzeczywiste, fizyczne wymiary narzędzi zamocowanych w oprawkach.
            Model materiału skrawa dokładnie tymi wymiarami.
          </p>
          <div class="table-scroll">
            <table class="cnc-table">
              <thead>
                <tr>
                  <th>Gniazdo</th>
                  <th>Nazwa i typ</th>
                  <th>Średnica (Promień)</th>
                  <th>Długość fizyczna</th>
                  <th>Ostrza</th>
                </tr>
              </thead>
              <tbody>${toolsRows}</tbody>
            </table>
          </div>
        </div>

        <div class="table-section">
          <h4>2. Rejestry korekcyjne wpisane w sterowniku (H – długość, D – promień)</h4>
          <p class="table-hint">
            Wartości w pamięci sterownika używane przez <code>G43 H..</code> oraz <code>G41/G42 D..</code>.
            Jeśli wpiszesz tu wartość inną niż fizyczny wymiar narzędzia powyżej, zobaczysz w symulatorze
            błąd głębokości lub podcięcie konturu!
          </p>
          <div class="table-scroll">
            <table class="cnc-table">
              <thead>
                <tr>
                  <th>Rejestr</th>
                  <th>Offset długości H (mm)</th>
                  <th>Offset promienia D (mm)</th>
                </tr>
              </thead>
              <tbody>${offsetsRows}</tbody>
            </table>
          </div>
        </div>

        <div class="table-section">
          <h4>3. Tabela punktów zerowych przedmiotu (WCS: G54–G59 względem MCS)</h4>
          <div class="table-scroll">
            <table class="cnc-table">
              <thead>
                <tr>
                  <th>Baza</th>
                  <th>X (MCS)</th>
                  <th>Y (MCS)</th>
                  <th>Z (MCS)</th>
                </tr>
              </thead>
              <tbody>${wcsRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const inputs = this.container.querySelectorAll<HTMLInputElement>(
      'input.table-num-input'
    );
    inputs.forEach((inp) => {
      inp.addEventListener('change', () => {
        const regNum = Number(inp.dataset.reg);
        const field = inp.dataset.field as 'lengthOffsetMm' | 'radiusOffsetMm';
        const val = Number(inp.value);
        if (Number.isNaN(val)) return;

        const reg = this.config.toolOffsets.find(
          (r) => r.registerNumber === regNum
        );
        if (reg) {
          reg[field] = val;
          this.onConfigChange(this.config);
        }
      });
    });
  }
}
