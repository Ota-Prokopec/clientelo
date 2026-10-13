// The closing Section: the Lead Magnet, then the Lead Form. #13 adds the preview, the contents list and the Lead Form.
import { Section } from './Section.tsx'

/** The id the Sticky CTA scrolls to until the Lead Form (#13) exists. */
export const leadMagnetSectionId = 'lead-magnet'

/**
 * The Lead Magnet's title and promise, ahead of the closing Lead Form.
 *
 * ```tsx
 * <LeadMagnetSection /> // <section id="lead-magnet">04 Tahák zdarma …</section>
 * ```
 */
export function LeadMagnetSection() {
  return (
    <Section id={leadMagnetSectionId} number="04" label="Tahák zdarma">
      <h2 className="text-title text-heading">Tahák: evropská dvojčata amerických ETF</h2>
      <p>
        Co koupit místo VOO, co stojí poplatek bankovního fondu za 20 let a jak na daně v Česku. Na dvou stranách,
        zdarma.
      </p>
      <div className="min-h-16" />
    </Section>
  )
}
