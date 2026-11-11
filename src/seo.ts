/**
 * SEO (NFR-2, Z11): słowa kluczowe, Open Graph i dane strukturalne JSON-LD.
 *
 * - Adres witryny: tylko `site` + `base` w astro.config.mjs (zmienne SITE_URL / SITE_BASE).
 *   Canonical, hreflang, og:url, sitemap.xml i robots.txt budujemy z `Astro.site`.
 * - Dane obiektu (adres, współrzędne, telefon, godziny): src/site.ts — te same co w stopce.
 * - Title i description: klucz `meta` w src/i18n/<kod>.json (docs/seo-teksty.md).
 */
import { brand } from './brand';
import { site } from './site';
import type { Locale } from './i18n';

/** Słowa kluczowe — wspólna lista właściciela z docs/seo-teksty.md */
export const keywords = [
  'strzelnica',
  'strzelectwo sportowe',
  'strzelectwo długodystansowe',
  'trening strzelecki',
  'zawody strzeleckie',
  'Steel Valley Long Range',
] as const;

/** Kody regionalne dla og:locale */
export const ogLocales: Record<Locale, string> = {
  pl: 'pl_PL',
  en: 'en_GB',
  de: 'de_DE',
  lt: 'lt_LT',
  cs: 'cs_CZ',
  sk: 'sk_SK',
};

const dayNames: Record<(typeof site.openingHours.days)[number], string> = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};

interface StructuredDataInput {
  /** Adres bezwzględny bieżącej wersji językowej */
  url: string;
  /** Adres bezwzględny wersji domyślnej (stały identyfikator obiektu we wszystkich wersjach) */
  homeUrl: string;
  description: string;
}

/** JSON-LD `SportsActivityLocation` — dane wyłącznie z src/site.ts i src/brand.ts */
export function structuredData({ url, homeUrl, description }: StructuredDataInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${homeUrl}#obiekt`,
    name: brand.name,
    description,
    url,
    telephone: site.phone.e164,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.openingHours.days.map((day) => `https://schema.org/${dayNames[day]}`),
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
    ],
  };
}
