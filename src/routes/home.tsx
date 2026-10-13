// The landing page: the five Sections in the order README.md justifies, opened by the Visitor's Ad Variant.
import { useSearchParams } from 'react-router'
import { resolveAdVariant } from '@lib/adVariant/adVariant.ts'
import { Page } from '../components/Page.tsx'
import { StickyCta } from '../components/StickyCta.tsx'
import { Footer } from '../components/sections/Footer.tsx'
import { KeyInsight } from '../components/sections/KeyInsight.tsx'
import { LeadMagnetSection } from '../components/sections/LeadMagnetSection.tsx'
import { leadMagnetSectionId } from '../components/sections/leadMagnetSectionId.ts'

/**
 * The landing page, its First Screen chosen by `utm_content`.
 *
 * ```tsx
 * // /?utm_content=money → MoneyAdVariant: First Screen with the Fee Calculator, then the Fund Picker in `#other-tool`
 * // /                   → falls back to PainAdVariant: the Fund Picker first
 * ```
 */
const Home = () => {
  const [searchParams] = useSearchParams()
  const adVariant = resolveAdVariant(searchParams.get('utm_content'))

  return (
    <Page>
      <main>
        <adVariant.FirstScreen />
        <KeyInsight />
        <adVariant.OtherTool />
        <LeadMagnetSection />
      </main>
      <Footer />
      {/* #13 points this at the Lead Form and sets isLead once it is submitted. */}
      <StickyCta targetId={leadMagnetSectionId} isLead={false} />
    </Page>
  )
}

export default Home
