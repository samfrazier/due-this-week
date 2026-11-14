"""Build the Mac app icon set for the Safari app from the transparent logo.

Mac icons sit on a rounded-square "tile". Following Apple's icon grid, a
1024x1024 icon has an 824x824 tile (corner radius about 185) centered with
room for a soft shadow. The logo (store/icon-transparent-512.png, made by
make-icons.py) goes in the middle at its native 512px, so it is never scaled up.

Usage (from the project root, after make-icons.py):
    python3 utils/make-mac-icon.py

Writes:
    store/mac-icon-1024.png  (also the App Store icon)
    safari/Due This Week/Due This Week/Assets.xcassets/AppIcon.appiconset/mac-icon-*.png
"""

import importlib.util
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location(
    "make_icons", os.path.join(ROOT, "utils", "make-icons.py")
)
icons = importlib.util.module_from_spec(spec)
spec.loader.exec_module(icons)

SIZE = 1024
TILE = 824
RADIUS = 185
TILE_COLOR = (255, 255, 255)
SHADOW_OFFSET = 10  # px down
SHADOW_BLUR = 22
SHADOW_ALPHA = 0.28


def rounded_rect_distance(x, y, cx, cy, half, radius):
    """Signed distance from (x, y) to a rounded square (negative inside)."""
    qx = abs(x - cx) - (half - radius)
    qy = abs(y - cy) - (half - radius)
    outside = math.hypot(max(qx, 0.0), max(qy, 0.0))
    inside = min(max(qx, qy), 0.0)
    return outside + inside - radius


def over(dst, src):
    """Composite src RGBA (0-255 ints, straight alpha) over dst."""
    sa = src[3] / 255
    da = dst[3] / 255
    oa = sa + da * (1 - sa)
    if oa == 0:
        return [0, 0, 0, 0]
    return [
        round((src[i] * sa + dst[i] * da * (1 - sa)) / oa) for i in range(3)
    ] + [round(oa * 255)]


def build():
    w, h, logo = icons.read_png(os.path.join(ROOT, "store", "icon-transparent-512.png"))
    c = SIZE / 2
    half = TILE / 2
    img = []
    for y in range(SIZE):
        row = []
        for x in range(SIZE):
            px = [0, 0, 0, 0]
            # soft shadow under the tile
            ds = rounded_rect_distance(x + 0.5, y + 0.5 - SHADOW_OFFSET, c, c, half, RADIUS)
            if ds < SHADOW_BLUR:
                t = min(1.0, max(0.0, 1 - (ds + SHADOW_BLUR / 2) / (SHADOW_BLUR * 1.5)))
                px = [0, 0, 0, round(255 * SHADOW_ALPHA * t * t)]
            # the tile, with a 1px anti-aliased edge
            d = rounded_rect_distance(x + 0.5, y + 0.5, c, c, half, RADIUS)
            cover = min(1.0, max(0.0, 0.5 - d))
            if cover > 0:
                px = over(px, list(TILE_COLOR) + [round(255 * cover)])
            # the logo, centered at native size
            lx, ly = x - (SIZE - w) // 2, y - (SIZE - h) // 2
            if 0 <= lx < w and 0 <= ly < h and logo[ly][lx][3]:
                px = over(px, logo[ly][lx])
            row.append(px)
        img.append(row)
    return img


if __name__ == "__main__":
    big = build()
    icons.write_png(os.path.join(ROOT, "store", "mac-icon-1024.png"), big)
    out = os.path.join(
        ROOT, "safari", "Due This Week", "Due This Week", "Assets.xcassets", "AppIcon.appiconset"
    )
    for pt in (16, 32, 128, 256, 512):
        for scale in (1, 2):
            px = pt * scale
            img = big if px == SIZE else icons.resize(big, px)
            icons.write_png(os.path.join(out, f"mac-icon-{pt}@{scale}x.png"), img)
