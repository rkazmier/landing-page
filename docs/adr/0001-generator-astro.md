# ADR 0001: Generator stron statycznych (Astro) zamiast ręcznego HTML

- **Status:** Propozycja (czeka na potwierdzenie właściciela)
- **Data:** 2026-11-09

## Kontekst
Strona ma 6 wersji językowych, plan przedpola rysowany z pliku danych, wydruk, wysokie SEO i wynik Lighthouse powyżej 90. Hosting to GitHub Pages (tylko pliki statyczne).

## Rozważane opcje
1. **Czysty HTML/CSS/JS bez budowania.** Najprostszy start, ale 6 ręcznie synchronizowanych kopii stron, a plan musiałby być rysowany w przeglądarce (słabsze SEO, wydajność i wydruk).
2. **Eleventy.** Prosty generator, ale routing wielojęzyczny trzeba zbudować samemu.
3. **Astro.** Wbudowany routing językowy, domyślnie zero JavaScriptu po stronie klienta, komponenty (plan, tabela, nagłówek), oficjalna akcja wdrożenia na GitHub Pages.
4. **Next.js (eksport statyczny) lub inny framework z JS po stronie klienta.** Cięższe, gorsze dla celu „najszybsze ładowanie".

## Decyzja (propozycja)
Opcja 3, Astro. Polski w korzeniu (bez prefiksu), pozostałe języki z prefiksem. Plan SVG i tabela celów renderowane w czasie budowania. JavaScript tylko dla banera językowego i przycisku wydruku.

## Konsekwencje
- Do CI i wdrożenia potrzebny Node: zmiany w `ci.yml` (build, walidacja HTML katalogu wynikowego, walidacja `targets.json`) i `deploy.yml`.
- `AGENTS.md` i `architecture.md` trzeba zaktualizować (kod w `src/` zamiast `site/`) po akceptacji.
- Pierwsze zadanie dla implementatora: szkielet Astro + wdrożenie na Pages.
