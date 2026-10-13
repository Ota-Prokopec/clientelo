// The landing page: the five Sections in the order README.md justifies, opened by the Visitor's Ad Variant.
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { resolveAdVariant } from '@lib/adVariant/adVariant.ts'
import { Page } from '../components/Page.tsx'
import { StickyCta } from '../components/StickyCta.tsx'
import { Footer } from '../components/sections/Footer.tsx'
import { KeyInsight } from '../components/sections/KeyInsight.tsx'
import { LeadMagnetSection } from '../components/sections/LeadMagnetSection.tsx'

/**
 * The landing page, its First Screen chosen by `utm_content`. The Visitor becomes a Lead once the Lead Form is
 * submitted, and the Sticky CTA then goes.
 *
 * ```tsx
 * // /?utm_content=money → MoneyAdVariant: First Screen with the Fee Calculator, then the Fund Picker in `#other-tool`
 * // /                   → falls back to PainAdVariant: the Fund Picker first
 * ```
 */
const Home = () => {
  const [searchParams] = useSearchParams()
  const adVariant = resolveAdVariant(searchParams.get('utm_content'))
  // In memory only: #15 remembers the Lead across reloads.
  const [isLead, setIsLead] = useState(false)

  return (
    <Page>
      <main>
        <adVariant.FirstScreen />
        <KeyInsight />
        <adVariant.OtherTool />
        <LeadMagnetSection onLeadFormSubmitted={() => setIsLead(true)} />
      </main>
      <Footer />
      <StickyCta isLead={isLead} />
    </Page>
  )
}

export default Home
