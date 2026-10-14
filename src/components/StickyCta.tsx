// The Sticky CTA: on a phone it takes the Visitor to the Lead Form from anywhere on the page.
// The red CTA as a link, floating 16 px from the edges above the safe area (design-identity.md#components).
// It steps aside while a Lead Ask, the Lead Form's band included, is on screen, and is gone once the Visitor is a Lead.
import { useIsAnyOnScreen } from '@/hooks/useIsAnyOnScreen';
import { LeadFormLink } from './LeadFormLink.tsx';

export type StickyCtaProps = {
  isLead: boolean;
};

/**
 * The Sticky CTA, hidden while a Lead Ask is on screen and removed once the Visitor is a Lead.
 *
 * ```tsx
 * <StickyCta isLead={false} /> // <a id="sticky-cta" href="#lead-form">
 * <StickyCta isLead />         // nothing
 * ```
 */
export const StickyCta = ({ isLead }: StickyCtaProps) => {
  // Every Lead Ask's band carries `data-lead-ask`, Section 04's with the Lead Form included.
  const { isAnyOnScreen } = useIsAnyOnScreen('[data-lead-ask]');

  if (isLead) return null;

  return (
    <LeadFormLink
      id="sticky-cta"
      data-hidden={isAnyOnScreen}
      aria-hidden={isAnyOnScreen}
      tabIndex={isAnyOnScreen ? -1 : undefined}
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md duration-200 motion-reduce:transition-none data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-[calc(100%+2rem)] data-[hidden=true]:opacity-0"
    />
  );
};
