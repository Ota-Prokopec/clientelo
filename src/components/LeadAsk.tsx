// The inline Lead Ask each Interactive Tool ends in, right after the answer it extends. #13 turns this slot into the
// Lead Ask's band, with the PDF thumbnail, the contents list, the email field and the red CTA's own type.
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { leadMagnetSectionId } from './sections/leadMagnetSectionId.ts'

export type LeadAskArgs = {
  /** What the free cheat sheet adds to the answer above, in the tool's own words. */
  children: ReactNode
}

/**
 * Offers the free cheat sheet with what it adds to the answer above, linking to the Lead Magnet's Section.
 *
 * ```tsx
 * <LeadAsk>Celou tabulku evropských ETF … najdete v taháku zdarma.</LeadAsk>
 * // Celou tabulku evropských ETF … [Chci celý tahák →] (href="#lead-magnet")
 * ```
 */
export const LeadAsk = ({ children }: LeadAskArgs) => {
  return (
    <div data-lead-ask className="grid gap-3">
      <p>{children}</p>
      <a href={`#${leadMagnetSectionId}`} className={cn(buttonVariants({ size: 'lg' }), 'justify-between')}>
        Chci celý tahák
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </a>
    </div>
  )
}
