import { defineConfig } from 'astro/config';

// Adres witryny i ścieżka bazowa w jednym miejscu (docs/architecture.md).
// Strona działa pod własną domeną steel-valley.pl (Z13, instrukcja: docs/domena.md).
// Zmienne SITE_URL / SITE_BASE służą tylko do buildów pomocniczych (np. Lighthouse w CI).
const SITE = process.env.SITE_URL ?? 'https://steel-valley.pl';
const BASE = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
});
