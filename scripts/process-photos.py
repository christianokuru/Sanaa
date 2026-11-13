"""Turn source photos into the web files the site serves.

Usage: python3 scripts/process-photos.py <source-dir>
Each <source-dir>/<course-id>.jpg becomes public/images/courses/<course-id>-{480,1080,1600}.webp.
Very tall or very wide photos are cropped to between 3:4 and 4:3, keeping the
upper part of tall photos (where faces and hands usually are).
"""
import pathlib
import sys

from PIL import Image, ImageOps

WIDTHS = (480, 1080, 1600)
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "images" / "courses"


def clamp_aspect(im: Image.Image) -> Image.Image:
    w, h = im.size
    if h / w > 4 / 3:  # too tall: keep 3:4, biased to the top
        nh = round(w * 4 / 3)
        top = round((h - nh) * 0.3)
        return im.crop((0, top, w, top + nh))
    if w / h > 4 / 3:  # too wide: keep 4:3, centred
        nw = round(h * 4 / 3)
        left = (w - nw) // 2
        return im.crop((left, 0, left + nw, h))
    return im


def main(src: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(pathlib.Path(src).glob("*.jpg")):
        try:
            im = clamp_aspect(ImageOps.exif_transpose(Image.open(path)).convert("RGB"))
        except OSError:
            print(f"skipped {path.name}: not a readable image", file=sys.stderr)
            continue
        for width in WIDTHS:
            w = min(width, im.width)
            resized = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            resized.save(OUT / f"{path.stem}-{width}.webp", "WEBP", quality=66, method=6)
        print(path.stem, im.size)


if __name__ == "__main__":
    main(sys.argv[1])
