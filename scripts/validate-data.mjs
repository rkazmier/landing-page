#!/usr/bin/env node
/**
 * Waliduje pliki danych w src/data/ ich schematami JSON Schema:
 * każdy plik `<nazwa>.schema.json` sprawdza plik `<nazwa>.json` obok niego.
 * Dodatkowo: unikalność pól `id` w tablicach oraz kolejność oznaczeń `label`
 * (litera + numer, np. K1, A1, A2): dla każdej litery numery rosną od 1 bez przerw.
 * Uruchamiane w CI: `npm run validate:data`.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const ajv = new Ajv({ allErrors: true });
const errors = [];
let checked = 0;

for (const schemaFile of readdirSync(dir).filter((f) => f.endsWith('.schema.json'))) {
  const dataFile = schemaFile.replace('.schema.json', '.json');
  const dataPath = join(dir, dataFile);
  if (!existsSync(dataPath)) {
    errors.push(`${dataFile}: brak pliku danych dla schematu ${schemaFile}`);
    continue;
  }

  let schema;
  let data;
  try {
    schema = JSON.parse(readFileSync(join(dir, schemaFile), 'utf8'));
    data = JSON.parse(readFileSync(dataPath, 'utf8'));
  } catch (error) {
    errors.push(`${dataFile}: niepoprawny JSON (${error.message})`);
    continue;
  }

  const validate = ajv.compile(schema);
  if (!validate(data)) {
    for (const e of validate.errors) {
      errors.push(`${dataFile}${e.instancePath || ''}: ${e.message}`);
    }
  }

  if (Array.isArray(data)) {
    const seen = new Set();
    data.forEach((item, i) => {
      if (item && typeof item.id === 'string') {
        if (seen.has(item.id)) errors.push(`${dataFile}/${i}/id: powtórzony identyfikator "${item.id}"`);
        seen.add(item.id);
      }
    });

    const lastNumber = new Map();
    data.forEach((item, i) => {
      const match = item && typeof item.label === 'string' ? /^([A-Z])([1-9][0-9]*)$/.exec(item.label) : null;
      if (!match) return;
      const [, letter, num] = match;
      const expected = (lastNumber.get(letter) ?? 0) + 1;
      if (Number(num) !== expected) {
        errors.push(`${dataFile}/${i}/label: "${item.label}" — oczekiwano "${letter}${expected}" (numery dla litery rosną od 1 bez przerw)`);
      }
      lastNumber.set(letter, Math.max(expected, Number(num)));
    });
  }
  checked++;
}

if (errors.length) {
  console.error(`Błędy danych (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Dane OK: ${checked} plik(ów) zgodnych ze schematem.`);
