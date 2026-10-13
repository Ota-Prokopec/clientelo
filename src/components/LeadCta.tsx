// The red CTA, so every way to the Lead Form reads as the same button (design-identity.md#components): its label on
// the left, the arrow on the right. Base UI's `render` picks the element, so LeadFormLink renders it as a link for the
// inline Lead Asks and the Sticky CTA, and the Lead Form as its submit `Button`.
import { useRender } from '@base-ui/react/use-render'
import { ArrowRight } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

export type LeadCtaArgs = {
  /** The element the CTA renders as, which keeps its own props: a link to the Lead Form, or its submit `Button`. */
  render: ReactElement
  /** The label, left of the arrow. Without one, the CTA says "Chci tahák zdarma". */
  children?: ReactNode
  /** Merges with the CTA's own classes. */
  className?: string
}

/**
 * The red CTA on the element `render` gives it.
 *
 * ```tsx
 * <LeadCta render={<a href="#lead-form" />} />
 * // <a href="#lead-form">Chci tahák zdarma →</a>
 * <LeadCta render={<Button type="submit" />} className="w-full">Zkusit znovu</LeadCta>
 * // <button type="submit">Zkusit znovu →</button>, the Lead Form's full width
 * ```
 */
export const LeadCta = ({ render, children = 'Chci tahák zdarma', className }: LeadCtaArgs) => {
  return useRender({
    render,
    props: {
      className: cn(buttonVariants(), 'h-14 justify-between px-5 text-lg font-bold', className),
      children: (
        <>
          {children}
          <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-5" />
        </>
      ),
    },
  })
}
