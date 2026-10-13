# React

How to lay out React components in files. Read this before you add a component, or split or move one. `pnpm lint` enforces the mechanical rules (`react/no-multi-comp`, `react/only-export-components`), and its messages say what to do; this file holds the judgment calls. shadcn's primitives add their own rules in [shadcn.md](./shadcn.md), and how to name and document a component is [typescript.md](./typescript.md).

## One component per file

- **Every component has its own file, named after it** in PascalCase (`RemainingAmountBar.tsx` for `RemainingAmountBar`). Never declare two component functions in one file, not even a small helper only one component renders. Give the helper its own file and import it. oxlint's `react/no-multi-comp` fails the lint otherwise.
- **shadcn's generated files in `src/components/ui/` are the one exception.** shadcn ships a primitive's parts in one file (`card.tsx` holds `Card`, `CardHeader`, `CardTitle`…), and they stay as generated, so `.oxlintrc.json` turns `react/no-multi-comp` off there ([shadcn.md](./shadcn.md#where-primitives-come-from)).
- **What only one component uses stays in its file:** its `Args` type and the types it uses (`RemainingAmountBarArgs`, `FundKind`), exported as [typescript.md](./typescript.md#using-types) requires, and its lookup tables (`terClassNameByFundKind`) and cva variants, unexported.
- **What two components share moves to its own `.ts` file** named after what it exports, never into either component's file. A component file exports only components, as `react/only-export-components` requires, so the other component couldn't import it from there.

## Where a file goes

- **`src/components/sections/`**: a Section, including each Ad Variant's own First Screen and Section 03 (`PainFirstScreen.tsx`, `PainOtherTool.tsx`).
- **`src/components/`**: every other domain component, including one that only a single Section or route renders (`RemainingAmountBar.tsx`, `PolicyHeading.tsx`).
- **`src/components/ui/`**: shadcn's primitives ([shadcn.md](./shadcn.md)).
- **`src/routes/`**: only the route components the router mounts, one per file.
