# ADR 0005: Brak analityki i ciasteczek

- **Status:** Przyjęta (decyzja właściciela z 2026-11-09)
- **Data:** 2026-11-09

## Kontekst
Właściciel zdecydował, że strona nie ma analityki ruchu.

## Decyzja
- Brak narzędzi analitycznych, ciasteczek i trackerów.
- Brak zasobów ładowanych z zewnętrznych domen (fonty, skrypty, mapy).
- Z tego powodu strona nie potrzebuje banera zgód na ciasteczka.

## Konsekwencje
- Prostsza zgodność z przepisami o prywatności i szybsze ładowanie.
- Brak danych o ruchu. Pozycje w wynikach wyszukiwania można w przyszłości obserwować w darmowym narzędziu wyszukiwarki (weryfikacja własności przez DNS nie wpływa na odwiedzających); do decyzji razem z konfiguracją domeny.
- Treść polityki prywatności i stopki — zob. FR-8 w [requirements.md](../requirements.md).
