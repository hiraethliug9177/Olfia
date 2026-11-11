"""
Olfia quiz archetypes — sixteen original characters (Claude, 2026-11-10, for Tiffany).

Big-head, short-body proportions with soft shading, each standing in a room corner whose walls take
the colour of the archetype's scent family; pose and the object in hand show the personality.
Run:  python3 scripts/archetypes.py   ->  public/assets/archetypes/<code>.svg  (+ a contact sheet)

Since 11/10 the site uses Tiffany's own figures (scripts/cutout_characters.py). Until she supplies the two
that are still missing, those two are drawn here without the room ("bare": figure and a neutral shadow):
      python3 scripts/archetypes.py --bare --only INFJ,ENFJ
"""
from __future__ import annotations

import math
import os
import sys

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "archetypes")

FAMILY = {
    "floral": "#C98A8A", "gourmand": "#D4A26A", "spicy": "#B4552E", "woody": "#8A5A33",
    "green": "#7C8A4A", "citrus": "#E2A23B", "fresh": "#8FB5B8",
}


def mix(a: str, b: str, t: float) -> str:
    """Blend hex a toward hex b by t (0..1)."""
    a, b = a.lstrip("#"), b.lstrip("#")
    ca = [int(a[i:i + 2], 16) for i in (0, 2, 4)]
    cb = [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(ca, cb))


def shade(c: str, t: float) -> str:
    return mix(c, "#000000", t)


def tint(c: str, t: float) -> str:
    return mix(c, "#FFFFFF", t)


# ---------------------------------------------------------------- the room corner

def room(fam: str, uid: str) -> str:
    base = FAMILY[fam]
    wall_l = mix(tint(base, 0.62), "#F3EEE6", 0.25)
    wall_r = shade(wall_l, 0.07)
    board = "#8A5E3E"
    floor_a, floor_b = "#7B5236", "#6A4530"
    planks = []
    for i in range(-6, 14):
        x0 = 30 * i
        planks.append(f'<path d="M{x0} {372 - x0 * 0.136:.1f} L{x0 * 1.5 - 120:.1f} 480" />')
    return f"""
  <defs>
    <linearGradient id="wl-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{tint(wall_l, 0.12)}"/><stop offset="1" stop-color="{wall_l}"/></linearGradient>
    <linearGradient id="wr-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{shade(wall_r, 0.06)}"/><stop offset="1" stop-color="{wall_r}"/></linearGradient>
    <linearGradient id="fl-{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{floor_b}"/><stop offset="1" stop-color="{floor_a}"/></linearGradient>
    <radialGradient id="sh-{uid}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="400" height="480" fill="{wall_l}"/>
  <path d="M0 0 H250 V338 L0 372 Z" fill="url(#wl-{uid})"/>
  <path d="M250 0 H400 V360 L250 338 Z" fill="url(#wr-{uid})"/>
  <path d="M250 0 V338" stroke="{shade(wall_r, 0.12)}" stroke-width="2" opacity="0.5"/>
  <path d="M0 372 L250 338 L400 360 V480 H0 Z" fill="url(#fl-{uid})"/>
  <g stroke="#000" stroke-opacity="0.13" stroke-width="2" fill="none">{''.join(planks)}</g>
  <path d="M0 372 L250 338 L250 322 L0 355 Z" fill="{board}"/>
  <path d="M250 338 L400 360 L400 343 L250 322 Z" fill="{shade(board, 0.12)}"/>
  <path d="M0 355 L250 322 L400 343" stroke="#B88A64" stroke-width="2" fill="none" opacity="0.7"/>
  <ellipse cx="200" cy="446" rx="78" ry="14" fill="url(#sh-{uid})"/>"""


# ---------------------------------------------------------------- hair styles (back layer, front layer)

def hair_back(style: str, c: str) -> str:
    d = shade(c, 0.12)
    if style == "long":
        return f'<path d="M104 170 Q96 250 116 330 Q150 352 200 350 Q250 352 284 330 Q304 250 296 170 Z" fill="{d}"/>'
    if style == "wavy":
        return f'<path d="M102 168 Q88 230 106 290 Q96 320 122 336 Q160 352 200 348 Q240 352 278 336 Q304 320 294 290 Q312 230 298 168 Z" fill="{d}"/>'
    if style == "bob":
        return f'<path d="M100 168 Q98 236 118 262 Q160 274 200 272 Q240 274 282 262 Q302 236 300 168 Z" fill="{d}"/>'
    if style == "braids":
        return (f'<path d="M106 170 Q102 220 112 248 L288 248 Q298 220 294 170 Z" fill="{d}"/>'
                + "".join(f'<ellipse cx="{x}" cy="{y}" rx="13" ry="15" fill="{c}"/>' for x in (116, 284) for y in (262, 286, 310))
                + f'<circle cx="116" cy="330" r="7" fill="#C98A8A"/><circle cx="284" cy="330" r="7" fill="#C98A8A"/>')
    if style == "puffs":
        return (f'<circle cx="106" cy="104" r="38" fill="{c}"/><circle cx="294" cy="104" r="38" fill="{c}"/>'
                f'<circle cx="94" cy="96" r="18" fill="{tint(c, 0.12)}" opacity="0.6"/>')
    if style == "ponytail":
        return f'<path d="M262 96 Q330 92 324 170 Q318 236 286 258 Q302 200 290 150 Z" fill="{d}"/>'
    if style == "bun":
        return f'<circle cx="200" cy="66" r="34" fill="{c}"/><circle cx="190" cy="56" r="12" fill="{tint(c, 0.15)}" opacity="0.6"/>'
    return ""


def hair_front(style: str, c: str) -> str:
    hi = tint(c, 0.18)
    if style in ("long", "wavy", "bob", "braids", "bun"):
        part = f'<path d="M100 176 Q92 90 200 72 Q308 90 300 176 Q286 128 244 112 Q222 140 186 134 Q156 128 146 118 Q110 140 100 176 Z" fill="{c}"/>'
        return part + f'<path d="M150 92 Q190 76 236 86" stroke="{hi}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.7"/>'
    if style == "curly":
        bumps = "".join(f'<circle cx="{200 + 104 * math.cos(a):.1f}" cy="{150 + 82 * math.sin(a):.1f}" r="26" fill="{c}"/>'
                        for a in [math.pi * (0.95 + i * 0.1) for i in range(12)])
        return bumps + f'<path d="M110 160 Q120 98 200 90 Q280 98 290 160 Q260 130 200 128 Q140 130 110 160 Z" fill="{c}"/>'
    if style == "puffs":
        return f'<path d="M104 168 Q98 92 200 78 Q302 92 296 168 Q282 122 200 116 Q118 122 104 168 Z" fill="{c}"/>'
    if style == "crop":
        return (f'<path d="M102 160 Q96 84 200 74 Q304 84 298 160 Q290 122 262 110 Q234 124 200 118 Q164 124 140 110 Q110 122 102 160 Z" fill="{c}"/>'
                f'<path d="M156 92 Q196 80 240 90" stroke="{hi}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>')
    if style == "sidepart":
        return (f'<path d="M100 172 Q94 86 196 72 Q306 82 300 170 Q292 126 270 112 Q210 112 168 146 Q142 158 120 150 Q108 158 100 172 Z" fill="{c}"/>'
                f'<path d="M190 82 Q236 82 270 98" stroke="{hi}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6"/>')
    if style == "spiky":
        return (f'<path d="M100 166 L104 112 L122 120 L126 84 L152 100 L166 66 L190 92 L206 60 L224 90 L246 66 L256 100 L282 84 L280 120 L298 112 L300 166 Q276 126 200 120 Q124 126 100 166 Z" fill="{c}"/>')
    if style == "messy":
        return (f'<path d="M100 170 Q90 96 150 80 Q170 62 204 70 Q246 60 270 86 Q312 104 300 170 Q290 140 268 132 L262 150 Q246 126 222 130 L214 148 Q196 124 176 134 L168 116 Q140 130 134 150 Q118 140 100 170 Z" fill="{c}"/>')
    if style == "ponytail":
        return (f'<path d="M100 170 Q94 88 200 74 Q306 88 300 170 Q290 120 250 108 Q200 112 160 108 Q112 122 100 170 Z" fill="{c}"/>'
                f'<circle cx="268" cy="98" r="9" fill="#E7B49F"/>')
    return ""


# ---------------------------------------------------------------- hats

def hat(kind: str, c: str) -> str:
    if kind == "beret":
        return (f'<ellipse cx="190" cy="84" rx="104" ry="40" fill="{c}" transform="rotate(-8 190 84)"/>'
                f'<ellipse cx="174" cy="70" rx="56" ry="16" fill="{tint(c, 0.25)}" opacity="0.5" transform="rotate(-8 174 70)"/>'
                f'<path d="M188 46 q4 -14 12 -12" stroke="{shade(c, 0.15)}" stroke-width="6" stroke-linecap="round" fill="none"/>')
    if kind == "beanie":
        return (f'<path d="M98 140 Q100 52 200 48 Q300 52 302 140 Z" fill="{c}"/>'
                f'<rect x="94" y="122" width="212" height="34" rx="16" fill="{shade(c, 0.12)}"/>'
                + "".join(f'<path d="M{x} 126 V152" stroke="{shade(c, 0.25)}" stroke-width="3" opacity="0.5"/>' for x in range(110, 300, 14))
                + f'<circle cx="200" cy="44" r="16" fill="{tint(c, 0.3)}"/>')
    if kind == "bucket":
        return (f'<path d="M122 120 Q126 58 200 56 Q274 58 278 120 Z" fill="{c}"/>'
                f'<path d="M86 134 Q200 104 314 134 Q300 150 200 140 Q100 150 86 134 Z" fill="{shade(c, 0.1)}"/>'
                f'<path d="M124 112 Q200 98 276 112" stroke="{shade(c, 0.25)}" stroke-width="5" fill="none"/>')
    return ""


# ---------------------------------------------------------------- face

def face(expr: str, eye: str = "#3A2A26", look: int = 0) -> str:
    blush = '<ellipse cx="146" cy="206" rx="15" ry="8" fill="#F29C93" opacity="0.5"/><ellipse cx="254" cy="206" rx="15" ry="8" fill="#F29C93" opacity="0.5"/>'
    lx, rx_ = 166 + look, 234 + look
    if expr in ("happy", "content"):
        eyes = (f'<path d="M{lx - 11} 186 Q{lx} 172 {lx + 11} 186" stroke="{eye}" stroke-width="5" stroke-linecap="round" fill="none"/>'
                f'<path d="M{rx_ - 11} 186 Q{rx_} 172 {rx_ + 11} 186" stroke="{eye}" stroke-width="5" stroke-linecap="round" fill="none"/>')
    elif expr == "wink":
        eyes = (f'<ellipse cx="{lx}" cy="182" rx="8.5" ry="12" fill="{eye}"/><circle cx="{lx + 3}" cy="176" r="3.2" fill="#fff"/>'
                f'<path d="M{rx_ - 11} 184 Q{rx_} 174 {rx_ + 11} 184" stroke="{eye}" stroke-width="5" stroke-linecap="round" fill="none"/>')
    else:
        eyes = "".join(f'<ellipse cx="{x}" cy="182" rx="8.5" ry="12" fill="{eye}"/><circle cx="{x + 3}" cy="176" r="3.2" fill="#fff"/>' for x in (lx, rx_))
    brows = ""
    if expr == "focused":
        brows = f'<path d="M{lx - 12} 160 L{lx + 10} 163" stroke="{eye}" stroke-width="4" stroke-linecap="round"/><path d="M{rx_ - 10} 163 L{rx_ + 12} 160" stroke="{eye}" stroke-width="4" stroke-linecap="round"/>'
    elif expr in ("dreamy", "gentle"):
        brows = f'<path d="M{lx - 11} 162 Q{lx} 157 {lx + 11} 162" stroke="{eye}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.8"/><path d="M{rx_ - 11} 162 Q{rx_} 157 {rx_ + 11} 162" stroke="{eye}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.8"/>'
    if expr in ("open", "grin", "wink"):
        mouth = '<path d="M186 208 Q200 230 214 208 Z" fill="#9C3D33"/><path d="M191 216 Q200 224 209 216" fill="#E8867A"/>'
    elif expr == "focused":
        mouth = '<path d="M192 214 Q200 217 208 214" stroke="#7A3A2A" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
    elif expr == "o":
        mouth = '<ellipse cx="200" cy="214" rx="6" ry="7" fill="#9C3D33"/>'
    else:
        mouth = '<path d="M189 210 Q200 222 211 210" stroke="#7A3A2A" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
    return blush + eyes + brows + mouth


def glasses() -> str:
    return ('<g fill="none" stroke="#3B3B48" stroke-width="3.5"><circle cx="166" cy="182" r="19"/><circle cx="234" cy="182" r="19"/>'
            '<path d="M185 180 Q200 172 215 180"/></g><g fill="#fff" opacity="0.25"><circle cx="166" cy="182" r="17"/><circle cx="234" cy="182" r="17"/></g>')


# ---------------------------------------------------------------- body, clothes, arms

SHOULDER_L, SHOULDER_R = (158, 274), (242, 274)

POSES = {
    # each arm: list of points from shoulder to hand
    "down": ([(150, 312), (140, 350)], [(250, 312), (260, 350)]),
    "hold": ([(150, 312), (182, 326)], [(250, 312), (218, 326)]),
    "hug": ([(146, 300), (176, 300)], [(254, 300), (224, 300)]),
    "offer": ([(150, 316), (176, 344)], [(250, 316), (224, 344)]),
    "wave": ([(150, 312), (182, 326)], [(292, 262), (322, 222)]),
    "raise": ([(150, 312), (140, 350)], [(296, 248), (318, 186)]),
    "hip": ([(150, 312), (182, 326)], [(278, 304), (256, 332)]),
    "chin": ([(132, 290), (150, 244)], [(250, 312), (220, 326)]),
    "point": ([(150, 312), (140, 350)], [(278, 282), (306, 270)]),
    "stride": ([(140, 304), (124, 334)], [(254, 300), (226, 316)]),
    "side": ([(150, 312), (140, 350)], [(262, 312), (276, 344)]),
}


def torso(kind: str, c: str, accent: str, uid: str) -> str:
    g = f'<defs><radialGradient id="tg-{uid}" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="{tint(c, 0.18)}"/><stop offset="1" stop-color="{shade(c, 0.1)}"/></radialGradient></defs>'
    body = f'<path d="M160 258 Q200 250 240 258 Q258 264 262 292 L270 372 Q270 386 256 386 L144 386 Q130 386 130 372 L138 292 Q142 264 160 258 Z" fill="url(#tg-{uid})"/>'
    extra = ""
    if kind == "coat":
        extra = (f'<path d="M200 262 V384" stroke="{shade(c, 0.22)}" stroke-width="3"/>'
                 + "".join(f'<circle cx="{x}" cy="{y}" r="5.5" fill="{shade(c, 0.25)}"/>' for x in (186, 214) for y in (300, 334))
                 + f'<path d="M168 262 L200 300 L232 262" fill="none" stroke="{shade(c, 0.18)}" stroke-width="4"/>')
    elif kind == "cardigan":
        extra = (f'<path d="M178 258 L200 330 L222 258 Z" fill="{accent}"/>'
                 + "".join(f'<circle cx="198" cy="{y}" r="4.5" fill="{shade(c, 0.28)}"/>' for y in (340, 358, 376)))
    elif kind == "dress":
        extra = (f'<path d="M134 360 Q200 378 266 360 L270 372 Q270 386 256 386 L144 386 Q130 386 130 372 Z" fill="{shade(c, 0.08)}"/>'
                 f'<path d="M170 262 Q200 282 230 262" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.85"/>')
    elif kind == "apron":
        extra = (f'<path d="M164 296 H236 L244 384 H156 Z" fill="{accent}"/>'
                 f'<rect x="184" y="320" width="32" height="24" rx="5" fill="{shade(accent, 0.12)}"/>'
                 f'<path d="M168 296 Q200 258 232 296" fill="none" stroke="{accent}" stroke-width="6"/>')
    elif kind == "stripes":
        extra = "".join(f'<path d="M{136 + (y - 270) * 0.06:.1f} {y} H{264 - (y - 270) * 0.06:.1f}" stroke="{accent}" stroke-width="9"/>' for y in (286, 312, 338, 364))
    elif kind == "turtleneck":
        extra = (f'<rect x="174" y="250" width="52" height="20" rx="9" fill="{shade(c, 0.12)}"/>'
                 + "".join(f'<path d="M{x} 300 V380" stroke="{shade(c, 0.14)}" stroke-width="3" opacity="0.5"/>' for x in (160, 180, 200, 220, 240)))
    elif kind == "smock":
        extra = (f'<path d="M172 262 Q200 276 228 262" fill="none" stroke="{shade(c, 0.14)}" stroke-width="5"/>'
                 + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}"/>' for x, y, r, col in [(160, 330, 6, "#C98A8A"), (226, 352, 5, "#8FB5B8"), (182, 368, 5, "#E2A23B"), (240, 312, 4, "#7C8A4A")]))
    elif kind == "blazer":
        extra = (f'<path d="M178 258 L200 318 L222 258 Z" fill="#F7F1E6"/>'
                 f'<path d="M176 258 L196 320 L170 300 Z" fill="{shade(c, 0.15)}"/><path d="M224 258 L204 320 L230 300 Z" fill="{shade(c, 0.15)}"/>'
                 f'<circle cx="200" cy="346" r="5" fill="{shade(c, 0.3)}"/>')
    elif kind == "overalls":
        extra = (f'<path d="M156 300 H244 L250 384 H150 Z" fill="{accent}"/>'
                 f'<path d="M166 300 L164 262 M234 300 L236 262" stroke="{accent}" stroke-width="10"/>'
                 f'<circle cx="166" cy="300" r="5" fill="#E2C38A"/><circle cx="234" cy="300" r="5" fill="#E2C38A"/>'
                 f'<rect x="182" y="318" width="36" height="26" rx="4" fill="{shade(accent, 0.12)}"/>')
    elif kind == "jacket":
        extra = (f'<path d="M200 262 V384" stroke="{shade(c, 0.3)}" stroke-width="4"/>'
                 f'<path d="M166 262 Q200 280 234 262" fill="none" stroke="{shade(c, 0.2)}" stroke-width="8"/>'
                 f'<rect x="150" y="330" width="26" height="20" rx="4" fill="{shade(c, 0.14)}"/><rect x="224" y="330" width="26" height="20" rx="4" fill="{shade(c, 0.14)}"/>')
    elif kind == "sweater":
        extra = (f'<path d="M172 260 Q200 274 228 260" fill="none" stroke="{shade(c, 0.16)}" stroke-width="7"/>'
                 f'<path d="M136 372 H264" stroke="{shade(c, 0.14)}" stroke-width="10"/>')
    return g + body + extra


def legs(skin: str, pants: str | None, shoe: str, stride: bool = False) -> str:
    leg = pants or skin
    if stride:
        return (f'<path d="M184 380 L172 430" stroke="{leg}" stroke-width="22" stroke-linecap="round"/>'
                f'<path d="M216 380 L230 428" stroke="{leg}" stroke-width="22" stroke-linecap="round"/>'
                f'<ellipse cx="164" cy="436" rx="19" ry="10" fill="{shoe}"/><ellipse cx="238" cy="434" rx="19" ry="10" fill="{shoe}"/>')
    return (f'<rect x="174" y="372" width="22" height="62" rx="10" fill="{leg}"/>'
            f'<rect x="204" y="372" width="22" height="62" rx="10" fill="{leg}"/>'
            f'<ellipse cx="183" cy="438" rx="19" ry="10" fill="{shoe}"/><ellipse cx="217" cy="438" rx="19" ry="10" fill="{shoe}"/>'
            f'<ellipse cx="177" cy="434" rx="7" ry="3" fill="#fff" opacity="0.25"/><ellipse cx="211" cy="434" rx="7" ry="3" fill="#fff" opacity="0.25"/>')


def arm(points: list[tuple[float, float]], start: tuple[float, float], sleeve: str, skin: str) -> str:
    pts = [start] + points
    d = "M" + " L".join(f"{x} {y}" for x, y in pts)
    hx, hy = pts[-1]
    return (f'<path d="{d}" stroke="{sleeve}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
            f'<circle cx="{hx}" cy="{hy}" r="13.5" fill="{skin}"/><circle cx="{hx - 4}" cy="{hy - 4}" r="5" fill="#fff" opacity="0.25"/>')


# ---------------------------------------------------------------- things in hand

def item(kind: str, hand_l, hand_r, scale: float = 1.4) -> str:
    """Held objects, drawn at hand size and then enlarged around their hand so they read on a card."""
    body = _item(kind, hand_l, hand_r)
    two = kind in ("teapot", "mug", "basket", "notebook", "letter", "frame", "seedling")
    ax, ay = ((hand_l[0] + hand_r[0]) / 2, (hand_l[1] + hand_r[1]) / 2) if two else (hand_l if kind in ("bouquet", "palette") else hand_r)
    return f'<g transform="translate({ax} {ay}) scale({scale}) translate({-ax} {-ay})">{body}</g>' if body else ""


def _item(kind: str, hand_l, hand_r) -> str:
    lx, ly = hand_l
    rx, ry = hand_r
    cx, cy = (lx + rx) / 2, (ly + ry) / 2
    if kind == "teapot":
        return (f'<g transform="translate({cx} {cy - 6})"><ellipse cx="0" cy="0" rx="30" ry="24" fill="#F7F1E6"/>'
                f'<path d="M26 -6 Q48 -14 46 -30" stroke="#F7F1E6" stroke-width="7" fill="none" stroke-linecap="round"/>'
                f'<path d="M-28 -8 Q-46 -6 -40 12" stroke="#E6DCCB" stroke-width="6" fill="none"/>'
                f'<ellipse cx="0" cy="-22" rx="14" ry="5" fill="#E6DCCB"/><circle cx="0" cy="-28" r="5" fill="#C98A8A"/>'
                f'<path d="M-16 4 Q0 12 16 4" stroke="#C98A8A" stroke-width="4" fill="none"/></g>')
    if kind == "letter":
        return (f'<g transform="translate({cx} {cy - 8}) rotate(-8)"><rect x="-30" y="-20" width="60" height="40" rx="3" fill="#FBF8F1"/>'
                f'<path d="M-30 -20 L0 4 L30 -20" stroke="#D9CBB4" stroke-width="3" fill="none"/>'
                f'<circle cx="0" cy="2" r="7" fill="#B4552E"/></g>')
    if kind == "frame":
        return (f'<g transform="translate({cx} {cy - 12}) rotate(4)"><rect x="-30" y="-36" width="60" height="70" rx="4" fill="#B88A64"/>'
                f'<rect x="-22" y="-28" width="44" height="54" fill="#F3E3C8"/><circle cx="0" cy="-8" r="9" fill="#C98A8A"/>'
                f'<path d="M-16 22 Q0 0 16 22 Z" fill="#8FB5B8"/></g>')
    if kind == "bouquet":
        flowers = "".join(f'<circle cx="{x}" cy="{y}" r="11" fill="{col}"/><circle cx="{x}" cy="{y}" r="4" fill="#F7E3A2"/>'
                          for x, y, col in [(-14, -40, "#E3A6A9"), (8, -46, "#C98A8A"), (-2, -26, "#F4D6D6"), (20, -30, "#E3A6A9"), (-22, -22, "#C98A8A")])
        return (f'<g transform="translate({lx + 4} {ly})"><path d="M-6 -16 L0 30 L6 -16 Z" fill="#7C8A4A"/>'
                f'<path d="M-24 -20 L0 24 L24 -20 Z" fill="#F7F1E6" opacity="0.9"/>{flowers}</g>')
    if kind == "mug":
        return (f'<g transform="translate({cx} {cy - 10})"><rect x="-20" y="-20" width="40" height="40" rx="8" fill="#F7F1E6"/>'
                f'<path d="M20 -8 Q36 -8 34 6 Q32 16 20 12" stroke="#F7F1E6" stroke-width="6" fill="none"/>'
                f'<rect x="-20" y="-6" width="40" height="8" fill="#9DB28A"/>'
                f'<path d="M-8 -30 q-8 -12 2 -22 M8 -30 q-8 -12 2 -22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/></g>')
    if kind == "palette":
        return (f'<g transform="translate({lx - 6} {ly - 6}) rotate(-18)"><path d="M-38 0 Q-36 -30 0 -30 Q40 -30 38 4 Q34 28 6 24 Q-4 22 -6 12 Q-10 2 -22 10 Q-38 18 -38 0 Z" fill="#D9B98E"/>'
                f'<circle cx="-16" cy="-14" r="6" fill="#C98A8A"/><circle cx="2" cy="-18" r="6" fill="#8FB5B8"/><circle cx="20" cy="-10" r="6" fill="#E2A23B"/><circle cx="20" cy="8" r="6" fill="#7C8A4A"/></g>'
                f'<g transform="translate({rx} {ry})"><path d="M0 0 L22 -54" stroke="#8A5A33" stroke-width="6" stroke-linecap="round"/><path d="M20 -50 L28 -66" stroke="#4C527A" stroke-width="8" stroke-linecap="round"/></g>')
    if kind == "lantern":
        return (f'<g transform="translate({rx + 2} {ry + 6})"><path d="M0 -14 V0" stroke="#3B3B48" stroke-width="4"/><circle cx="0" cy="-16" r="6" fill="none" stroke="#3B3B48" stroke-width="3"/>'
                f'<rect x="-18" y="0" width="36" height="46" rx="6" fill="#3B3B48"/><rect x="-12" y="6" width="24" height="34" rx="4" fill="#F6C46A"/>'
                f'<circle cx="0" cy="24" r="28" fill="#F6C46A" opacity="0.25"/><rect x="-22" y="44" width="44" height="7" rx="3" fill="#3B3B48"/></g>')
    if kind == "basket":
        oranges = "".join(f'<circle cx="{x}" cy="{y}" r="11" fill="#E8952F"/><circle cx="{x - 3}" cy="{y - 4}" r="3" fill="#F9E3B0" opacity="0.6"/>' for x, y in [(-18, -14), (0, -18), (18, -14), (-8, -26), (10, -28)])
        return (f'<g transform="translate({cx} {cy - 4})">{oranges}<path d="M-34 -10 H34 L26 18 H-26 Z" fill="#C79F74"/>'
                f'<path d="M-30 -2 H30 M-28 8 H28" stroke="#A67C52" stroke-width="3"/><path d="M-30 -10 Q0 -54 30 -10" stroke="#A67C52" stroke-width="5" fill="none"/></g>')
    if kind == "seedling":
        return (f'<g transform="translate({cx} {cy - 12})"><path d="M-18 0 H18 L13 30 H-13 Z" fill="#C7774E"/><rect x="-21" y="-6" width="42" height="9" rx="3" fill="#B4552E"/>'
                f'<path d="M0 -6 Q2 -16 0 -24" stroke="#56653A" stroke-width="4" fill="none"/>'
                f'<path d="M0 -14 Q-22 -16 -26 -30 Q-6 -32 0 -14 Z" fill="#7C8A4A"/><path d="M0 -20 Q20 -26 26 -38 Q6 -40 0 -20 Z" fill="#9DB28A"/></g>')
    if kind == "notebook":
        return (f'<g transform="translate({cx} {cy - 10}) rotate(-6)"><rect x="-28" y="-34" width="56" height="70" rx="4" fill="#4C527A"/>'
                f'<rect x="-22" y="-28" width="46" height="58" rx="2" fill="#F7F1E6"/>'
                + "".join(f'<path d="M-16 {y} H18" stroke="#C9CBD6" stroke-width="2"/>' for y in (-16, -6, 4, 14))
                + f'<path d="M30 -30 L42 20" stroke="#E2A23B" stroke-width="6" stroke-linecap="round"/></g>')
    if kind == "book":
        return (f'<g transform="translate({rx - 14} {ry - 6}) rotate(-10)"><path d="M-36 -22 Q-18 -28 0 -20 Q18 -28 36 -22 V22 Q18 16 0 24 Q-18 16 -36 22 Z" fill="#F7F1E6"/>'
                f'<path d="M0 -20 V24" stroke="#C9CBD6" stroke-width="2"/><path d="M-36 22 Q-18 16 0 24 Q18 16 36 22 V28 Q18 22 0 30 Q-18 22 -36 28 Z" fill="#8FB5B8"/>'
                + "".join(f'<path d="M-28 {y} H-8 M8 {y} H28" stroke="#C9CBD6" stroke-width="2"/>' for y in (-10, -2, 6)) + '</g>')
    if kind == "clapper":
        stripes = "".join(f'<path d="M{x} -30 l10 0 l-8 14 l-10 0 Z" fill="#F7F1E6"/>' for x in (-22, -2, 18))
        return (f'<g transform="translate({rx + 14} {ry - 6}) rotate(-12)"><rect x="-30" y="-16" width="60" height="44" rx="4" fill="#292A31"/>'
                f'<path d="M-30 -2 H30" stroke="#5C5E6B" stroke-width="2"/><path d="M-12 8 H22 M-12 18 H14" stroke="#F7F1E6" stroke-width="3" opacity="0.8"/>'
                f'<g transform="rotate(-14 -30 -18)"><rect x="-30" y="-32" width="60" height="16" rx="3" fill="#292A31"/>{stripes}</g></g>')
    if kind == "map":
        return (f'<g transform="translate({rx + 8} {ry - 2}) rotate(-20)"><rect x="-6" y="-12" width="64" height="24" rx="12" fill="#F3E3C8"/>'
                f'<ellipse cx="-6" cy="0" rx="8" ry="12" fill="#E2CFA8"/><path d="M8 -4 H48 M8 4 H40" stroke="#B4552E" stroke-width="2.5" stroke-dasharray="4 3"/></g>')
    if kind == "plane":
        return (f'<g transform="translate({rx + 6} {ry - 22}) rotate(-24)"><path d="M-30 4 L34 -8 L-14 18 Z" fill="#FBF8F1"/><path d="M-30 4 L34 -8 L-6 4 Z" fill="#E6DCCB"/>'
                f'<path d="M-40 26 q10 -6 18 2" stroke="#E2A23B" stroke-width="3" stroke-dasharray="3 4" fill="none"/></g>')
    if kind == "wateringcan":
        return (f'<g transform="translate({rx + 14} {ry + 10})"><path d="M-22 -18 H22 L18 22 H-18 Z" fill="#7C8A4A"/>'
                f'<path d="M20 -6 L46 -26" stroke="#7C8A4A" stroke-width="7" stroke-linecap="round"/><ellipse cx="48" cy="-28" rx="8" ry="5" fill="#56653A" transform="rotate(-36 48 -28)"/>'
                f'<path d="M-22 -10 Q-34 -10 -34 4 Q-34 16 -20 14" stroke="#56653A" stroke-width="5" fill="none"/>'
                f'<path d="M54 -20 l4 10 M58 -24 l7 8 M50 -16 l2 11" stroke="#8FB5B8" stroke-width="3" stroke-linecap="round"/></g>')
    if kind == "hammer":
        return (f'<g transform="translate({rx} {ry}) rotate(28)"><rect x="-4" y="-50" width="8" height="58" rx="3" fill="#B88A64"/>'
                f'<rect x="-20" y="-62" width="40" height="16" rx="4" fill="#8A8C94"/><rect x="-20" y="-62" width="40" height="5" rx="2" fill="#B9BCC4"/></g>')
    if kind == "compass":
        return (f'<g transform="translate({rx} {ry - 4})"><circle cx="0" cy="0" r="20" fill="#E2C38A"/><circle cx="0" cy="0" r="15" fill="#FBF8F1"/>'
                f'<path d="M0 -12 L4 0 L0 12 L-4 0 Z" fill="#B4552E"/><path d="M0 12 L4 0 L-4 0 Z" fill="#4C527A"/><circle cx="0" cy="-22" r="4" fill="#E2C38A"/></g>')
    return ""


def backpack(c: str) -> str:
    return (f'<path d="M262 280 Q290 280 292 312 L294 370 Q294 382 282 382 L262 382 Z" fill="{c}"/>'
            f'<rect x="268" y="324" width="22" height="22" rx="4" fill="{shade(c, 0.15)}"/>')


def scarf(c: str) -> str:
    return (f'<path d="M162 254 Q200 276 238 254 L242 270 Q200 292 158 270 Z" fill="{c}"/>'
            f'<path d="M212 276 L222 318 L206 318 L200 280 Z" fill="{shade(c, 0.1)}"/>')


def headphones() -> str:
    return ('<path d="M168 262 Q200 286 232 262" stroke="#3B3B48" stroke-width="6" fill="none"/>'
            '<ellipse cx="164" cy="264" rx="11" ry="14" fill="#3B3B48"/><ellipse cx="236" cy="264" rx="11" ry="14" fill="#3B3B48"/>')


# ---------------------------------------------------------------- the sixteen

ARCH = [
    # code, family, skin, hair style, hair colour, outfit, top colour, accent, pants, shoes, pose, item, expr, extras
    ("ESFJ", "floral", "#F3C9A8", "wavy", "#5A3A28", "cardigan", "#D99A9A", "#F7F1E6", None, "#8A5A33", "hold", "teapot", "happy", {}),
    ("INFJ", "floral", "#EBC09C", "bun", "#2E2420", "sweater", "#B9A9D0", "", "#4C527A", "#3B3B48", "hug", "letter", "gentle", {"look": -4}),
    ("ISFJ", "spicy", "#D9A67E", "braids", "#A33A2A", "cardigan", "#C7774E", "#F3E3C8", None, "#6A4530", "hug", "frame", "content", {}),
    ("ENFP", "floral", "#F6D3B8", "curly", "#8C5A33", "dress", "#E3A6A9", "", None, "#B4552E", "wave", "bouquet", "open", {}),
    ("ESFP", "green", "#B57C55", "puffs", "#2E2420", "sweater", "#9DB28A", "", "#56653A", "#F7F1E6", "hold", "mug", "content", {}),
    ("ISFP", "floral", "#F3C9A8", "bob", "#A33A2A", "smock", "#F3EEE4", "", "#8FB5B8", "#8A5A33", "side", "palette", "gentle", {"hat": ("beret", "#EFE6D6")}),
    ("ISTJ", "woody", "#D9A67E", "crop", "#2E2420", "coat", "#8A5A33", "", "#5A4436", "#3B2A20", "side", "lantern", "smile", {"scarf": "#C7774E"}),
    ("ENFJ", "citrus", "#8C5A3C", "long", "#2E2420", "apron", "#F3E3C8", "#E2A23B", "#8A5A33", "#5A3A28", "offer", "basket", "open", {}),
    ("INFP", "green", "#F6D3B8", "long", "#C9A26B", "dress", "#7C8A4A", "", None, "#8A5A33", "offer", "seedling", "dreamy", {"look": 3}),
    ("INTJ", "woody", "#EBC09C", "sidepart", "#2E2420", "turtleneck", "#5A4436", "", "#3B3B48", "#2E2420", "hold", "notebook", "focused", {"glasses": True}),
    ("INTP", "fresh", "#F3C9A8", "messy", "#5A3A28", "sweater", "#8FB5B8", "", "#4C527A", "#F7F1E6", "chin", "book", "o", {"headphones": True, "look": 4}),
    ("ENTJ", "spicy", "#B57C55", "ponytail", "#2E2420", "blazer", "#B4552E", "", "#3B3B48", "#2E2420", "point", "clapper", "smile", {}),
    ("ENTP", "citrus", "#F6D3B8", "spiky", "#C97A3A", "stripes", "#FBF8F1", "#E2A23B", "#4C527A", "#B4552E", "raise", "plane", "wink", {}),
    ("ESTJ", "green", "#D9A67E", "bob", "#D8D2C8", "apron", "#F3EEE4", "#56653A", "#8A5A33", "#5A3A28", "side", "wateringcan", "smile", {}),
    ("ISTP", "gourmand", "#8C5A3C", "crop", "#2E2420", "overalls", "#F3E3C8", "#D4A26A", None, "#5A3A28", "side", "hammer", "content", {"hat": ("beanie", "#B4552E")}),
    ("ESTP", "spicy", "#EBC09C", "crop", "#8C5A33", "jacket", "#C7774E", "", "#4C527A", "#5A3A28", "stride", "compass", "grin", {"hat": ("bucket", "#E2C38A"), "backpack": "#7C8A4A"}),
]


def character(row, bare: bool = False) -> str:
    code, fam, skin, hstyle, hcol, outfit, top, accent, pants, shoe, pose, thing, expr, ex = row
    uid = code.lower()
    left, right = POSES[pose]
    sleeve = shade(top, 0.04)
    hand_l, hand_r = left[-1], right[-1]
    if bare:
        # no room and no colour behind the figure; a neutral charcoal ground shadow like the cut-outs
        parts = [f'<defs><radialGradient id="sh-{uid}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#292A31" stop-opacity="0.24"/><stop offset="1" stop-color="#292A31" stop-opacity="0"/></radialGradient></defs>'
                 f'<ellipse cx="200" cy="452" rx="84" ry="14" fill="url(#sh-{uid})"/>']
    else:
        parts = [room(fam, uid)]
    parts.append(f"<g>{hair_back(hstyle, hcol)}</g>")
    if ex.get("backpack"):
        parts.append(backpack(ex["backpack"]))
    parts.append(legs(skin, pants, shoe, stride=(pose == "stride")))
    parts.append(torso(outfit, top, accent or tint(top, 0.4), uid))
    if ex.get("scarf"):
        parts.append(scarf(ex["scarf"]))
    if ex.get("headphones"):
        parts.append(headphones())
    # arms behind the held object for two-handed holds, in front for one-handed
    two_hands = thing in ("teapot", "mug", "basket", "notebook", "letter", "frame", "seedling")
    high_l, high_r = hand_l[1] < 262, hand_r[1] < 262
    late: list[str] = []
    if two_hands:
        parts.append(arm(left, SHOULDER_L, sleeve, skin))
        parts.append(arm(right, SHOULDER_R, sleeve, skin))
        parts.append(item(thing, hand_l, hand_r))
        # thumbs over the object
        parts.append(f'<circle cx="{hand_l[0] + 2}" cy="{hand_l[1]}" r="9" fill="{skin}"/><circle cx="{hand_r[0] - 2}" cy="{hand_r[1]}" r="9" fill="{skin}"/>')
    else:
        held_by_right = thing not in ("bouquet",)
        (late if (high_r and held_by_right) or (high_l and not held_by_right) else parts).append(item(thing, hand_l, hand_r))
        (late if high_l else parts).append(arm(left, SHOULDER_L, sleeve, skin))
        (late if high_r else parts).append(arm(right, SHOULDER_R, sleeve, skin))
    # head
    parts.append(f'<defs><radialGradient id="hg-{uid}" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stop-color="{tint(skin, 0.14)}"/><stop offset="1" stop-color="{shade(skin, 0.07)}"/></radialGradient></defs>')
    parts.append(f'<ellipse cx="200" cy="172" rx="100" ry="92" fill="url(#hg-{uid})"/>')
    parts.append(hair_front(hstyle, hcol))
    parts.append(face(expr, look=ex.get("look", 0)))
    if ex.get("glasses"):
        parts.append(glasses())
    if ex.get("hat"):
        parts.append(hat(*ex["hat"]))
    parts.extend(late)
    body = "\n  ".join(parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" role="img" aria-label="{code}">\n  {body}\n</svg>\n')


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    args = sys.argv[1:]
    bare = "--bare" in args
    only: set[str] | None = None
    if "--only" in args:
        only = set(args[args.index("--only") + 1].upper().split(","))
    rest = [a for i, a in enumerate(args) if not a.startswith("--") and (i == 0 or args[i - 1] != "--only")]
    sheet = []
    rows = [r for r in ARCH if only is None or r[0] in only]
    for row in rows:
        svg = character(row, bare=bare)
        path = os.path.join(OUT, f"{row[0].lower()}.svg")
        with open(path, "w", encoding="utf-8") as f:
            f.write(svg)
        sheet.append(f'<figure><img src="{os.path.abspath(path)}" width="200" height="240"><figcaption>{row[0]}</figcaption></figure>')
    if rest:
        with open(rest[0], "w", encoding="utf-8") as f:
            f.write('<html><body style="margin:0;background:#eee;display:grid;grid-template-columns:repeat(8,200px);gap:8px;font:12px monospace">' + "".join(sheet) + "</body></html>")
    print("wrote", len(rows))


if __name__ == "__main__":
    main()
