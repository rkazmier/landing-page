# Wymagania

> Wersja robocza (Szkic) na podstawie wywiadu z właścicielem produktu z 2026-11-09. Pozycje `TODO(właściciel)` czekają na odpowiedź lub materiały. Priorytety: Must / Should / Could.
> Wymagania zależne od niezatwierdzonych decyzji są oznaczone odnośnikiem do ADR-u ze statusem „Propozycja".

## Wymagania funkcjonalne

### FR-1 — Wersje językowe (Must)
- **Opis:** Strona istnieje w 6 wersjach: polskiej (domyślnej), angielskiej, niemieckiej, litewskiej, czeskiej i słowackiej. Każda wersja ma własny adres ([ADR 0002](adr/0002-wersje-jezykowe.md)).
- **Kryteria akceptacji:**
  - [ ] Adresy: `/` (polski), `/en/`, `/de/`, `/lt/`, `/cs/`, `/sk/`
  - [ ] `<html lang>` odpowiada wersji; każda strona ma `link rel="alternate" hreflang` do wszystkich 6 wersji oraz `x-default` wskazujący wersję polską
  - [ ] Na każdej stronie jest przełącznik języka z nazwami: Polski, English, Deutsch, Lietuvių, Čeština, Slovenčina
  - [ ] Jeśli język przeglądarki (`navigator.languages`) jest wspierany i różni się od bieżącej wersji, pokazuje się baner z propozycją zmiany. **Bez** automatycznego przekierowania, bez wykrywania po IP
  - [ ] Zamknięcie banera jest pamiętane najwyżej do końca sesji (`sessionStorage`), bez ciasteczek
  - [ ] Wszystkie treści i teksty interfejsu (w tym `alt`, tytuły, opisy SEO) są przetłumaczone w każdej wersji; brak tekstów w niewłaściwym języku

### FR-2 — Opis obiektu i osi 1000 m (Must)
- **Opis:** Sekcja opisująca przeznaczenie strzelnicy i oś 1000 metrów.
- **Kryteria akceptacji:**
  - [ ] Sekcja z nagłówkiem `h2` jest obecna w każdej wersji językowej
  - [ ] Treść pochodzi od właściciela (`TODO(właściciel)`: opis, zdjęcia)

### FR-3 — Wspierane dyscypliny (Must)
- **Opis:** Lista rodzajów dyscyplin sportowych wspieranych na strzelnicy.
- **Kryteria akceptacji:**
  - [ ] Lista dyscyplin w każdej wersji językowej
  - [ ] `TODO(właściciel)`: lista dyscyplin

### FR-4 — Lokalizacja i dojazd (Must)
- **Opis:** Sekcja z lokalizacją, wskazaniem najlepszego dojazdu i statycznym obrazem mapy ([ADR 0004](adr/0004-mapa-statyczna.md)).
- **Kryteria akceptacji:**
  - [ ] Obraz mapy jest statyczny (bez `iframe` i zewnętrznych skryptów); cały obraz jest linkiem
  - [ ] Link prowadzi do `https://www.google.com/maps/dir/?api=1&destination=53.104351448019855,20.796570746344496` (punkt początkowy to bieżąca lokalizacja nawigującego)
  - [ ] Link ma `rel="noopener noreferrer"`; tekst alternatywny obrazu opisuje cel linku (np. „Nawiguj do Steel Valley Long Range w Mapach Google")
  - [ ] Adres i współrzędne są podane **tekstem** obok obrazu
  - [ ] Opis najlepszego dojazdu jest w każdej wersji językowej
  - [ ] `TODO(właściciel)`: adres pocztowy, opis dojazdu, źródło obrazu mapy

### FR-5 — Plan przedpola z danymi o celach (Must)
- **Opis:** Uproszczony plan strzelnicy z rozmieszczeniem celów metalowych, generowany z pliku `targets.json` ([ADR 0003](adr/0003-dane-celow-i-plan.md)).
- **Kryteria akceptacji:**
  - [ ] Dane o celach są w jednym pliku `targets.json` (tablica obiektów: `shape`, `distance_m`, `size_cm`, `offset_right_m`)
  - [ ] Plan (SVG) powstaje z tego pliku automatycznie, a nie jest rysowany ręcznie
  - [ ] Dodanie, usunięcie lub zmiana celu wymaga edycji wyłącznie `targets.json`
  - [ ] Te same dane są pokazane jako tabela HTML (dostępność, indeksowanie)
  - [ ] Kształt celu jest widoczny na planie; znaczniki mają czytelny minimalny rozmiar, a rzeczywiste wymiary są w tabeli i legendzie
  - [ ] Plan ma tekstowy opis alternatywny; informacje nie są przekazywane samym kolorem
  - [ ] CI waliduje strukturę pliku; błędny plik (brak pola, zły typ, wartość spoza zakresu) powoduje czerwone CI
  - [ ] Plan i tabela są widoczne bez włączonego JavaScriptu
  - [ ] `TODO(właściciel)`: potwierdzenie semantyki pól, dopuszczalne kształty, wymiary przedpola i wałów (zob. Otwarte pytania)

### FR-6 — Przejrzysty wydruk planu (Must)
- **Opis:** Odwiedzający może wydrukować plan przedpola wraz z tabelą celów.
- **Kryteria akceptacji:**
  - [ ] Przycisk „Drukuj plan" wywołuje okno drukowania; styl `@media print` ukrywa nawigację, baner i elementy zbędne
  - [ ] Podgląd wydruku w formacie A4 pokazuje plan i tabelę celów bez ucięć
  - [ ] Wydruk jest czytelny w czerni i bieli (kształty i oznaczenia, nie kolory)

### FR-7 — Baza hotelowa i atrakcje w pobliżu (Must)
- **Opis:** Sekcja z ogólnym opisem noclegów i atrakcji; struktura umożliwia późniejsze dodanie konkretnych pozycji i odnośników.
- **Kryteria akceptacji:**
  - [ ] W pierwszej wersji sekcja zawiera opis ogólny w każdej wersji językowej
  - [ ] Dodanie pozycji z nazwą, odległością i linkiem wymaga edycji wyłącznie pliku z treścią, bez zmian w kodzie
  - [ ] Linki zewnętrzne mają `rel="noopener noreferrer"`
  - [ ] `TODO(właściciel)`: opis ogólny

### FR-8 — Stopka (Must)
- **Opis:** Stopka z danymi wymaganymi prawem.
- **Kryteria akceptacji:**
  - [ ] `TODO(właściciel)`: zawartość stopki (dane firmy, polityka prywatności, dane kontaktowe) — odpowiedź w wywiadzie była niepełna
  - [ ] Zgodność wymogów prawnych (np. informacja o wydawcy dla odbiorców z Niemiec) potwierdzona z prawnikiem — nie jest poradą analityka

### FR-9 — Charakter informacyjny (Must)
- **Kryteria akceptacji:**
  - [ ] Brak formularzy, rezerwacji i logowania
  - [ ] Brak linków do sklepu, zawodów i wydarzeń (poza zakresem na tym etapie)

## Wymagania niefunkcjonalne

### NFR-1 — Wydajność (Must)
- [ ] Lighthouse (mobile) powyżej 90 w każdej z czterech kategorii, osobno dla każdej wersji językowej
- [ ] Brak zewnętrznych zasobów (fonty, skrypty, mapy); fonty hostowane lokalnie i w podzbiorze znaków
- [ ] Obrazy w nowoczesnych formatach, z wymiarami; `loading="lazy"` poniżej pierwszego ekranu
- [ ] Treść i plan nie wymagają JavaScriptu; JS tylko dla banera językowego i przycisku wydruku

### NFR-2 — SEO (Must)
- [ ] `title` i `meta description` w każdej wersji zgodnie z [seo-teksty.md](seo-teksty.md); polskie wartości dokładnie jak podał właściciel
- [ ] `canonical` budowany z jednej zmiennej adresu witryny (zmiana adresu na `steel-valley.pl` = zmiana w jednym miejscu)
- [ ] `hreflang` (FR-1), `sitemap.xml` z odpowiednikami językowymi, `robots.txt`, strona 404
- [ ] Dane strukturalne JSON-LD (np. `SportsActivityLocation`) ze współrzędnymi obiektu
- [ ] Open Graph i Twitter Cards w każdej wersji
- [ ] `meta keywords` z listy właściciela (Could; Google tego pola nie wykorzystuje)
- [ ] Jeden `h1` na stronę, poprawna hierarchia nagłówków
- **Uwaga:** pierwsze miejsce w wynikach wyszukiwania nie jest gwarantowane; wymaganie dotyczy podstaw technicznych i treści.

### NFR-3 — Dostępność (Must)
- [ ] Semantyczny HTML, poprawna hierarchia nagłówków
- [ ] Obrazy mają sensowny `alt` (pusty dla dekoracyjnych)
- [ ] Kontrast tekstu zgodny z WCAG AA
- [ ] Pełna obsługa klawiaturą, widoczny focus
- [ ] Informacje na planie nie są przekazywane samym kolorem

### NFR-4 — Responsywność (Must)
- [ ] Brak poziomego przewijania od 320 px do 1920 px
- [ ] Plan przedpola (proporcje ok. 1000 m długości do szerokości przedpola) czytelny na wąskim ekranie

### NFR-5 — Prywatność (Must)
- [ ] Brak analityki, ciasteczek i trackerów; z tego powodu nie jest potrzebny baner zgód ([ADR 0005](adr/0005-brak-analityki.md))
- [ ] Brak zasobów ładowanych z zewnętrznych domen

### NFR-6 — Utrzymywalność (Should)
- [ ] Teksty każdej wersji językowej w osobnych plikach, wspólna struktura strony
- [ ] Dane celów w jednym pliku; hotele i atrakcje w jednym pliku z treścią

## Otwarte pytania (do właściciela)
1. **Styl wizualny:** logo, kolory, klimat, jasny czy ciemny motyw, przykłady stron — brak odpowiedzi w wywiadzie.
2. **Stopka:** odpowiedź urwała się na „tak, stopka ni…". Co ma zawierać stopka (dane firmy, polityka prywatności, telefon/e-mail)?
3. **Dane celów:** (a) czy `distance_m` to odległość od linii strzału (oś y), a `offset_right_m` to odległość od prawego wału (oś x)? (b) jakie kształty (okrąg, kwadrat, prostokąt, sylwetka…)? (c) w jakich jednostkach i co oznacza `size_cm` dla kształtów nieokrągłych? (d) jaka jest szerokość przedpola i gdzie leżą wały (potrzebne do narysowania planu)?
4. **Mapa:** czy dostarczysz obraz, czy mamy go przygotować na podstawie OpenStreetMap (wymaga podania źródła „© autorzy OpenStreetMap")? Zrzut ekranu Map Google ma ograniczenia licencyjne.
5. **Adres pocztowy** obiektu.
6. **Generator stron (ADR 0001):** potwierdzenie wyboru Astro zamiast ręcznego HTML.
7. **Tłumaczenia:** weryfikacja wersji litewskiej, czeskiej i słowackiej przez osobę znającą te języki.
8. **Budżet i termin.**
