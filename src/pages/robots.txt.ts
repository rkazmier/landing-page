/**
 * robots.txt (Z11, NFR-2): zezwala na indeksowanie i wskazuje sitemap.xml.
 * Adres sitemap z jednej konfiguracji `site` + `base` (astro.config.mjs).
 *
 * Wyszukiwarki czytają robots.txt tylko z katalogu głównego domeny — od Z13 plik leży
 * pod https://steel-valley.pl/robots.txt.
 */
import type { APIRoute } from 'astro';
import { withBase } from '../utils/url';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Brak `site` w astro.config.mjs — robots.txt wymaga adresu witryny.');
  const sitemap = new URL(withBase('sitemap.xml'), site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
