# AGENTS.md — zasady pracy agentów w tym repozytorium

Projekt: **wielojęzyczna (pl, en, de, lt, cs, sk) statyczna strona typu landing page**, budowana w Astro (ADR 0001) i hostowana na GitHub Pages.
Właściciel produktu: **rkazmier** (człowiek). Agenci pracują wg poniższego procesu.

## Źródło prawdy

1. `docs/vision.md` — cel, odbiorcy, zakres
2. `docs/requirements.md` — wymagania i kryteria akceptacji
3. `docs/architecture.md` + `docs/adr/` — stack i decyzje techniczne
4. GitHub Issues — konkretne zadania (jedno zadanie = jeden Issue)

Jeśli kod jest sprzeczny z dokumentacją, wygrywa dokumentacja. Jeśli dokumentacja jest niejasna lub sprzeczna sama ze sobą — **zatrzymaj się i zadaj pytanie**, nie zgaduj.

## Role

| Rola | Plik | Co robi | Czego NIE robi |
|---|---|---|---|
| Analityk | `.claude/agents/analityk.md` | Wymagania, dokumentacja, architektura, rozbicie na Issues | Nie pisze kodu strony |
| Implementator | `.claude/agents/implementator.md` | Realizuje jedno Issue, pisze kod i testy, otwiera PR | Nie zmienia `docs/` bez zgody, nie scala PR, nie pushuje do `main` |
| Recenzent | `.claude/agents/recenzent.md` | Sprawdza PR względem kryteriów akceptacji | Nie poprawia kodu sam, tylko komentuje |

Człowiek: zatwierdza dokumentację (bramka przed implementacją), scala PR-y.

## Proces

1. Analityk przeprowadza wywiad i wypełnia `docs/`.
2. **Człowiek zatwierdza** dokumentację (w `docs/README.md` status zmienia się na `Zatwierdzone`).
3. Analityk rozbija wymagania na małe Issues (szablon: `.github/ISSUE_TEMPLATE/zadanie.md`), każde z kryteriami akceptacji.
4. Implementator bierze **jedno** Issue, pracuje na osobnej gałęzi, otwiera PR z `Closes #N`.
5. CI (`.github/workflows/ci.yml`) sprawdza PR automatycznie; Recenzent robi przegląd.
6. Człowiek scala PR do `main`; `deploy.yml` publikuje stronę.

Szczegóły: `docs/process.md`.

## Konwencje

- Gałęzie: `issue-<numer>-<krótki-opis>`, np. `issue-12-sekcja-hero`.
- Commity: krótkie, w trybie rozkazującym, po polsku lub angielsku, spójnie w całym repo.
- Jedno Issue = jeden PR. Bez „przy okazji" zmian spoza zakresu Issue.
- Kod strony leży w `src/` i `public/`. Poza nimi zmieniamy tylko dokumentację, konfigurację CI i narzędzia.- Dane w `src/data/` (`targets.json`, noclegi i atrakcje), teksty w `src/i18n/`. Każda nowa treść powstaje we wszystkich 6 językach.
- Dostępność (semantyczny HTML, kontrast, `alt`, nawigacja klawiaturą) i responsywność (mobile-first) są wymaganiem domyślnym.
- Bez zewnętrznych trackerów, fontów ani skryptów bez wpisu w `docs/adr/`.
- Żadnych sekretów, kluczy ani danych osobowych w repozytorium. To repo jest **publiczne**.

## Definicja „gotowe" (Definition of Done)

- [ ] Wszystkie kryteria akceptacji z Issue spełnione
- [ ] CI zielone (build, walidacja HTML i danych)
- [ ] Sprawdzone na szerokości mobile (~375 px) i desktop
- [ ] Brak zmian poza zakresem Issue
- [ ] Opis PR mówi, co i jak sprawdzono

## Zakazy dla wszystkich agentów

- Nie pushuj do `main`, nie scalaj PR-ów, nie zmieniaj ustawień repozytorium.
- Nie usuwaj historii (`push --force` na wspólnych gałęziach).
- Nie dodawaj zależności bez uzasadnienia w PR.
