# Proces pracy

## Role
- **Właściciel produktu (człowiek):** odpowiada na pytania analityka, zatwierdza dokumentację, scala PR-y.
- **Analityk:** wymagania, dokumentacja, architektura, Issues.
- **Implementator:** kod według Issue.
- **Recenzent:** przegląd PR względem kryteriów akceptacji.

## Przepływ
```
Wywiad → docs/ (Szkic) → ZATWIERDZENIE → Issues → Implementator (PR) → CI + Recenzent → Scalenie → Deploy
```

## Jak uruchamiać agentów (Claude Code)
Z katalogu repozytorium uruchom `claude`. Agenci z `.claude/agents/` są dostępni jako subagenty. Przykłady poleceń:

- `Użyj agenta analityk i przeprowadź ze mną wywiad, żeby wypełnić docs/.`
- `Użyj agenta analityk: rozbij zatwierdzone wymagania na Issues.`
- `Użyj agenta implementator do Issue #3.`
- `Użyj agenta recenzent do PR #7.`

Każdą rolę najlepiej uruchamiać w **osobnej sesji** (czysty kontekst, mniej pomyłek).

## Bramki jakości
1. Człowiek zatwierdza dokumentację przed implementacją.
2. `main` chroniony: scalanie tylko przez PR z zielonym CI.
3. Człowiek scala PR po przeglądzie.

## Zmiana zakresu w trakcie
Zmiana wymagań idzie zawsze przez analityka: aktualizuje `docs/`, a potem Issues. Implementator nie zmienia zakresu samodzielnie.
