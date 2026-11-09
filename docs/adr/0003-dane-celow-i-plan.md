# ADR 0003: Dane o celach w `targets.json` i plan generowany z pliku

- **Status:** Propozycja (format pliku wskazał właściciel; semantyka pól i sposób renderowania do potwierdzenia)
- **Data:** 2026-11-09

## Kontekst
Plan przedpola z rozmieszczeniem celów metalowych ma być generowany z osobnego pliku danych, wyświetlany jako uproszczona grafika i dawać się przejrzyście wydrukować.

## Decyzja
- Plik `targets.json` zawiera **tablicę obiektów**, jeden na cel.
- Proponowane pola (do potwierdzenia):

| Pole | Znaczenie | Jednostka | Uwagi |
|---|---|---|---|
| `shape` | kształt celu | — | wartości dopuszczalne do ustalenia (np. `circle`, `square`, `rectangle`, `silhouette`) |
| `distance_m` | odległość od linii strzału (oś y) | metry | |
| `offset_right_m` | odległość od prawego wału (oś x) | metry | |
| `size_cm` | rozmiar | centymetry | dla kształtów nieokrągłych do ustalenia (np. `[szerokość, wysokość]`) |

- Opcjonalnie: `id` lub `label` do oznaczania celu na planie.
- Plan jako SVG i tabela HTML są generowane w czasie budowania z tego samego pliku (zależnie od [ADR 0001](0001-generator-astro.md)).
- Struktura pliku jest walidowana schematem JSON w CI.
- Wydruk: przycisk i `@media print`, kształty i oznaczenia zamiast kolorów.

## Otwarte kwestie
Szerokość przedpola, położenie wałów i ewentualne inne elementy planu (stanowiska, linia strzału) — potrzebne do narysowania tła planu. Skala jest bardzo niesymetryczna (1000 m długości), więc plan może używać innej skali w poziomie niż w pionie; do ustalenia przy projektowaniu.

## Konsekwencje
- Zmiana rozmieszczenia celów to zmiana jednego pliku, bez edycji kodu.
- Błędne dane zatrzymuje walidacja w CI.
