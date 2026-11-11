#!/usr/bin/env node
/**
 * Sprawdza zbudowaną stronę (dist/), czy nie ładuje zasobów z zewnętrznych domen
 * (NFR-1, NFR-5, ADR 0005, Z12).
 *
 * Zasób = coś, co przeglądarka pobiera sama: skrypty, style, obrazy, fonty, ramki,
 * ikony, preload/preconnect, `url()` i `@import` w CSS, `href` w SVG (<image>, <use>).
 * Zwykłe linki (<a href>), adresy kanoniczne i hreflang (<link rel="canonical|alternate">)
 * oraz wartości meta (np. og:url) nie są zasobami i są dozwolone.
 *
 * Zewnętrzny adres = zaczyna się od `http:`, `https:` lub `//`. Zasoby strony mają adresy
 * względne (ścieżka bazowa z astro.config.mjs), więc każdy adres bezwzględny w zasobie to błąd.
 *
 * Bez zależności; uruchamiane w CI po buildzie: `npm run check:external`.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname, resolve } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? resolve(process.argv[2]) : join(root, 'dist');

if (!existsSync(dist)) {
  console.error(`Brak katalogu ${relative(process.cwd(), dist)} — najpierw uruchom \`npm run build\`.`);
  process.exit(1);
}

const EXTERNAL = /^\s*(?:https?:)?\/\//i;

/** Atrybuty, którymi elementy ładują zasoby */
const RESOURCE_ATTRS = {
  script: ['src'],
  img: ['src', 'srcset'],
  source: ['src', 'srcset'],
  iframe: ['src'],
  frame: ['src'],
  embed: ['src'],
  object: ['data'],
  video: ['src', 'poster'],
  audio: ['src'],
  track: ['src'],
  input: ['src'],
  image: ['href', 'xlink:href'],
  use: ['href', 'xlink:href'],
  feimage: ['href', 'xlink:href'],
};

/** Wartości `rel` w <link>, przy których przeglądarka pobiera lub łączy się z adresem */
const RESOURCE_RELS = new Set([
  'stylesheet',
  'preload',
  'modulepreload',
  'prefetch',
  'preconnect',
  'dns-prefetch',
  'prerender',
  'icon',
  'shortcut',
  'apple-touch-icon',
  'apple-touch-icon-precomposed',
  'mask-icon',
  'manifest',
]);

const errors = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function parseAttrs(source) {
  const attrs = {};
  const re = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(source))) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

/** Adresy z wartości srcset: „a.webp 1x, b.webp 2x” */
const srcsetUrls = (value) =>
  value
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);

function report(file, where, url) {
  errors.push(`${relative(root, file)}: ${where} → ${url}`);
}

/** `url(...)` i `@import` w treści CSS */
function checkCss(file, css, where) {
  const urlRe = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi;
  const importRe = /@import\s+(?:url\()?\s*["']?([^"')\s;]+)/gi;
  let m;
  while ((m = urlRe.exec(css))) {
    const url = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    if (EXTERNAL.test(url)) report(file, `${where} url()`, url);
  }
  while ((m = importRe.exec(css))) {
    if (EXTERNAL.test(m[1])) report(file, `${where} @import`, m[1]);
  }
}

/** Znaczniki HTML/SVG: atrybuty zasobów, <link rel>, style inline i bloki <style> */
function checkMarkup(file, markup) {
  const withoutComments = markup.replace(/<!--[\s\S]*?-->/g, '');

  const styleBlock = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleBlock.exec(withoutComments))) checkCss(file, m[1], '<style>');

  // Treść <script> i <style> nie jest znacznikami — usuwamy ją przed analizą tagów
  const tagsOnly = withoutComments.replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1>/gi, '<$1$2>');
  const tagRe = /<([a-zA-Z][\w:-]*)\b([^>]*)>/g;
  while ((m = tagRe.exec(tagsOnly))) {
    const tag = m[1].toLowerCase();
    const attrs = parseAttrs(m[2]);

    for (const name of RESOURCE_ATTRS[tag] ?? []) {
      const value = attrs[name];
      if (value === undefined) continue;
      const urls = name === 'srcset' ? srcsetUrls(value) : [value];
      for (const url of urls) if (EXTERNAL.test(url)) report(file, `<${tag} ${name}>`, url);
    }

    if (tag === 'link' && attrs.href !== undefined) {
      const rels = (attrs.rel ?? '').toLowerCase().split(/\s+/);
      if (rels.some((rel) => RESOURCE_RELS.has(rel)) && EXTERNAL.test(attrs.href)) {
        report(file, `<link rel="${attrs.rel}">`, attrs.href);
      }
      if (attrs.imagesrcset) {
        for (const url of srcsetUrls(attrs.imagesrcset)) {
          if (EXTERNAL.test(url)) report(file, '<link imagesrcset>', url);
        }
      }
    }

    if (attrs.style) checkCss(file, attrs.style, `<${tag} style>`);
  }
}

const files = walk(dist);
let checked = 0;
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.html', '.css', '.svg'].includes(ext)) continue;
  const content = readFileSync(file, 'utf8');
  if (ext === '.css') checkCss(file, content, 'CSS');
  else checkMarkup(file, content);
  checked += 1;
}

if (errors.length) {
  console.error(`Zasoby z zewnętrznych domen (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Brak zasobów z zewnętrznych domen: sprawdzono ${checked} plików HTML/CSS/SVG.`);
