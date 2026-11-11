#!/usr/bin/env node
/**
 * Pilnuje, żeby JavaScript był tylko tam, gdzie pozwala NFR-1 / ADR 0001 (Z12):
 * baner językowy, przycisk wydruku planu oraz ulepszenia nawigacji
 * (zwijane menu na telefonie, zamykanie listy języków).
 *
 * 1. Źródła: skrypty wykonywalne (<script> bez typu danych) wolno umieszczać tylko
 *    w komponentach z listy ALLOWED; w żadnym pliku .astro nie ma atrybutów `on…=`
 *    (np. onclick) ani dyrektyw `client:*` (wyspy z JS frameworka).
 * 2. Wynik budowania (dist/): każda strona ma co najwyżej tyle skryptów wykonywalnych,
 *    ile jest dozwolonych komponentów; bez `<script src>` z zewnątrz i bez atrybutów `on…=`.
 *
 * Skrypty danych (`type="application/json"`, `application/ld+json`) nie są JavaScriptem.
 * Bez zależności; uruchamiane w CI po buildzie: `npm run check:js`.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, basename, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Komponent → do czego służy jego skrypt */
const ALLOWED = {
  'LanguageBanner.astro': 'baner językowy (FR-1)',
  'RangePlanSection.astro': 'przycisk „Drukuj plan” (Z08)',
  'Header.astro': 'zwijane menu na telefonie (NFR-1)',
  'LanguageSwitcher.astro': 'zamykanie listy języków: Esc, kliknięcie obok (NFR-1)',
};

const DATA_TYPES = new Set(['application/json', 'application/ld+json', 'importmap', 'speculationrules']);
const errors = [];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/** Otwierające znaczniki <script> wykonujące kod */
function executableScripts(markup) {
  const tags = markup.replace(/<!--[\s\S]*?-->/g, '').match(/<script\b[^>]*>/gi) ?? [];
  return tags.filter((tag) => {
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(tag)?.[1]?.toLowerCase();
    return !type || !DATA_TYPES.has(type);
  });
}

/** Atrybuty obsługi zdarzeń w znacznikach (poza treścią <script>/<style>) */
function inlineHandlers(markup) {
  const tagsOnly = markup
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  return [...tagsOnly.matchAll(/<[a-zA-Z][^>]*\s(on[a-z]+)\s*=/g)].map((m) => m[1]);
}

// 1. Źródła
const sources = walk(join(root, 'src')).filter((file) => extname(file) === '.astro');
for (const file of sources) {
  const content = readFileSync(file, 'utf8');
  const name = relative(root, file);
  const scripts = executableScripts(content);
  if (scripts.length && !ALLOWED[basename(file)]) {
    errors.push(`${name}: skrypt w komponencie spoza listy dozwolonych (${Object.keys(ALLOWED).join(', ')})`);
  }
  for (const handler of inlineHandlers(content)) {
    errors.push(`${name}: atrybut ${handler}= — JavaScript tylko w dozwolonych komponentach`);
  }
  for (const directive of content.match(/\bclient:[a-z]+/g) ?? []) {
    errors.push(`${name}: dyrektywa ${directive} — bez wysp z JavaScriptem frameworka`);
  }
}

// 2. Wynik budowania
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('Brak katalogu dist/ — najpierw uruchom `npm run build`.');
  process.exit(1);
}
const limit = Object.keys(ALLOWED).length;
const pages = walk(dist).filter((file) => extname(file) === '.html');
for (const file of pages) {
  const content = readFileSync(file, 'utf8');
  const name = relative(root, file);
  const scripts = executableScripts(content);
  if (scripts.length > limit) {
    errors.push(`${name}: ${scripts.length} skryptów wykonywalnych, dozwolone najwyżej ${limit}`);
  }
  for (const tag of scripts) {
    if (/\bsrc\s*=\s*["']?(?:https?:)?\/\//i.test(tag)) errors.push(`${name}: zewnętrzny skrypt ${tag}`);
  }
  for (const handler of inlineHandlers(content)) {
    errors.push(`${name}: atrybut ${handler}=`);
  }
}

if (errors.length) {
  console.error(`Niedozwolony JavaScript (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `JavaScript OK: skrypty tylko w ${Object.entries(ALLOWED)
    .map(([file, purpose]) => `${file} — ${purpose}`)
    .join('; ')}. Sprawdzono ${sources.length} komponentów i ${pages.length} stron.`,
);
