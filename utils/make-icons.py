"""Build every icon size from store/icon-source.png, using only the Python standard library.

The source artwork has an opaque white background. This script:
  1. Decodes the PNG (8-bit RGB or RGBA, non-interlaced).
  2. Makes the *outer* white background transparent. It flood-fills from the
     image border through near-white pixels, so white areas *inside* the icon
     (like the calendar page) stay untouched. Edge pixels get partial alpha
     so the rounded corners stay smooth.
  3. Downscales with area averaging (premultiplied alpha, so there are no
     white fringes).
  4. Writes the PNGs the extension and the Edge store need.

Usage (from the project root):
    python3 utils/make-icons.py [path/to/source.png]

Writes:
    store/icon-transparent-512.png           -> master copy with transparency
    src/assets/img/icon-{16,32,48,128}.png   -> extension icons (manifest)
    store/logo-300.png                        -> Edge Add-ons store logo
"""

import os
import struct
import sys
import zlib
from collections import deque

# A pixel counts as "background white" if all channels are at least this bright.
BG_THRESHOLD = 236
# Pixels near the background (within RIM_RADIUS px) that are brighter than this
# get partial transparency.
EDGE_THRESHOLD = 170
RIM_RADIUS = 2


# ---------- PNG decode / encode ----------

def read_png(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    pos, idat = 8, b""
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        tag = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + length]
        if tag == b"IHDR":
            w, h, depth, ctype, _, _, interlace = struct.unpack(">IIBBBBB", body)
        elif tag == b"IDAT":
            idat += body
        pos += 12 + length
    assert depth == 8 and ctype in (2, 6) and interlace == 0, "need 8-bit RGB/RGBA, non-interlaced"
    bpp = 3 if ctype == 2 else 4
    raw = zlib.decompress(idat)
    stride = w * bpp
    prev = bytearray(stride)
    pixels = []
    i = 0
    for _ in range(h):
        ftype = raw[i]
        line = bytearray(raw[i + 1:i + 1 + stride])
        i += 1 + stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
            if ftype == 1:
                line[x] = (line[x] + a) & 255
            elif ftype == 2:
                line[x] = (line[x] + b) & 255
            elif ftype == 3:
                line[x] = (line[x] + (a + b) // 2) & 255
            elif ftype == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                line[x] = (line[x] + pred) & 255
        row = []
        for x in range(w):
            px = line[x * bpp:(x + 1) * bpp]
            row.append([px[0], px[1], px[2], px[3] if bpp == 4 else 255])
        pixels.append(row)
        prev = line
    return w, h, pixels


def write_png(path, pixels):
    h, w = len(pixels), len(pixels[0])
    raw = b"".join(b"\x00" + bytes(v for px in row for v in px) for row in pixels)

    def chunk(tag, body):
        return struct.pack(">I", len(body)) + tag + body + struct.pack(">I", zlib.crc32(tag + body) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(png)
    print(f"wrote {os.path.relpath(path)} ({w}x{h})")


# ---------- background removal ----------

def remove_outer_background(w, h, px):
    bg = [[False] * w for _ in range(h)]
    queue = deque()
    for x in range(w):
        queue.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        queue.extend([(0, y), (w - 1, y)])
    while queue:
        x, y = queue.popleft()
        if bg[y][x] or min(px[y][x][:3]) < BG_THRESHOLD:
            continue
        bg[y][x] = True
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny][nx]:
                queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                px[y][x] = [255, 255, 255, 0]
                continue
            # Anti-aliased rim: bright pixels within RIM_RADIUS of the background
            # are a blend of the artwork colour and white. Estimate how much
            # white is mixed in (that becomes transparency), then remove the
            # white from the colour so no light fringe shows on dark toolbars.
            near_bg = any(
                bg[ny][nx]
                for ny in range(max(0, y - RIM_RADIUS), min(h, y + RIM_RADIUS + 1))
                for nx in range(max(0, x - RIM_RADIUS), min(w, x + RIM_RADIUS + 1))
            )
            lo = min(px[y][x][:3])
            if near_bg and lo > EDGE_THRESHOLD:
                alpha = max(0.02, min(1.0, (255 - lo) / (255 - EDGE_THRESHOLD)))
                r, g, b = (
                    max(0, min(255, round((c - (1 - alpha) * 255) / alpha)))
                    for c in px[y][x][:3]
                )
                px[y][x] = [r, g, b, round(255 * alpha)]
    return px


# ---------- resizing ----------

def resize(px, size):
    h, w = len(px), len(px[0])
    out = []
    for oy in range(size):
        y0, y1 = oy * h / size, (oy + 1) * h / size
        row = []
        for ox in range(size):
            x0, x1 = ox * w / size, (ox + 1) * w / size
            r = g = b = a = total = 0.0
            for sy in range(int(y0), min(h, int(y1 + 0.999999))):
                wy = min(y1, sy + 1) - max(y0, sy)
                for sx in range(int(x0), min(w, int(x1 + 0.999999))):
                    wgt = wy * (min(x1, sx + 1) - max(x0, sx))
                    pr, pg, pb, pa = px[sy][sx]
                    al = pa / 255 * wgt
                    r += pr * al
                    g += pg * al
                    b += pb * al
                    a += al
                    total += wgt
            if a > 0:
                row.append([round(r / a), round(g / a), round(b / a), round(255 * a / total)])
            else:
                row.append([0, 0, 0, 0])
        out.append(row)
    return out


if __name__ == "__main__":
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "store", "icon-source.png")
    w, h, px = read_png(src)
    assert w == h, "icon source must be square"
    px = remove_outer_background(w, h, px)
    write_png(os.path.join(root, "store", "icon-transparent-512.png"), px if w == 512 else resize(px, 512))
    for s in (16, 32, 48, 128):
        write_png(os.path.join(root, "src", "assets", "img", f"icon-{s}.png"), resize(px, s))
    write_png(os.path.join(root, "store", "logo-300.png"), resize(px, 300))
