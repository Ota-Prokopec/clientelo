# shadcn

How to build UI from shadcn components. Read this before you add a control, a form or a component to the page. The decision and its alternatives are [ADR-0003](../adr/0003-tailwind-and-shadcn-replace-css-modules.md); the look is [design-identity.md](../specifications/design-identity.md).

## Where primitives come from

- **Every UI primitive is a shadcn component** in `src/components/ui/`, on Base UI with the Vega preset, added with the shadcn command in [README.md](../../README.md#commands). Domain components (`FundPicker`, `FeeCalculator`, `StickyCta`) and Sections are built from these primitives and Tailwind utilities.
- **No raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<label>` outside `src/components/ui/`.** When shadcn has no primitive for what you need, build one in `src/components/ui/` from Base UI's parts and style it with tokens.
- **A link that looks like a button** is `<Button nativeButton={false} render={<a href="…" />}>`, so it keeps link semantics.

## Restyling

- **Tokens first.** A change the whole page should share goes into the theme in `src/index.css` ([tailwind.md](./tailwind.md)).
- **Then the call site.** A one-place change is a `className` on the component, merged by `cn`. A primitive's inner parts take a descendant selector on its `data-slot` (`[&_[data-slot=slider-thumb]]:size-7`).
- **Edit a file in `src/components/ui/` last**, only when neither of the above can express the change. `shadcn add --overwrite` replaces these files, so record each edit in the file's top comment, where the next update will see it.

## Forms

- **A form is `Field`, `FieldLabel` and `FieldError` around shadcn inputs**, wired with react-hook-form's `Controller` and `zodResolver`. shadcn's `<Form>` wrapper doesn't exist on Base UI.
- **A form's zod schema lives in `src/schemas/`** (`leadSchema.ts`), with Czech error messages, so the server validates against the same rules.

## Icons

lucide-react only, and only as a functional glyph inside a primitive (a check mark, a chevron). Decorative icons are on the [ban list](../specifications/design-identity.md#ban-list).
