/**
 * Geometria planu przedpola (FR-5, ADR 0003, Z07) — liczona w czasie budowania.
 *
 * Układ (jednostki viewBox SVG):
 * - oś strzału w pionie: linia strzału na dole (distance_m = 0), 1000 m na górze,
 * - prawy wał po prawej (offset_right_m = 0), lewy wał po lewej (160 m) — tak, jak widzi strzelec,
 * - skale różne: 160 m szerokości zajmuje FIELD_W, 1000 m długości FIELD_H (opis przy planie).
 * Znaczniki mają stały rozmiar (kształt, nie wielkość celu). Etykiety `label` są układane tak,
 * by nie nachodziły na inne etykiety ani znaczniki (pierwsze wolne miejsce z listy kandydatów).
 */

export type Shape = 'square' | 'circle' | 'rhombus' | 'rectangle' | 'silhouette' | 'bust' | 'other';

export interface Target {
  label: string;
  shape: Shape;
  distance_m: number;
  offset_right_m: number;
  size_cm: number | { width: number; height: number; name?: string };
  id?: string;
}

export const SHAPES: Shape[] = ['square', 'circle', 'rhombus', 'rectangle', 'silhouette', 'bust', 'other'];

export const RANGE_WIDTH_M = 160;
export const RANGE_LENGTH_M = 1000;

const FIELD_W = 200;
const FIELD_H = 560;
const BERM = 14;
const MARGIN = { top: 12, right: 6, bottom: 46, left: 46 };

export const MARKER = 14;
export const LABEL_FONT = 12;
const LABEL_CHAR_W = 7.4; // szerokość znaku przy LABEL_FONT (z zapasem, font pogrubiony)
const LABEL_GAP = 4;

export const layout = {
  fieldX: MARGIN.left + BERM,
  fieldY: MARGIN.top + BERM,
  fieldW: FIELD_W,
  fieldH: FIELD_H,
  berm: BERM,
  width: MARGIN.left + BERM + FIELD_W + BERM + MARGIN.right,
  height: MARGIN.top + BERM + FIELD_H + BERM + MARGIN.bottom,
};

/** Ile razy skala pozioma jest większa od pionowej */
export const scaleRatio = FIELD_W / RANGE_WIDTH_M / (FIELD_H / RANGE_LENGTH_M);

export const xOf = (offsetRight: number) => layout.fieldX + FIELD_W - (offsetRight / RANGE_WIDTH_M) * FIELD_W;
export const yOf = (distance: number) => layout.fieldY + FIELD_H - (distance / RANGE_LENGTH_M) * FIELD_H;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const overlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const overlapArea = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

export interface PlacedTarget extends Target {
  cx: number;
  cy: number;
  /** pozycja tekstu etykiety (x, y linii bazowej) i wyrównanie */
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
}

/**
 * Rozmieszcza cele i ich etykiety. `reserved` — obszary już zajęte (np. napis „Linia strzału”).
 */
export function placeTargets(targets: Target[], reserved: Box[] = []): PlacedTarget[] {
  const half = MARKER / 2 + 1;
  const markers: Box[] = targets.map((t) => ({
    x: xOf(t.offset_right_m) - half,
    y: yOf(t.distance_m) - half,
    w: 2 * half,
    h: 2 * half,
  }));
  // Etykiety mieszczą się w polu przedpola (nie wchodzą na wał ani jego opisy)
  const bounds: Box = { x: layout.fieldX, y: layout.fieldY, w: FIELD_W, h: FIELD_H };
  const taken: Box[] = [...reserved];

  return targets.map((t, i) => {
    const cx = xOf(t.offset_right_m);
    const cy = yOf(t.distance_m);
    const w = t.label.length * LABEL_CHAR_W;
    const h = LABEL_FONT;
    const d = MARKER / 2 + LABEL_GAP;
    const candidates = [
      { box: { x: cx + d, y: cy - h / 2, w, h }, lx: cx + d, ly: cy + h * 0.36, anchor: 'start' as const },
      { box: { x: cx - d - w, y: cy - h / 2, w, h }, lx: cx - d, ly: cy + h * 0.36, anchor: 'end' as const },
      { box: { x: cx - w / 2, y: cy - d - h, w, h }, lx: cx, ly: cy - d - h * 0.14, anchor: 'middle' as const },
      { box: { x: cx - w / 2, y: cy + d, w, h }, lx: cx, ly: cy + d + h * 0.86, anchor: 'middle' as const },
      { box: { x: cx + d, y: cy - d - h, w, h }, lx: cx + d, ly: cy - d - h * 0.14, anchor: 'start' as const },
      { box: { x: cx - d - w, y: cy - d - h, w, h }, lx: cx - d, ly: cy - d - h * 0.14, anchor: 'end' as const },
      { box: { x: cx + d, y: cy + d, w, h }, lx: cx + d, ly: cy + d + h * 0.86, anchor: 'start' as const },
      { box: { x: cx - d - w, y: cy + d, w, h }, lx: cx - d, ly: cy + d + h * 0.86, anchor: 'end' as const },
    ];

    const inside = (b: Box) =>
      b.x >= bounds.x && b.y >= bounds.y && b.x + b.w <= bounds.x + bounds.w && b.y + b.h <= bounds.y + bounds.h;
    const others = markers.filter((_, j) => j !== i);
    const cost = (b: Box) =>
      (inside(b) ? 0 : 1e6) + [...taken, ...others].reduce((sum, o) => sum + (overlap(b, o) ? overlapArea(b, o) : 0), 0);

    const best = candidates.reduce((a, b) => (cost(b.box) < cost(a.box) ? b : a));
    taken.push(best.box);
    return { ...t, cx, cy, lx: best.lx, ly: best.ly, anchor: best.anchor };
  });
}
