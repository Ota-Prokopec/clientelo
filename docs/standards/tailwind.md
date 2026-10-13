# Tailwind

How to style the page. Read this before you write a `className` or touch `src/index.css`. What the page should look like is [design-identity.md](../specifications/design-identity.md); why Tailwind is [ADR-0003](../adr/0003-tailwind-and-shadcn-replace-css-modules.md).

## One way to style

- **Tailwind v4 utilities are the only styling.** No CSS Modules, no other stylesheet beside `src/index.css`, and no `style` prop except to pass a computed CSS custom property.
- **Compose conditional classes with `cn`** from `@/lib/utils`, so a later class wins over an earlier one instead of both landing in the DOM.
- **Mobile first.** Unprefixed utilities style the 375 px phone. Add `sm:` and wider only for what changes on a larger screen.

## Tokens

- **Every colour, radius, font and type size is a token** in `src/index.css`: shadcn's roles (`background`, `primary`, `muted-foreground`…) and ours (`heading`, `brand`, `signal`, `block`). Use them by name (`text-brand`, `bg-block`, `rounded-md`, `text-ticker`). Never put a hex value or an arbitrary colour (`text-[#00666c]`) in a `className`: a raw value can't follow dark mode.
- **A type size is one token per role in [design-identity.md](../specifications/design-identity.md#type)** (`text-ticker`, `text-label`), carrying its line height, tracking and weight.
- **A type-size token never goes through `cn` beside another `text-*` class.** `cn` doesn't know our names and reads `text-label` as a colour: `cn('text-ter', 'text-signal')` drops `text-ter`, and `cn('text-sm', 'text-label')` keeps both and leaves the winner to the stylesheet's order. Write a size and its colour in one plain `className` string. A shadcn component merges its `className` with its own `text-sm` through `cn`, so give it the size on an element inside it (`<Label><span className="text-label">…</span></Label>`).
- **A new role gets a light and a dark value in the same change.** Dark mode is the system's `prefers-color-scheme`. Prefer a token whose value changes with the mode over a `dark:` override at the call site. `tests/index.css.test.ts` fails when a role misses either value.
- **Content that stays light in dark mode** (the PDF thumbnail) is scoped to the light token values, not painted with raw hex: mark it `data-palette="light"`, which `src/index.css` gives the light values alongside `:root`.
- **`src/design/tokens.ts` mirrors** the light palette in hex and the fonts, for the PDF ([ADR-0003](../adr/0003-tailwind-and-shadcn-replace-css-modules.md)). Change a mirrored token in both files in the same commit; the sync test fails otherwise.
