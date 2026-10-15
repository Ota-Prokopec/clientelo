// The inline Lead Ask each Interactive Tool ends in, right after the answer it extends: the Lead Ask's band, listing the
// three Chapters that finish the answer, with a link to the one Lead Form (docs/strategy.md#lead-ask). A Lead already has
// the Lead Magnet, so for them it steps aside, as the Sticky CTA does.
import { leadAskChapters } from '@data/leadMagnet.ts'
import { useLead } from '@/hooks/leadContext.ts'
import type { InteractiveTool } from '@/types.ts'
import { LeadAskBand } from './LeadAskBand.tsx'
import { LeadFormLink } from './LeadFormLink.tsx'

export type LeadAskProps = {
  /** The Interactive Tool whose answer the Lead Ask extends. */
  interactiveTool: InteractiveTool
}

/**
 * The band after an Interactive Tool's result, leading to the Lead Form.
 *
 * ```tsx
 * <LeadAsk interactiveTool="fund-picker" />
 * // <div data-lead-ask="fund-picker">… 02 Tabulka dvojčat… 03 Daně v Česku… 04 Americká dědická daň…
 * //   <a href="#lead-form">Chci tahák zdarma →</a></div>
 * // for a Lead → nothing
 * ```
 */
export const LeadAsk = ({ interactiveTool }: LeadAskProps) => {
  const lead = useLead()
  if (lead) return null

  return (
    <LeadAskBand placement={interactiveTool} headingLevel={3} chapters={leadAskChapters}>
      <LeadFormLink placement={interactiveTool} />
    </LeadAskBand>
  )
}
