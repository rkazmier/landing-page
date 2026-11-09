# Z11: SEO: meta, canonical, sitemap, robots, 404, dane strukturalne

**Wymagania:** NFR-2 · **Zależności:** Z03, Z10

## Cel
Techniczne podstawy SEO w każdej wersji językowej.

## Kryteria akceptacji
- [ ] `title` i `meta description` dla każdej wersji zgodne z `docs/seo-teksty.md` (wersja polska dosłownie)
- [ ] `canonical` budowany z jednej zmiennej adresu witryny
- [ ] `sitemap.xml` z odpowiednikami językowymi i `robots.txt` wskazujący sitemap
- [ ] Strona 404 z linkami do wersji językowych
- [ ] JSON-LD (`SportsActivityLocation`) ze współrzędnymi, adresem (Morawy Wielkie 06-316), telefonem i godzinami otwarcia (codziennie 09:00–18:00), spójny ze stopką; dane pochodzą z jednego miejsca
- [ ] Open Graph i Twitter Cards w każdej wersji (obraz opcjonalny do czasu dostarczenia grafiki)
- [ ] `meta keywords` z listy w `docs/seo-teksty.md`
- [ ] Jeden `h1` na stronę; poprawna hierarchia nagłówków
- [ ] W opisie PR wynik walidacji JSON-LD i sitemap

## Zakres
**W zakresie:** tagi, pliki SEO, dane strukturalne.
**Poza zakresem:** treści i słowa kluczowe w tekstach (właściciel).
