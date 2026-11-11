#!/usr/bin/env node
/**
 * Tabela wyników Lighthouse (mediana z przebiegów) dla każdej wersji językowej, w Markdownie.
 * Czyta .lhci/raporty/manifest.json (lighthouserc.cjs). W GitHub Actions dopisuje tabelę
 * do podsumowania przebiegu (GITHUB_STEP_SUMMARY), lokalnie wypisuje ją na ekran.
 * Uruchamiane po `lhci autorun`: `npm run lighthouse:summary`.
 */
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, '.lhci', 'raporty', 'manifest.json');
if (!existsSync(manifestPath)) {
  console.error('Brak .lhci/raporty/manifest.json — najpierw uruchom Lighthouse CI.');
  process.exit(1);
}

const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibility', 'Accessibility'],
  ['best-practices', 'Best Practices'],
  ['seo', 'SEO'],
];
const MIN = 91;

const runs = JSON.parse(readFileSync(manifestPath, 'utf8')).filter((run) => run.isRepresentativeRun);
const label = (url) => new URL(url).pathname.replace(/^\/|\/$/g, '') || 'pl';
const cell = (score) => {
  const value = Math.round(score * 100);
  return value >= MIN ? `${value}` : `**${value}** ❌`;
};

const lines = [
  `### Lighthouse (mobile), mediana z przebiegów — próg ≥ ${MIN}`,
  '',
  `| Wersja | ${CATEGORIES.map(([, name]) => name).join(' | ')} |`,
  `|---|${CATEGORIES.map(() => '---:').join('|')}|`,
  ...runs.map(
    (run) => `| ${label(run.url)} | ${CATEGORIES.map(([key]) => cell(run.summary[key])).join(' | ')} |`,
  ),
  '',
];
const table = lines.join('\n');

console.log(table);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`);
