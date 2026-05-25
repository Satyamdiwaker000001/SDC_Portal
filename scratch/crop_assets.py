import os
from PIL import Image

# Setup directories
output_dir = r"a:\New project\SDC_Portal\frontend\public\images"
os.makedirs(output_dir, exist_ok=True)

# Open source image
img_path = r"C:\Users\diwak\.gemini\antigravity-ide\brain\5ec516b3-c358-4f29-a7a3-0a9b306aeb1d\media__1779702008595.jpg"
img = Image.open(img_path)

# Avatar Coordinates (left, top, right, bottom)
# Based on 1024x1024 grid, targeting the exact avatar box of each card
avatars = {
    "avatar_raven.png": (75, 195, 245, 360),
    "avatar_neo.png": (305, 195, 475, 360),
    "avatar_phantom.png": (535, 195, 705, 360),
    "avatar_circuit.png": (765, 195, 935, 360),
    "avatar_neural.png": (75, 565, 245, 730),
    "avatar_ghost.png": (305, 565, 475, 730),
    "avatar_zero.png": (535, 565, 705, 730),
    "avatar_data.png": (765, 565, 935, 730)
}

print("Cropping avatars...")
for name, box in avatars.items():
    cropped = img.crop(box)
    save_path = os.path.join(output_dir, name)
    cropped.save(save_path, "PNG")
    print(f"Saved: {save_path} (size: {cropped.size})")

# Also crop the background (an area from the top right or clean bg area)
print("Extracting background asset...")
bg_box = (0, 0, 1024, 1024) # Use full source image as styled background
bg_cropped = img.crop(bg_box)
bg_path = os.path.join(output_dir, "portal_bg.jpg")
bg_cropped.save(bg_path, "JPEG")
print(f"Saved background: {bg_path}")
print("Asset extraction completed successfully!")
