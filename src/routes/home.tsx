// The landing page: the five Sections in the order README.md justifies, opened by the Visitor's Ad Variant.
import { useSearchParams } from 'react-router'
import { orderInteractiveTools, resolveAdVariant } from '../adVariant.ts'
import { StickyCta } from '../components/StickyCta.tsx'
import { FirstScreen } from '../sections/FirstScreen.tsx'
import { Footer } from '../sections/Footer.tsx'
import { KeyInsight } from '../sections/KeyInsight.tsx'
import { LeadMagnetSection, leadMagnetSectionId } from '../sections/LeadMagnetSection.tsx'
import { OtherTool } from '../sections/OtherTool.tsx'

/**
 * The landing page, its First Screen chosen by `utm_content`.
 *
 * ```tsx
 * // /?utm_content=money → First Screen with the Fee Calculator, then the Fund Picker in `#other-tool`
 * // /                   → falls back to `pain`: the Fund Picker first
 * ```
 */
export default function Home() {
  const [searchParams] = useSearchParams()
  const adVariant = resolveAdVariant(searchParams.get('utm_content'))
  const [, otherInteractiveTool] = orderInteractiveTools(adVariant)

  return (
    <>
      <main>
        <FirstScreen adVariant={adVariant} />
        <KeyInsight />
        <OtherTool interactiveTool={otherInteractiveTool} />
        <LeadMagnetSection />
      </main>
      <Footer />
      {/* #13 points this at the Lead Form and sets isLead once it is submitted. */}
      <StickyCta targetId={leadMagnetSectionId} isLead={false} />
    </>
  )
}
