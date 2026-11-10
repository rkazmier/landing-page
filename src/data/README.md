# Dane strony (`src/data/`)

Każdy plik `<nazwa>.json` ma obok schemat `<nazwa>.schema.json`. Poprawność sprawdza
`npm run validate:data` (uruchamiane w CI, plik `.github/workflows/ci.yml`).

| Plik | Zawartość |
|---|---|
| `targets.json` | cele metalowe na przedpolu (FR-5, ADR 0003) |
| `accommodation.json` | noclegi i atrakcje w pobliżu (FR-7) |

## `targets.json` — cele metalowe

> **Uwaga: obecne dane są PRZYKŁADOWE** (po jednym celu każdego kształtu, okrągłe wartości).
> Nie opisują prawdziwego rozmieszczenia celów. Właściwe dane dostarczy właściciel.

Tablica obiektów, jeden obiekt = jeden cel.

| Pole | Wymagane | Jednostka | Znaczenie |
|---|---|---|---|
| `label` | tak | — | oznaczenie na planie: jedna wielka litera A–Z i numer kolejnego celu z tą literą, np. `K1`, `A1`, `A2` |
| `shape` | tak | — | kształt: `square`, `circle`, `rhombus`, `rectangle`, `silhouette`, `bust`, `other` |
| `distance_m` | tak | metry | odległość od linii strzału (oś y), 0–1000 |
| `offset_right_m` | tak | metry | odległość od prawego wału (oś x, prawy wał = 0, lewy = 160), 0–160 |
| `size_cm` | tak | centymetry | rozmiar — liczba lub obiekt, zależnie od kształtu (tabela niżej) |
| `id` | nie | — | opcjonalny stały identyfikator (małe litery, cyfry, myślniki), unikalny |

### Rozmiar `size_cm`

| `shape` | Kształt | `size_cm` |
|---|---|---|
| `square` | kwadrat | liczba — bok |
| `circle` | koło | liczba — średnica |
| `rhombus` | romb | liczba — bok |
| `silhouette` | sylwetka | liczba — wysokość |
| `bust` | popiersie | liczba — wysokość |
| `rectangle` | prostokąt | `{ "width", "height" }` |
| `other` | inny | `{ "name", "width", "height" }` |

### Oznaczenia `label`

- Format: jedna litera alfabetu łacińskiego (A–Z, bez polskich znaków) + numer, np. `K1`.
- Numer mówi, który to kolejny cel z daną literą: dla tej samej litery numery rosną
  w kolejności występowania w pliku, od 1 i bez przerw (`A1`, `A2`, `A3`…).
  Walidator zgłasza błąd przy powtórzeniu, przeskoku lub złej kolejności.
- W danych przykładowych litera odpowiada kształtowi: K – kwadrat, O – koło, R – romb,
  P – prostokąt, S – sylwetka, B – popiersie (ang. *bust*), I – inny.
  To tylko konwencja przykładu; właściciel może przyjąć dowolne litery.

### Przykład

```json
[
  { "label": "K1", "shape": "square", "distance_m": 100, "offset_right_m": 20, "size_cm": 40 },
  { "label": "P1", "shape": "rectangle", "distance_m": 400, "offset_right_m": 80, "size_cm": { "width": 50, "height": 100 } }
]
```
