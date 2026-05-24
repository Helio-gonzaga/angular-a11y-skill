import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const targetUrl = 'http://localhost:4200';

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

test.describe('Angular accessibility', () => {
  test('does not expose automated Axe Core violations on the target page', async ({
    page,
  }, testInfo) => {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
});
