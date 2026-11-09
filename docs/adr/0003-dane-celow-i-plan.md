# ADR 0003: Dane o celach w `targets.json` i plan generowany z pliku

- **Status:** Przyjęta w części (format pliku, kształty i pomiary rozmiaru ustalił właściciel); do potwierdzenia: znaczenie osi x/y
- **Data:** 2026-11-09

## Kontekst
Plan przedpola z rozmieszczeniem celów metalowych ma być generowany z osobnego pliku danych, wyświetlany jako uproszczona grafika i dawać się przejrzyście wydrukować.

## Decyzja
- Plik `targets.json` zawiera **tablicę obiektów**, jeden na cel.
- Proponowane pola (do potwierdzenia):

| Pole | Znaczenie | Jednostka | Uwagi |
|---|---|---|---|
| `shape` | kształt celu | — | jedna z wartości z tabeli kształtów poniżej |
| `distance_m` | odległość od linii strzału (oś y) | metry | |
| `offset_right_m` | odległość od prawego wału (oś x) | metry | |
| `size_cm` | rozmiar | centymetry | liczba lub obiekt, zależnie od kształtu (tabela poniżej) |

- Opcjonalnie: `id` lub `label` do oznaczania celu na planie.
- Kształty i sposób zapisu rozmiaru (ustalone przez właściciela):

| `shape` | Kształt | `size_cm` | Znaczenie |
|---|---|---|---|
| `square` | kwadrat | liczba | długość boku |
| `circle` | koło | liczba | średnica |
| `rhombus` | romb | liczba | długość boku (właściciel napisał „rąb", przyjęto romb; rysowany jako kwadrat obrócony o 45°, o ile nie zdecyduje inaczej) |
| `rectangle` | prostokąt | obiekt `{ "width", "height" }` | szerokość i wysokość |
| `silhouette` | sylwetka | liczba | wysokość |
| `bust` | popiersie | liczba | wysokość |
| `other` | inny | obiekt `{ "name", "width", "height" }` | nazwa, szerokość i wysokość |

Przykład (wartości przykładowe):
```json
[
  { "shape": "circle", "distance_m": 300, "offset_right_m": 12.5, "size_cm": 60 },
  { "shape": "rectangle", "distance_m": 600, "offset_right_m": 4, "size_cm": { "width": 50, "height": 80 } }
]
```
- Plan jako SVG i tabela HTML są generowane w czasie budowania z tego samego pliku (zależnie od [ADR 0001](0001-generator-astro.md)).
- Struktura pliku jest walidowana schematem JSON w CI.
- Wydruk: przycisk i `@media print`, kształty i oznaczenia zamiast kolorów.

## Otwarte kwestie
Przedpole ma **160 m szerokości**, a **wały biegną po jego obwodzie** (decyzja właściciela). Przyjęto: prawy wał to x = 0, lewy x = 160 m, więc `offset_right_m` mieści się w zakresie 0–160 (walidowane w CI), a `distance_m` jest mierzone od linii strzału wzdłuż osi (do 1000 m).

Do potwierdzenia: czy `distance_m` rzeczywiście liczy się od linii strzału. Skala planu jest bardzo niesymetryczna (160 m szerokości wobec 1000 m długości), więc plan może używać innej skali w poziomie niż w pionie; do ustalenia przy projektowaniu.

## Konsekwencje
- Zmiana rozmieszczenia celów to zmiana jednego pliku, bez edycji kodu.
- Błędne dane zatrzymuje walidacja w CI.
