// Delivery: what replaces the Lead Form once the Visitor is a Lead, inline, never a toast or a dialog
// (design-identity.md#components). A new Lead reads that the PDF is downloading and on its way to their email, gets the
// PDF as a visible link in case the download didn't start, and is asked the Segmentation Question. A returning Lead
// gets the link again. Either way, Section 04 shows Chapters 2 and 3 unlocked below the band. A tap on the link is a
// pdf_download Funnel Event.
import { ArrowDown } from 'lucide-react'
import { LEAD_MAGNET_PDF_PATH } from '@data/leadMagnetFiles.ts'
import { buttonVariants } from '@/components/ui/button-variants'
import { trackFunnelEvent } from '@/funnel/trackFunnelEvent.ts'
import { cn } from '@/lib/utils'
import type { Lead } from '@/types.ts'
import { SegmentationQuestion } from './SegmentationQuestion.tsx'

export type DeliveryProps = { lead: Lead }

/**
 * Records a tap on the PDF's link.
 *
 * ```ts
 * trackPdfLinkDownload() // pdf_download { trigger: 'link' }
 * ```
 */
const trackPdfLinkDownload = () => {
  trackFunnelEvent({ event: 'pdf_download', trigger: 'link' })
}

/**
 * Moves focus to a new Lead's Delivery as it appears, so a Lead on a keyboard or a screen reader isn't left on the form
 * that just disappeared. Declared outside the component, so React calls it when Delivery mounts, not after every render.
 *
 * ```tsx
 * <div ref={focusDelivery} tabIndex={-1}> // focused once, without scrolling
 * ```
 */
const focusDelivery = (delivery: HTMLDivElement | null) => {
  delivery?.focus({ preventScroll: true })
}

/**
 * The confirmation, the PDF's link, and for a new Lead the Segmentation Question.
 *
 * ```tsx
 * <Delivery lead={{ kind: 'new', email: 'jana.novakova@seznam.cz' }} />
 * // Hotovo. Tahák se stahuje. Odkaz na něj vám posíláme i na jana.novakova@seznam.cz. …
 * // [Stáhnout tahák (PDF) ↓] Kde investujete? XTB · Trading 212 · … Tabulku dvojčat a daně máte odemčené…
 * <Delivery lead={{ kind: 'returning' }} />
 * // Tahák už máte. … [Stáhnout tahák (PDF) ↓] Tabulku dvojčat a daně máte odemčené…
 * ```
 */
export const Delivery = ({ lead }: DeliveryProps) => {
  const isNewLead = lead.kind === 'new'

  return (
    // Only a new Lead's Delivery takes focus: a returning Lead's is there when the page opens, far below the First Screen.
    <div
      ref={isNewLead ? focusDelivery : undefined}
      tabIndex={isNewLead ? -1 : undefined}
      className="grid gap-5 outline-none"
    >
      <div className="grid gap-2">
        {isNewLead ? (
          <>
            <p className="text-title">Hotovo. Tahák se stahuje.</p>
            <p>
              Odkaz na něj vám posíláme i na <strong className="break-all">{lead.email}</strong>. Když do pár minut
              nedorazí, mrkněte do složky Hromadné nebo Spam.
            </p>
          </>
        ) : (
          <>
            <p className="text-title">Tahák už máte.</p>
            <p>Kdyby se vám ztratil, stáhněte si ho znovu.</p>
          </>
        )}
      </div>
      {/* The same file the download started, for a browser that refused a download no tap started directly. */}
      <a
        href={LEAD_MAGNET_PDF_PATH}
        download
        onClick={trackPdfLinkDownload}
        className={cn(buttonVariants({ variant: 'secondary' }), 'h-12 justify-between px-5')}
      >
        {/* The type size sits on the text: the button's own `text-sm` would fight it through `cn` (tailwind.md#tokens). */}
        <span className="text-fact">Stáhnout tahák (PDF)</span>
        <ArrowDown data-icon="inline-end" aria-hidden="true" className="size-5" />
      </a>
      {isNewLead && <SegmentationQuestion email={lead.email} />}
      <p>Tabulku dvojčat a daně máte odemčené hned pod tímto blokem.</p>
    </div>
  )
}
