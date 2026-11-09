# Z01: Szkielet Astro, build w CI i wdrożenie na Pages

**Wymagania:** ADR 0001, NFR-1 · **Zależności:** brak

## Cel
Zastąpić stronę zastępczą szkieletem Astro i sprawdzić cały łańcuch: PR → CI → scalenie → wdrożenie na GitHub Pages.

## Kryteria akceptacji
- [ ] `npm run build` tworzy katalog `dist/` bez błędów
- [ ] Struktura katalogów zgodna z `docs/architecture.md` (`src/pages`, `src/components`, `src/i18n`, `src/data`, `src/styles`, `public`)
- [ ] Adres witryny (`site`) i ścieżka bazowa (`base`) pochodzą z jednej konfiguracji; domyślnie `https://rkazmier.github.io` i `/landing-page`
- [ ] Strona zastępcza `site/` jest usunięta
- [ ] `ci.yml` na PR: instalacja, build i walidacja HTML katalogu `dist/` (`html-validate`, konfiguracja `.htmlvalidate.json`)
- [ ] `deploy.yml` po scaleniu do `main`: build i publikacja `dist/` na Pages
- [ ] Po scaleniu strona otwiera się pod `https://rkazmier.github.io/landing-page/`
- [ ] Strona startowa nie ładuje JavaScriptu po stronie klienta
- [ ] `AGENTS.md` nie wymaga zmian (jeśli wymaga, opisz w PR dlaczego)

## Zakres
**W zakresie:** szkielet projektu, konfiguracja, workflowy.
**Poza zakresem:** treści, style, wersje językowe.

## Uwagi
Właściciel musi mieć włączone **Settings → Pages → Source: GitHub Actions**. Dodanie zależności (Astro, walidator) uzasadnij w opisie PR.
