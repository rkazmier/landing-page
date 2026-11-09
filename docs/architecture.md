# Architektura

> Wersja robocza do zatwierdzenia. Decyzje i ich status: zob. ADR-y.

## Stack
- **Astro** ([ADR 0001](adr/0001-generator-astro.md), przyjęty): generator stron statycznych; wynik budowania to zwykłe pliki HTML/CSS z minimalnym JavaScriptem
- Hosting: GitHub Pages, wdrożenie przez GitHub Actions (krok budowania przed publikacją)
- Adres obecny: `https://rkazmier.github.io/landing-page/`
- Adres docelowy: `https://steel-valley.pl/` (domena w GoDaddy, konfiguracja później)

## Dlaczego nie czysty HTML
Sześć wersji językowych oznaczałoby sześć ręcznie utrzymywanych kopii, a plan przedpola rysowany z pliku danych musiałby powstawać w przeglądarce (JavaScript), co pogarsza SEO, wydajność i wydruk. Generator rysuje plan i tabelę w czasie budowania.

## Struktura repozytorium
```
src/
  pages/               # strony; polski w korzeniu, pozostałe języki w /en, /de, /lt, /cs, /sk
  components/          # nagłówek, stopka, sekcje, plan przedpola, baner językowy
  i18n/                # teksty: pl.json, en.json, de.json, lt.json, cs.json, sk.json
  data/
    targets.json       # cele metalowe (ADR 0003)
    accommodation.json # baza hotelowa i atrakcje (do rozbudowy)
  styles/
public/                # obrazy, fonty, robots.txt, favicon
docs/                  # dokumentacja (nie jest publikowana)
.github/workflows/     # ci.yml (build + walidacja), deploy.yml (publikacja)
```
Zasady agentów (`AGENTS.md`, `.claude/agents/`) wskazują `src/` i `public/`. Do czasu pierwszego zadania (szkielet Astro) w repozytorium leży jeszcze strona zastępcza w `site/` i workflowy do niej dopasowane; to zadanie je zastępuje.

## Wersje językowe
Szczegóły w [ADR 0002](adr/0002-wersje-jezykowe.md): osobne adresy, polski bez prefiksu, `hreflang`, baner sugestii na podstawie języka przeglądarki, bez przekierowań.

## Dane i plan przedpola
Szczegóły w [ADR 0003](adr/0003-dane-celow-i-plan.md): `targets.json` → walidacja schematem w CI → w czasie budowania powstaje SVG planu i tabela HTML. Wydruk przez `@media print`.

## Mapa
Statyczny obraz jako link do nawigacji w Mapach Google ([ADR 0004](adr/0004-mapa-statyczna.md)).

## Adres witryny i ścieżka bazowa
Adres witryny i ścieżka bazowa pochodzą z jednej konfiguracji (`site` i `base`). Do czasu podpięcia domeny `base` to `/landing-page`, po podpięciu `steel-valley.pl` zmienia się na `/`. Linki wewnętrzne buduje się z tej konfiguracji, nigdy na sztywno.

## Wdrożenie
Scalenie PR do `main` uruchamia `deploy.yml`: instalacja zależności, budowanie, publikacja katalogu wynikowego na Pages. Wymaga **Settings → Pages → Source: GitHub Actions**. Podpięcie domeny własnej: wpisy DNS w GoDaddy i pole „Custom domain" w ustawieniach Pages (osobne zadanie, później).

## Budżet wydajności
Strona ma uzyskać powyżej 90 w Lighthouse (mobile) w każdej wersji językowej. Dlatego: brak zewnętrznych zasobów, lokalne fonty w podzbiorze, obrazy AVIF/WebP z wymiarami, minimum JavaScriptu.

## Elementy, których nie ma
- Brak backendu, formularzy i rezerwacji (strona informacyjna)
- Brak analityki i ciasteczek ([ADR 0005](adr/0005-brak-analityki.md))
