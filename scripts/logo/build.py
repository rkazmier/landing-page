"""
Generator plików logo Steel Valley (wariant C: stalowa tarcza „V" + krzyż w stylu SKMR3).

Wynik:
  src/assets/logo/*.svg      — wektorowe źródła do strony i innych materiałów
  public/favicon.svg         — favicon (jasny/ciemny motyw przeglądarki)
  public/favicon.ico         — fallback 16/32/48 px
  public/apple-touch-icon.png — 180 px

Uruchomienie (z katalogu repozytorium):
  pip install fonttools brotli
  python3 scripts/logo/build.py
Wymaga: rsvg-convert i ImageMagick (convert) do plików PNG/ICO.
Napisy w logo poziomym są zamieniane na krzywe z fontu Inter (public/fonts/),
więc pliki SVG nie zależą od zainstalowanych fontów.
"""
import pathlib
import subprocess
import tempfile

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
ASSETS = ROOT / "src/assets/logo"
PUBLIC = ROOT / "public"

# ---- Kolory ----
STEEL = "#AEB7BF"        # stal (znak podstawowy, na ciemne tło)
STEEL_DARK = "#7A848D"   # ciemniejsza stal (na jasne tło)
GRAPHITE = "#16191D"     # krzyż celowniczy / ciemne tło
RED = "#E0482E"          # kropka w środku (podświetlana siatka)
LIGHT_TEXT = "#EEF0F1"
LIGHT_MUTED = "#AEB7BF"
DARK_TEXT = "#1A1D21"
DARK_MUTED = "#51575E"

# ---- Geometria znaku (układ 200 × 240) ----
SHIELD = "M14 14H186V40Q174 144 100 232Q26 144 14 40Z"
VIEWBOX = "10 10 180 226"
RET_THIN = "M62 92H93M107 92H138M100 62V85M100 99V150"
RET_TICKS = "M80 86V98M120 86V98M94 72H106M94 112H106M94 132H106"
RET_POSTS = "M36 92H62M138 92H164M100 32V62M100 150V182"
# uproszczony krzyż do małych rozmiarów (favicon)
RET_SMALL = "M36 92H84M116 92H164M100 32V76M100 108V182"


def reticle(color, dot=True):
    out = (
        f'<g fill="none" stroke="{color}">'
        f'<path stroke-width="2.2" d="{RET_THIN}"/>'
        f'<path stroke-width="1.8" d="{RET_TICKS}"/>'
        f'<path stroke-width="6.5" d="{RET_POSTS}"/>'
        f"</g>"
    )
    if dot:
        out += f'<circle cx="100" cy="92" r="2.8" fill="{RED}"/>'
    return out


def mark_body(steel, reticle_color=GRAPHITE, dot=True):
    return f'<path fill="{steel}" d="{SHIELD}"/>' + reticle(reticle_color, dot)


def svg(viewbox, body, title, w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{size} role="img">'
        f"<title>{title}</title>{body}</svg>\n"
    )


# ---- Napisy jako krzywe ----
def text_path(font_file, text, size, tracking_em, x, baseline):
    """Zwraca (d, szerokość) napisu złożonego z konturów glifów."""
    font = TTFont(font_file)
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    upm = font["head"].unitsPerEm
    scale = size / upm
    pen = SVGPathPen(gs)
    cursor = 0.0
    last_adv = 0.0
    for ch in text:
        name = cmap[ord(ch)]
        adv = font["hmtx"][name][0]
        tp = TransformPen(pen, (scale, 0, 0, -scale, x + cursor, baseline))
        gs[name].draw(tp)
        last_adv = adv * scale
        cursor += last_adv + tracking_em * size
    width = cursor - tracking_em * size
    return pen.getCommands(), width


def cap_height(font_file, size):
    font = TTFont(font_file)
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    gs[font.getBestCmap()[ord("H")]].draw(bp)
    return bp.bounds[3] * size / font["head"].unitsPerEm


def lockup(steel, text, muted, title):
    display = PUBLIC / "fonts/inter-display-600.woff2"
    inter = PUBLIC / "fonts/inter-600.woff2"
    # znak: 180 × 226 jednostek, napisy obok
    x0 = 10 + 180 + 44
    size1, size2 = 92, 30
    ch1, ch2 = cap_height(display, size1), cap_height(inter, size2)
    gap = 26
    block = ch1 + gap + ch2
    top = 10 + (226 - block) / 2 - 8  # optyczne wyrównanie do górnej części tarczy
    d1, w1 = text_path(display, "STEEL VALLEY", size1, 0.02, x0, top + ch1)
    d2, w2 = text_path(inter, "LONG RANGE", size2, 0.42, x0, top + ch1 + gap + ch2)
    width = x0 + max(w1, w2) + 10
    body = (
        mark_body(steel)
        + f'<path fill="{text}" d="{d1}"/>'
        + f'<path fill="{muted}" d="{d2}"/>'
    )
    return svg(f"0 0 {width:.0f} 246", body, title)


def favicon():
    # kwadratowy kadr, uproszczony krzyż; kolor stali zależny od motywu przeglądarki
    style = (
        "<style>.s{fill:%s}.r{stroke:%s}"
        "@media (prefers-color-scheme:dark){.s{fill:%s}}</style>" % (STEEL_DARK, GRAPHITE, STEEL)
    )
    body = (
        style
        + f'<path class="s" d="{SHIELD}"/>'
        + f'<path class="r" fill="none" stroke-width="13" d="{RET_SMALL}"/>'
    )
    return svg("-9 14 218 218", body, "Steel Valley")


def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print("zapisano", path.relative_to(ROOT))


def main():
    write(ASSETS / "steel-valley-znak.svg",
          svg(VIEWBOX, mark_body(STEEL), "Steel Valley — znak (na ciemne tło)"))
    write(ASSETS / "steel-valley-znak-jasne-tlo.svg",
          svg(VIEWBOX, mark_body(STEEL_DARK), "Steel Valley — znak (na jasne tło)"))
    mono = (
        '<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="240">'
        f'<path fill="#fff" d="{SHIELD}"/>{reticle("#000", dot=False)}'
        '<circle cx="100" cy="92" r="2.8" fill="#000"/></mask></defs>'
        f'<path fill="#000" mask="url(#m)" d="{SHIELD}"/>'
    )
    write(ASSETS / "steel-valley-znak-mono.svg",
          svg(VIEWBOX, mono, "Steel Valley — znak jednokolorowy"))
    write(ASSETS / "steel-valley-logo-poziome-ciemne-tlo.svg",
          lockup(STEEL, LIGHT_TEXT, LIGHT_MUTED, "Steel Valley Long Range"))
    write(ASSETS / "steel-valley-logo-poziome-jasne-tlo.svg",
          lockup(STEEL_DARK, DARK_TEXT, DARK_MUTED, "Steel Valley Long Range"))
    fav = favicon()
    write(ASSETS / "favicon.svg", fav)
    write(PUBLIC / "favicon.svg", fav)

    # ---- Rastry ----
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        # favicon.ico: wersja na jasne tło (bez media query, której rsvg nie zna)
        flat = fav.replace("@media (prefers-color-scheme:dark){.s{fill:%s}}" % STEEL, "")
        (tmp / "fav.svg").write_text(flat)
        pngs = []
        for s in (16, 32, 48):
            p = tmp / f"f{s}.png"
            subprocess.run(["rsvg-convert", "-w", str(s), "-h", str(s), "-o", p, tmp / "fav.svg"], check=True)
            pngs.append(str(p))
        subprocess.run(["convert", *pngs, PUBLIC / "favicon.ico"], check=True)
        print("zapisano public/favicon.ico")
        # apple-touch-icon: znak na grafitowym tle
        touch = svg(
            "0 0 180 180",
            f'<rect width="180" height="180" fill="{GRAPHITE}"/>'
            f'<g transform="translate(26 12) scale(0.64)">{mark_body(STEEL)}</g>',
            "Steel Valley",
        )
        (tmp / "touch.svg").write_text(touch)
        subprocess.run(["rsvg-convert", "-w", "180", "-h", "180", "-o", PUBLIC / "apple-touch-icon.png", tmp / "touch.svg"], check=True)
        print("zapisano public/apple-touch-icon.png")


if __name__ == "__main__":
    main()
