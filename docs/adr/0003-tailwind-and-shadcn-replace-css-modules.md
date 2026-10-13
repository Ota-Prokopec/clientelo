# Tailwind and shadcn replace CSS Modules

The page shell from #10 is styled with CSS Modules and hand-written `<input type="radio|range|number">` controls, and the tools still to come need a slider, a segmented picker, a validated email form and a dark mode, each accessible on a phone. We style with **Tailwind v4** (`@tailwindcss/vite`) only, and take every UI primitive from **shadcn**, installed through its CLI on **Base UI** with the **Vega** preset into `src/components/ui/` and restyled through the theme tokens in `src/index.css`. shadcn gives us those primitives as source we own instead of controls we would write and keep accessible by hand. Base UI is the CLI's default primitive layer, and Vega's components take their corner radius from the theme, which the rounded design identity ([design-identity.md](../specifications/design-identity.md)) needs. The rules for using them are [tailwind.md](../standards/tailwind.md) and [shadcn.md](../standards/shadcn.md).

The same change settles four choices that hang off it:

- **Forms** use shadcn's `Field` components with react-hook-form's `Controller` and `zodResolver`. On Base UI, shadcn has no `<Form>` wrapper: its `form` registry item is empty there, and shadcn's React Hook Form guide uses this pattern. The Lead's zod schema lives in `src/schemas/leadSchema.ts`, so the Lead Form and step 7's `/api/lead` validate against the same rules.
- **Motion** comes from the `motion` package (`motion/react`), loaded through `LazyMotion` with the `domAnimation` features, so its upfront cost on the First Screen stays small.
- **Dark mode** follows the system's `prefers-color-scheme`, with no toggle: the page has no navigation, and a toggle would be chrome that leads nowhere near the Lead Form.
- **The Lead Magnet PDF** ([ADR-0002](./0002-lead-magnet-pdf-generated-from-data-module.md)) is styled with Tailwind classes through `react-pdf-tailwind`. Its `createTw()` takes the theme as a JS object and can't read `@theme`, and it passes colours through unconverted, so `src/design/tokens.ts` mirrors the light palette in hex and the fonts, and a Vitest test fails when it drifts from `@theme`. The PDF is light-only.

## Considered Options

- **Keep CSS Modules with hand-written controls.** No new dependency, but every slider, toggle and form state, with its keyboard and screen-reader behaviour, written and kept by hand.
- **Tailwind without shadcn.** Same primitive problem as above.
- **shadcn on Radix.** It still has the classic `<Form>`/`<FormField>` wrapper, but Radix is now the opt-in layer and Base UI the default.
- **The Lyra preset.** Its components hard-code `rounded-none`, so every primitive would need its corners overridden by hand.
- **Read `@theme` from `index.css` at build time for the PDF.** One source for the tokens, but a CSS parser of our own to maintain, against a mirror module and one test.
- **Lint rules for the component rule.** oxlint can ban raw form elements outside `src/components/ui/` (`react/forbid-elements`) and CSS Module imports (`no-restricted-imports`). We keep both as written standards that `/code-review` checks instead.

## Consequences

- The "Bloky" identity from #10 goes: its tokens, Bricolage Grotesque and every `.module.css`. The page's identity is "Mřížka" in clientelo.cz's colours ([design-identity.md](../specifications/design-identity.md)), picked from prototypes kept on the branch `chore/prototype-design-directions`.
- The files in `src/components/ui/` are vendored source: `shadcn add --overwrite` replaces them, so a primitive is restyled through tokens or at the call site before its file is edited ([shadcn.md](../standards/shadcn.md)).
- Every colour role has a light and a dark value, and the PDF's colours exist twice (`@theme` and `tokens.ts`), held together by the sync test.
- oxlint's `react/only-export-components` warns on shadcn's `button.tsx`, `badge.tsx` and `toggle.tsx`, which export their `cva` variants beside the component. The migration fixes the cause instead of silencing it.
