// A Lead Ask's band (design-identity.md#components): a `block` band with a 26 px radius that shows the Lead Magnet
// before it asks. "Tahák zdarma · PDF, 2 strany", the title, and the PDF thumbnail beside its Chapters, then what the
// Visitor does next: a link to the Lead Form after an Interactive Tool, or the Lead Form itself in Section 04.
import type { ReactNode } from 'react'
import { LEAD_MAGNET_TITLE, type LeadMagnetChapter } from '@data/leadMagnet.ts'
import type { InteractiveTool } from '@/types.ts'
import { LeadMagnetContents } from './LeadMagnetContents.tsx'
import { LeadMagnetThumbnail } from './LeadMagnetThumbnail.tsx'

/** Where a band asks: after one of the Interactive Tools, or in the closing Section with the Lead Form. */
export type LeadAskPlacement = InteractiveTool | 'lead-magnet'

export type LeadAskBandProps = {
  /** Set as `data-lead-ask`, which the Sticky CTA steps aside for and step 5's Funnel Events hook onto. */
  placement: LeadAskPlacement
  /** The title's heading level: 2 where the band is its Section's heading, 3 inside a tool under its Section's own. */
  headingLevel: 2 | 3
  /** The Chapters the contents list shows. */
  chapters: LeadMagnetChapter[]
  /** What the Visitor does next: the link to the Lead Form, or the Lead Form. */
  children: ReactNode
}

/**
 * The band, its Lead Magnet preview over what the Visitor does next.
 *
 * ```tsx
 * <LeadAskBand placement="fund-picker" headingLevel={3} chapters={leadAskChapters}>
 *   <LeadFormLink />
 * </LeadAskBand>
 * // <div data-lead-ask="fund-picker">Tahák zdarma · PDF, 2 strany <h3>Tahák: evropská dvojčata amerických ETF</h3>
 * //   [thumbnail] 02 Tabulka dvojčat… 03 Daně v Česku… 04 Americká dědická daň… [Chci tahák zdarma →]</div>
 * ```
 */
export const LeadAskBand = ({ placement, headingLevel, chapters, children }: LeadAskBandProps) => {
  const TitleHeading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <div data-lead-ask={placement} className="grid gap-5 rounded-3xl bg-block p-5 text-block-foreground">
      <div className="grid gap-2">
        <p className="text-label">Tahák zdarma · PDF, 2 strany</p>
        <TitleHeading className="text-title">{LEAD_MAGNET_TITLE}</TitleHeading>
      </div>
      <div className="grid grid-cols-[auto_1fr] items-start gap-4">
        <LeadMagnetThumbnail />
        <LeadMagnetContents chapters={chapters} />
      </div>
      {children}
    </div>
  )
}
