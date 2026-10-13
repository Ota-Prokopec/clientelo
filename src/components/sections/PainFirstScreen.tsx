// Ad Variant A's First Screen: the ETF the Visitor's app won't sell, struck out over its Twin, deliverable without
// scrolling at 375 px.
// The `fund-picker` slot shows the static comparison until #11 makes it interactive.
import { DataSourceNote } from '../DataSourceNote.tsx'
import { FactGrid } from '../FactGrid.tsx'
import { findEtf, findUcitsEtf, usEstateTaxThreshold } from '@data/figures.ts'
import { formatPercent } from '@lib/format.ts'
import { Section } from './Section.tsx'

/**
 * Ad Variant A's Section 01: the ETF the Visitor's app won't sell, struck out in grey, over its Twin in `brand`.
 *
 * ```tsx
 * <PainFirstScreen />
 * // <section id="first-screen" data-ad-variant="pain">01 Dvojče k americkému ETF
 * //   <div id="fund-picker">VOO SPYL, then the Twin's index, TER, estate tax and domicile</div></section>
 * ```
 */
export const PainFirstScreen = () => {
  const voo = findEtf('VOO')
  const spyl = findUcitsEtf('SPYL')

  return (
    <Section id="first-screen" number="01" label="Dvojče k americkému ETF" data-ad-variant="pain">
      <h1 className="text-headline text-heading">
        VOO v aplikaci nekoupíte. <span className="text-brand">Dvojče ano.</span>
      </h1>
      <div id="fund-picker" className="grid gap-5">
        <p className="grid text-ticker">
          <s className="relative w-fit text-muted-foreground no-underline">
            {voo.ticker}
            <span aria-hidden="true" className="absolute -inset-x-2 top-[46%] h-3 -rotate-6 rounded-full bg-signal" />
          </s>
          <span className="text-brand">{spyl.ticker}</span>
        </p>
        <FactGrid
          facts={[
            { label: 'Stejný index', value: spyl.trackedIndex },
            {
              label: `TER ročně (${voo.ticker} ${formatPercent(voo.terPercent)})`,
              value: formatPercent(spyl.terPercent),
            },
            { label: 'Americká dědická daň', value: 'žádná' },
            { label: 'Sídlo fondu', value: spyl.domicile },
          ]}
        />
        <DataSourceNote sources={[voo.source, spyl.source, usEstateTaxThreshold.source]} />
      </div>
    </Section>
  )
}
