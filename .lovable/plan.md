## Add Instagram + WhatsApp quick-contact buttons

Add a small floating action stack (bottom-right, fixed) visible on every page, with two circular icon buttons:

1. **Instagram** → opens `https://www.instagram.com/gearbox_autos_usedcars/` in new tab
2. **WhatsApp** → opens `https://wa.me/919065591253` in new tab (E.164 format, India +91)

Both open with `target="_blank"` and `rel="noopener noreferrer"`, with accessible `aria-label`s.

### Implementation
- New component: `src/components/SocialFloat.tsx` — fixed `bottom-6 right-6 z-40`, vertical stack of two buttons. WhatsApp uses brand green (`#25D366`), Instagram uses a pink→orange gradient. Lucide `Instagram` icon + Lucide `MessageCircle` (or inline WhatsApp SVG) for WhatsApp. Subtle hover scale, shadow.
- Mount once in `src/routes/__root.tsx` inside `RootComponent` so it appears on every route (including admin — confirm OK, otherwise hide on `/admin*`).
- Also add the same two links to the Footer "Contact" column so they're discoverable in-flow.

No backend changes.
