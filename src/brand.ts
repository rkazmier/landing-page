/**
 * Marka — jedyne miejsce z nazwą i logo.
 *
 * Pliki logo (wektorowe źródła, także do innych materiałów): src/assets/logo/.
 * Generator plików logo i favicon: scripts/logo/build.py.
 *
 * `logo.mark` to znak graficzny wyświetlany w nagłówku. `logo.withWordmark`
 * decyduje, czy obok znaku stoi logotyp tekstowy (`wordmark`).
 * Ustawienie `logo: null` przywraca sam logotyp tekstowy. Komponenty nie wymagają zmian.
 * Kolory i fonty strony: src/styles/tokens.css.
 */
import mark from './assets/logo/steel-valley-znak-jasne-tlo.svg';

export interface BrandLogo {
  /** Znak graficzny zaimportowany z src/assets/ */
  mark: { src: string; width: number; height: number };
  /** Czy obok znaku wyświetlać logotyp tekstowy */
  withWordmark: boolean;
}

export const brand = {
  name: 'Steel Valley Long Range',
  wordmark: {
    primary: 'Steel Valley',
    secondary: 'Long Range',
  },
  logo: { mark, withWordmark: true } as BrandLogo | null,
};
