// The closing Section: the Lead Ask's band with the Lead Magnet's preview and every Chapter, holding the one Lead Form
// that every other Lead Ask and the Sticky CTA lead to.
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { LeadAskBand } from '../LeadAskBand.tsx'
import { LeadForm } from '../LeadForm.tsx'
import { Section } from './Section.tsx'

export type LeadMagnetSectionArgs = {
  /** Called once the Lead Form is submitted: the Visitor is now a Lead. */
  onLeadFormSubmitted: () => void
}

/**
 * Section 04: every Chapter of the PDF, then the Lead Form.
 *
 * ```tsx
 * <LeadMagnetSection onLeadFormSubmitted={() => setIsLead(true)} />
 * // <section id="lead-magnet">04 Celý tahák <div data-lead-ask="lead-magnet"><h2>Tahák: evropská dvojčata…</h2>
 * //   [thumbnail] 01 Proč vám aplikace VOO neprodá … 06 Kde dvojče koupit… <div id="lead-form">…</div></div></section>
 * ```
 */
export const LeadMagnetSection = ({ onLeadFormSubmitted }: LeadMagnetSectionArgs) => {
  return (
    // The label isn't "Tahák zdarma", which the band's own first line says right below it.
    <Section id="lead-magnet" number="04" label="Celý tahák">
      <LeadAskBand placement="lead-magnet" headingLevel={2} chapters={Object.values(leadMagnetChapters)}>
        <LeadForm onLeadFormSubmitted={onLeadFormSubmitted} />
      </LeadAskBand>
    </Section>
  )
}
