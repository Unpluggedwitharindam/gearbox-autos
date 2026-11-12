# Gearbox Autos design system

Build premium automotive experiences with strong contrast, concise copy, and clear action hierarchy. Use the exported components and semantic design tokens rather than recreating controls or hardcoding visual values.

## Foundations

- React and Tailwind CSS v4 are the supported UI stack.
- Import the library entry once to load the canonical theme stylesheet.
- Use `Button`, `Input`, `Badge`, and `Card` before creating equivalent controls.
- Use semantic classes such as `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, and `bg-primary`.
- Use `cn` when merging conditional Tailwind classes.

## Typography

The library uses Anton and Oswald for display typography and Montserrat for body copy. Caveat is reserved for occasional handwritten editorial accents, while Inter supports clean marketplace typography. Consumer applications must load these fonts through document-head stylesheet links; never use remote `@import` statements in CSS.

Attaching this library copies its theme stylesheet but not the preview application's root route. Importing the library entry therefore registers font-family tokens without loading the font files. Add the following entries to the consumer's root route `head().links`, preserving its existing links and avoiding duplicate font requests:

```tsx
{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
{
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500;600&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap',
},
```

This is a locally authored library (`source_type: local`), not a wrapper around an upstream npm design system. No upstream package or upstream version pin applies; do not invent one.

## Interaction and accessibility

- Use semantic buttons, links, labels, and form controls.
- Preserve visible keyboard focus and disabled states.
- Add accessible names to icon-only controls.
- Keep one clear primary action per section.
- Respect reduced-motion preferences for animation.

## Visual constraints

- Preserve the black, steel, white, and signal-amber Gearbox Autos identity.
- Do not replace the supplied Gearbox Autos logo or vehicle photography with generated substitutes.
- Avoid generic marketplace dashboards, excessive cards, oversized rounded pills, decorative gradients, and raw color values.
- Keep layouts spacious and editorial while maintaining practical mobile usability.