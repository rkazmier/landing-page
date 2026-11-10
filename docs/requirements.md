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
  - [ ] Obraz mapy powstał z danych OpenStreetMap i ma zaznaczony punkt obiektu; pod obrazem, tekstem HTML w danym języku, widnieje „© autorzy OpenStreetMap" z linkiem do https://www.openstreetmap.org/copyright
  - [ ] Obraz jest zapisany w repozytorium (AVIF/WebP), a kafelki OSM nie są pobierane w trakcie budowania ani wyświetlania strony
  - [ ] Opis najlepszego dojazdu jest w każdej wersji językowej
  - [ ] Adres pocztowy: Morawy Wielkie 06-316
  - [ ] Kadr mapy obejmuje obiekt oraz drogę dojazdową od strony wschodniej z czytelnie opisaną miejscowością Łanięta
  - [ ] `TODO(właściciel)`: opis najlepszego dojazdu (treść)

### FR-5 — Plan przedpola z danymi o celach (Must)
- **Opis:** Uproszczony plan strzelnicy z rozmieszczeniem celów metalowych, generowany z pliku `targets.json` ([ADR 0003](adr/0003-dane-celow-i-plan.md)).
- **Kryteria akceptacji:**
  - [ ] Dane o celach są w jednym pliku `targets.json` (tablica obiektów z wymaganymi polami `label`, `shape`, `distance_m`, `offset_right_m`, `size_cm` i opcjonalnym `id`; kształty, sposób zapisu rozmiaru i format `label` w ADR 0003)
  - [ ] Plan (SVG) powstaje z tego pliku automatycznie, a nie jest rysowany ręcznie
  - [ ] Tło planu: przedpole o szerokości 160 m, otoczone wałem po całym obwodzie; prawy wał to x = 0, lewy x = 160 m
  - [ ] Dodanie, usunięcie lub zmiana celu wymaga edycji wyłącznie `targets.json`
  - [ ] Te same dane są pokazane jako tabela HTML (dostępność, indeksowanie)
  - [ ] Każdy kształt (kwadrat, koło, romb, prostokąt, sylwetka, popiersie, inny) ma odrębny znacznik na planie i w legendzie; znaczniki mają czytelny minimalny rozmiar, a rzeczywiste wymiary są w tabeli
  - [ ] Plan ma tekstowy opis alternatywny; informacje nie są przekazywane samym kolorem
  - [ ] CI waliduje strukturę pliku; błędny plik (brak pola, zły typ, wartość spoza zakresu, w tym `offset_right_m` poza 0–160 m) powoduje czerwone CI
  - [ ] Każdy cel ma oznaczenie `label` zgodne z wzorcem `^[A-Z][1-9][0-9]*$` (np. `K1`, `A2`); dla tej samej litery numery rosną od 1 bez przerw w kolejności występowania w pliku; brak `label`, powtórzenie, przeskok lub zła kolejność numeru powoduje czerwone CI
  - [ ] Plan i tabela są widoczne bez włączonego JavaScriptu
  - [ ] Znaczenie osi (potwierdzone przez właściciela): `distance_m` = odległość od linii strzału (y), `offset_right_m` = odległość od prawego wału (x); romb rysowany jako kwadrat obrócony o 45°

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
- **Opis:** Rozbudowana stopka w formie osobnej sekcji na końcu każdej wersji językowej: kluczowe informacje, kontakt i mapa strony.
- **Kryteria akceptacji:**
  - [ ] Sekcja „kluczowe informacje": nazwa obiektu, adres (Morawy Wielkie 06-316), współrzędne, godziny otwarcia 9:00–18:00 codziennie (pon–nd), skrót oferty
  - [ ] Sekcja „kontakt": telefon +48 503 911 707 jako tekst i link `tel:+48503911707` (bez formularza); bez adresu e-mail (decyzja właściciela)
  - [ ] Sekcja „mapa strony": linki do wszystkich sekcji strony i do wszystkich 6 wersji językowych
  - [ ] Stopka jest dostępna z każdej strony i w każdej wersji językowej, w pełni przetłumaczona
  - [ ] Nazwa i dane firmy, polityka prywatności i informacja prawna zostaną dodane później (decyzja właściciela): stopka ma przygotowane na nie miejsce, a do czasu dostarczenia treści nie wyświetla pustych sekcji ani martwych linków
  - [ ] `TODO(właściciel, później)`: nazwa i dane firmy, polityka prywatności, informacja prawna
  - [ ] Zgodność wymogów prawnych (np. informacja o wydawcy dla odbiorców z Niemiec) potwierdzona z prawnikiem — nie jest poradą analityka

### FR-9 — Charakter informacyjny (Must)
- **Kryteria akceptacji:**
  - [ ] Brak formularzy, rezerwacji i logowania; dane kontaktowe występują wyłącznie jako tekst i link `tel:` w stopce
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
- [ ] Dane strukturalne JSON-LD (np. `SportsActivityLocation`) ze współrzędnymi, adresem, telefonem i godzinami otwarcia obiektu, zgodne z danymi w stopce
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

### NFR-4 — Responsywność i podejście mobile-first (Must)
- [ ] Style bazowe projektowane dla najmniejszego ekranu (320 px); większe ekrany obsługiwane przez media queries `min-width`
- [ ] Brak poziomego przewijania od 320 px do 1920 px
- [ ] Elementy dotykowe (linki, przyciski) mają co najmniej 44 × 44 px
- [ ] Plan przedpola (proporcje ok. 1000 m długości do szerokości przedpola) czytelny na wąskim ekranie

### NFR-5 — Prywatność (Must)
- [ ] Brak analityki, ciasteczek i trackerów; z tego powodu nie jest potrzebny baner zgód ([ADR 0005](adr/0005-brak-analityki.md))
- [ ] Brak zasobów ładowanych z zewnętrznych domen

### NFR-6 — Utrzymywalność (Should)
- [ ] Teksty każdej wersji językowej w osobnych plikach, wspólna struktura strony
- [ ] Dane celów w jednym pliku; hotele i atrakcje w jednym pliku z treścią

### NFR-7 — Wygląd (Must)
- [ ] Charakter „premium", jasny motyw; kierunek wizualny (makieta strony głównej w wersji mobile) zatwierdza właściciel przed wdrożeniem sekcji
- [ ] Kolory, fonty i logo zdefiniowane jako zmienne (tokeny) w jednym miejscu; podmiana logo i kolorów nie wymaga zmian w komponentach
- [ ] Do czasu dostarczenia logo używany jest logotyp tekstowy „Steel Valley Long Range"

## Rozstrzygnięte w wywiadzie
Astro ([ADR 0001](adr/0001-generator-astro.md)), wersje językowe ([ADR 0002](adr/0002-wersje-jezykowe.md)), kształty celów, osie planu i pomiar rozmiarów ([ADR 0003](adr/0003-dane-celow-i-plan.md)), mapa z OpenStreetMap i jej kadr ([ADR 0004](adr/0004-mapa-statyczna.md)), brak analityki ([ADR 0005](adr/0005-brak-analityki.md)), styl (premium, jasny motyw, mobile-first), przedpole 160 m z wałami po obwodzie, adres, telefon, godziny otwarcia, brak e-maila w stopce.

## Otwarte pytania (do właściciela)
Brak pytań blokujących zatwierdzenie dokumentacji.

## Treści do dostarczenia później (nie blokują zatwierdzenia)
Opis obiektu i dojazdu, zdjęcia, lista dyscyplin, plan strzelnicy, logo, opis noclegów i atrakcji, nazwa i dane firmy, polityka prywatności, informacja prawna.
