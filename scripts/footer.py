"""
Footer background for Olfia (Claude, 2026-11-10, after two mood references Tiffany shared:
a dot-dithered sky and a hillside with pixel lace). Drawn from scratch in Olfia's colours:
a halftone sky whose clouds are left as bare paper, rolling sage hills, and a few cross-stitch sprigs.
Run:  python3 scripts/footer.py  ->  public/assets/footer/sky.webp
"""
from __future__ import annotations

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 2000, 640
CELL = 9
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "footer")
rng = np.random.default_rng(11)


def hexrgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def noise(w: int, h: int, octaves: int = 5, base: int = 6) -> np.ndarray:
    """Smooth fractal noise in 0..1 from bilinearly upsampled random grids."""
    out = np.zeros((h, w))
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gw, gh = base * 2 ** o + 1, max(2, int(base * 2 ** o * h / w) + 1)
        grid = rng.random((gh, gw))
        img = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += np.asarray(img, dtype=float) / 255 * amp
        total += amp
        amp *= 0.5
    out /= total
    return (out - out.min()) / (out.max() - out.min())


def hills_mask(y0: float, amp: float, freq: float, phase: float) -> np.ndarray:
    xs = np.arange(W)
    top = y0 + amp * np.sin(xs / W * np.pi * freq + phase) + amp * 0.35 * np.sin(xs / W * np.pi * freq * 2.7 + phase * 1.7)
    ys = np.arange(H)[:, None]
    return ys >= top[None, :]


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    ivory = np.array(hexrgb("#F8F6F0"), dtype=float)
    paper = Image.new("RGB", (W, H), tuple(int(c) for c in ivory))
    d = ImageDraw.Draw(paper)

    # --- halftone sky: square dots, larger toward the top; clouds stay bare paper with a soft rim
    gw, gh = W // CELL, H // CELL
    cloud = noise(gw, gh, octaves=5, base=5)
    yy = np.linspace(0, 1, gh)[:, None]
    band = np.exp(-((yy - 0.40) / 0.2) ** 2)
    cloud = np.clip((cloud * 0.85 + band * 0.5 - 0.42) * 2.2, 0, 1)
    sky = np.clip(1.0 - yy * 1.05, 0, 1) ** 0.9
    deep, mid, peri = hexrgb("#4C527A"), hexrgb("#6E76A8"), hexrgb("#A0A6C8")
    for j in range(gh):
        for i in range(gw):
            v = sky[j, 0] * (1 - cloud[j, i])
            if v <= 0.05:
                continue
            r = (CELL * 0.42) * min(1.0, v) ** 0.7
            col = deep if v > 0.7 else mid if v > 0.4 else peri
            cx, cy = i * CELL + CELL / 2, j * CELL + CELL / 2
            d.rectangle([cx - r, cy - r, cx + r, cy + r], fill=col)

    # --- rolling hills, back to front
    arr = np.asarray(paper, dtype=float)
    layers = [
        (H * 0.66, 34, 2.2, 0.6, "#C9D4B2"),
        (H * 0.74, 42, 1.6, 2.1, "#9DB28A"),
        (H * 0.84, 36, 2.6, 4.0, "#7C8A4A"),
    ]
    for y0, amp, freq, ph, col in layers:
        m = hills_mask(y0, amp, freq, ph)
        shade = noise(W // 4, H // 4, octaves=3, base=8)
        shade = np.asarray(Image.fromarray((shade * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), dtype=float) / 255
        c = np.array(hexrgb(col), dtype=float)
        tint = c[None, None, :] * (0.92 + 0.14 * shade[:, :, None])
        arr = np.where(m[:, :, None], tint, arr)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    # a light dot texture on the hills so they belong to the same print
    hd = ImageDraw.Draw(img)
    front = hills_mask(H * 0.84, 36, 2.6, 4.0)
    mid_h = hills_mask(H * 0.74, 42, 1.6, 2.1)
    for j in range(0, H, CELL):
        for i in range(0, W, CELL):
            if front[j, i]:
                hd.rectangle([i + 3, j + 3, i + 5, j + 5], fill=hexrgb("#6A7840"))
            elif mid_h[j, i] and (i // CELL + j // CELL) % 2 == 0:
                hd.rectangle([i + 3, j + 3, i + 5, j + 5], fill=hexrgb("#8CA078"))

    # --- cross-stitch sprigs (white squares) drifting over the sky
    sprig = [
        "....X....",
        "...XXX...",
        "..X.X.X..",
        ".XX.X.XX.",
        "....X....",
        "X..XXX..X",
        ".X..X..X.",
        "..XXXXX..",
        "....X....",
        "...X.X...",
        "..X...X..",
    ]
    dd = ImageDraw.Draw(img)
    for (ox, oy, s) in [(70, 50, 8), (1800, 70, 8), (980, 30, 6), (520, 150, 5), (1460, 160, 5)]:
        for r, row in enumerate(sprig):
            for c, ch in enumerate(row):
                if ch == "X":
                    x, y = ox + c * (s + 2), oy + r * (s + 2)
                    dd.rectangle([x, y, x + s, y + s], fill=(255, 255, 255))

    # --- film grain to match the site
    g = rng.normal(0, 7, (H, W, 1))
    out = np.clip(np.asarray(img, dtype=float) + g, 0, 255).astype(np.uint8)
    final = Image.fromarray(out).filter(ImageFilter.GaussianBlur(0.3))
    final.save(os.path.join(OUT, "sky.webp"), "WEBP", quality=80, method=6)
    print("saved", os.path.getsize(os.path.join(OUT, "sky.webp")) // 1024, "KB")


if __name__ == "__main__":
    main()
