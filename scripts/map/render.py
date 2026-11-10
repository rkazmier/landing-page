"""Render a static map (SVG) of the Steel Valley Long Range surroundings from OSM data.

Data: OpenStreetMap contributors (ODbL), extracted once via the OSM API (map call),
simplified, stored as delta-encoded text (lines.txt, areas.txt).
Usage: python3 render.py <out.svg> <width> <height> <W> <E> <S> <N> <label_scale>
"""
import math
import sys

SITE = (20.796570746344496, 53.104351448019855)

PLACES = {  # name: (lon, lat, weight)  — from OSM place=* nodes
    "Morawy Wielkie": (20.7933, 53.10719, 1),
    "Łanięta": (20.82888, 53.10577, 2),
    "Romany-Sebory": (20.86039, 53.10715, 1),
    "Łoje": (20.8015, 53.12432, 1),
    "Morawy-Śliwki": (20.80718, 53.11322, 0),
    "Romany-Janowięta": (20.86491, 53.09545, 0),
    "Rudno Jeziorowe": (20.75206, 53.11572, 0),
}


def decode(text):
    out = []
    for item in text.strip().split("|"):
        head, body = item.split(":", 1)
        cls, _, extra = head.partition("#")
        pts, x, y = [], 0, 0
        for i, pair in enumerate(body.split(";")):
            dx, dy = map(int, pair.split(","))
            x, y = (dx, dy) if i == 0 else (x + dx, y + dy)
            pts.append((20 + x / 1e5, 53 + y / 1e5))
        out.append((cls, extra, pts))
    return out


def main():
    out, w, h, W, E, S, N, ls = sys.argv[1:9]
    compact = len(sys.argv) > 9 and sys.argv[9] == "compact"
    w, h, W, E, S, N, ls = int(w), int(h), float(W), float(E), float(S), float(N), float(ls)
    lat0 = math.radians((S + N) / 2)
    kx = w / ((E - W) * math.cos(lat0))
    ky = h / (N - S)
    k = min(kx, ky)
    ox = (w - (E - W) * math.cos(lat0) * k) / 2
    oy = (h - (N - S) * k) / 2

    def P(lon, lat):
        return (ox + (lon - W) * math.cos(lat0) * k, oy + (N - lat) * k)

    def path(pts, close=False):
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in (P(*p) for p in pts))
        return d + (" Z" if close else "")

    lines = decode(open("lines.txt", encoding="utf-8").read())
    areas = decode(open("areas.txt", encoding="utf-8").read())
    s = w / 1600 * ls  # stroke/label scale

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">',
           f'<rect width="{w}" height="{h}" fill="#f2efe8"/>']
    fills = {"F": "#dfe6d5", "Z": "#ebe5da", "A": "#bcd5e4"}
    for cls in ("Z", "F", "A"):
        for c, _, pts in areas:
            if c == cls:
                svg.append(f'<path d="{path(pts, True)}" fill="{fills[cls]}"/>')

    def stroke(cls_set, color, width, extra=""):
        for c, _, pts in lines:
            if c in cls_set:
                svg.append(f'<path d="{path(pts)}" fill="none" stroke="{color}" stroke-width="{width:.2f}" '
                           f'stroke-linecap="round" stroke-linejoin="round" {extra}/>')

    stroke({"W"}, "#a9c8dc", 2.2 * s)
    stroke({"V"}, "#93bbd4", 4 * s)
    stroke({"K"}, "#c9c1b2", 2 * s, f'stroke-dasharray="{6*s:.1f} {5*s:.1f}"')
    # casings
    stroke({"R"}, "#c3baa9", 9 * s)
    stroke({"U", "T"}, "#b4aa97", 12 * s)
    stroke({"P"}, "#8a6a2c", 17 * s)
    stroke({"R"}, "#ffffff", 6 * s)
    stroke({"U", "T"}, "#ffffff", 8.5 * s)
    stroke({"P"}, "#e3b866", 13 * s)

    # recommended access from the east: DK57 -> Łanięta -> range
    access = [pts for c, _, pts in lines
              if c == "R" and pts[0] in [(20.85384, 53.10546), (20.82774, 53.10516)]]
    for pts in access:
        svg.append(f'<path d="{path(pts)}" fill="none" stroke="#23465d" stroke-width="{9*s:.2f}" '
                   f'stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>')
    # connector DK57 → start of access road
    a = P(20.85384, 53.10546); b = P(20.8537, 53.10771)
    svg.append(f'<path d="M{a[0]:.1f},{a[1]:.1f} L{b[0]:.1f},{b[1]:.1f}" stroke="#23465d" stroke-width="{9*s:.2f}" stroke-linecap="round"/>')

    font = "Inter, 'DejaVu Sans', sans-serif"

    def label(x, y, text, size, weight=600, color="#1a1d21", anchor="middle"):
        svg.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="{font}" font-size="{size:.1f}" font-weight="{weight}" '
                   f'text-anchor="{anchor}" fill="{color}" stroke="#f2efe8" stroke-width="{size*0.28:.1f}" '
                   f'stroke-linejoin="round" paint-order="stroke">{text}</text>')

    for name, (lon, lat, wgt) in PLACES.items():
        x, y = P(lon, lat)
        if not (0 < x < w and 0 < y < h):
            continue
        if compact and wgt == 0:
            continue
        if name == "Morawy Wielkie":
            if compact:
                x, y = P(*SITE)
                x += 30 * s; y += 80 * s
            else:
                y -= 44 * s  # keep clear of the marker
        if name == "Łanięta":
            y -= 14 * s
        if name == "Romany-Sebory" and compact:
            x -= 40 * s; y -= 12 * s
        size = {2: 38, 1: 27, 0: 21}[wgt] * s
        color = "#1a1d21" if wgt else "#51575e"
        label(x, y, name, size, 700 if wgt == 2 else 600, color)

    # DK57 shield
    for lon, lat in [(20.8556, 53.1150), (20.8545, 53.0960)]:
        x, y = P(lon, lat)
        if 0 < x < w and 0 < y < h:
            r = 19 * s
            svg.append(f'<rect x="{x-r*1.2:.1f}" y="{y-r*0.8:.1f}" width="{r*2.4:.1f}" height="{r*1.6:.1f}" rx="{r*0.3:.1f}" '
                       f'fill="#c0392b" stroke="#ffffff" stroke-width="{2.5*s:.1f}"/>')
            svg.append(f'<text x="{x:.1f}" y="{y+r*0.45:.1f}" font-family="{font}" font-size="{r*1.15:.1f}" font-weight="700" '
                       f'text-anchor="middle" fill="#ffffff">57</text>')

    # site marker (pin)
    x, y = P(*SITE)
    r = 22 * s
    svg.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r*2.2:.1f}" fill="#a57a2c" opacity="0.18"/>')
    svg.append(f'<path d="M{x:.1f},{y:.1f} c{-r*0.35:.1f},{-r*0.9:.1f} {-r*1.1:.1f},{-r*1.3:.1f} {-r*1.1:.1f},{-r*2.1:.1f} '
               f'a{r*1.1:.1f},{r*1.1:.1f} 0 1 1 {r*2.2:.1f},0 c0,{r*0.8:.1f} {-r*0.75:.1f},{r*1.2:.1f} {-r*1.1:.1f},{r*2.1:.1f} z" '
               f'fill="#1b2329" stroke="#ffffff" stroke-width="{3*s:.1f}"/>')
    svg.append(f'<circle cx="{x:.1f}" cy="{y-r*2.1:.1f}" r="{r*0.45:.1f}" fill="#e3b866"/>')
    if compact:
        label(x - r * 1.0, y - r * 3.5, "Steel Valley Long Range", 25 * s, 700, "#1b2329", "start")
    else:
        label(x + r * 1.6, y - r * 1.6, "Steel Valley Long Range", 27 * s, 700, "#1b2329", "start")

    svg.append("</svg>")
    open(out, "w", encoding="utf-8").write("\n".join(svg))


main()
