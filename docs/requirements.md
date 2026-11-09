# Wymagania

> Każde wymaganie ma numer i **sprawdzalne** kryterium akceptacji. Szablon do wypełnienia przez analityka.

## Wymagania funkcjonalne

### FR-1 — Przykład: sekcja hero
- **Opis:** Strona zaczyna się sekcją z nagłówkiem, krótkim opisem i przyciskiem CTA.
- **Kryteria akceptacji:**
  - [ ] Nagłówek `h1` jest jedyny na stronie
  - [ ] Przycisk CTA widoczny bez przewijania na szerokości 375 px i 1280 px
  - [ ] Przycisk prowadzi do: TODO
- **Priorytet:** Must

*(Usuń przykład i dodaj właściwe wymagania: sekcje, formularz/kontakt, nawigacja, stopka, wersje językowe...)*

## Wymagania niefunkcjonalne

### NFR-1 — Responsywność
- [ ] Brak poziomego przewijania od 320 px do 1920 px

### NFR-2 — Dostępność
- [ ] Semantyczny HTML, poprawna hierarchia nagłówków
- [ ] Wszystkie obrazy mają sensowny `alt` (lub pusty dla dekoracyjnych)
- [ ] Kontrast tekstu zgodny z WCAG AA
- [ ] Pełna obsługa klawiaturą, widoczny focus

### NFR-3 — Wydajność
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 90
- [ ] Obrazy w nowoczesnych formatach, z wymiarami i `loading="lazy"` poniżej pierwszego ekranu

### NFR-4 — SEO i udostępnianie
- [ ] `title`, `meta description`, `canonical`, tagi Open Graph
- [ ] `robots.txt`, `sitemap.xml`, `lang` na elemencie `html`

### NFR-5 — Prywatność
- [ ] Brak trackerów bez zgody; jeśli analityka — opisana w ADR i w polityce prywatności

## Otwarte pytania
- TODO
