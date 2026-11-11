# Z12: Lighthouse w CI oraz poprawki wydajności i dostępności

**Wymagania:** NFR-1, NFR-3, NFR-5 · **Zależności:** Z04–Z11

## Cel
Pilnować, by wynik Lighthouse pozostawał powyżej 90 w każdej wersji językowej.

## Kryteria akceptacji
- [ ] Workflow uruchamia Lighthouse (mobile) dla każdej z 6 wersji na zbudowanej stronie
- [ ] Próg powyżej 90 w czterech kategoriach (Performance, Accessibility, Best Practices, SEO); spadek poniżej progu daje czerwone CI
- [ ] Automatyczna kontrola, że zbudowane HTML i CSS nie ładują zasobów z zewnętrznych domen (poza zwykłymi linkami `<a>`)
- [ ] JavaScript tylko dla banera językowego, przycisku wydruku, menu na telefonie i zamykania listy języków (NFR-1)
- [ ] Poprawione problemy znalezione przez audyt
- [ ] W opisie PR raport z wynikami dla 6 wersji

## Zakres
**W zakresie:** workflow, kontrole, poprawki.
**Poza zakresem:** nowe funkcje.

## Uwagi
Dodanie narzędzia (np. Lighthouse CI) uzasadnij w opisie PR.
