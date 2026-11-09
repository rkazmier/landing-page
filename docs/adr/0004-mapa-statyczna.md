# ADR 0004: Mapa jako statyczny obraz z linkiem do nawigacji

- **Status:** Przyjęta (decyzja właściciela z 2026-11-09)
- **Data:** 2026-11-09

## Kontekst
Strona ma wskazywać lokalizację i najlepszy dojazd. Mapa osadzona (`iframe`) ładuje zewnętrzne skrypty, spowalnia stronę (Lighthouse) i może wymagać zgód.

## Decyzja
- Mapa to **statyczny obraz**; **cały obraz jest linkiem**, bez osobnego przycisku.
- Link: `https://www.google.com/maps/dir/?api=1&destination=53.104351448019855,20.796570746344496`. Bez parametru punktu początkowego Mapy Google użyją bieżącej lokalizacji osoby nawigującej (za jej zgodą w aplikacji lub przeglądarce).
- `rel="noopener noreferrer"`, tekst alternatywny opisuje cel linku, a adres i współrzędne są podane również tekstem.

## Otwarte kwestie
Źródło obrazu: **OpenStreetMap** (decyzja właściciela). Zrzut ekranu Map Google odpada ze względu na licencję. Zasady:
- obraz przygotowywany jednorazowo i zapisany w repozytorium (AVIF/WebP); kafelki OSM nie są pobierane w trakcie budowania ani wyświetlania strony (zasady użycia serwerów OSM)
- na obrazie zaznaczony punkt obiektu
- pod obrazem, jako tekst HTML w danym języku, „© autorzy OpenStreetMap" z linkiem do https://www.openstreetmap.org/copyright

Do ustalenia: kadr (sam obiekt czy też drogi dojazdowe od głównej trasy).

## Konsekwencje
- Brak zewnętrznych skryptów i ciasteczek, szybkie ładowanie.
- Obraz mapy jest tłumaczony tylko w tekście alternatywnym i opisie, nie w samej grafice (o ile nie zawiera napisów).
