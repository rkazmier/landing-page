# Zadania (Issues) do utworzenia

Zadania wynikają z zatwierdzonej dokumentacji. Każde to jedno Issue = jeden PR. Pliki `Z*.md` mają tytuł w pierwszej linii i treść w reszcie.

| Kod | Zadanie | Zależności |
|---|---|---|
| Z01 | Szkielet Astro, build w CI i wdrożenie na Pages | — |
| Z02 | Układ strony, tokeny wizualne i fonty (**bramka: zatwierdzenie wyglądu**) | Z01 |
| Z03 | Wersje językowe: routing, teksty, przełącznik, hreflang, baner | Z01, Z02 |
| Z04 | Opis obiektu i dyscypliny | Z03 |
| Z05 | Noclegi i atrakcje | Z03 |
| Z06 | Dane celów: schemat i walidacja | Z01 |
| Z07 | Plan przedpola (SVG i tabela) | Z02, Z03, Z06 |
| Z08 | Wydruk planu | Z07 |
| Z09 | Lokalizacja i mapa OSM | Z03 |
| Z10 | Stopka | Z03 |
| Z11 | SEO | Z03, Z10 |
| Z12 | Lighthouse w CI i poprawki | Z04–Z11 |
| Z13 | Domena steel-valley.pl (później) | Z01, Z11 |

Kolejność: Z01 → Z02 → Z03, potem równolegle Z04, Z05, Z06, Z09, Z10, następnie Z07 → Z08, Z11, na końcu Z12. Z13 po decyzji właściciela.

## Tworzenie Issues
Na komputerze z zalogowanym `gh` (`gh auth login`), z katalogu repozytorium:

```
bash docs/issues/create-issues.sh
```

Skrypt tworzy 13 Issues i wypisuje ich adresy. Uruchom go **raz** (ponowne uruchomienie utworzy duplikaty). GitHub numeruje Issues i PR-y wspólnie, więc numery nie będą pokrywać się z kodami Z01–Z13; zależności w treści podano kodami. Po utworzeniu możesz usunąć katalog `docs/issues/` albo go zostawić jako archiwum.
