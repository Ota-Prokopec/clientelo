// shadcn's Button (Base UI, Vega): every CTA, rendered as a link where it scrolls (docs/standards/shadcn.md).
// Edited: its cva variants moved to button-variants.ts, so this file exports only a component (oxlint's
// react/only-export-components). Redo that after `shadcn add --overwrite`.
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
