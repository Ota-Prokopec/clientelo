// The Sticky CTA: on a phone it takes the Visitor to the Lead Form from anywhere on the page.
// A link with the red Button's look, floating 16 px from the edges above the safe area (design-identity.md#components).
// It steps aside while the Lead Form or an inline Lead Ask is on screen, and is gone once the Visitor is a Lead.
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { useIsAnyOnScreen } from '@/hooks/useIsAnyOnScreen';
import { cn } from '@/lib/utils';

export type StickyCtaArgs = {
  /** The id of the element the CTA scrolls to: the Lead Form, or the closing Section until #13 adds it. */
  targetId: string;
  isLead: boolean;
};

/**
 * The Sticky CTA, hidden while the Lead Form or a Lead Ask is on screen and removed once the Visitor is a Lead.
 *
 * ```tsx
 * <StickyCta targetId="lead-magnet" isLead={false} /> // <a id="sticky-cta" href="#lead-magnet">
 * <StickyCta targetId="lead-magnet" isLead />         // nothing
 * ```
 */
export function StickyCta({ targetId, isLead }: StickyCtaArgs) {
  const isLeadFormOrLeadAskOnScreen = useIsAnyOnScreen(`#${targetId}, #lead-form, [data-lead-ask]`);

  if (isLead) return null;

  return (
    <a
      id="sticky-cta"
      href={`#${targetId}`}
      data-hidden={isLeadFormOrLeadAskOnScreen}
      aria-hidden={isLeadFormOrLeadAskOnScreen}
      tabIndex={isLeadFormOrLeadAskOnScreen ? -1 : undefined}
      className={cn(
        buttonVariants(),
        'fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto h-14 max-w-md justify-between px-5 text-lg font-bold duration-200 motion-reduce:transition-none data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-[calc(100%+2rem)] data-[hidden=true]:opacity-0',
      )}
    >
      Chci tahák zdarma
      <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-5" />
    </a>
  );
}
