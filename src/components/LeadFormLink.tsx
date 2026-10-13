// A link that opens the one Lead Form from anywhere on the page: it scrolls there and focuses the email field, so a
// phone's keyboard is already up. The inline Lead Asks and the Sticky CTA are built on it. Without JavaScript it is a
// plain link to `#lead-form`.
import type { ComponentProps, MouseEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { leadCtaClassName, leadCtaLabel } from './leadCta.ts'
import { leadFormEmailId, leadFormId } from './leadFormIds.ts'

export type LeadFormLinkArgs = Omit<ComponentProps<'a'>, 'href' | 'children'>

/**
 * The red CTA as a link to the Lead Form, its label on the left and the arrow on the right. A `className` merges with
 * the CTA's own, and other props land on the `<a>`.
 *
 * ```tsx
 * <LeadFormLink />
 * // <a href="#lead-form">Chci tahák zdarma →</a>; a click scrolls to the Lead Form and focuses its email field
 * ```
 */
export const LeadFormLink = ({ className, onClick, ...anchorProps }: LeadFormLinkArgs) => {
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
    onClick?.(event)
    const leadForm = document.getElementById(leadFormId)
    if (event.defaultPrevented || !leadForm) return

    event.preventDefault()
    // No `behavior`, so the scroll follows html's `scroll-behavior`: smooth, or instant under reduced motion.
    leadForm.scrollIntoView()
    document.getElementById(leadFormEmailId)?.focus({ preventScroll: true })
  }

  return (
    <a
      href={`#${leadFormId}`}
      onClick={openLeadForm}
      className={cn(buttonVariants(), leadCtaClassName, className)}
      {...anchorProps}
    >
      {leadCtaLabel}
      <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-5" />
    </a>
  )
}
