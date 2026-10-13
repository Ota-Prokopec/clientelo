// Ad Variant A's First Screen content: the ETF the Visitor's app won't sell, struck out over its Twin.
// The `fund-picker` slot shows the static comparison until #11 makes it interactive.
import { DataSourceNote } from '../components/DataSourceNote.tsx'
import { FactGrid } from '../components/FactGrid.tsx'
import { findEtf, findUcitsEtf, usEstateTaxThreshold } from '../data/figures.ts'
import { formatPercent } from '../format.ts'

/**
 * Ad Variant A: the ETF the Visitor's app won't sell, struck out in grey, over its Twin in `brand`.
 *
 * ```tsx
 * <PainFirstScreen /> // <div id="fund-picker">VOO SPYL, then the Twin's index, TER, estate tax and domicile</div>
 * ```
 */
export function PainFirstScreen() {
  const voo = findEtf('VOO')
  const spyl = findUcitsEtf('SPYL')

  return (
    <>
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
    </>
  )
}
