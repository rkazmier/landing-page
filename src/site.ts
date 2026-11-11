/**
 * Dane obiektu w jednym miejscu (adres, współrzędne, telefon, godziny otwarcia, nawigacja).
 * Używane w sekcji „Lokalizacja i dojazd” (Z09), w stopce (Z10) i w danych strukturalnych JSON-LD (Z11, src/seo.ts).
 */
export const site = {
  address: {
    locality: 'Morawy Wielkie',
    postalCode: '06-316',
    country: 'PL',
  },
  geo: {
    latitude: 53.104351448019855,
    longitude: 20.796570746344496,
  },
  /** Telefon: zapis do wyświetlenia i format E.164 do linku tel: */
  phone: {
    display: '+48 503 911 707',
    e164: '+48503911707',
  },
  /** Godziny otwarcia: codziennie (pon–nd) */
  openingHours: {
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    opens: '09:00',
    closes: '18:00',
  },
} as const;

/** Link tel: do telefonu obiektu */
export const phoneHref = `tel:${site.phone.e164}`;

/** Godzina do wyświetlenia bez zera wiodącego: „09:00” → „9:00” */
export const displayTime = (time: string) => time.replace(/^0(\d)/, '$1');

/** Link do nawigacji w Mapach Google (punkt startowy = bieżąca lokalizacja użytkownika) — ADR 0004 */
export const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.latitude},${site.geo.longitude}`;

/** Adres w formie tekstowej, zgodnie z dokumentacją: „Morawy Wielkie 06-316” */
export const addressText = `${site.address.locality} ${site.address.postalCode}`;

/** Współrzędne do wyświetlenia (6 miejsc po przecinku ≈ 0,1 m) */
export const coordinatesText = `${site.geo.latitude.toFixed(6)}° N, ${site.geo.longitude.toFixed(6)}° E`;
