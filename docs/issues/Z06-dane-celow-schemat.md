# Z06: Dane celów: plik targets.json, schemat i walidacja w CI

**Wymagania:** FR-5, ADR 0003 · **Zależności:** Z01

## Cel
Jedno źródło danych o celach metalowych z automatyczną walidacją.

## Kryteria akceptacji
- [ ] `src/data/targets.json`: tablica obiektów z wymaganymi polami `label`, `shape`, `distance_m`, `offset_right_m`, `size_cm` (oraz opcjonalnie `id`), z przykładowymi celami wszystkich 7 kształtów
- [ ] Schemat `src/data/targets.schema.json`: `shape` jedna z `square`, `circle`, `rhombus`, `rectangle`, `silhouette`, `bust`, `other`; `distance_m` 0–1000; `offset_right_m` 0–160; `size_cm` jako liczba (kwadrat: bok, koło: średnica, romb: bok, sylwetka i popiersie: wysokość) lub obiekt (`rectangle`: `width`, `height`; `other`: `name`, `width`, `height`); `label` wymagane, wzorzec `^[A-Z][1-9][0-9]*$`
- [ ] Numeracja `label` (ADR 0003): jedna wielka litera A–Z (bez polskich znaków) i numer; dla tej samej litery numery rosną od 1 bez przerw w kolejności występowania w pliku (`A1`, `A2`, `A3`…); powtórzenie, przeskok lub zła kolejność to błąd walidacji sprawdzany przez `scripts/validate-data.mjs`
- [ ] Polecenie `npm run validate:data` (alias `npm run check:data` zostaje) waliduje plik i jest uruchamiane w `ci.yml`
- [ ] Test negatywny opisany w PR: błędny plik (brak pola, w tym `label`, zły typ, `offset_right_m` = 200, powtórzony lub przeskoczony numer `label`, np. `A1`, `A3`) powoduje czerwone CI
- [ ] `src/data/README.md` opisuje pola, jednostki, format i numerację `label` oraz oznacza dane przykładowe jako przykładowe (konwencja liter w przykładzie: `K` kwadrat, `O` koło, `R` romb, `P` prostokąt, `S` sylwetka, `B` popiersie, `I` inny; litery dobiera właściciel dowolnie)

## Zakres
**W zakresie:** plik danych, schemat, walidacja.
**Poza zakresem:** rysowanie planu (Z07).

## Uwagi
Właściwe dane celów dostarczy właściciel; przykładowe wartości nie mogą wyglądać na prawdziwe.
