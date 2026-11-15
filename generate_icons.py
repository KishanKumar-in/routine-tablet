import os
from PIL import Image, ImageDraw

def create_icon(size, is_maskable=False):
    # Create an image with an emerald & indigo aesthetic
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = 0 if is_maskable else int(size * 0.08)
    radius = int(size * 0.22) if not is_maskable else 0

    # Draw rounded rectangle background
    bg_color = (15, 17, 23, 255) # Deep slate
    if is_maskable:
        draw.rectangle([0, 0, size, size], fill=bg_color)
    else:
        draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=bg_color)

    # Accent subtle gradient or border ring
    ring_color = (16, 185, 129, 220) # Emerald accent
    border_width = max(2, int(size * 0.025))
    if not is_maskable:
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=radius,
            outline=ring_color,
            width=border_width
        )

    # Draw checkmark badge inside a circle
    cx, cy = size // 2, size // 2
    r = int(size * 0.26)
    
    # Outer circle for checkmark
    circle_box = [cx - r, cy - r, cx + r, cy + r]
    draw.ellipse(circle_box, fill=(16, 185, 129, 255))

    # Inner checkmark (white)
    # Check points: left, bottom tip, right tip
    line_w = max(3, int(size * 0.055))
    p1 = (cx - int(r * 0.45), cy + int(r * 0.02))
    p2 = (cx - int(r * 0.1), cy + int(r * 0.4))
    p3 = (cx + int(r * 0.45), cy - int(r * 0.35))

    draw.line([p1, p2, p3], fill=(255, 255, 255, 255), width=line_w, joint="curve")

    # Draw small flame/sparkle icon at top right
    flame_cx = cx + int(r * 0.85)
    flame_cy = cy - int(r * 0.85)
    flame_r = int(size * 0.09)
    draw.ellipse([flame_cx - flame_r, flame_cy - flame_r, flame_cx + flame_r, flame_cy + flame_r], fill=(245, 158, 11, 255))
    
    # Flame inner dot
    draw.ellipse([flame_cx - flame_r//2, flame_cy - flame_r//2, flame_cx + flame_r//2, flame_cy + flame_r//2], fill=(254, 240, 138, 255))

    return img

os.makedirs("icons", exist_ok=True)
create_icon(192).save("icons/icon-192.png")
create_icon(512).save("icons/icon-512.png")
create_icon(512, is_maskable=True).save("icons/icon-maskable-512.png")
create_icon(64).save("icons/favicon.png")
print("Icons created successfully!")
