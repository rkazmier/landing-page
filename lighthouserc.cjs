/**
 * Lighthouse CI (Z12, NFR-1/NFR-3): audyt mobile każdej z 6 wersji językowych.
 *
 * Strona jest budowana na potrzeby audytu z adresem lokalnym:
 *   SITE_URL=http://localhost:9000 SITE_BASE=/ npm run build
 * i serwowana prostym serwerem plików z katalogu dist/ (bez kompresji, jak najgorszy przypadek).
 *
 * Próg: wynik „powyżej 90” w czterech kategoriach — Lighthouse pokazuje liczby całkowite,
 * więc wymagamy co najmniej 91 (0.91). Wynik niższy = czerwone CI.
 * Każdy adres audytowany 3 razy; liczy się mediana (mniej przypadkowych wahań wydajności).
 */
const PORT = 9000;

// Wersje językowe — jak w src/i18n/index.ts: polski w korzeniu, pozostałe z prefiksem
const LOCALES = ['pl', 'en', 'de', 'lt', 'cs', 'sk'];
const DEFAULT_LOCALE = 'pl';
const urls = LOCALES.map(
  (code) => `http://localhost:${PORT}/${code === DEFAULT_LOCALE ? '' : `${code}/`}`,
);

const MIN_SCORE = 0.91;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `python3 -u -m http.server ${PORT} --bind 127.0.0.1 --directory dist`,
      startServerReadyPattern: 'Serving HTTP',
      url: urls,
      numberOfRuns: 3,
      settings: {
        // Domyślne ustawienia Lighthouse = urządzenie mobilne z ograniczeniem sieci i CPU
        formFactor: 'mobile',
        chromeFlags: process.env.LHCI_CHROME_FLAGS ?? '--headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: MIN_SCORE, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: MIN_SCORE, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['error', { minScore: MIN_SCORE, aggregationMethod: 'median-run' }],
        'categories:seo': ['error', { minScore: MIN_SCORE, aggregationMethod: 'median-run' }],
      },
    },
    upload: {
      // Raporty HTML/JSON zostają w artefakcie workflow (bez wysyłania na zewnętrzne serwery)
      target: 'filesystem',
      outputDir: '.lhci/raporty',
      reportFilenamePattern: 'lighthouse-%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
