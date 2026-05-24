import { rmSync } from 'node:fs';

rmSync('reports/.a11y-results', { force: true, recursive: true });
rmSync('reports/accessibility-report.html', { force: true });
