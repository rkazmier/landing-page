# Mapa dojazdu (ADR 0004)

Statyczna mapa w sekcji „Lokalizacja i dojazd” powstała **jednorazowo** z danych OpenStreetMap
(© autorzy OpenStreetMap, licencja ODbL). Strona nie pobiera kafelków ani danych OSM —
ani w trakcie budowania, ani podczas wyświetlania.

## Pliki

| Plik | Co to jest |
|---|---|
| `lines.txt` | drogi, cieki wodne (uproszczone) |
| `areas.txt` | lasy, wody, tereny zabudowane (uproszczone) |
| `render.py` | rysuje mapę jako SVG (projekcja równoodległościowa, napisy fontem Inter) |
| `../../src/assets/map/mapa-dojazdu-szeroka.webp` | wersja na szersze ekrany (1600×1000) |
| `../../src/assets/map/mapa-dojazdu-waska.webp` | wersja na telefony (1000×900, większe napisy) |

Dane pobrano 2026-11-10 z API OSM (`/api/0.6/map`) dla obszaru ok. 20.70–20.95° E, 53.05–53.16° N
i uproszczono algorytmem Douglasa–Peuckera. Format: `klasa[#nazwa/numer]:x,y;dx,dy;…`, gdzie
x, y to (lon − 20)·10⁵ i (lat − 53)·10⁵, a kolejne punkty są przyrostami.
Klasy: P droga krajowa, T/U/R drogi lokalne, K drogi gruntowe, V rzeka, W strumień, F las, A woda, Z zabudowa.

## Jak odświeżyć obraz

```sh
cd scripts/map
python3 render.py wide.svg 1600 1000 20.772 20.878 53.088 53.126 1.5 compact
python3 render.py narrow.svg 1000 900 20.779 20.869 53.090 53.122 1.75 compact
rsvg-convert wide.svg -o wide.png && rsvg-convert narrow.svg -o narrow.png
# konwersja do WebP, np. przez sharp (zależność Astro):
node -e "require('sharp')('wide.png').webp({quality:90}).toFile('../../src/assets/map/mapa-dojazdu-szeroka.webp')"
node -e "require('sharp')('narrow.png').webp({quality:90}).toFile('../../src/assets/map/mapa-dojazdu-waska.webp')"
```

Zaznaczony granatową linią dojazd: droga krajowa nr 57 → Łanięta → strzelnica.
