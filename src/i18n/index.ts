/**
 * Wersje językowe (ADR 0002): konfiguracja, słowniki i adresy.
 *
 * Polski jest domyślny i leży pod `/`, pozostałe pod `/<kod>/`.
 * Teksty: src/i18n/<kod>.json — każdy klucz musi istnieć we wszystkich plikach
 * (sprawdza to scripts/check-i18n.mjs w CI).
 */
import pl from './pl.json';
import en from './en.json';
import de from './de.json';
import lt from './lt.json';
import cs from './cs.json';
import sk from './sk.json';
import { withBase } from '../utils/url';

export const locales = ['pl', 'en', 'de', 'lt', 'cs', 'sk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

/** Nazwy języków w ich własnym brzmieniu (przełącznik, baner) */
export const languageNames: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
  de: 'Deutsch',
  lt: 'Lietuvių',
  cs: 'Čeština',
  sk: 'Slovenčina',
};

export type Dictionary = typeof pl;

const dictionaries: Record<Locale, Dictionary> = { pl, en, de, lt, cs, sk };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Ścieżka strony głównej danej wersji, z uwzględnieniem ścieżki bazowej */
export function localePath(locale: Locale): string {
  return withBase(locale === defaultLocale ? '' : `${locale}/`);
}
