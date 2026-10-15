// The closing Section: the Lead Ask's band with the Lead Magnet's preview and every Chapter, holding the one Lead Form
// that every other Lead Ask and the Sticky CTA lead to. Once the Visitor is a Lead, Delivery replaces the Lead Form on
// the band, and Chapters 2 and 3 unlock below it.
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import type { LeadSubmission } from '@/schemas/leadSchema.ts'
import type { Lead } from '@/types.ts'
import { CzechTaxFactList } from '@/components/CzechTaxFactList.tsx'
import { LeadAskBand } from '@/components/LeadAskBand.tsx'
import { LeadForm } from '@/components/LeadForm.tsx'
import { TwinTable } from '@/components/TwinTable.tsx'
import { UnlockedChapter } from '@/components/UnlockedChapter.tsx'
import { Section } from './Section.tsx'

export type LeadMagnetSectionProps = {
  /** The Visitor as a Lead once they are one, or null while they are a Visitor. */
  lead: Lead | null
  /** Called once the Lead Form is submitted, with the email the new Lead left. */
  onLeadFormSubmitted: (leadSubmission: LeadSubmission) => void
}

/**
 * Section 04: every Chapter of the PDF, then the Lead Form, or for a Lead, Delivery and the unlocked Chapters.
 *
 * ```tsx
 * <LeadMagnetSection lead={null} onLeadFormSubmitted={handleLeadFormSubmitted} />
 * // <section id="lead-magnet">04 Celý tahák <div data-lead-ask="lead-magnet"><h2>Tahák: evropská dvojčata…</h2>
 * //   [thumbnail] 01 Proč vám aplikace VOO neprodá … 06 Kde dvojče koupit… <div id="lead-form">…</div></div></section>
 * <LeadMagnetSection lead={{ kind: 'returning' }} onLeadFormSubmitted={handleLeadFormSubmitted} />
 * // … <div id="lead-form">Tahák už máte. …</div></div> 02 Odemčeno z taháku <h3>Tabulka dvojčat…</h3> …
 * //   03 Odemčeno z taháku <h3>Daně v Česku…</h3> …</section>
 * ```
 */
export const LeadMagnetSection = ({ lead, onLeadFormSubmitted }: LeadMagnetSectionProps) => {
  return (
    // The label isn't "Tahák zdarma", which the band's own first line says right below it.
    <Section id="lead-magnet" number="04" label="Celý tahák">
      <LeadAskBand placement="lead-magnet" headingLevel={2} chapters={Object.values(leadMagnetChapters)}>
        <LeadForm lead={lead} onLeadFormSubmitted={onLeadFormSubmitted} />
      </LeadAskBand>
      {lead && (
        <div className="grid gap-12 pt-4">
          <UnlockedChapter chapter={leadMagnetChapters.twinTable}>
            <TwinTable />
          </UnlockedChapter>
          <UnlockedChapter chapter={leadMagnetChapters.czechTaxes}>
            <CzechTaxFactList />
          </UnlockedChapter>
        </div>
      )}
    </Section>
  )
}
