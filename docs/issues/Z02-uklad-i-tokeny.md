# Z02: Układ strony, tokeny wizualne i fonty (mobile-first)

**Wymagania:** NFR-7, NFR-4, NFR-3, NFR-1 · **Zależności:** Z01

## Cel
Ustalić bazę wizualną: układ, zmienne stylów i charakter „premium" w jasnym motywie. Właściciel zatwierdza kierunek, zanim powstaną kolejne sekcje.

## Kryteria akceptacji
- [ ] Układ bazowy: nagłówek z logotypem tekstowym „Steel Valley Long Range", nawigacja kotwicowa po sekcjach, `main`, miejsce na stopkę
- [ ] Kolory, fonty, odstępy i promienie zdefiniowane jako zmienne (tokeny) w jednym pliku; podmiana logo i kolorów nie wymaga zmian w komponentach
- [ ] Style bazowe dla 320 px, rozszerzenia przez `min-width`
- [ ] Jasny motyw, charakter „premium" (spokojna paleta, dużo przestrzeni, wyraźna typografia)
- [ ] Fonty hostowane lokalnie, w podzbiorze znaków wystarczającym dla pl, en, de, lt, cs, sk; brak zasobów z zewnętrznych domen
- [ ] Elementy dotykowe mają co najmniej 44 × 44 px; widoczny focus; kontrast WCAG AA
- [ ] Brak poziomego przewijania od 320 do 1920 px
- [ ] W opisie PR zrzuty ekranu: mobile (375 px) i desktop (1280 px)

## Zakres
**W zakresie:** układ, tokeny, fonty, nawigacja.
**Poza zakresem:** treści sekcji, wersje językowe, logo graficzne (dostarczy właściciel).

## Uwagi
Bramka: właściciel zatwierdza kierunek wizualny na podstawie zrzutów, zanim ruszą Z04 i kolejne.
