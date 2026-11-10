# ADR 0003: Dane o celach w `targets.json` i plan generowany z pliku

- **Status:** Przyjęta (decyzja właściciela z 2026-11-09)
- **Data:** 2026-11-09 (aktualizacja 2026-11-10: wymagane pole `label`, decyzja właściciela przy Z06, Issue #12)

## Kontekst
Plan przedpola z rozmieszczeniem celów metalowych ma być generowany z osobnego pliku danych, wyświetlany jako uproszczona grafika i dawać się przejrzyście wydrukować.

## Decyzja
- Plik `targets.json` zawiera **tablicę obiektów**, jeden na cel.
- Pola celu:

| Pole | Znaczenie | Jednostka | Uwagi |
|---|---|---|---|
| `label` | oznaczenie celu na planie i w tabeli | — | **wymagane**; format i numeracja niżej |
| `shape` | kształt celu | — | jedna z wartości z tabeli kształtów poniżej |
| `distance_m` | odległość od linii strzału (oś y) | metry | |
| `offset_right_m` | odległość od prawego wału (oś x) | metry | |
| `size_cm` | rozmiar | centymetry | liczba lub obiekt, zależnie od kształtu (tabela poniżej) |
| `id` | identyfikator techniczny | — | opcjonalne |

- Wszystkie pola poza `id` są wymagane.
- Oznaczenie `label` (decyzja właściciela z 2026-11-10):
  - format: jedna wielka litera alfabetu łacińskiego A–Z (bez polskich znaków) i numer kolejnego celu z tą literą, np. `K1`, `A1`, `A2`; wzorzec `^[A-Z][1-9][0-9]*$`;
  - dla tej samej litery numery rosną od 1 bez przerw, w kolejności występowania celów w pliku (`A1`, `A2`, `A3`…); litery mogą się przeplatać (np. `K1`, `O1`, `K2`);
  - powtórzenie oznaczenia, przeskok numeru (np. `A1`, `A3`) lub zła kolejność (np. `A2` przed `A1`) to błąd walidacji; reguły numeracji sprawdza `scripts/validate-data.mjs` (wzorzec może być też w schemacie JSON);
  - `label` jest pokazywane jako etykieta przy znaczniku celu na planie SVG (czytelna także na wydruku) i w kolumnie „Oznaczenie” tabeli HTML; wartość nie jest tłumaczona (decyzja właściciela z 2026-11-10);
  - litery dobiera właściciel dowolnie. W danych przykładowych przyjęto konwencję: `K` – kwadrat, `O` – koło, `R` – romb, `P` – prostokąt, `S` – sylwetka, `B` – popiersie, `I` – inny. To tylko konwencja przykładu, walidacja nie wiąże litery z `shape`.
- Kształty i sposób zapisu rozmiaru (ustalone przez właściciela):

| `shape` | Kształt | `size_cm` | Znaczenie |
|---|---|---|---|
| `square` | kwadrat | liczba | długość boku |
| `circle` | koło | liczba | średnica |
| `rhombus` | romb | liczba | długość boku (właściciel napisał „rąb", przyjęto romb; rysowany jako kwadrat obrócony o 45°, potwierdzone przez właściciela) |
| `rectangle` | prostokąt | obiekt `{ "width", "height" }` | szerokość i wysokość |
| `silhouette` | sylwetka | liczba | wysokość |
| `bust` | popiersie | liczba | wysokość |
| `other` | inny | obiekt `{ "name", "width", "height" }` | nazwa, szerokość i wysokość |

Przykład (wartości przykładowe):
```json
[
  { "label": "O1", "shape": "circle", "distance_m": 300, "offset_right_m": 12.5, "size_cm": 60 },
  { "label": "P1", "shape": "rectangle", "distance_m": 600, "offset_right_m": 4, "size_cm": { "width": 50, "height": 80 } },
  { "label": "O2", "shape": "circle", "distance_m": 800, "offset_right_m": 40, "size_cm": 45 }
]
```
- Plan jako SVG i tabela HTML są generowane w czasie budowania z tego samego pliku (zależnie od [ADR 0001](0001-generator-astro.md)).
- Struktura pliku jest walidowana schematem JSON w CI, a reguły numeracji `label` skryptem `scripts/validate-data.mjs`; polecenie `npm run validate:data` (alias `npm run check:data`).
- Wydruk: przycisk i `@media print`, kształty i oznaczenia zamiast kolorów.

## Otwarte kwestie
Przedpole ma **160 m szerokości**, a **wały biegną po jego obwodzie** (decyzja właściciela). Przyjęto: prawy wał to x = 0, lewy x = 160 m, więc `offset_right_m` mieści się w zakresie 0–160 (walidowane w CI), a `distance_m` jest mierzone od linii strzału wzdłuż osi (do 1000 m).

Znaczenie osi potwierdził właściciel (odległość od linii strzału oraz od prawego wału). Skala planu jest bardzo niesymetryczna (160 m szerokości wobec 1000 m długości), więc plan może używać innej skali w poziomie niż w pionie; do ustalenia przy projektowaniu.

## Konsekwencje
- Zmiana rozmieszczenia celów to zmiana jednego pliku, bez edycji kodu.
- Błędne dane (w tym błędna numeracja `label`) zatrzymuje walidacja w CI.
- Dodając cel w środku pliku, trzeba przenumerować kolejne cele z tą samą literą, bo numeracja wynika z kolejności w pliku.
