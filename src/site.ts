/**
 * Dane obiektu w jednym miejscu (adres, współrzędne, nawigacja).
 * Używane w sekcji „Lokalizacja i dojazd” (Z09); stopka (Z10) i dane strukturalne (Z11)
 * powinny korzystać z tych samych wartości.
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
} as const;

/** Link do nawigacji w Mapach Google (punkt startowy = bieżąca lokalizacja użytkownika) — ADR 0004 */
export const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.latitude},${site.geo.longitude}`;

/** Adres w formie tekstowej, zgodnie z dokumentacją: „Morawy Wielkie 06-316” */
export const addressText = `${site.address.locality} ${site.address.postalCode}`;

/** Współrzędne do wyświetlenia (6 miejsc po przecinku ≈ 0,1 m) */
export const coordinatesText = `${site.geo.latitude.toFixed(6)}° N, ${site.geo.longitude.toFixed(6)}° E`;
