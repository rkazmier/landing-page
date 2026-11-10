#!/usr/bin/env node
/**
 * Sprawdza pliki tłumaczeń src/i18n/<kod>.json (FR-1, Z03):
 * - każdy z 6 plików istnieje i jest poprawnym JSON-em,
 * - każdy klucz występuje we wszystkich plikach (porównanie ze zbiorem wszystkich kluczy),
 * - wartości są niepustymi napisami,
 * - tablice (np. listy dyscyplin) mają tyle samo elementów w każdym języku
 *   (elementy są porównywane jako klucze `lista.0`, `lista.1`, …).
 * Bez zależności; uruchamiane w CI: `npm run check:i18n`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const LOCALES = ['pl', 'en', 'de', 'lt', 'cs', 'sk'];
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n');
const errors = [];

function flatten(value, prefix, out, locale) {
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out, locale);
    }
  } else {
    out.add(prefix);
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${locale}.json: "${prefix}" musi być niepustym napisem`);
    }
  }
  return out;
}

const keys = {};
for (const locale of LOCALES) {
  const file = join(dir, `${locale}.json`);
  try {
    keys[locale] = flatten(JSON.parse(readFileSync(file, 'utf8')), '', new Set(), locale);
  } catch (error) {
    errors.push(`${locale}.json: nie można wczytać (${error.message})`);
    keys[locale] = new Set();
  }
}

const all = new Set(Object.values(keys).flatMap((set) => [...set]));
for (const locale of LOCALES) {
  for (const key of all) {
    if (!keys[locale].has(key)) errors.push(`${locale}.json: brak klucza "${key}"`);
  }
}

if (errors.length) {
  console.error(`Błędy tłumaczeń (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Tłumaczenia OK: ${all.size} kluczy w ${LOCALES.length} językach.`);
