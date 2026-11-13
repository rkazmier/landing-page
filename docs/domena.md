# Domena steel-valley.pl — instrukcja dla właściciela (Z13)

Repozytorium jest już przygotowane: `site` = `https://steel-valley.pl`, `base` = `/` (`astro.config.mjs`), plik `public/CNAME` zawiera `steel-valley.pl`. Canonical, hreflang, `sitemap.xml`, `robots.txt` i dane strukturalne budują się z tej jednej konfiguracji.

Poniższe kroki wykonuje **właściciel** w GoDaddy i w ustawieniach GitHub. Dane według dokumentacji GitHub Pages (stan na listopad 2026) — przed startem warto zerknąć, czy adresy IP się nie zmieniły:
- https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

> **Ważne — kolejność.** Po scaleniu PR-a Z13 strona buduje się już dla `https://steel-valley.pl/`. Stary adres `rkazmier.github.io/landing-page/` przestaje wtedy poprawnie działać (style i linki wskazują katalog główny). Dlatego: **najpierw DNS (kroki 1–3), potem scalenie PR-a i od razu pole „Custom domain” (kroki 4–5)**.

> **Plik CNAME a GitHub Actions.** Strona publikuje się przez GitHub Actions (`deploy.yml`). W tym trybie GitHub **ignoruje** plik `CNAME` z repozytorium — domenę trzeba wpisać ręcznie w Settings → Pages (krok 5). Plik zostaje w repozytorium jako zapis docelowej domeny.

## 1. Weryfikacja domeny na koncie GitHub (ochrona przed przejęciem)

Weryfikacja sprawia, że nikt inny nie opublikuje na `steel-valley.pl` własnej strony z GitHub Pages. Robimy ją **przed** dodaniem rekordów A.

1. GitHub → zdjęcie profilu → **Settings** (ustawienia konta, nie repozytorium) → w menu **Pages** → **Add a domain**.
2. Wpisz `steel-valley.pl` → **Add domain**.
3. GitHub pokaże rekord TXT: nazwa w postaci `_github-pages-challenge-rkazmier.steel-valley.pl` i wartość (ciąg znaków do skopiowania).
4. W GoDaddy dodaj rekord (krok 2 opisuje, gdzie):
   | Typ | Nazwa (Host) | Wartość | TTL |
   |---|---|---|---|
   | TXT | `_github-pages-challenge-rkazmier` | wartość z GitHub | domyślny |

   GoDaddy sam dopisuje `.steel-valley.pl` — **nie** wpisuj pełnej nazwy, bo powstanie `…steel-valley.pl.steel-valley.pl`.
5. Po kilku–kilkunastu minutach wróć do GitHub i kliknij **Verify**. Rekordu TXT **nie usuwaj** — musi zostać, żeby domena pozostała zweryfikowana.

## 2. Rekordy DNS w GoDaddy

GoDaddy → **My Products** → przy `steel-valley.pl` **DNS** (Zarządzaj DNS).

**Najpierw usuń lub zmień kolidujące wpisy domyślne GoDaddy:**
- rekord **A** o nazwie `@` z wartością „Parked” (lub inną) — usuń,
- jeżeli włączone jest **przekierowanie (Forwarding)** domeny — wyłącz je,
- istniejący rekord **CNAME** `www` → `@` — zmień jego wartość (poniżej), nie dodawaj drugiego.

**Dodaj:**

| Typ | Nazwa (Host) | Wartość | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 1 godz. |
| A | `@` | `185.199.109.153` | 1 godz. |
| A | `@` | `185.199.110.153` | 1 godz. |
| A | `@` | `185.199.111.153` | 1 godz. |
| AAAA | `@` | `2606:50c0:8000::153` | 1 godz. |
| AAAA | `@` | `2606:50c0:8001::153` | 1 godz. |
| AAAA | `@` | `2606:50c0:8002::153` | 1 godz. |
| AAAA | `@` | `2606:50c0:8003::153` | 1 godz. |
| CNAME | `www` | `rkazmier.github.io` | 1 godz. |

Uwagi:
- Rekordy AAAA (IPv6) są zalecane, ale opcjonalne.
- `www` wskazuje na `rkazmier.github.io` (bez `/landing-page` i bez kropki na końcu, jeśli GoDaddy jej nie wymaga). **Nie** wskazuj `www` na `@` — wtedy GitHub nie wystawi certyfikatu HTTPS dla `www`.
- Rekordy poczty (MX, TXT SPF itp.), jeśli są, zostaw bez zmian.

## 3. Sprawdzenie DNS

Zmiany rozchodzą się zwykle w kilkanaście minut, czasem do 24 godzin. Sprawdzenie w terminalu (macOS/Linux):

```
dig steel-valley.pl +noall +answer -t A
dig steel-valley.pl +noall +answer -t AAAA
dig www.steel-valley.pl +noall +answer
```

Oczekiwany wynik: cztery adresy `185.199.108–111.153`, cztery `2606:50c0:800x::153`, a dla `www` — `CNAME rkazmier.github.io`. Bez terminala: https://dnschecker.org (typ A, domena `steel-valley.pl`).

## 4. Scalenie PR-a Z13

Scal PR „Z13: Podpięcie domeny steel-valley.pl”. Workflow `Deploy to GitHub Pages` opublikuje stronę zbudowaną dla nowej domeny (zakładka **Actions**, ok. 1–2 min).

## 5. Pole „Custom domain” w repozytorium

Od razu po wdrożeniu:

1. Repozytorium `rkazmier/landing-page` → **Settings** → **Pages**.
2. Sprawdź, że **Source** = **GitHub Actions**.
3. **Custom domain**: wpisz `steel-valley.pl` (bez `www`, bez `https://`) → **Save**.
4. GitHub uruchomi sprawdzenie DNS — powinno zakończyć się komunikatem „DNS check successful”.

Od tej chwili `rkazmier.github.io/landing-page/` przekierowuje na `https://steel-valley.pl/`, a `www.steel-valley.pl` — na `steel-valley.pl` (GitHub robi to automatycznie, gdy rekord `www` wskazuje na `rkazmier.github.io`).

## 6. HTTPS

1. Certyfikat (Let's Encrypt) GitHub wystawia sam — zwykle w kilkanaście minut, maksymalnie do 24 godzin. Do tego czasu pole **Enforce HTTPS** jest wyszarzone.
2. Gdy się odblokuje, zaznacz **Enforce HTTPS** — ruch `http://` będzie przekierowywany na `https://`.
3. Jeśli po 24 godzinach nadal nie ma certyfikatu: w Settings → Pages usuń domenę z pola **Custom domain**, zapisz, wpisz ją ponownie i zapisz — to wymusza ponowne wystawienie certyfikatu.

## 7. Sprawdzenie końcowe

- [ ] `https://steel-valley.pl/` otwiera stronę po polsku, kłódka w przeglądarce bez ostrzeżeń
- [ ] `https://steel-valley.pl/en/` (i pozostałe języki) działają, przełącznik języków działa
- [ ] `http://steel-valley.pl/` → przekierowanie na `https://`
- [ ] `https://www.steel-valley.pl/` → przekierowanie na `https://steel-valley.pl/`
- [ ] `https://rkazmier.github.io/landing-page/` → przekierowanie na `https://steel-valley.pl/`
- [ ] `https://steel-valley.pl/robots.txt` i `https://steel-valley.pl/sitemap.xml` zawierają adresy `steel-valley.pl`
- [ ] Nieistniejący adres (np. `/xyz`) pokazuje stronę 404 serwisu
- [ ] (opcjonalnie) Google Search Console: dodaj usługę `steel-valley.pl` (weryfikacja kolejnym rekordem TXT w GoDaddy) i zgłoś `https://steel-valley.pl/sitemap.xml`

## Najczęstsze problemy

| Objaw | Przyczyna i rozwiązanie |
|---|---|
| „Domain does not resolve to the GitHub Pages server” | DNS jeszcze się nie rozszedł albo został rekord „Parked” / przekierowanie GoDaddy — sprawdź krok 2 i 3 |
| Strona bez stylów, linki prowadzą do `/landing-page/…` | Wdrożona stara wersja — sprawdź, czy PR Z13 jest scalony i workflow Deploy zakończył się sukcesem |
| Strona działa na `rkazmier.github.io/landing-page/` bez stylów | PR scalony, ale domena nie jest jeszcze wpisana w Settings → Pages (krok 5) |
| Weryfikacja TXT nie przechodzi | Nazwa rekordu wpisana z pełną domeną (GoDaddy ją zdublował) — zostaw samo `_github-pages-challenge-rkazmier` |
| „Enforce HTTPS” długo wyszarzone | Odczekaj do 24 h; potem usuń i dodaj ponownie domenę (krok 6.3) |
