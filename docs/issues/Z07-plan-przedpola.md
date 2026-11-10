# Z07: Plan przedpola jako SVG i tabela generowane z danych

**Wymagania:** FR-5, NFR-3, NFR-4, ADR 0003 · **Zależności:** Z02, Z03, Z06

## Cel
Uproszczony plan przedpola i tabela celów, generowane w czasie budowania z `targets.json`.

## Kryteria akceptacji
- [ ] Komponent renderuje SVG w czasie budowania (bez JavaScriptu w przeglądarce)
- [ ] Tło: przedpole o szerokości 160 m i długości do 1000 m, wał po całym obwodzie; prawy wał to x = 0, lewy x = 160 m
- [ ] Cel leży w miejscu `offset_right_m` (oś x, od prawego wału) i `distance_m` (oś y, od linii strzału)
- [ ] Siedem odrębnych znaczników kształtu (romb jako kwadrat obrócony o 45°) z czytelnym minimalnym rozmiarem; legenda
- [ ] Przy każdym znaczniku celu na planie SVG jest etykieta z jego `label` (np. `K1`) jako tekst SVG; etykieta nie zasłania innych etykiet ani znaczników, jest czytelna na ekranie 375 px i na wydruku w czerni i bieli (Z08)
- [ ] Skale pozioma i pionowa mogą się różnić; jest to zaznaczone przy planie
- [ ] Plan zorientowany tak, by pasował do wąskich ekranów (oś strzału w pionie); brak poziomego przewijania strony na 320 px
- [ ] Tabela HTML z tymi samymi danymi: pierwsza kolumna „Oznaczenie” (`label`), dalej kształt, odległość, położenie, rozmiar z jednostką; nagłówki przetłumaczone na 6 języków, wartość `label` bez tłumaczenia
- [ ] Opis alternatywny planu (`role="img"` z tytułem i opisem); informacje nie są przekazywane samym kolorem
- [ ] W opisie PR pokaż, że dodanie celu do JSON pojawia się na planie i w tabeli po buildzie bez zmian w kodzie

## Zakres
**W zakresie:** plan, legenda, tabela.
**Poza zakresem:** wydruk (Z08), właściwe dane celów.
