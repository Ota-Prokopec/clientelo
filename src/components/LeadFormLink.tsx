// A link that opens the one Lead Form from anywhere on the page: it scrolls there and focuses the email field, so a
// phone's keyboard is already up. The inline Lead Asks and the Sticky CTA are built on it, and each tap on it is a
// lead_ask_click Funnel Event naming where it was. Without JavaScript it is a plain link to `#lead-form`.
import type { ComponentProps, MouseEvent } from 'react'
import type { LeadAskClickPlacement } from '@lib/funnel/funnelEvent.ts'
import { trackFunnelEvent } from '@lib/funnel/trackFunnelEvent.ts'
import { LeadCta } from './LeadCta.tsx'
import { LEAD_FORM_EMAIL_ID, LEAD_FORM_ID } from './LeadForm.tsx'

export type LeadFormLinkProps = Omit<ComponentProps<'a'>, 'href' | 'children'> & {
  /** Where the link is: after an Interactive Tool, as its `data-lead-ask` band says, or the Sticky CTA. */
  placement: LeadAskClickPlacement
}

/**
 * The red CTA as a link to the Lead Form, its label on the left and the arrow on the right. A `className` merges with
 * the CTA's own, and other props land on the `<a>`.
 *
 * ```tsx
 * <LeadFormLink placement="fund-picker" />
 * // <a href="#lead-form">Chci tahák zdarma →</a>; a click records lead_ask_click { placement: 'fund-picker' },
 * // scrolls to the Lead Form and focuses its email field
 * ```
 */
export const LeadFormLink = ({ placement, className, onClick, ...anchorProps }: LeadFormLinkProps) => {
  /**
   * Scrolls to the Lead Form and focuses its email field, both within the tap, which is the only time a phone opens
   * its keyboard for a field. The link's own jump to `#lead-form` would take the focus away again, so it is cancelled.
   * Once the Visitor is a Lead the field is gone, and the link only scrolls.
   *
   * ```ts
   * // a click on <LeadFormLink> → the page scrolls to #lead-form, and #lead-form-email has focus
   * ```
   */
  const openLeadForm = (event: MouseEvent<HTMLAnchorElement>) => {
    trackFunnelEvent({ event: 'lead_ask_click', placement })
    onClick?.(event)
    const leadForm = document.getElementById(LEAD_FORM_ID)
    if (event.defaultPrevented || !leadForm) return

    event.preventDefault()
    // No `behavior`, so the scroll follows html's `scroll-behavior`: smooth, or instant under reduced motion.
    leadForm.scrollIntoView()
    document.getElementById(LEAD_FORM_EMAIL_ID)?.focus({ preventScroll: true })
  }

  return (
    <LeadCta render={<a href={`#${LEAD_FORM_ID}`} onClick={openLeadForm} {...anchorProps} />} className={className} />
  )
}
