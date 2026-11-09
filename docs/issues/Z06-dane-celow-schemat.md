# Z06: Dane celów: plik targets.json, schemat i walidacja w CI

**Wymagania:** FR-5, ADR 0003 · **Zależności:** Z01

## Cel
Jedno źródło danych o celach metalowych z automatyczną walidacją.

## Kryteria akceptacji
- [ ] `src/data/targets.json`: tablica obiektów z polami `shape`, `distance_m`, `offset_right_m`, `size_cm` (oraz opcjonalnie `id`/`label`), z przykładowymi celami wszystkich 7 kształtów
- [ ] Schemat `src/data/targets.schema.json`: `shape` jedna z `square`, `circle`, `rhombus`, `rectangle`, `silhouette`, `bust`, `other`; `distance_m` 0–1000; `offset_right_m` 0–160; `size_cm` jako liczba (kwadrat: bok, koło: średnica, romb: bok, sylwetka i popiersie: wysokość) lub obiekt (`rectangle`: `width`, `height`; `other`: `name`, `width`, `height`)
- [ ] Polecenie `npm run validate:data` waliduje plik i jest uruchamiane w `ci.yml`
- [ ] Test negatywny opisany w PR: błędny plik (brak pola, zły typ, `offset_right_m` = 200) powoduje czerwone CI
- [ ] `src/data/README.md` opisuje pola, jednostki i oznacza dane przykładowe jako przykładowe

## Zakres
**W zakresie:** plik danych, schemat, walidacja.
**Poza zakresem:** rysowanie planu (Z07).

## Uwagi
Właściwe dane celów dostarczy właściciel; przykładowe wartości nie mogą wyglądać na prawdziwe.
