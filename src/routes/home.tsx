// The landing page: the five Sections in the order README.md justifies, opened by the Visitor's Ad Variant. It records
// the Visit's arrival, each Section's first view and the automatic PDF download as Funnel Events.
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import useDownloader from 'react-use-downloader'
import { leadMagnetPdfFileName, leadMagnetPdfPath } from '@data/leadMagnetFiles.ts'
import { resolveAdVariant } from '@lib/adVariant/adVariant.ts'
import { isSectionViewed } from '@/funnel/sectionView.ts'
import { trackFunnelEvent } from '@/funnel/trackFunnelEvent.ts'
import { useOnFirstView } from '@/hooks/useOnFirstView.ts'
import { readRememberedLead, rememberLead } from '@/lead/rememberedLead.ts'
import type { Lead, SectionId } from '@/types.ts'
import { Page } from '../components/Page.tsx'
import { StickyCta } from '../components/StickyCta.tsx'
import { Footer } from '../components/sections/Footer.tsx'
import { KeyInsight } from '../components/sections/KeyInsight.tsx'
import { LeadMagnetSection } from '../components/sections/LeadMagnetSection.tsx'

/** Every Section's anchor, whose first view is a section_view Funnel Event. */
const sectionIds: readonly SectionId[] = ['first-screen', 'key-insight', 'other-tool', 'lead-magnet', 'footer']

/**
 * Records a Section's first view.
 *
 * ```ts
 * trackSectionView('key-insight') // section_view { section: 'key-insight' }
 * ```
 */
const trackSectionView = (sectionId: SectionId) => {
  trackFunnelEvent({ event: 'section_view', section: sectionId })
}

/**
 * The landing page, its First Screen chosen by `utm_content`. The Visitor becomes a Lead once the Lead Form is
 * submitted, or opens the page as one when an earlier visit remembers them. A Lead gets Delivery and the unlocked
 * Chapters, and no Sticky CTA.
 *
 * ```tsx
 * // /?utm_content=money → MoneyAdVariant: First Screen with the Fee Calculator, then the Fund Picker in `#other-tool`
 * // /                   → falls back to PainAdVariant: the Fund Picker first
 * ```
 */
const Home = () => {
  const [searchParams] = useSearchParams()
  const adVariant = resolveAdVariant(searchParams.get('utm_content'))
  const [lead, setLead] = useState<Lead | null>(readRememberedLead)
  const { download } = useDownloader()

  // The Visit's first Funnel Event: a Section's first view comes from an observer, which reports only after this runs.
  useEffect(() => {
    trackFunnelEvent({ event: 'arrival' })
  }, [])
  useOnFirstView({ elementIds: sectionIds, isViewed: isSectionViewed, onFirstView: trackSectionView })

  /**
   * Turns the Visitor into a new Lead: the PDF starts downloading, and the page remembers them for the next visit.
   *
   * ```ts
   * handleLeadFormSubmitted('jana.novakova@seznam.cz')
   * // tahak-evropska-dvojcata-americkych-etf.pdf downloads, pdf_download { trigger: 'auto' };
   * // lead = { kind: 'new', email: 'jana.novakova@seznam.cz' }
   * ```
   */
  const handleLeadFormSubmitted = (email: string) => {
    // Not awaited: the hook catches a failed download into its own `error`. A browser may also refuse a download that
    // no tap started directly, as Safari on iOS can, so Delivery always shows the same file as a visible link too.
    void download(leadMagnetPdfPath, leadMagnetPdfFileName)
    trackFunnelEvent({ event: 'pdf_download', trigger: 'auto' })
    rememberLead()
    setLead({ kind: 'new', email })
  }

  return (
    <Page>
      <main>
        <adVariant.FirstScreen />
        <KeyInsight />
        <adVariant.OtherTool />
        <LeadMagnetSection lead={lead} onLeadFormSubmitted={handleLeadFormSubmitted} />
      </main>
      <Footer />
      <StickyCta isLead={lead !== null} />
    </Page>
  )
}

export default Home
