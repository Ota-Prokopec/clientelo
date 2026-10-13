# React

How to lay out React components in files. Read this before you add a component, or split or move one. `pnpm lint` enforces the mechanical rules (`react/no-multi-comp`, `react/only-export-components`), and its messages say what to do; this file holds the judgment calls. shadcn's primitives add their own rules in [shadcn.md](./shadcn.md), and how to name and document a component is [typescript.md](./typescript.md).

## One component per file

- **Every component has its own file, named after it** in PascalCase (`RemainingAmountBar.tsx` for `RemainingAmountBar`). Never declare two component functions in one file, not even a small helper only one component renders. Give the helper its own file and import it. oxlint's `react/no-multi-comp` fails the lint otherwise.
- **shadcn's generated files in `src/components/ui/` are the one exception.** shadcn ships a primitive's parts in one file (`card.tsx` holds `Card`, `CardHeader`, `CardTitle`…), and they stay as generated, so `.oxlintrc.json` turns `react/no-multi-comp` off there ([shadcn.md](./shadcn.md#where-primitives-come-from)).
- **What only one component uses stays in its file:** its `Args` type and the types it uses (`RemainingAmountBarArgs`, `FundKind`), exported as [typescript.md](./typescript.md#using-types) requires, and its lookup tables (`terClassNameByFundKind`) and cva variants, unexported.
- **A constant that names part of what a component renders, such as an element's id, is exported from that component's file.** Every other module imports it from there. For example, `LeadForm.tsx` exports `leadFormId` and `leadFormEmailId`, which `LeadFormLink` imports to scroll to the Lead Form and focus its email field. `react/only-export-components` allows a constant export (`allowConstantExport` in `.oxlintrc.json`).
- **Anything else two components share moves to its own `.ts` file** named after what it exports, never into either component's file. Apart from those constants, a component file exports only components, as `react/only-export-components` requires.
- **A shared look is a component, never an exported class string.** When two components need the same classes, write one component that owns them and wraps the text or the element they style, and render it from both. Never export a `…ClassName` constant, or the label that goes with it, for other components to put in their own markup. When the element differs between them, the component takes Base UI's `render` prop through `useRender` from `@base-ui/react/use-render`. For example, `LeadCta` is the red CTA: `LeadFormLink` renders it as an `<a>`, and `LeadForm` renders it as its submit `Button`.
- **A generic domain type goes in `src/types.ts`:** a type naming a domain concept that several modules use and none owns (`InteractiveTool`, `SubstituteRelation`). A type describing one component's or module's own interface stays in its file, even when another imports it (`LeadAskPlacement` in `LeadAskBand.tsx`, `EtfSubstitutes` in `substitutes.ts`), and a record type stays beside its data (`Etf` in `figures.ts`).

## Where a file goes

- **`src/components/sections/`**: a Section, including each Ad Variant's own First Screen and Section 03 (`PainFirstScreen.tsx`, `PainOtherTool.tsx`).
- **`src/components/`**: every other domain component, including one that only a single Section or route renders (`RemainingAmountBar.tsx`, `PolicyHeading.tsx`).
- **`src/components/fields/`**: a form field wired to react-hook-form, generic over the form that renders it (`InputField.tsx`, `HoneypotField.tsx`) ([shadcn.md](./shadcn.md#forms)), and `types.ts`, the types every field shares.
- **`src/components/ui/`**: shadcn's primitives ([shadcn.md](./shadcn.md)).
- **`src/routes/`**: only the route components the router mounts, one per file.
- **`src/pdfLeadMagnet/`**: the Lead Magnet PDF, written with `@react-pdf/renderer`'s components instead of the DOM's: the Document, one file per Chapter, and the parts they share. `vite-plugins/pdfLeadMagnetPlugin.ts` renders it at build time ([ADR-0002](../adr/0002-lead-magnet-pdf-generated-from-data-module.md)).
