# Gearbox Autos design system

Build premium automotive experiences with strong contrast, concise copy, and clear action hierarchy. Use the exported components and semantic design tokens rather than recreating controls or hardcoding visual values.

## Foundations

- React and Tailwind CSS v4 are the supported UI stack.
- Import the library entry once to load the canonical theme stylesheet.
- Use `Button`, `Input`, `Badge`, and `Card` before creating equivalent controls.
- Use semantic classes such as `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, and `bg-primary`.
- Use `cn` when merging conditional Tailwind classes.

## Typography

The brand uses Anton and Oswald for display typography and Montserrat for body copy. Caveat is reserved for occasional handwritten editorial accents, while Inter supports the Gearbox Garage experience. Consumer applications must load these fonts through document-head stylesheet links; never use remote `@import` statements in CSS.

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