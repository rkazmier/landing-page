# Z05: Sekcja: noclegi i atrakcje w pobliżu

**Wymagania:** FR-7 · **Zależności:** Z03

## Cel
Sekcja z opisem ogólnym oraz strukturą pozwalającą później dodać konkretne pozycje i linki bez zmian w kodzie.

## Kryteria akceptacji
- [ ] Opis ogólny w sześciu językach (tekst zastępczy oznaczony `TODO`)
- [ ] Plik `src/data/accommodation.json`: pozycje z nazwą, odległością, linkiem i opisem (w każdym języku); schemat JSON Schema walidowany w CI
- [ ] Gdy lista jest pusta, sekcja pokazuje tylko opis ogólny
- [ ] Dodanie pozycji wymaga edycji wyłącznie tego pliku
- [ ] Linki zewnętrzne mają `rel="noopener noreferrer"`
- [ ] W opisie PR pokaż działanie z jedną przykładową pozycją (przykład nie trafia do `main`)

## Zakres
**W zakresie:** komponent, plik danych, schemat.
**Poza zakresem:** właściwe pozycje i opisy (dostarczy właściciel).
