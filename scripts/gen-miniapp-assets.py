#!/usr/bin/env python3
"""Generate PNG assets for a Farcaster Mini App.

Produces three PNGs per Farcaster Mini App spec:
  - icon.png  : 1024x1024 RGB, no alpha
  - splash.png: 200x200 RGB
  - embed.png : 1200x800 RGB (3:2 aspect ratio — NOT 1200x630)

Text on the embed image is auto-sized via fit_text() so it never overflows.

Usage:
  /tmp/pil-venv/bin/python scripts/gen-miniapp-assets.py <slug>

Requires:
  /tmp/pil-venv/bin/python with Pillow installed
  (uv pip install --python /tmp/pil-venv/bin/python Pillow)

Customize the OUT path and text constants below for each app.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

# --- CONFIG: edit these per app ---
SLUG = sys.argv[1] if len(sys.argv) > 1 else "claude-test-lab"
OUT = f"/home/ubuntu/app-factory/apps/{SLUG}/public/assets"

BG     = (30, 27, 75)        # dark indigo
ACCENT = (139, 92, 246)      # violet
WHITE  = (255, 255, 255)
LIGHT  = (199, 210, 254)     # light indigo

APP_NAME    = "Claude Test Lab"
APP_SUBTITLE = "Farcaster Mini App diagnostics"
APP_DESC    = "SDK  •  embed metadata  •  manifest"
APP_FOOTER  = "Powered by App Factory"
# --- end CONFIG ---


def get_font(size):
    for c in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def fit_text(draw, s, max_w, start_size, min_size=18):
    """Auto-shrink font until text fits within max_w pixels."""
    size = start_size
    while size > min_size:
        f = get_font(size)
        bbox = draw.textbbox((0, 0), s, font=f)
        w = bbox[2] - bbox[0]
        if w <= max_w:
            return f, size, w
        size -= 2
    f = get_font(min_size)
    bbox = draw.textbbox((0, 0), s, font=f)
    return f, min_size, bbox[2] - bbox[0]


def draw_test_tube(draw, cx, cy, w, h, color):
    """Simple test tube icon. Replace with app-specific graphic."""
    tube_w = w // 3
    x0 = cx - tube_w // 2
    x1 = cx + tube_w // 2
    y0 = cy - h // 2
    y1 = cy + h // 2
    draw.rounded_rectangle([x0, y0, x1, y1], radius=tube_w // 2,
                            outline=color, width=max(2, w // 20))
    fill_top = y0 + int(h * 0.6)
    draw.rectangle([x0 + 2, fill_top, x1 - 2, y1 - 2], fill=color)
    r = max(2, w // 40)
    draw.ellipse([cx - r * 2, fill_top + h * 0.1,
                  cx - r * 2 + r * 2, fill_top + h * 0.1 + r * 2], fill=WHITE)
    draw.ellipse([cx + r, fill_top + h * 0.2,
                  cx + r + r, fill_top + h * 0.2 + r], fill=WHITE)


def make_icon():
    img = Image.new("RGB", (1024, 1024), BG)
    draw = ImageDraw.Draw(img)
    draw_test_tube(draw, 512, 512, 600, 700, ACCENT)
    badge_r = 120
    bx, by = 512 + 180, 512 + 180
    draw.ellipse([bx - badge_r, by - badge_r, bx + badge_r, by + badge_r],
                 fill=(34, 197, 94))
    s = badge_r * 0.5
    draw.line([(bx - s * 0.6, by + s * 0.1),
               (bx - s * 0.1, by + s * 0.6),
               (bx + s * 0.7, by - s * 0.4)], fill=WHITE, width=24)
    img.save(os.path.join(OUT, "icon.png"), "PNG", optimize=True)


def make_splash():
    img = Image.new("RGB", (200, 200), BG)
    draw = ImageDraw.Draw(img)
    draw_test_tube(draw, 100, 100, 120, 140, ACCENT)
    img.save(os.path.join(OUT, "splash.png"), "PNG", optimize=True)


def make_embed():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw_test_tube(draw, 220, H // 2, 220, 320, ACCENT)

    right_x = 440
    right_w_max = W - right_x - 60

    title_font, _, _    = fit_text(draw, APP_NAME, right_w_max, 80)
    subtitle_font, _, _ = fit_text(draw, APP_SUBTITLE, right_w_max, 44)
    desc_font, _, _     = fit_text(draw, APP_DESC, right_w_max, 30)

    tb = draw.textbbox((0, 0), "Tg", font=title_font)
    sb = draw.textbbox((0, 0), "Tg", font=subtitle_font)
    db = draw.textbbox((0, 0), "Tg", font=desc_font)
    title_h = tb[3] - tb[1]
    sub_h   = sb[3] - sb[1]
    desc_h  = db[3] - db[1]
    gap1, gap2 = 30, 25
    block_h = title_h + gap1 + sub_h + gap2 + desc_h
    y = (H - block_h) // 2

    draw.text((right_x, y), APP_NAME, fill=WHITE, font=title_font)
    draw.text((right_x, y + title_h + gap1),
              APP_SUBTITLE, fill=LIGHT, font=subtitle_font)
    draw.text((right_x, y + title_h + gap1 + sub_h + gap2),
              APP_DESC, fill=LIGHT, font=desc_font)

    bar_h = 56
    draw.rectangle([0, H - bar_h, W, H], fill=ACCENT)
    footer_font = get_font(24)
    fbbox = draw.textbbox((0, 0), APP_FOOTER, font=footer_font)
    fw = fbbox[2] - fbbox[0]
    fh = fbbox[3] - fbbox[1]
    draw.text(((W - fw) // 2, H - bar_h + (bar_h - fh) // 2 - 4),
              APP_FOOTER, fill=WHITE, font=footer_font)

    img.save(os.path.join(OUT, "embed.png"), "PNG", optimize=True)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    make_icon()
    make_splash()
    make_embed()
    print(f"Generated assets for '{SLUG}' in {OUT}")
    for f, expected in [("icon", "1024x1024"), ("splash", "200x200"),
                        ("embed", "1200x800")]:
        path = os.path.join(OUT, f"{f}.png")
        with Image.open(path) as im:
            w, h = im.size
            ok = "OK" if (w, h) in [(1024, 1024), (200, 200), (1200, 800)] else "FAIL"
            print(f"  {f}.png: {w}x{h} ({expected}) {ok}")