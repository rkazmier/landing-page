/**
 * sitemap.xml (Z11, NFR-2): wszystkie wersje językowe strony głównej,
 * każda z odpowiednikami językowymi (xhtml:link hreflang, w tym x-default).
 * Adresy z jednej konfiguracji `site` + `base` (astro.config.mjs). Strona 404 jest pominięta.
 */
import type { APIRoute } from 'astro';
import { defaultLocale, localePath, locales } from '../i18n';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Brak `site` w astro.config.mjs — sitemap.xml wymaga adresu witryny.');
  const absolute = (path: string) => escapeXml(new URL(path, site).href);

  const alternates = [
    ...locales.map((code) => ({ hreflang: code, href: absolute(localePath(code)) })),
    { hreflang: 'x-default', href: absolute(localePath(defaultLocale)) },
  ]
    .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`)
    .join('\n');

  const urls = locales
    .map((code) => `  <url>\n    <loc>${absolute(localePath(code))}</loc>\n${alternates}\n  </url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
