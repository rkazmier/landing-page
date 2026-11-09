# Architektura

> Szkic domyślny; analityk potwierdza lub zmienia go ADR-em.

## Stack
- Czysty HTML, CSS i minimum JavaScript, bez kroku budowania
- Kod strony w katalogu `site/`
- Hosting: GitHub Pages, wdrożenie przez GitHub Actions
- Adres docelowy: `https://rkazmier.github.io/landing-page/`

## Struktura repozytorium
```
site/                  # to, co trafia na hosting
  index.html
  css/
  js/
  img/
docs/                  # dokumentacja (nie jest publikowana na stronie)
.github/
  workflows/ci.yml     # walidacja PR
  workflows/deploy.yml # publikacja po scaleniu do main
  ISSUE_TEMPLATE/
.claude/agents/        # definicje agentów
AGENTS.md              # zasady pracy
```

## Uwaga: ścieżki względne
Strona działa pod podkatalogiem `/landing-page/`, więc w HTML używaj ścieżek **względnych** (`css/style.css`), a nie absolutnych (`/css/style.css`). Przy własnej domenie zasada nadal działa.

## Wdrożenie
Scalenie PR do `main` uruchamia `deploy.yml`, który publikuje zawartość `site/`. Wymaga ustawienia **Settings → Pages → Source: GitHub Actions**.

## Elementy dynamiczne (statyczna strona nie ma backendu)
- Formularz kontaktowy: usługa zewnętrzna (np. Formspree, Web3Forms) lub link `mailto:`. Wybór zapisać w ADR.
- Analityka: tylko rozwiązanie przyjazne prywatności i za zgodą, w ADR.

## Kiedy zmienić stack
Jeśli strona rozrośnie się do wielu podstron i komponentów, rozważ Astro lub Vite. Decyzja wymaga ADR i dostosowania `deploy.yml` (krok budowania).
