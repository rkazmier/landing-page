# ADR 0002: Wersje językowe pod osobnymi adresami

- **Status:** Przyjęta (decyzja właściciela z 2026-11-09)
- **Data:** 2026-11-09

## Kontekst
Odbiorcy pochodzą z całej Europy. Właściciel chce wersji: polskiej (domyślnej), angielskiej, niemieckiej, litewskiej, czeskiej i słowackiej, oraz dopasowania języka do odbiorcy.

## Rozważane opcje
1. **Wykrywanie kraju po IP i przekierowanie.** Niemożliwe bez backendu, a roboty wyszukiwarek łączą się zwykle z innych krajów i zobaczyłyby tylko jedną wersję. Szkodzi SEO.
2. **Jeden adres, język przełączany skryptem.** Wyszukiwarki indeksują jedną wersję.
3. **Osobne adresy dla języków + `hreflang` + baner sugestii** na podstawie języka przeglądarki.

## Decyzja
Opcja 3:
- polski pod `/`, pozostałe pod `/en/`, `/de/`, `/lt/`, `/cs/`, `/sk/`
- `hreflang` dla wszystkich wersji i `x-default` na polską
- baner „Czytaj w swoim języku" na podstawie `navigator.languages`, bez automatycznego przekierowania
- zamknięcie banera pamiętane w `sessionStorage` (bez ciasteczek)

## Konsekwencje
- Każda wersja jest indeksowana osobno i ma własne `title` i `description` ([seo-teksty.md](../seo-teksty.md)).
- Każda zmiana treści wymaga aktualizacji 6 plików tłumaczeń.
- Tłumaczenia lt, cs i sk wymagają weryfikacji przez osobę znającą język.
