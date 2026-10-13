// shadcn's Toggle (Base UI, Vega), which ToggleGroup's items build on.
// Edited: its cva variants moved to toggle-variants.ts, so this file exports only a component (oxlint's
// react/only-export-components). Redo that after `shadcn add --overwrite`.
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { toggleVariants } from "@/components/ui/toggle-variants"

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle }
