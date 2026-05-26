## Plan — Use your own cars as site backgrounds

Goal: Replace the Defender hero and AI-generated inventory shots with your uploaded GearBOX Autos cars. All text/logos/price callouts in the posters get removed so they read as clean automotive photography.

### Source images (uploaded)
1. White Hyundai Creta (rear) — urban sunset
2. Black BMW X5 (front) — garage
3. Black Honda Amaze (front 3/4) — street
4. Brown Honda Amaze (front 3/4) — tree-lined street
5. White Hyundai Creta (front 3/4) — outdoor

### Step 1 — Clean each photo
Use the image edit tool on each upload with a prompt to remove every overlay (logos, text blocks, price chips, owner/KMs badges, WhatsApp/phone bars, brand watermarks on number plates) and reconstruct the underlying car/background naturally. Output saved to `src/assets/`:
- `hero-bmw-x5.jpg` (16:9, landscape — for homepage hero)
- `car-creta-front.jpg` (4:3)
- `car-creta-rear.jpg` (4:3)
- `car-amaze-black.jpg` (4:3)
- `car-amaze-brown.jpg` (4:3)

QA each output by viewing it; re-run if any text/logo remains.

### Step 2 — Wire into the site
- **Hero (`src/routes/index.tsx`)**: swap `hero-defender.png` → `hero-bmw-x5.jpg`. Keep dark gradient overlay so headline stays legible.
- **About / How-it-works / Contact section backgrounds**: where a brand-new car visual is used decoratively, swap to one of the cleaned Cretas/Amazes (subtle, darkened).
- **Seed inventory fallback (`src/lib/cars.ts`)**: update `imageBySlug` map so the seeded `creta` slug uses `car-creta-front.jpg`; add new entries for `amaze-black`, `amaze-brown`, `creta-rear` if you want them surfaced. Existing AI shots for XUV500/Fortuner/Dzire stay until you upload replacements.
- **Admin-seeded cars**: optionally insert two new rows (BMW X5, Honda Amaze) via a small migration so they appear in `/buy` and `/inventory` out of the box, using the cleaned images as `image_url`.

### Step 3 — Polish pass
- Ensure hero overlay contrast still passes (tweak gradient opacity if BMW photo is too dark).
- Lazy-load all new images, add descriptive `alt` text ("Hyundai Creta SX — GearBOX Autos Jamshedpur" etc.) for SEO.
- Update homepage `og:image` to the cleaned BMW hero.

### Out of scope
- No layout/typography changes.
- No backend schema changes (unless you want the X5/Amaze auto-seeded — say the word).
- XUV500 / Fortuner / Dzire keep their current AI images until you share real photos.

Confirm and I'll execute.