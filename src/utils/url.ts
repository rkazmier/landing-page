/**
 * Buduje adres wewnętrzny z uwzględnieniem ścieżki bazowej (`base` w astro.config.mjs).
 * Linków wewnętrznych nie zapisujemy na sztywno (docs/architecture.md).
 */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}
