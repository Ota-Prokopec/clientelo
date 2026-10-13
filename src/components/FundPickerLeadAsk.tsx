// The Fund Picker's inline Lead Ask, right under the answer it extends. #13 turns this slot into the Lead Ask's band,
// with the PDF thumbnail, the contents list, the email field and the red CTA's own type.
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { leadMagnetSectionId } from './sections/leadMagnetSectionId.ts';

/**
 * Offers the full table of European ETFs in the free cheat sheet, linking to the Lead Magnet's Section.
 *
 * ```tsx
 * <FundPickerLeadAsk /> // Celou tabulku evropských ETF … [Chci celý tahák →] (href="#lead-magnet")
 * ```
 */
export const FundPickerLeadAsk = () => {
  return (
    <div data-lead-ask className="grid gap-3">
      <p>
        Celou tabulku evropských ETF s ISIN, burzou a měnou a návod, jak je v Česku zdanit, najdete v taháku zdarma.
      </p>
      <a href={`#${leadMagnetSectionId}`} className={cn(buttonVariants({ size: 'lg' }), 'justify-between')}>
        Chci celý tahák
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </a>
    </div>
  );
};
