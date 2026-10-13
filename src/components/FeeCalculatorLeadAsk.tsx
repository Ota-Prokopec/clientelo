// The Fee Calculator's inline Lead Ask, right after the result it extends. #13 turns this slot into the Lead Ask's band,
// with the PDF thumbnail, the contents list, the email field and the red CTA's own type.
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { leadMagnetSectionId } from './sections/leadMagnetSectionId.ts'

/**
 * Offers what to buy instead of the Bank Fund, and how, in the free cheat sheet, linking to the Lead Magnet's Section.
 *
 * ```tsx
 * <FeeCalculatorLeadAsk /> // Které ETF koupit místo bankovního fondu … [Chci celý tahák →] (href="#lead-magnet")
 * ```
 */
export const FeeCalculatorLeadAsk = () => {
  return (
    <div data-lead-ask className="grid gap-3">
      <p>
        Které ETF koupit místo bankovního fondu, kde ho koupíte a jak ho v Česku zdanit, najdete v taháku zdarma.
      </p>
      <a href={`#${leadMagnetSectionId}`} className={cn(buttonVariants({ size: 'lg' }), 'justify-between')}>
        Chci celý tahák
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </a>
    </div>
  )
}
