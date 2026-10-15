# shadcn

How to build UI from shadcn components. Read this before you add a control, a form or a component to the page. The decision and its alternatives are [ADR-0003](../adr/0003-tailwind-and-shadcn-replace-css-modules.md); the look is [design-identity.md](../specifications/design-identity.md).

## Where primitives come from

- **Every UI primitive is a shadcn component** in `src/components/ui/`, on Base UI with the Vega preset, added with the shadcn command in [README.md](../../README.md#commands). Domain components (`FundPicker`, `FeeCalculator`, `StickyCta`) and Sections are built from these primitives and Tailwind utilities.
- **No raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<label>` outside `src/components/ui/`.** When shadcn has no primitive for what you need, build one in `src/components/ui/` from Base UI's parts and style it with tokens.
- **A new file in `src/components/ui/` gets a top comment** saying what it is for on the page, and `Unedited.` or what was edited.
- **A file there exports only components**, as oxlint's `react/only-export-components` requires. When shadcn's file exports its `cva` variants beside the component, move them to `<name>-variants.ts` (`button-variants.ts`) and say so in both files' top comments.
- **A file there keeps all the parts shadcn generated in it** (`card.tsx` holds `Card`, `CardHeader`, `CardTitle`…). Don't split it. `.oxlintrc.json` turns `react/no-multi-comp` off for `src/components/ui/` only, and every other component gets its own file ([react.md](./react.md#one-component-per-file)).
- **A file there keeps shadcn's `function` declarations.** `.oxlintrc.json` turns `func-style` off for `src/components/ui/` only. Everywhere else, every function is an arrow function.
- **A link that looks like a button** is an `<a>` styled with `buttonVariants` from `@/components/ui/button-variants` (`className={cn(buttonVariants(), …)}`). Base UI's `Button` rendered as an `<a>` gives it `role="button"`, which takes it out of a screen reader's links.

## Restyling

- **Tokens first.** A change the whole page should share goes into the theme in `src/index.css` ([tailwind.md](./tailwind.md)).
- **Then the call site.** A one-place change is a `className` on the component, merged by `cn`. A primitive's inner parts take a descendant selector on its `data-slot` (`[&_[data-slot=slider-thumb]]:size-7`).
- **Edit a file in `src/components/ui/` last**, only when neither of the above can express the change. `shadcn add --overwrite` replaces these files, so record each edit in the file's top comment, where the next update will see it.

## Forms

- **A form is `Field`, `FieldLabel` and `FieldError` around shadcn inputs**, wired with react-hook-form's `Controller` and `zodResolver`. shadcn's `<Form>` wrapper doesn't exist on Base UI.
- **A form renders its fields from `src/components/fields/`**, never its own `Controller`. A field's `Props` type extends `FieldProps` from `src/components/fields/types.ts`, the form's `control` and the `name` of the value it edits, and the field reads its value and its error from them: `InputField` is any one-line Input, its `type` picking text, email or number, and `surface="band"` sets it on a Lead Ask's band. A field no component there covers gets its own file there.
- **A form's zod schema lives in `src/schemas/`** (`leadSchema.ts`), with Czech error messages, apart from the form, so its rules are tested on their own.

## Icons

lucide-react only, and only as a functional glyph inside a primitive (a check mark, a chevron) or as the arrow on a CTA ([design-identity.md](../specifications/design-identity.md#icons)). Decorative icons are on the [ban list](../specifications/design-identity.md#ban-list).
