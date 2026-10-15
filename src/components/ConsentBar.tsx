// The Consent Bar (`consent-bar`, #51): asks for the one thing the page stores only with consent, remembering that the
// Visitor has been here before, for measurement (§89(3) of Act No. 127/2005 Coll.). One line of copy and two buttons of
// equal weight, nothing preselected. A `block` panel at the bottom of the screen, stacked above the Sticky CTA
// (design-identity.md#components), its buttons light like Delivery's link so neither competes with the red CTA.
import { Button } from '@/components/ui/button'
import type { ConsentChoice } from '@/consent/consentChoice.ts'
import { cn } from '@/lib/utils'

/** The bar's id, which the footer's "Nastavení cookies" names as the element it opens. */
export const CONSENT_BAR_ID = 'consent-bar'

export type ConsentBarProps = {
  /** Whether the Sticky CTA is on the page, so the bar sits above it; once the Visitor is a Lead, it is gone. */
  isAboveStickyCta: boolean
  /** Called with the Visitor's choice. */
  onChoose: (consentChoice: ConsentChoice) => void
}

/**
 * The open Consent Bar.
 *
 * ```tsx
 * <ConsentBar isAboveStickyCta onChoose={chooseConsent} />
 * // <section id="consent-bar">Smíme si pro naše měření zapamatovat, že jste tu už byli?
 * //   [Povolit] [Odmítnout]</section>, 8 px above the Sticky CTA
 * ```
 */
export const ConsentBar = ({ isAboveStickyCta, onChoose }: ConsentBarProps) => {
  return (
    <section
      id={CONSENT_BAR_ID}
      aria-label="Nastavení cookies"
      className={cn(
        'fixed inset-x-4 z-40 mx-auto grid max-w-md gap-3 rounded-xl bg-block p-4 text-block-foreground',
        // The Sticky CTA is 3.5 rem tall and 1 rem from the bottom, so 5 rem leaves an 8 px gap above it.
        isAboveStickyCta
          ? 'bottom-[calc(5rem+env(safe-area-inset-bottom))]'
          : 'bottom-[calc(1rem+env(safe-area-inset-bottom))]',
      )}
    >
      <p className="text-contents">Smíme si pro naše měření zapamatovat, že jste tu už byli?</p>
      <div className="grid grid-cols-2 gap-2">
        {/* The type size sits on the text: the button's own `text-sm` would fight it through `cn` (tailwind.md#tokens). */}
        <Button variant="secondary" className="h-11" onClick={() => onChoose('granted')}>
          <span className="text-fact">Povolit</span>
        </Button>
        <Button variant="secondary" className="h-11" onClick={() => onChoose('denied')}>
          <span className="text-fact">Odmítnout</span>
        </Button>
      </div>
    </section>
  )
}
