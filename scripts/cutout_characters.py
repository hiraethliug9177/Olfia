"""
Quiz characters: cut Tiffany's sixteen-personality figures out of their flat backgrounds (2026-11-10).

Tiffany supplied the figures (one image per personality, unnamed, each on its own plain colour; the Empath
and the Altruist arrived later the same night). This
script removes the background so the figures sit on Olfia's own colours, and gives every figure the same
canvas and scale:
  1. model the background as a smooth colour surface fitted to the image border (Lab, quadratic);
  2. seed definite background (border-connected, close to that colour), probable background (enclosed
     background and the soft ground shadow) and definite figure (far from it), then let GrabCut decide
     the rest;
  3. feather the edge and remove the background colour that bleeds into edge pixels;
  4. place the figure on a 800 x 960 transparent canvas at one shared scale, feet on the same line,
     with a neutral charcoal ground shadow, and save WebP.

Run:  python3 scripts/cutout_characters.py <folder with the originals> [contact-sheet.png]
The originals are matched to personalities in MAP below (file name prefix -> code).
Output: public/assets/archetypes/<code>.webp
"""
from __future__ import annotations

import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from skimage import color

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "archetypes")

# file name prefix -> personality code (matched by what each figure holds and wears)
MAP = {
    "b55e2a13": "estp",  # compass, backpack, explorer hat, mid-stride: The Adventurer
    "6d100dca": "istp",  # hammer in the pocket, beanie, overalls: The Maker
    "7ba4e4e3": "infp",  # seedling in a pot, long fair hair, green dress: The Idealist
    "5c3067e0": "estj",  # watering can, silver hair, apron: The Steward
    "ae966aa9": "entj",  # points ahead with a clapperboard, blazer: The Director
    "b7520fff": "intj",  # notebook and pencil, glasses, turtleneck: The Strategist
    "3bca924e": "enfp",  # bouquet and a wave: The Romantic
    "b779c2ae": "isfj",  # hugs a framed photo, eyes closed: The Devotee
    "1adac856": "esfj",  # rose teapot: The Nurturer
    "cc9ddcfd": "istj",  # lantern, scarf, long coat: The Guardian
    "3ccd5a54": "esfp",  # mug of tea, green sweater: The Harmonist
    "64fe5420": "isfp",  # beret and paint palette: The Muse (the yellow-background copy)
    "8f547a25": "entp",  # paper plane held high, wink: The Spark
    "cecabfcc": "intp",  # hand on chin, open book: The Thinker
    "b34f5d8d": "infj",  # low bun, lilac sweater, hugs a sealed letter: The Empath (sent later the same night)
    "eff89a90": "enfj",  # apron, holds out a basket of oranges: The Altruist (sent later the same night)
}

CANVAS_W, CANVAS_H = 800, 960
FIGURE_H = 860          # every figure is scaled to this height (feet to top of head / hat)
FOOT_LINE = 922         # y of the lowest foot pixel on the canvas


def background_model(lab: np.ndarray, band: int = 28) -> np.ndarray:
    """A quadratic surface per Lab channel, fitted to the border band."""
    h, w, _ = lab.shape
    yy, xx = np.mgrid[0:h, 0:w]
    m = np.zeros((h, w), bool)
    m[:band] = m[-band:] = True
    m[:, :band] = m[:, -band:] = True
    xs, ys = xx[m][::7] / w, yy[m][::7] / h
    A = np.stack([np.ones_like(xs), xs, ys, xs * xs, xs * ys, ys * ys], 1)
    X, Y = xx / w, yy / h
    full = np.stack([np.ones_like(X), X, Y, X * X, X * Y, Y * Y], -1)
    out = np.empty_like(lab)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, lab[..., c][m][::7], rcond=None)
        out[..., c] = full @ coef
    return out


def cut(path: str) -> Image.Image:
    rgb8 = np.asarray(Image.open(path).convert("RGB"))
    rgb = rgb8.astype(np.float64) / 255
    lab = color.rgb2lab(rgb)
    bg = background_model(lab)
    d = np.sqrt(((lab - bg) ** 2).sum(-1))
    d = ndimage.gaussian_filter(d, 1.2)
    h, w = d.shape
    # thresholds follow how flat this background is (some are almost perfectly flat, so skin a few
    # Lab units away from a warm tan must still count as figure)
    band = np.zeros((h, w), bool)
    band[:28] = band[-28:] = True
    band[:, :28] = band[:, -28:] = True
    noise = float(np.percentile(d[band], 97))
    near_t = float(np.clip(noise * 1.8 + 1.0, 2.4, 7.0))
    fg_t = float(np.clip(near_t + 3.0, 5.4, 10.0))

    # the soft ground shadow: darker than the background but the same hue, in the lower part of the frame
    dl = bg[..., 0] - lab[..., 0]
    dab = np.sqrt(((lab[..., 1:] - bg[..., 1:]) ** 2).sum(-1))
    lower = np.zeros_like(d, bool)
    lower[int(h * 0.72):] = True
    shadow = lower & (dl > 1.5) & (dl < 26) & (dab < 9)

    near = d < near_t
    lbl, _ = ndimage.label(near | shadow)
    edge_ids = np.unique(np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]]))
    edge_ids = edge_ids[edge_ids > 0]
    outer = np.isin(lbl, edge_ids)

    mask = np.full((h, w), cv2.GC_PR_FGD, np.uint8)
    mask[near | shadow] = cv2.GC_PR_BGD
    mask[outer & near] = cv2.GC_BGD
    # anything clearly off the background colour is figure. The backgrounds are flat (noise under 2 in Lab),
    # so 10 is safe; it keeps skin that sits close to a warm background (The Maker's tan) from being dropped.
    sure_fg = ndimage.binary_erosion((d > fg_t) & ~shadow, iterations=2)
    mask[sure_fg] = cv2.GC_FGD

    # GrabCut at half size, then back to full size
    small = cv2.resize(rgb8, (w // 2, h // 2), interpolation=cv2.INTER_AREA)
    msmall = cv2.resize(mask, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), msmall, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg_small = np.isin(msmall, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8) * 255
    fg = cv2.resize(fg_small, (w, h), interpolation=cv2.INTER_LINEAR) > 127
    # full-resolution touch-ups: certain background stays out, certain figure stays in
    fg[outer & near] = False
    fg[sure_fg] = True

    # keep the figure and anything sizeable attached to the composition (e.g. a compass sparkle)
    lbl, n = ndimage.label(fg)
    if n:
        sizes = ndimage.sum(fg, lbl, range(1, n + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s >= max(400, sizes.max() * 0.002)]
        fg = np.isin(lbl, keep)
    # tiny pinholes inside the figure that are not background-coloured
    holes = ndimage.binary_fill_holes(fg) & ~fg
    hl, hn = ndimage.label(holes)
    for i in range(1, hn + 1):
        region = hl == i
        if region.sum() < 600 and np.median(d[region]) > near_t:
            fg |= region
    fg = ndimage.binary_opening(fg, iterations=1)

    # soft edge, then take the background colour back out of the edge pixels
    alpha = ndimage.gaussian_filter(fg.astype(np.float64), 1.1)
    alpha = np.clip((alpha - 0.08) / 0.84, 0, 1)
    bg_rgb = np.clip(color.lab2rgb(bg), 0, 1)
    a3 = alpha[..., None]
    est = np.where(a3 > 0.02, (rgb - (1 - a3) * bg_rgb) / np.maximum(a3, 0.02), rgb)
    est = np.clip(est, 0, 1)
    rgba = np.dstack([est, alpha])
    print(f"  {os.path.basename(path)[:8]}: background noise {noise:.2f}, near {near_t:.1f}, figure {fg_t:.1f}")
    return Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA")


def place(fig: Image.Image) -> Image.Image:
    """Crop to the figure, scale to the shared height, stand it on the foot line with a neutral shadow."""
    a = np.asarray(fig)[..., 3]
    ys, xs = np.nonzero(a > 24)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    crop = fig.crop(box)
    s = FIGURE_H / crop.height
    if crop.width * s > CANVAS_W - 24:
        s = (CANVAS_W - 24) / crop.width
    crop = crop.resize((round(crop.width * s), round(crop.height * s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    # where the feet are: the lowest 6% of the figure
    ca = np.asarray(crop)[..., 3]
    feet_rows = ca[int(ca.shape[0] * 0.94):]
    fx = np.nonzero(feet_rows.max(0) > 24)[0]
    feet_c = (fx.min() + fx.max()) / 2 if fx.size else crop.width / 2
    feet_w = (fx.max() - fx.min()) if fx.size else crop.width * 0.4
    x0 = round(CANVAS_W / 2 - feet_c)
    x0 = max(4, min(CANVAS_W - crop.width - 4, x0))
    y0 = FOOT_LINE - crop.height
    # neutral ground shadow (charcoal, soft)
    sh = Image.new("L", (CANVAS_W, CANVAS_H), 0)
    sw = max(feet_w * 1.25, 200)
    from PIL import ImageDraw
    ImageDraw.Draw(sh).ellipse([x0 + feet_c - sw / 2, FOOT_LINE - 16, x0 + feet_c + sw / 2, FOOT_LINE + 20], fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    shadow = Image.new("RGBA", (CANVAS_W, CANVAS_H), (41, 42, 49, 0))
    shadow.putalpha(sh)
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(crop, (x0, y0))
    return canvas


def main() -> None:
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    done = []
    for name in sorted(os.listdir(src)):
        key = name.split("-")[0]
        if key not in MAP:
            continue
        code = MAP[key]
        fig = place(cut(os.path.join(src, name)))
        fig.save(os.path.join(OUT, f"{code}.webp"), "WEBP", quality=88, method=6)
        done.append((code, fig))
        print(code, os.path.getsize(os.path.join(OUT, f"{code}.webp")) // 1024, "KB")
    if len(sys.argv) > 2:
        # contact sheet on two backgrounds, to check edges
        cols = 7
        tile_w, tile_h = 220, 264
        rows = (len(done) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * tile_w, rows * tile_h * 2), "#F8F6F0")
        for i, (code, fig) in enumerate(sorted(done)):
            t = fig.resize((tile_w, tile_h), Image.LANCZOS)
            for k, bgc in enumerate(["#F8F6F0", "#4C527A"]):
                tile = Image.new("RGBA", (tile_w, tile_h), bgc)
                tile.alpha_composite(t)
                sheet.paste(tile.convert("RGB"), ((i % cols) * tile_w, (i // cols) * tile_h + k * rows * tile_h))
        sheet.save(sys.argv[2])


if __name__ == "__main__":
    main()
