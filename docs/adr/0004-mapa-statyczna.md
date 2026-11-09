# ADR 0004: Mapa jako statyczny obraz z linkiem do nawigacji

- **Status:** Przyjęta (decyzja właściciela z 2026-11-09); źródło obrazu do ustalenia
- **Data:** 2026-11-09

## Kontekst
Strona ma wskazywać lokalizację i najlepszy dojazd. Mapa osadzona (`iframe`) ładuje zewnętrzne skrypty, spowalnia stronę (Lighthouse) i może wymagać zgód.

## Decyzja
- Mapa to **statyczny obraz**; **cały obraz jest linkiem**, bez osobnego przycisku.
- Link: `https://www.google.com/maps/dir/?api=1&destination=53.104351448019855,20.796570746344496`. Bez parametru punktu początkowego Mapy Google użyją bieżącej lokalizacji osoby nawigującej (za jej zgodą w aplikacji lub przeglądarce).
- `rel="noopener noreferrer"`, tekst alternatywny opisuje cel linku, a adres i współrzędne są podane również tekstem.

## Otwarte kwestie
Źródło obrazu. Zrzut ekranu Map Google ma ograniczenia licencyjne. Opcje: obraz dostarczony przez właściciela albo przygotowany na podstawie OpenStreetMap z podaniem „© autorzy OpenStreetMap".

## Konsekwencje
- Brak zewnętrznych skryptów i ciasteczek, szybkie ładowanie.
- Obraz mapy jest tłumaczony tylko w tekście alternatywnym i opisie, nie w samej grafice (o ile nie zawiera napisów).
