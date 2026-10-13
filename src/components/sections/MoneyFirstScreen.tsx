// Ad Variant B's First Screen: the Ad Promise's headline over the prefilled Fee Calculator, whose Kč difference shows
// without scrolling at 375 px.
import { FeeCalculator } from '../FeeCalculator.tsx'
import { findUcitsEtf, typicalBankEquityFundTer } from '@data/figures.ts'
import { feeCalculatorPrefill } from '@lib/feeCalculatorPrefill.ts'
import { formatPercent, formatYears } from '@lib/format.ts'
import { Section } from './Section.tsx'

/**
 * Ad Variant B's Section 01: the bank fund's TER in `signal` and a Twin's in `brand`, over the Fee Calculator.
 *
 * ```tsx
 * <MoneyFirstScreen />
 * // <section id="first-screen" data-ad-variant="money">01 Poplatek banky vs ETF
 * //   <h1>2 % nebo 0,03 % ročně? …</h1><div id="fee-calculator">… 35 575 Kč …</div></section>
 * ```
 */
export const MoneyFirstScreen = () => {
  const twin = findUcitsEtf(feeCalculatorPrefill.twinTicker)

  return (
    <Section id="first-screen" number="01" label="Poplatek banky vs ETF" data-ad-variant="money">
      <h1 className="text-headline text-heading">
        <span className="text-signal">{formatPercent(typicalBankEquityFundTer.value)}</span> nebo{' '}
        <span className="text-brand">{formatPercent(twin.terPercent)}</span> ročně? Spočítejte si rozdíl za{' '}
        {formatYears(feeCalculatorPrefill.years)}.
      </h1>
      <FeeCalculator />
    </Section>
  )
}
