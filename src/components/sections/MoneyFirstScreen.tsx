// Ad Variant B's First Screen: a bank fund's TER against a Twin's, ahead of the Fee Calculator, deliverable without
// scrolling at 375 px.
// The `fee-calculator` slot shows the static comparison until #12 makes it interactive.
import { DataSourceNote } from '../DataSourceNote.tsx'
import { TerRow } from '../TerRow.tsx'
import { csobAkciovy, findUcitsEtf, typicalBankEquityFundTer } from '../../data/figures.ts'
import { formatPercent } from '../../lib/format.ts'
import { Section } from './Section.tsx'

/**
 * Ad Variant B's Section 01: the bank fund's TER in `signal` over a Twin's in `brand`, ahead of the Fee Calculator.
 *
 * ```tsx
 * <MoneyFirstScreen />
 * // <section id="first-screen" data-ad-variant="money">01 Poplatek banky vs ETF
 * //   <div id="fee-calculator">ČSOB Akciový 2,22 %, SPYL 0,03 %</div></section>
 * ```
 */
export const MoneyFirstScreen = () => {
  const spyl = findUcitsEtf('SPYL')

  return (
    <Section id="first-screen" number="01" label="Poplatek banky vs ETF" data-ad-variant="money">
      <h1 className="text-headline text-heading">
        <span className="text-signal">{formatPercent(typicalBankEquityFundTer.value)}</span> nebo{' '}
        <span className="text-brand">{formatPercent(spyl.terPercent)}</span> ročně? Spočítejte si rozdíl za 20 let.
      </h1>
      <div id="fee-calculator" className="grid gap-5">
        <dl className="grid gap-2">
          <TerRow
            name={csobAkciovy.name}
            description="akciový fond banky"
            terPercent={csobAkciovy.terPercent}
            fundKind="bank-fund"
          />
          <TerRow
            name={spyl.ticker}
            description={`ETF na ${spyl.trackedIndex}`}
            terPercent={spyl.terPercent}
            fundKind="twin"
          />
        </dl>
        <DataSourceNote sources={[typicalBankEquityFundTer.source, csobAkciovy.source, spyl.source]} />
      </div>
    </Section>
  )
}
