import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const targetUrl = 'http://localhost:4200';
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const reportPath = 'reports/accessibility-report.html';
const reportDataDir = 'reports/.a11y-results';

type AxeViolation = {
  id: string;
  impact: string | null;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary?: string;
  }>;
};

type Severity = 'grave' | 'medio' | 'leve';

type A11yFinding = {
  severity: Severity;
  title: string;
  wcag: string;
  location: string;
  evidence: string;
  impact: string;
  steps: string[];
  recommendation: string;
  source: string;
  state: string;
};

type TestRecord = {
  duration: number;
  findings: A11yFinding[];
  status: string;
  title: string;
};

let currentFindings: A11yFinding[] = [];

function addFinding(finding: A11yFinding): void {
  const duplicated = currentFindings.some(
    (item) =>
      item.title === finding.title &&
      item.location === finding.location &&
      item.evidence === finding.evidence &&
      item.state === finding.state,
  );

  if (!duplicated) {
    currentFindings.push(finding);
  }
}

function severityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    grave: '1 - Grave',
    medio: '2 - Medio',
    leve: '3 - Leve',
  };

  return labels[severity];
}

function severityFromAxeImpact(impact: string | null): Severity {
  if (impact === 'critical' || impact === 'serious') {
    return 'grave';
  }

  if (impact === 'minor') {
    return 'leve';
  }

  return 'medio';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeReportFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

function readTestRecords(): TestRecord[] {
  if (!existsSync(reportDataDir)) {
    return [];
  }

  return readdirSync(reportDataDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const filePath = `${reportDataDir}/${fileName}`;
      return JSON.parse(readFileSync(filePath, 'utf8')) as TestRecord;
    });
}

function writeTestRecord(testInfo: TestInfo): void {
  mkdirSync(reportDataDir, { recursive: true });

  const record: TestRecord = {
    duration: testInfo.duration,
    findings: currentFindings,
    status: testInfo.status,
    title: testInfo.title,
  };
  const fileName = `${testInfo.workerIndex}-${testInfo.retry}-${safeReportFilename(
    testInfo.title,
  )}.json`;

  writeFileSync(`${reportDataDir}/${fileName}`, JSON.stringify(record, null, 2), 'utf8');
  currentFindings = [];
}

function renderFinding(finding: A11yFinding): string {
  return `
          <article class="finding ${finding.severity}">
            <div class="finding-header">
              <div class="finding-title">
                <span class="badge ${finding.severity}">${severityLabel(finding.severity)}</span>
                <h3>${escapeHtml(finding.title)}</h3>
              </div>
              <code>${escapeHtml(finding.wcag)}</code>
            </div>
            <div class="finding-body">
              <div class="detail">
                <strong>Estado</strong>
                <p>${escapeHtml(finding.state)}</p>
              </div>
              <div class="detail">
                <strong>Local</strong>
                <p><code>${escapeHtml(finding.location)}</code></p>
              </div>
              <div class="detail">
                <strong>Fonte</strong>
                <p>${escapeHtml(finding.source)}</p>
              </div>
              <div class="detail">
                <strong>Evidencia</strong>
                <p>${escapeHtml(finding.evidence)}</p>
              </div>
              <div class="detail">
                <strong>Impacto</strong>
                <p>${escapeHtml(finding.impact)}</p>
              </div>
              <div class="detail">
                <strong>Passos para reproduzir</strong>
                <ol class="steps">
                  ${finding.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('\n                  ')}
                </ol>
              </div>
              <div class="detail detail-wide">
                <strong>Recomendacao Angular</strong>
                <p>${escapeHtml(finding.recommendation)}</p>
              </div>
            </div>
          </article>`;
}

function generateHtmlReport(): string {
  const records = readTestRecords();
  const findings = records.flatMap((record) => record.findings);
  const graveCount = findings.filter((finding) => finding.severity === 'grave').length;
  const medioCount = findings.filter((finding) => finding.severity === 'medio').length;
  const leveCount = findings.filter((finding) => finding.severity === 'leve').length;
  const status = findings.length === 0 && records.every((record) => record.status === 'passed')
    ? 'Pass'
    : 'Fail';
  const testStats = {
    failed: records.filter((record) => !['passed', 'skipped'].includes(record.status)).length,
    passed: records.filter((record) => record.status === 'passed').length,
    skipped: records.filter((record) => record.status === 'skipped').length,
    total: records.length,
  };
  const generatedAt = new Date().toISOString();
  const sortedFindings = [...findings].sort((a, b) => {
    const weight: Record<Severity, number> = {
      grave: 1,
      medio: 2,
      leve: 3,
    };

    return weight[a.severity] - weight[b.severity];
  });
  const findingsHtml =
    sortedFindings.length > 0
      ? sortedFindings.map(renderFinding).join('\n')
      : `
          <article class="empty-state">
            <span class="badge ok">Pass</span>
            <h3>Nenhum erro encontrado</h3>
            <p>Os testes automatizados e customizados nao encontraram falhas nesse escopo.</p>
          </article>`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Relatorio de Acessibilidade</title>
    <style>
      :root {
        --bg: #f6f8fb;
        --surface: #ffffff;
        --surface-muted: #f1f5f9;
        --text: #172033;
        --muted: #5d6b82;
        --border: #d8e0ea;
        --grave: #b42318;
        --grave-bg: #fff1f0;
        --grave-border: #ffb4ad;
        --medio: #a15c00;
        --medio-bg: #fff7e6;
        --medio-border: #ffd591;
        --leve: #175cd3;
        --leve-bg: #eff6ff;
        --leve-border: #9ec5fe;
        --ok: #067647;
        --ok-bg: #ecfdf3;
        --ok-border: #a6f4c5;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      .page {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0 56px;
      }

      header {
        margin-bottom: 24px;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: 2rem;
        line-height: 1.2;
      }

      h2 {
        margin-bottom: 14px;
        font-size: 1.35rem;
        line-height: 1.2;
      }

      h3 {
        font-size: 1rem;
        line-height: 1.25;
      }

      code {
        padding: 2px 5px;
        border-radius: 4px;
        background: var(--surface-muted);
        color: var(--text);
        font-size: 0.92em;
      }

      .subtitle,
      .footer {
        color: var(--muted);
      }

      .subtitle {
        margin-top: 8px;
      }

      .section {
        margin-top: 18px;
        padding: 20px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .metric {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
      }

      .metric strong {
        display: block;
        margin-top: 4px;
        font-size: 1.7rem;
        line-height: 1;
      }

      .metric span {
        color: var(--muted);
        font-size: 0.9rem;
      }

      .metric.grave {
        border-color: var(--grave-border);
        background: var(--grave-bg);
        color: var(--grave);
      }

      .metric.medio {
        border-color: var(--medio-border);
        background: var(--medio-bg);
        color: var(--medio);
      }

      .metric.leve {
        border-color: var(--leve-border);
        background: var(--leve-bg);
        color: var(--leve);
      }

      .metric.ok {
        border-color: var(--ok-border);
        background: var(--ok-bg);
        color: var(--ok);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid transparent;
        font-weight: 700;
        font-size: 0.82rem;
      }

      .badge.grave {
        border-color: var(--grave-border);
        background: var(--grave-bg);
        color: var(--grave);
      }

      .badge.medio {
        border-color: var(--medio-border);
        background: var(--medio-bg);
        color: var(--medio);
      }

      .badge.leve {
        border-color: var(--leve-border);
        background: var(--leve-bg);
        color: var(--leve);
      }

      .badge.ok {
        border-color: var(--ok-border);
        background: var(--ok-bg);
        color: var(--ok);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px;
        border-bottom: 1px solid var(--border);
        text-align: left;
        vertical-align: top;
      }

      th {
        background: var(--surface-muted);
      }

      .findings {
        display: grid;
        gap: 14px;
      }

      .finding,
      .empty-state {
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        overflow: hidden;
      }

      .finding {
        border-left-width: 8px;
      }

      .finding.grave {
        border-left-color: var(--grave);
      }

      .finding.medio {
        border-left-color: var(--medio);
      }

      .finding.leve {
        border-left-color: var(--leve);
      }

      .empty-state {
        display: grid;
        gap: 8px;
        padding: 16px;
      }

      .finding-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 16px 0;
      }

      .finding-title {
        display: grid;
        gap: 8px;
      }

      .finding-body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        padding: 16px;
      }

      .detail {
        padding: 12px;
        border-radius: 8px;
        background: var(--surface-muted);
      }

      .detail-wide {
        grid-column: 1 / -1;
      }

      .detail strong {
        display: block;
        margin-bottom: 4px;
      }

      .steps {
        margin: 6px 0 0;
        padding-left: 20px;
      }

      .footer {
        margin-top: 22px;
        font-size: 0.9rem;
      }

      @media (max-width: 820px) {
        .summary-grid,
        .finding-body {
          grid-template-columns: 1fr;
        }

        .finding-header {
          display: grid;
        }

        .detail-wide {
          grid-column: auto;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header>
        <h1>Relatorio de Acessibilidade</h1>
        <p class="subtitle">
          Auditoria de ${escapeHtml(targetUrl)} com Playwright, Axe Core e validacoes customizadas.
        </p>
      </header>

      <section class="summary-grid" aria-label="Resumo de erros">
        <div class="metric grave">
          <span>1 - Grave</span>
          <strong>${graveCount}</strong>
        </div>
        <div class="metric medio">
          <span>2 - Medio</span>
          <strong>${medioCount}</strong>
        </div>
        <div class="metric leve">
          <span>3 - Leve</span>
          <strong>${leveCount}</strong>
        </div>
        <div class="metric ok">
          <span>Testes executados</span>
          <strong>${testStats.total}</strong>
        </div>
      </section>

      <section class="section" aria-labelledby="escopo-title">
        <h2 id="escopo-title">Escopo</h2>
        <table>
          <tbody>
            <tr>
              <th>URL</th>
              <td><code>${escapeHtml(targetUrl)}</code></td>
            </tr>
            <tr>
              <th>Data</th>
              <td>${escapeHtml(generatedAt)}</td>
            </tr>
            <tr>
              <th>Tags Axe Core</th>
              <td>${wcagTags.map((tag) => `<code>${escapeHtml(tag)}</code>`).join(' ')}</td>
            </tr>
            <tr>
              <th>Ferramentas</th>
              <td>Playwright, Axe Core, validacoes customizadas da Angular A11y Skill</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section" aria-labelledby="resultado-title">
        <h2 id="resultado-title">Resultado Automatizado</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Total de erros</th>
              <th>Passou</th>
              <th>Falhou</th>
              <th>Ignorado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge ${findings.length === 0 ? 'ok' : 'grave'}">${status}</span></td>
              <td>${findings.length}</td>
              <td>${testStats.passed}</td>
              <td>${testStats.failed}</td>
              <td>${testStats.skipped}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section" aria-labelledby="achados-title">
        <h2 id="achados-title">Erros Encontrados</h2>
        <div class="findings">
${findingsHtml}
        </div>
      </section>

      <section class="section" aria-labelledby="proximos-title">
        <h2 id="proximos-title">Proximos Passos</h2>
        <ol class="steps">
          <li>Corrigir primeiro os erros classificados como <strong>1 - Grave</strong>.</li>
          <li>Depois corrigir os erros <strong>2 - Medio</strong>.</li>
          <li>Revisar os pontos <strong>3 - Leve</strong>.</li>
          <li>Rodar novamente <code>npm run test:a11y</code>.</li>
          <li>Usar Playwright MCP para repetir a navegacao nos estados dinamicos.</li>
        </ol>
      </section>

      <p class="footer">Relatorio gerado automaticamente em <code>${escapeHtml(reportPath)}</code>.</p>
    </main>
  </body>
</html>
`;
}

function writeAccessibilityReport(): void {
  mkdirSync('reports', { recursive: true });
  writeFileSync(reportPath, generateHtmlReport(), 'utf8');
}

async function openTarget(page: Page): Promise<void> {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function runAxeScan(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  await testInfo.attach(`${name}-axe-results.json`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  for (const violation of results.violations) {
    addFinding({
      evidence: `${violation.help}. ${violation.nodes.length} node(s) affected.`,
      impact:
        'A violacao automatizada pode impedir ou dificultar o uso da interface por tecnologias assistivas.',
      location:
        violation.nodes
          .flatMap((node) => node.target)
          .slice(0, 5)
          .join(', ') || 'DOM',
      recommendation: `Corrija a regra Axe ${violation.id}. Consulte ${violation.helpUrl}.`,
      severity: severityFromAxeImpact(violation.impact),
      source: 'Axe Core',
      state: name,
      steps: [
        `Abrir ${targetUrl}.`,
        `Acessar o estado ${name}.`,
        `Executar Axe Core com tags ${wcagTags.join(', ')}.`,
      ],
      title: violation.help,
      wcag: violation.id,
    });
  }

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}

function formatViolations(violations: AxeViolation[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations found.';
  }

  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .slice(0, 3)
        .map((node) => {
          const target = node.target.join(', ');
          const summary = node.failureSummary ? `\n      ${node.failureSummary}` : '';
          return `    - ${target}\n      ${node.html}${summary}`;
        })
        .join('\n');

      return [
        `${violation.id} (${violation.impact ?? 'unknown impact'})`,
        `  ${violation.help}`,
        `  ${violation.helpUrl}`,
        nodes,
      ].join('\n');
    })
    .join('\n\n');
}

async function expectValidHeadingHierarchy(page: Page, stateName: string): Promise<void> {
  const headingIssues = await page.evaluate((currentStateName) => {
    type HeadingInfo = {
      level: number;
      text: string;
      selector: string;
    };

    function isVisible(element: HTMLElement): boolean {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        !element.hidden &&
        !element.closest('[aria-hidden="true"]') &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    function selectorFor(element: Element): string {
      if (element.id) {
        return `#${CSS.escape(element.id)}`;
      }

      const parts: string[] = [];
      let current: Element | null = element;

      while (current && parts.length < 4) {
        const tagName = current.tagName.toLowerCase();
        const parent = current.parentElement;

        if (!parent) {
          parts.unshift(tagName);
          break;
        }

        const sameTagSiblings = Array.from(parent.children).filter(
          (sibling) => sibling.tagName === current?.tagName,
        );
        const index = sameTagSiblings.indexOf(current) + 1;
        parts.unshift(sameTagSiblings.length > 1 ? `${tagName}:nth-of-type(${index})` : tagName);
        current = parent;
      }

      return parts.join(' > ');
    }

    const headings: HeadingInfo[] = Array.from(
      document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'),
    )
      .filter(isVisible)
      .map((heading) => ({
        level: Number(heading.tagName.slice(1)),
        text: heading.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        selector: selectorFor(heading),
      }));

    const issues: Array<{
      state: string;
      problem: string;
      selector?: string;
      text?: string;
      expected?: string;
      received?: string;
    }> = [];

    if (headings.length === 0) {
      issues.push({
        state: currentStateName,
        problem: 'No visible heading found.',
        expected: 'At least one visible h1.',
        received: 'No h1-h6 headings.',
      });

      return issues;
    }

    const [firstHeading] = headings;

    if (firstHeading.level !== 1) {
      issues.push({
        state: currentStateName,
        problem: 'The first visible heading must be h1.',
        selector: firstHeading.selector,
        text: firstHeading.text,
        expected: 'h1',
        received: `h${firstHeading.level}`,
      });
    }

    for (let index = 1; index < headings.length; index += 1) {
      const previousHeading = headings[index - 1];
      const currentHeading = headings[index];

      if (currentHeading.level > previousHeading.level + 1) {
        issues.push({
          state: currentStateName,
          problem: 'Heading level skipped.',
          selector: currentHeading.selector,
          text: currentHeading.text,
          expected: `h${previousHeading.level + 1} or above`,
          received: `h${currentHeading.level} after h${previousHeading.level}`,
        });
      }
    }

    return issues;
  }, stateName);

  for (const issue of headingIssues) {
    const firstHeadingIssue =
      issue.problem === 'No visible heading found.' ||
      issue.problem === 'The first visible heading must be h1.';

    addFinding({
      evidence: `${issue.problem} Esperado: ${issue.expected ?? 'heading valido'}. Recebido: ${
        issue.received ?? 'estrutura invalida'
      }.${issue.text ? ` Texto: ${issue.text}.` : ''}`,
      impact:
        'Usuarios de leitor de tela dependem de headings para entender a pagina e navegar por secoes.',
      location: issue.selector ?? stateName,
      recommendation: firstHeadingIssue
        ? 'Adicione um h1 visivel e coerente como primeiro heading do estado ou tela.'
        : 'Reorganize a hierarquia para nao pular niveis, por exemplo h1, h2, h3.',
      severity: firstHeadingIssue ? 'grave' : 'medio',
      source: 'Teste customizado',
      state: issue.state,
      title: firstHeadingIssue ? 'Tela nao comeca com h1' : 'Hierarquia de headings pula nivel',
      wcag: 'WCAG 2.4.6 Headings and Labels',
      steps: [
        `Abrir ${targetUrl}.`,
        `Acessar o estado ${issue.state}.`,
        'Inspecionar a ordem dos headings visiveis.',
      ],
    });
  }

  expect(
    headingIssues,
    'Every screen/state must start with a visible h1 and must not skip heading levels.',
  ).toEqual([]);
}

async function expectVisibleTextContrast(page: Page, stateName: string): Promise<void> {
  const contrastIssues = await page.evaluate((currentStateName) => {
    type Rgba = {
      r: number;
      g: number;
      b: number;
      a: number;
    };

    function parseRgb(value: string): Rgba | null {
      const match = value.match(/rgba?\(([^)]+)\)/);

      if (!match) {
        return null;
      }

      const [r, g, b, a = '1'] = match[1].split(',').map((part) => part.trim());

      return {
        r: Number.parseFloat(r),
        g: Number.parseFloat(g),
        b: Number.parseFloat(b),
        a: Number.parseFloat(a),
      };
    }

    function blend(foreground: Rgba, background: Rgba): Rgba {
      const alpha = foreground.a + background.a * (1 - foreground.a);

      if (alpha === 0) {
        return { r: 255, g: 255, b: 255, a: 1 };
      }

      return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
        a: alpha,
      };
    }

    function effectiveBackground(element: HTMLElement): Rgba {
      const backgrounds: Rgba[] = [];
      let color: Rgba = { r: 255, g: 255, b: 255, a: 1 };
      let current: HTMLElement | null = element;

      while (current) {
        const background = parseRgb(window.getComputedStyle(current).backgroundColor);

        if (background && background.a > 0) {
          backgrounds.unshift(background);
        }

        current = current.parentElement;
      }

      for (const background of backgrounds) {
        color = blend(background, color);
      }

      return color;
    }

    function channelToLinear(value: number): number {
      const normalized = value / 255;

      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    }

    function luminance(color: Rgba): number {
      return (
        0.2126 * channelToLinear(color.r) +
        0.7152 * channelToLinear(color.g) +
        0.0722 * channelToLinear(color.b)
      );
    }

    function contrastRatio(foreground: Rgba, background: Rgba): number {
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));

      return (lighter + 0.05) / (darker + 0.05);
    }

    function isVisible(element: HTMLElement): boolean {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        !element.hidden &&
        !element.closest('[aria-hidden="true"]') &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number.parseFloat(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    function hasDirectText(element: HTMLElement): boolean {
      return Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()),
      );
    }

    function selectorFor(element: Element): string {
      if (element.id) {
        return `#${CSS.escape(element.id)}`;
      }

      return element.outerHTML.slice(0, 140);
    }

    return Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter(isVisible)
      .filter(hasDirectText)
      .filter((element) => {
        const tagName = element.tagName.toLowerCase();

        return !['script', 'style', 'noscript', 'svg'].includes(tagName);
      })
      .filter((element) => !element.matches('[disabled], [aria-disabled="true"]'))
      .flatMap((element) => {
        const style = window.getComputedStyle(element);
        const foreground = parseRgb(style.color);

        if (!foreground) {
          return [];
        }

        const background = effectiveBackground(element);
        const ratio = contrastRatio(foreground, background);
        const fontSize = Number.parseFloat(style.fontSize);
        const fontWeight = Number.parseInt(style.fontWeight, 10);
        const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const minimumRatio = isLargeText ? 3 : 4.5;

        if (ratio >= minimumRatio) {
          return [];
        }

        return [
          {
            state: currentStateName,
            selector: selectorFor(element),
            text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) ?? '',
            ratio: Number(ratio.toFixed(2)),
            expected: minimumRatio,
            color: style.color,
            backgroundColor: `rgb(${Math.round(background.r)}, ${Math.round(
              background.g,
            )}, ${Math.round(background.b)})`,
          },
        ];
    });
  }, stateName);

  for (const issue of contrastIssues) {
    addFinding({
      evidence: `Texto "${issue.text}" com contraste ${issue.ratio}:1. Esperado minimo ${issue.expected}:1. Cor ${issue.color} sobre ${issue.backgroundColor}.`,
      impact:
        'Usuarios com baixa visao podem nao conseguir ler o texto quando o contraste fica abaixo do minimo WCAG AA.',
      location: issue.selector,
      recommendation:
        'Ajuste os tokens de cor do texto ou do fundo para atingir 4.5:1 em texto normal e 3:1 em texto grande.',
      severity: 'medio',
      source: 'Teste customizado',
      state: issue.state,
      steps: [
        `Abrir ${targetUrl}.`,
        `Acessar o estado ${issue.state}.`,
        `Inspecionar o texto "${issue.text}".`,
      ],
      title: 'Contraste de texto abaixo do minimo WCAG AA',
      wcag: 'WCAG 1.4.3 Contrast Minimum',
    });
  }

  expect(
    contrastIssues,
    'Visible text must meet WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text.',
  ).toEqual([]);
}

test.describe('Angular accessibility', () => {
  test.beforeEach(async ({ page }) => {
    currentFindings = [];
    await openTarget(page);
  });

  test.afterEach(async ({}, testInfo) => {
    writeTestRecord(testInfo);
    writeAccessibilityReport();
  });

  test.afterAll(async () => {
    writeAccessibilityReport();
  });

  test('does not expose automated Axe Core violations on the initial screen', async ({
    page,
  }, testInfo) => {
    await runAxeScan(page, testInfo, 'initial-screen');
  });

  test('starts every screen with h1 and keeps heading levels ordered', async ({ page }) => {
    await expectValidHeadingHierarchy(page, 'initial-screen');
  });

  test('keeps visible text contrast within WCAG AA minimums', async ({ page }) => {
    await expectVisibleTextContrast(page, 'initial-screen');
  });

  test('keeps ARIA and label ID references valid in the current DOM', async ({ page }) => {
    const missingReferences = await page.evaluate(() => {
      const idRefAttributes = [
        'aria-activedescendant',
        'aria-controls',
        'aria-describedby',
        'aria-errormessage',
        'aria-labelledby',
        'aria-owns',
        'for',
      ];

      function selectorFor(element: Element): string {
        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        const parts: string[] = [];
        let current: Element | null = element;

        while (current && parts.length < 4) {
          const tagName = current.tagName.toLowerCase();
          const parent = current.parentElement;

          if (!parent) {
            parts.unshift(tagName);
            break;
          }

          const sameTagSiblings = Array.from(parent.children).filter(
            (sibling) => sibling.tagName === current?.tagName,
          );
          const index = sameTagSiblings.indexOf(current) + 1;
          parts.unshift(
            sameTagSiblings.length > 1 ? `${tagName}:nth-of-type(${index})` : tagName,
          );
          current = parent;
        }

        return parts.join(' > ');
      }

      return Array.from(document.querySelectorAll('*'))
        .flatMap((element) =>
          idRefAttributes.flatMap((attribute) => {
            const value = element.getAttribute(attribute);

            if (!value?.trim()) {
              return [];
            }

            return value
              .trim()
              .split(/\s+/)
              .filter((id) => !document.getElementById(id))
              .map((missingId) => ({
                attribute,
                missingId,
                selector: selectorFor(element),
              }));
          }),
        );
    });

    for (const reference of missingReferences) {
      addFinding({
        evidence: `${reference.selector} usa ${reference.attribute} apontando para "${reference.missingId}", mas esse ID nao existe no DOM atual.`,
        impact:
          'Tecnologias assistivas podem receber uma relacao quebrada entre controle, descricao, erro ou elemento controlado.',
        location: reference.selector,
        recommendation:
          'No template Angular, renderize o elemento referenciado antes de apontar para ele ou use binding condicional em [attr.aria-describedby], [attr.aria-labelledby] e atributos relacionados.',
        severity: 'medio',
        source: 'Teste customizado',
        state: 'initial-screen',
        steps: [
          `Abrir ${targetUrl}.`,
          `Inspecionar o elemento ${reference.selector}.`,
          `Verificar se o ID "${reference.missingId}" existe no DOM.`,
        ],
        title: 'Referencia ARIA ou label aponta para ID inexistente',
        wcag: 'WCAG 4.1.2 Name, Role, Value',
      });
    }

    expect(
      missingReferences,
      'Every aria-* ID reference and label "for" value must point to an element that exists in the current DOM.',
    ).toEqual([]);
  });

  test('keeps form controls explicitly labelled', async ({ page }) => {
    const unlabeledControls = await page.evaluate(() => {
      function textFromIds(value: string | null): string {
        if (!value) {
          return '';
        }

        return value
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
          .filter(Boolean)
          .join(' ');
      }

      function selectorFor(element: Element): string {
        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        return element.outerHTML.slice(0, 140);
      }

      return Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          'input:not([type="hidden"]), select, textarea',
        ),
      )
        .filter((control) => !control.disabled)
        .filter((control) => {
          const nativeLabel = Array.from(control.labels ?? [])
            .map((label) => label.textContent?.trim() ?? '')
            .filter(Boolean)
            .join(' ');
          const ariaLabel = control.getAttribute('aria-label')?.trim() ?? '';
          const ariaLabelledBy = textFromIds(control.getAttribute('aria-labelledby'));
          const title = control.getAttribute('title')?.trim() ?? '';

          return !nativeLabel && !ariaLabel && !ariaLabelledBy && !title;
        })
        .map((control) => selectorFor(control));
    });

    for (const selector of unlabeledControls) {
      addFinding({
        evidence: `${selector} nao possui label nativo, aria-label, aria-labelledby ou title.`,
        impact:
          'Usuarios de leitor de tela podem nao entender a finalidade do campo de formulario.',
        location: selector,
        recommendation:
          'Associe um <label for="id"> ao controle ou use aria-label/aria-labelledby quando nao houver label visual.',
        severity: 'grave',
        source: 'Teste customizado',
        state: 'initial-screen',
        steps: [
          `Abrir ${targetUrl}.`,
          'Inspecionar controles de formulario habilitados.',
          `Verificar o nome acessivel de ${selector}.`,
        ],
        title: 'Controle de formulario sem nome acessivel',
        wcag: 'WCAG 3.3.2 Labels or Instructions',
      });
    }

    expect(unlabeledControls, 'Every enabled form control must have an accessible name.').toEqual([]);
  });

  test('does not use positive tabindex', async ({ page }) => {
    const positiveTabIndexElements = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('[tabindex]'))
        .filter((element) => element.tabIndex > 0)
        .map((element) => element.outerHTML.slice(0, 160)),
    );

    for (const element of positiveTabIndexElements) {
      addFinding({
        evidence: `Elemento usa tabindex positivo: ${element}`,
        impact:
          'tabindex positivo pode criar uma ordem de foco diferente da ordem visual e confundir usuarios de teclado.',
        location: element,
        recommendation:
          'Remova tabindex positivo. Use a ordem natural do DOM ou tabindex="0" apenas quando necessario.',
        severity: 'leve',
        source: 'Teste customizado',
        state: 'initial-screen',
        steps: [
          `Abrir ${targetUrl}.`,
          'Buscar elementos com tabindex maior que zero.',
          'Comparar a ordem de foco com a ordem visual.',
        ],
        title: 'Uso de tabindex positivo',
        wcag: 'WCAG 2.4.3 Focus Order',
      });
    }

    expect(
      positiveTabIndexElements,
      'Positive tabindex makes focus order harder to predict. Use DOM order or tabindex="0".',
    ).toEqual([]);
  });

  test('allows keyboard navigation through every enabled tabbable control', async ({ page }) => {
    const tabbableSelectors = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      function isVisible(element: HTMLElement): boolean {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          !element.hidden &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      }

      function selectorFor(element: Element): string {
        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        const parts: string[] = [];
        let current: Element | null = element;

        while (current && parts.length < 4) {
          const tagName = current.tagName.toLowerCase();
          const parent = current.parentElement;

          if (!parent) {
            parts.unshift(tagName);
            break;
          }

          const sameTagSiblings = Array.from(parent.children).filter(
            (sibling) => sibling.tagName === current?.tagName,
          );
          const index = sameTagSiblings.indexOf(current) + 1;
          parts.unshift(
            sameTagSiblings.length > 1 ? `${tagName}:nth-of-type(${index})` : tagName,
          );
          current = parent;
        }

        return parts.join(' > ');
      }

      return Array.from(document.querySelectorAll<HTMLElement>(selector))
        .filter(isVisible)
        .filter((element) => element.tabIndex >= 0)
        .map(selectorFor);
    });

    test.skip(tabbableSelectors.length === 0, 'No enabled tabbable controls found on this screen.');

    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    const visited = new Set<string>();

    for (let index = 0; index < tabbableSelectors.length + 2; index += 1) {
      await page.keyboard.press('Tab');
      const activeSelector = await page.evaluate(() => {
        const element = document.activeElement;

        if (!element || element === document.body) {
          return 'body';
        }

        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        const parts: string[] = [];
        let current: Element | null = element;

        while (current && parts.length < 4) {
          const tagName = current.tagName.toLowerCase();
          const parent = current.parentElement;

          if (!parent) {
            parts.unshift(tagName);
            break;
          }

          const sameTagSiblings = Array.from(parent.children).filter(
            (sibling) => sibling.tagName === current?.tagName,
          );
          const index = sameTagSiblings.indexOf(current) + 1;
          parts.unshift(
            sameTagSiblings.length > 1 ? `${tagName}:nth-of-type(${index})` : tagName,
          );
          current = parent;
        }

        return parts.join(' > ');
      });

      if (activeSelector !== 'body') {
        visited.add(activeSelector);
      }
    }

    const missedSelectors = tabbableSelectors.filter((selector) => !visited.has(selector));

    for (const selector of missedSelectors) {
      addFinding({
        evidence: `${selector} esta habilitado e visivel, mas nao foi alcancado com Tab.`,
        impact:
          'Usuarios que dependem de teclado podem nao conseguir acessar ou acionar essa funcionalidade.',
        location: selector,
        recommendation:
          'Garanta que o controle seja naturalmente focavel, nao esteja encoberto e siga a ordem do DOM.',
        severity: 'grave',
        source: 'Teste customizado',
        state: 'initial-screen',
        steps: [
          `Abrir ${targetUrl}.`,
          'Pressionar Tab repetidamente a partir do inicio da pagina.',
          `Confirmar que ${selector} recebe foco.`,
        ],
        title: 'Controle habilitado nao e alcancavel por teclado',
        wcag: 'WCAG 2.1.1 Keyboard',
      });
    }

    expect(missedSelectors, 'Every enabled tabbable control should be reachable with Tab.').toEqual(
      [],
    );
  });

  test('shows a visible focus indicator on enabled tabbable controls', async ({ page }) => {
    const controlsWithoutVisibleFocus = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      function isVisible(element: HTMLElement): boolean {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          !element.hidden &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        );
      }

      function selectorFor(element: Element): string {
        if (element.id) {
          return `#${CSS.escape(element.id)}`;
        }

        return element.outerHTML.slice(0, 140);
      }

      return Array.from(document.querySelectorAll<HTMLElement>(selector))
        .filter(isVisible)
        .filter((element) => element.tabIndex >= 0)
        .filter((element) => {
          element.focus();

          if (document.activeElement !== element) {
            return true;
          }

          const style = window.getComputedStyle(element);
          const outlineWidth = Number.parseFloat(style.outlineWidth);
          const hasOutline =
            style.outlineStyle !== 'none' &&
            style.outlineStyle !== 'hidden' &&
            outlineWidth > 0 &&
            style.outlineColor !== 'transparent';
          const hasBoxShadow = style.boxShadow !== 'none';

          return !hasOutline && !hasBoxShadow;
        })
        .map(selectorFor);
    });

    for (const selector of controlsWithoutVisibleFocus) {
      addFinding({
        evidence: `${selector} recebe foco, mas nao apresenta outline ou box-shadow visivel.`,
        impact:
          'Usuarios de teclado podem se perder na interface sem indicador visual claro de foco.',
        location: selector,
        recommendation:
          'Adicione estado de foco visivel com outline, box-shadow ou borda com contraste suficiente.',
        severity: 'medio',
        source: 'Teste customizado',
        state: 'initial-screen',
        steps: [
          `Abrir ${targetUrl}.`,
          `Navegar ate ${selector} usando Tab.`,
          'Observar se existe indicador de foco visivel.',
        ],
        title: 'Controle sem foco visivel',
        wcag: 'WCAG 2.4.7 Focus Visible',
      });
    }

    expect(
      controlsWithoutVisibleFocus,
      'Every enabled tabbable control should expose a visible focus indicator.',
    ).toEqual([]);
  });

  test('associates visible form errors with their controls', async ({ page }) => {
    const form = page.locator('form').first();
    test.skip((await form.count()) === 0, 'No form found on this screen.');

    for (const label of [/^nome$/i, /^sobrenome$/i, /^e-mail$/i, /^sexo$/i]) {
      const control = page.getByLabel(label).first();

      if ((await control.count()) > 0) {
        await control.focus();
        await page.keyboard.press('Tab');
      }
    }

    const unassociatedErrors = await page.evaluate(() => {
      const visibleErrors = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[id].error-message, [id][role="alert"], [id][aria-live]',
        ),
      ).filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0 &&
          Boolean(element.textContent?.trim())
        );
      });

      return visibleErrors
        .filter((errorElement) => {
          const id = errorElement.id;

          return !document.querySelector(
            `input[aria-describedby~="${CSS.escape(id)}"], select[aria-describedby~="${CSS.escape(
              id,
            )}"], textarea[aria-describedby~="${CSS.escape(
              id,
            )}"], input[aria-errormessage="${CSS.escape(
              id,
            )}"], select[aria-errormessage="${CSS.escape(
              id,
            )}"], textarea[aria-errormessage="${CSS.escape(id)}"]`,
          );
        })
        .map((errorElement) => ({
          id: errorElement.id,
          text: errorElement.textContent?.trim() ?? '',
        }));
    });

    for (const error of unassociatedErrors) {
      addFinding({
        evidence: `A mensagem "${error.text}" aparece com id "${error.id}", mas nenhum campo aponta para ela com aria-describedby ou aria-errormessage.`,
        impact:
          'Usuarios de leitor de tela podem nao perceber que a mensagem de erro pertence ao campo correspondente.',
        location: `#${error.id}`,
        recommendation:
          'Adicione [attr.aria-describedby] ou [attr.aria-errormessage] no campo relacionado quando o erro estiver visivel.',
        severity: 'medio',
        source: 'Teste customizado',
        state: 'validation-errors',
        steps: [
          `Abrir ${targetUrl}.`,
          'Focar um campo obrigatorio e sair sem preencher.',
          `Verificar a associacao programatica da mensagem #${error.id}.`,
        ],
        title: 'Mensagem de erro visivel sem associacao com o campo',
        wcag: 'WCAG 3.3.1 Error Identification',
      });
    }

    expect(
      unassociatedErrors,
      'Visible validation errors should be connected to their fields with aria-describedby or aria-errormessage.',
    ).toEqual([]);
  });

  test('keeps the completed cadastro flow accessible', async ({ page }, testInfo) => {
    const form = page.locator('form').first();
    test.skip((await form.count()) === 0, 'No form found on this screen.');

    await page.getByLabel(/^nome$/i).fill('Maria');
    await page.getByLabel(/^sobrenome$/i).fill('Silva');
    await page.getByLabel(/^e-mail$/i).fill('maria.silva@example.com');
    await page.getByLabel(/^sexo$/i).selectOption({ value: 'nao-informar' });

    await runAxeScan(page, testInfo, 'filled-form');

    await page.getByRole('button', { name: /^cadastrar$/i }).click();

    await expect(
      page.getByRole('heading', { name: /cadastro realizado com sucesso/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /voltar/i })).toBeVisible();

    await expectValidHeadingHierarchy(page, 'success-screen');
    await expectVisibleTextContrast(page, 'success-screen');
    await runAxeScan(page, testInfo, 'success-screen');
  });
});
