# Z13: Podpięcie domeny steel-valley.pl (później)

**Wymagania:** ADR 0001, NFR-2 · **Zależności:** Z01, Z11

## Cel
Przełączyć stronę z `rkazmier.github.io/landing-page` na `steel-valley.pl`.

## Kryteria akceptacji
- [ ] Plik `public/CNAME` z `steel-valley.pl`
- [ ] Konfiguracja Astro: `site` = `https://steel-valley.pl`, `base` = `/`
- [ ] `docs/domena.md` z instrukcją dla właściciela: rekordy DNS w GoDaddy zgodnie z aktualną dokumentacją GitHub Pages, pole „Custom domain" w Settings → Pages, weryfikacja domeny, włączenie HTTPS, przekierowanie `www`
- [ ] Wszystkie `canonical`, `sitemap.xml`, `hreflang` i dane strukturalne wskazują nową domenę
- [ ] Brak na sztywno wpisanych adresów `github.io` w kodzie

## Zakres
**W zakresie:** zmiany w repozytorium i instrukcja.
**Poza zakresem:** czynności w GoDaddy i w ustawieniach repozytorium wykonuje właściciel.

## Uwagi
Wykonać dopiero po decyzji właściciela (domena była odłożona na później).
