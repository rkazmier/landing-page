/**
 * Geometria planu przedpola (FR-5, ADR 0003, Z07) — liczona w czasie budowania.
 *
 * Układ (jednostki viewBox SVG):
 * - oś strzału w pionie: linia otwarcia ognia na dole (distance_m = 0), 1000 m na górze,
 * - prawy wał po prawej (offset_right_m = 0), lewy wał po lewej (160 m) — tak, jak widzi strzelec,
 * - skale różne: 160 m szerokości zajmuje FIELD_W, 1000 m długości FIELD_H.
 * Znaczniki mają stały rozmiar (kształt, nie wielkość celu). Cele z tą samą literą `label` są rysowane
 * jako grupa: rząd znaczników z jedną literą po lewej (placeGroups).
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
const MARGIN = { top: 12, right: 6, bottom: 6, left: 46 };

export const MARKER = 14;
export const LABEL_FONT = 12;
const LABEL_CHAR_W = 7.4; // szerokość znaku przy LABEL_FONT (z zapasem, font pogrubiony)
const LABEL_GAP = 4;
const GROUP_GAP = 2; // odstęp między znacznikami w grupie

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

/** Litera oznaczenia celu (`K1` → `K`) — cele z tą samą literą tworzą grupę stojącą obok siebie. */
export const groupLetter = (label: string) => label.replace(/[0-9]+$/, '');

export interface PlacedGroup {
  letter: string;
  targets: (Target & { cx: number; cy: number })[];
  /** pozycja tekstu litery grupy (x, y linii bazowej), wyrównanie do prawej — litera stoi po lewej stronie grupy */
  lx: number;
  ly: number;
}

/**
 * Rozmieszcza grupy celów (decyzja właściciela z 2026-11-11).
 *
 * - Grupa = cele z tą samą literą `label`, w kolejności z pliku; stoją fizycznie obok siebie, więc mają
 *   wspólny dystans i położenie — oba czytane z pierwszego celu grupy.
 * - Znaczniki grupy stoją w rzędzie: pierwszy w miejscu pierwszego celu, kolejne na prawo od niego;
 *   litera grupy (raz) po lewej stronie rzędu.
 * - Rząd z literą mieści się w polu przedpola; gdy nachodzi na wcześniej ułożoną grupę albo obszar
 *   zarezerwowany, jest przesuwany w poziomie do najbliższego wolnego miejsca.
 * `reserved` — obszary już zajęte (np. napis linii otwarcia ognia).
 */
export function placeGroups(targets: Target[], reserved: Box[] = []): PlacedGroup[] {
  const groups = new Map<string, Target[]>();
  for (const t of targets) {
    const key = groupLetter(t.label);
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }

  const half = MARKER / 2 + 1;
  const step = MARKER + GROUP_GAP;
  const left = layout.fieldX;
  const right = layout.fieldX + FIELD_W;
  const taken: Box[] = [...reserved];

  return [...groups.entries()].map(([letter, members]) => {
    const first = members[0];
    const cy = yOf(first.distance_m);
    const letterW = letter.length * LABEL_CHAR_W;
    const lead = letterW + LABEL_GAP; // miejsce na literę przed pierwszym znacznikiem
    const rowW = (members.length - 1) * step + 2 * half;
    const boxAt = (firstCx: number): Box => ({ x: firstCx - half - lead, y: cy - half, w: lead + rowW, h: 2 * half });

    // Położenie z pierwszego celu, przycięte do pola
    const minCx = left + lead + half;
    const maxCx = right - rowW + half;
    const clamp = (v: number) => Math.min(maxCx, Math.max(minCx, v));
    const base = clamp(xOf(first.offset_right_m));

    const pad = 2;
    const free = (b: Box) =>
      !taken.some((o) => overlap({ x: b.x - pad, y: b.y - pad, w: b.w + 2 * pad, h: b.h + 2 * pad }, o));
    let cx = base;
    if (!free(boxAt(base))) {
      let best: number | undefined;
      for (let dx = 1; dx <= FIELD_W && best === undefined; dx += 1) {
        for (const c of [base + dx, base - dx]) {
          if (c >= minCx && c <= maxCx && free(boxAt(c))) {
            best = c;
            break;
          }
        }
      }
      cx = best ?? base;
    }
    taken.push(boxAt(cx));

    return {
      letter,
      targets: members.map((t, i) => ({ ...t, cx: cx + i * step, cy })),
      lx: cx - half - LABEL_GAP + 1,
      ly: cy + LABEL_FONT * 0.36,
    };
  });
}
