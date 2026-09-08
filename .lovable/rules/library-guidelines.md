# gearbox autos — Guidelines

## Components

The design system exports these components — import them from `@ws-fbnsxmjeiapi8qlhmbew/1406dad9-9280-43ae-8894-1eb8be55a558` and compose them before building anything from scratch:

`CarCard`, `CarImageCarousel`, `Constants`, `Footer`, `Header`, `Logo`, `ShareButton`, `SocialFloat`, `TrustBar`, `WhatsAppShareCarButton`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-fbnsxmjeiapi8qlhmbew/1406dad9-9280-43ae-8894-1eb8be55a558/styles.css` (source — preferred import)
- `@ws-fbnsxmjeiapi8qlhmbew/1406dad9-9280-43ae-8894-1eb8be55a558/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)

