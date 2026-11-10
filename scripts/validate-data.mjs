#!/usr/bin/env node
/**
 * Waliduje pliki danych w src/data/ ich schematami JSON Schema:
 * każdy plik `<nazwa>.schema.json` sprawdza plik `<nazwa>.json` obok niego.
 * Dodatkowo: unikalność pól `id` w tablicach.
 * Uruchamiane w CI: `npm run check:data`.
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
  }
  checked++;
}

if (errors.length) {
  console.error(`Błędy danych (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Dane OK: ${checked} plik(ów) zgodnych ze schematem.`);
