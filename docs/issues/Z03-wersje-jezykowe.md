# Z03: Wersje językowe: routing, teksty, przełącznik, hreflang, baner

**Wymagania:** FR-1, ADR 0002 · **Zależności:** Z01, Z02

## Cel
Sześć wersji językowych pod osobnymi adresami, z przełącznikiem i sugestią języka na podstawie przeglądarki.

## Kryteria akceptacji
- [ ] Adresy: `/` (pl), `/en/`, `/de/`, `/lt/`, `/cs/`, `/sk/`
- [ ] Teksty w `src/i18n/{pl,en,de,lt,cs,sk}.json`, wspólny układ strony
- [ ] `<html lang>` zgodny z wersją; `link rel="alternate" hreflang` do wszystkich 6 wersji oraz `x-default` na wersję polską
- [ ] Przełącznik języka z nazwami: Polski, English, Deutsch, Lietuvių, Čeština, Slovenčina
- [ ] Baner z propozycją zmiany języka na podstawie `navigator.languages`; bez przekierowania i bez wykrywania po IP; zamknięcie pamiętane w `sessionStorage` (strona działa poprawnie, gdy storage jest niedostępny)
- [ ] Teksty interfejsu (nawigacja, przyciski, baner) są przetłumaczone we wszystkich językach
- [ ] Skrypt w CI sprawdza, że każdy klucz tłumaczeń istnieje we wszystkich 6 plikach
- [ ] Strona działa bez JavaScriptu (poza banerem)

## Zakres
**W zakresie:** routing, pliki tłumaczeń, przełącznik, baner, hreflang.
**Poza zakresem:** treści sekcji (kolejne zadania).

## Uwagi
Polskie teksty od właściciela; pozostałe języki to tłumaczenia robocze (zob. `docs/seo-teksty.md`).
