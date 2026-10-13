// Ad Variant A's First Screen: the Fund Picker with VOO struck out over its Twin SPYL, deliverable without scrolling
// at 375 px. Its headline follows the ETF the Visitor picks.
import { FundPicker } from '../FundPicker.tsx'
import { Section } from './Section.tsx'

/**
 * Ad Variant A's Section 01: the Fund Picker under a headline naming the picked ETF and whether it has a Twin.
 *
 * ```tsx
 * <PainFirstScreen />
 * // <section id="first-screen" data-ad-variant="pain">01 Dvojče k americkému ETF
 * //   <h1>VOO v aplikaci nekoupíte. Dvojče ano.</h1><div id="fund-picker">…</div></section>
 * ```
 */
export const PainFirstScreen = () => {
  return (
    <Section id="first-screen" number="01" label="Dvojče k americkému ETF" data-ad-variant="pain">
      <FundPicker
        renderHeadline={({ etf, relation, substitutes }) => (
          // Three lines are kept for every pick, so a shorter or longer answer never moves the picker under the
          // Visitor's finger. Only a Twin's answer is set in `brand` (design-identity.md#colour).
          <h1 className="min-h-[3lh] text-headline text-heading">
            {etf.ticker} v aplikaci nekoupíte.{' '}
            {relation === 'twin' ? (
              <span className="text-brand">Dvojče ano.</span>
            ) : (
              substitutes.length > 0 && 'Alternativa ano.'
            )}
          </h1>
        )}
      />
    </Section>
  )
}
