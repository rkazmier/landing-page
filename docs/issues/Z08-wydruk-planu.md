# Z08: Przejrzysty wydruk planu

**Wymagania:** FR-6 · **Zależności:** Z07

## Cel
Odwiedzający może wydrukować plan przedpola z tabelą celów.

## Kryteria akceptacji
- [ ] Przycisk „Drukuj plan" (przetłumaczony na 6 języków) wywołuje okno drukowania; to jedyny JavaScript tej funkcji
- [ ] `@media print` ukrywa nawigację, baner językowy, przyciski i stopkę
- [ ] Podgląd wydruku A4 pokazuje plan i tabelę celów bez ucięć elementów
- [ ] Wydruk jest czytelny w czerni i bieli (kształty i wzory wypełnień, nie kolory)
- [ ] W opisie PR PDF z drukarki do PDF dla wersji polskiej

## Zakres
**W zakresie:** styl wydruku i przycisk.
**Poza zakresem:** zmiany planu.
