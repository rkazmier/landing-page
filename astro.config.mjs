import { defineConfig } from 'astro/config';

// Adres witryny i ścieżka bazowa w jednym miejscu (docs/architecture.md).
// Do czasu podpięcia domeny strona działa pod podkatalogiem GitHub Pages.
// Zadanie Z13 zmieni to na https://steel-valley.pl i '/'.
const SITE = process.env.SITE_URL ?? 'https://rkazmier.github.io';
const BASE = process.env.SITE_BASE ?? '/landing-page';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
});
