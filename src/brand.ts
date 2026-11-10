/**
 * Marka — jedyne miejsce z nazwą i logo.
 *
 * Do czasu dostarczenia logo graficznego wyświetlany jest logotyp tekstowy.
 * Aby podmienić logo: umieść plik w public/ (np. public/logo.svg) i ustaw `logo`,
 * np. { src: 'logo.svg', width: 180, height: 40 }. Komponenty nie wymagają zmian.
 * Kolory i fonty: src/styles/tokens.css.
 */
export interface BrandLogo {
  /** Ścieżka względem public/, bez ukośnika na początku */
  src: string;
  width: number;
  height: number;
}

export const brand = {
  name: 'Steel Valley Long Range',
  wordmark: {
    primary: 'Steel Valley',
    secondary: 'Long Range',
  },
  logo: null as BrandLogo | null,
};
