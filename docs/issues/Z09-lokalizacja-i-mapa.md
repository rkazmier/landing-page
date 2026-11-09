# Z09: Lokalizacja i dojazd z mapą OpenStreetMap

**Wymagania:** FR-4, ADR 0004 · **Zależności:** Z03

## Cel
Sekcja lokalizacji ze statycznym obrazem mapy jako linkiem do nawigacji.

## Kryteria akceptacji
- [ ] Obraz mapy z OpenStreetMap przygotowany jednorazowo (np. eksport z openstreetmap.org); kafelki OSM nie są pobierane w trakcie budowania ani wyświetlania strony
- [ ] Kadr: obiekt (53.104351448019855, 20.796570746344496) oraz droga dojazdowa od strony wschodniej z czytelnie opisaną miejscowością Łanięta; zaznaczony punkt obiektu
- [ ] Obraz zapisany w repozytorium (AVIF/WebP) z podanymi wymiarami
- [ ] Cały obraz jest linkiem do `https://www.google.com/maps/dir/?api=1&destination=53.104351448019855,20.796570746344496` z `rel="noopener noreferrer"`
- [ ] `alt` opisuje cel linku, w 6 językach
- [ ] Pod obrazem, tekstem HTML w danym języku: „© autorzy OpenStreetMap" z linkiem do https://www.openstreetmap.org/copyright
- [ ] Adres Morawy Wielkie 06-316 i współrzędne podane tekstem
- [ ] Miejsce na opis najlepszego dojazdu (tekst zastępczy oznaczony `TODO`)
- [ ] Brak `iframe` i zewnętrznych skryptów

## Zakres
**W zakresie:** sekcja, obraz, link, atrybucja.
**Poza zakresem:** właściwy opis dojazdu (dostarczy właściciel).

## Uwagi
Jeśli nie możesz pobrać obrazu z OSM, zgłoś to w Issue i poproś właściciela o eksport. Nie używaj zrzutu z Map Google (licencja).
