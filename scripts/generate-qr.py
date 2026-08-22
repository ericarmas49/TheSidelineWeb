#!/usr/bin/env python3
"""Generate transparent SideLine download QR codes."""

import qrcode
from PIL import Image

URL = "https://thesideline.club/app"
OUTPUTS = [
    ("assets/app/sideline-download-qr-white.png", (255, 255, 255)),
    ("assets/app/sideline-download-qr-dark.png", (33, 33, 33)),
]


def write_transparent_qr(path: str, fill_rgb: tuple[int, int, int]) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=2,
    )
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    img.putdata([
        (*fill_rgb, 255) if pixel[:3] == (0, 0, 0) else (255, 255, 255, 0)
        for pixel in img.getdata()
    ])
    img.save(path)
    print(f"Wrote {path} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    for output_path, color in OUTPUTS:
        write_transparent_qr(output_path, color)
