---
description: "Brand assets shipped by the gearbox autos design system (logos, icons, illustrations, photography, fonts, videos) with exact import paths. Read before adding any logo, icon, illustration, image, video, or font to the app: use these real assets instead of placeholders, stock photos, or generated images."
---

# gearbox autos — Assets

These files are copied into `src/design-system/{slug}/assets/` in this project — never generate, placeholder, or substitute an asset that exists here.

Raw files import directly, e.g. `import logo from "@/design-system/{slug}/assets/logos/logo.svg"`.
R2 pointer files (`.asset.json`) are imported as JSON — use the `url` property, e.g. `import hero from "@/design-system/{slug}/assets/hero.png.asset.json"` then `<img src={hero.url} />`.
The full machine-readable catalog lives in this library's `design-system.json` (`assets` array).

## Logos

- `@/design-system/{slug}/assets/gearbox-logo.png.asset.json` (png, R2 pointer)

## Images

- `@/design-system/{slug}/assets/about-jsr.png` (png)
- `@/design-system/{slug}/assets/car-amaze-black.jpg` (jpg)
- `@/design-system/{slug}/assets/car-amaze-brown.jpg` (jpg)
- `@/design-system/{slug}/assets/car-creta-front.jpg` (jpg)
- `@/design-system/{slug}/assets/car-creta.jpg` (jpg)
- `@/design-system/{slug}/assets/car-dzire.jpg` (jpg)
- `@/design-system/{slug}/assets/car-fortuner.jpg` (jpg)
- `@/design-system/{slug}/assets/car-xuv500.jpg` (jpg)
- `@/design-system/{slug}/assets/contact-creta.png` (png)
- `@/design-system/{slug}/assets/hero-bmw-x5.jpg` (jpg)
- `@/design-system/{slug}/assets/hero-defender.png` (png)
- `@/design-system/{slug}/assets/inventory-hero.png` (png)
- `@/design-system/{slug}/assets/sell-bg.png` (png)
- `@/design-system/{slug}/assets/showroom-hero.jpg.asset.json` (jpg, R2 pointer)
- `@/design-system/{slug}/assets/verna.png` (png)

