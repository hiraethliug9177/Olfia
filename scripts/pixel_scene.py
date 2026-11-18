"""
Pixel scene for My Page (Tiffany 11/18): a placeholder for a later picture made from each visitor's own
scent preferences. This one is drawn from the sample data: woody first (cedar forest, a timber cabin, a
candle in the window at night), citrus second (an orange tree, the apricot dusk), green third (the hills),
and the preferred products, candle and diffuser (the lit window, the mist from the chimney).

Colours come from the brand guide and the family colours. Run from the repo root:
    python3 scripts/pixel_scene.py
It writes public/assets/preferences/sample-scene.png at its native 192 x 108 pixels; the page scales it up
with `image-rendering: pixelated`, so every pixel stays a crisp square.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image

W, H = 192, 108
OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "preferences" / "sample-scene.png"

rng = random.Random(1118)


def hx(c: str) -> tuple[int, int, int]:
    c = c.lstrip("#")
    return int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)


def mix(a, b, t: float):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# brand guide and family colours
IVORY, PAPER, MIST = hx("#F8F6F0"), hx("#F5EEE1"), hx("#ECEDF5")
DEEP, PERI, APRICOT = hx("#4C527A"), hx("#A0A6C8"), hx("#E7B49F")
WOODY, GREEN, CITRUS = hx("#8A5A33"), hx("#7C8A4A"), hx("#E2A23B")

NIGHT = hx("#363A5C")
KEYS = [NIGHT, DEEP, hx("#6A6F9C"), PERI, hx("#C7AFB8"), APRICOT, hx("#F2CDB0")]
SKY = []
for a, b in zip(KEYS, KEYS[1:]):
    SKY += [mix(a, b, 0.0), mix(a, b, 0.5)]
SKY.append(KEYS[-1])

img = Image.new("RGB", (W, H), IVORY)
px = img.load()

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def sky_colour(x: int, y: int, horizon: int):
    """Banded sky with ordered dithering between bands, warmer towards the left where the sun has set."""
    t = min(1.0, max(0.0, y / horizon))
    t = t ** 0.85 + (0.06 * (1 - x / W))  # a little more glow on the left
    t = min(0.999, t)
    pos = t * (len(SKY) - 1)
    i = int(pos)
    frac = pos - i
    threshold = (BAYER[y % 4][x % 4] + 0.5) / 16
    return SKY[i + 1] if frac > threshold else SKY[i]


HORIZON = 70
for y in range(H):
    for x in range(W):
        px[x, y] = sky_colour(x, y, HORIZON)

# stars, only in the dark upper sky
for _ in range(46):
    x, y = rng.randrange(W), rng.randrange(0, 34)
    if px[x, y] in (NIGHT, DEEP):
        px[x, y] = IVORY if rng.random() < 0.6 else PERI
for x, y in [(30, 7), (88, 5), (121, 14), (63, 19)]:  # a few brighter ones, with a cross
    px[x, y] = IVORY
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        px[x + dx, y + dy] = PERI

# crescent moon
mx, my, r = 156, 17, 7
for y in range(my - r - 1, my + r + 2):
    for x in range(mx - r - 1, mx + r + 2):
        inside = (x - mx) ** 2 + (y - my) ** 2 <= r * r
        bite = (x - mx - 4) ** 2 + (y - my + 2) ** 2 <= (r - 1) ** 2
        if inside and not bite:
            px[x, y] = PAPER if (x - mx) < -2 else MIST


def ridge(base: int, amp: list[tuple[float, float, float]], colour, rim=None, x0=0, x1=W):
    """Fill everything below a wavy line; `amp` is a list of (height, wavelength, phase)."""
    tops = {}
    for x in range(x0, x1):
        h = base - sum(a * math.sin(x / wl * 2 * math.pi + ph) for a, wl, ph in amp)
        top = int(round(h))
        tops[x] = top
        for y in range(max(0, top), H):
            px[x, y] = colour
        if rim is not None and 0 <= top < H:
            px[x, top] = rim
    return tops


# far hills in periwinkle haze, then nearer ones
ridge(60, [(5, 90, 0.4), (2.5, 37, 1.1)], hx("#8E91B8"), rim=hx("#A9A8C4"))
ridge(66, [(4, 70, 2.0), (2, 23, 0.3)], hx("#727699"))

# a cedar forest on the middle hill: dark conifers, lit a little on the left
FOREST_DARK, FOREST_MID, FOREST_LIGHT = hx("#323B2C"), hx("#465238"), hx("#5E6B43")
TRUNK = hx("#4A2F1C")


def cedar(cx: int, base: int, height: int, lit: float = 0.0):
    tiers = max(3, height // 5)
    for i in range(height):
        y = base - i
        frac = i / height
        # stacked tiers: the width shrinks with height and kicks out at each tier
        tier_pos = (i * tiers / height) % 1.0
        half = (1 - frac) * height * 0.32 + (1 - tier_pos) * 1.6
        half = max(0.5, half)
        for x in range(int(cx - half), int(cx + half) + 1):
            if 0 <= x < W and 0 <= y < H:
                left_side = x < cx - half * 0.25
                c = FOREST_MID if left_side else FOREST_DARK
                if x == int(cx - half):
                    c = FOREST_LIGHT if lit > 0 else FOREST_MID
                px[x, y] = c
    for y in range(base, min(H, base + 2)):
        px[cx, y] = TRUNK


mid = ridge(76, [(3, 64, 0.9), (1.5, 19, 2.2)], hx("#3F4A33"))
for cx in range(-4, W + 6, 7):
    jitter = rng.randint(-2, 2)
    x = cx + jitter
    base = mid.get(min(max(x, 0), W - 1), 76) + 1
    cedar(x, base, rng.randint(13, 21), lit=1.0 if x < 70 else 0.0)

# the near hill: grass, green-herbal
GRASS, GRASS_DARK, GRASS_LIGHT = GREEN, hx("#5F6B39"), hx("#97A35E")
near = ridge(88, [(4, 120, 3.6), (1.5, 29, 0.7)], GRASS)
for x in range(W):
    top = near[x]
    for y in range(top, H):
        d = y - top
        if d == 0:
            px[x, y] = GRASS_LIGHT
        elif d == 1 and x % 2 == 0:
            px[x, y] = GRASS_LIGHT

# a path to the cabin door
PATH, PATH_DARK = hx("#C9A57A"), hx("#A98559")
for y in range(H - 1, 91, -1):
    t = (H - 1 - y) / (H - 1 - 92)
    cx = 118 + int(8 * (1 - t)) - int(3 * t)
    half = int(6 * (1 - t) + 1.5)
    for x in range(cx - half, cx + half + 1):
        px[x, y] = PATH_DARK if (x == cx - half or x == cx + half) else PATH

# the cabin: timber walls (woody), dark roof, a candle-lit window
CAB_X0, CAB_X1, CAB_TOP, CAB_BOT = 100, 136, 74, 92
PLANK, SEAM, ROOF, ROOF_LIGHT = WOODY, hx("#6A4326"), hx("#3E2A1E"), hx("#5B3F2B")
for y in range(CAB_TOP, CAB_BOT):
    for x in range(CAB_X0, CAB_X1):
        px[x, y] = SEAM if (y - CAB_TOP) % 3 == 2 else PLANK
for x in range(CAB_X0, CAB_X1):  # sill shadow
    px[x, CAB_BOT - 1] = SEAM
# roof: a wide gable
for i in range(12):
    y = CAB_TOP - 1 - i
    x0, x1 = CAB_X0 - 4 + i, CAB_X1 + 3 - i
    for x in range(x0, x1):
        shingle = i % 3 == 1
        px[x, y] = ROOF_LIGHT if (i == 0 or x == x0 or (shingle and (x - x0) % 4 != 0)) else ROOF
# chimney
for y in range(CAB_TOP - 13, CAB_TOP - 4):
    for x in range(127, 131):
        px[x, y] = hx("#7A6A62") if (x + y) % 3 else hx("#5E504A")
# door
for y in range(CAB_TOP + 6, CAB_BOT):
    for x in range(115, 121):
        px[x, y] = hx("#4F3220")
px[119, CAB_TOP + 12] = CITRUS
# window with candlelight
GLOW, GLOW_HOT, FRAME = hx("#F2C26B"), hx("#FBE3A6"), hx("#3E2A1E")
for y in range(CAB_TOP + 4, CAB_TOP + 12):
    for x in range(104, 112):
        edge = x in (104, 111) or y in (CAB_TOP + 4, CAB_TOP + 11)
        cross = x == 108 or y == CAB_TOP + 8
        px[x, y] = FRAME if edge or cross else (GLOW_HOT if (x, y) in [(106, CAB_TOP + 6), (110, CAB_TOP + 10)] else GLOW)
# the candle seen through the glass
px[106, CAB_TOP + 10] = IVORY
px[106, CAB_TOP + 9] = CITRUS
# warm light on the grass below the window
for y in range(CAB_BOT, CAB_BOT + 6):
    for x in range(100 - (y - CAB_BOT), 112 + (y - CAB_BOT)):
        if 0 <= x < W and (x + y) % 2 == 0:
            px[x, y] = mix(px[x, y], GLOW, 0.45)

# diffuser mist from the chimney, drifting right
for i, (dx, dy, rr) in enumerate([(1, -16, 1.6), (4, -20, 2.2), (8, -24, 2.6), (13, -27, 2.8), (19, -29, 2.4)]):
    cx, cy = 128 + dx, CAB_TOP + dy
    for y in range(int(cy - rr) - 1, int(cy + rr) + 2):
        for x in range(int(cx - rr) - 1, int(cx + rr) + 2):
            if (x - cx) ** 2 + (y - cy) ** 2 <= rr * rr and 0 <= x < W and 0 <= y < H:
                px[x, y] = mix(px[x, y], MIST, 0.55 - i * 0.07)

# the orange tree (citrus) beside the cabin
TREE_X, TREE_BASE = 78, near[78] + 1
for y in range(TREE_BASE - 12, TREE_BASE + 1):
    px[TREE_X, y] = hx("#5A3A22")
    px[TREE_X + 1, y] = hx("#6E4526")
LEAF_D, LEAF_M, LEAF_L = hx("#3F4A2E"), hx("#55633A"), GREEN
for (cx, cy, rr) in [(TREE_X, TREE_BASE - 17, 8), (TREE_X - 7, TREE_BASE - 13, 6), (TREE_X + 8, TREE_BASE - 13, 6), (TREE_X + 1, TREE_BASE - 23, 5)]:
    for y in range(cy - rr, cy + rr + 1):
        for x in range(cx - rr, cx + rr + 1):
            d = (x - cx) ** 2 + (y - cy) ** 2
            if d <= rr * rr:
                c = LEAF_M
                # lit from the dusk on the upper left, shaded on the lower right
                if (x - cx + 2) ** 2 + (y - cy + 2) ** 2 <= (rr - 2.5) ** 2 and x < cx and y < cy:
                    c = LEAF_L
                if d > (rr - 1.4) ** 2 and (x > cx or y > cy + 1):
                    c = LEAF_D
                px[x, y] = c
ORANGE_HI = hx("#F6D58A")
for (ox, oy) in [(73, -18), (80, -21), (85, -14), (70, -12), (78, -12), (83, -24), (74, -25), (88, -18)]:
    x, y = TREE_X + (ox - 78), TREE_BASE + oy
    for dx, dy in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        px[x + dx, y + dy] = CITRUS
    px[x, y] = ORANGE_HI
# two oranges in the grass
for (x, y) in [(70, TREE_BASE + 3), (89, TREE_BASE + 5)]:
    for dx, dy in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        px[x + dx, y + dy] = CITRUS
    px[x, y] = ORANGE_HI

# scent drifting from the window: a few warm dots, fading as they rise
for i, (x, y) in enumerate([(98, 76), (95, 72), (93, 67), (90, 63), (88, 58), (91, 54)]):
    px[x, y] = mix(px[x, y], hx("#FBE3A6"), 0.9 - i * 0.12)

# small tufts of grass, scattered
for _ in range(70):
    x = rng.randrange(1, W - 1)
    y = rng.randrange(near[x] + 3, H)
    if px[x, y] != GRASS:
        continue
    px[x, y] = GRASS_DARK
    px[x - 1, y - 1] = GRASS_DARK if px[x - 1, y - 1] == GRASS else px[x - 1, y - 1]
    px[x + 1, y - 1] = GRASS_DARK if px[x + 1, y - 1] == GRASS else px[x + 1, y - 1]

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, optimize=True)
print(f"wrote {OUT.relative_to(Path.cwd()) if OUT.is_relative_to(Path.cwd()) else OUT} ({W}x{H})")
