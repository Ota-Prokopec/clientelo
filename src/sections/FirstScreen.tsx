// The First Screen: the Ad Variant's Ad Promise and its Interactive Tool, deliverable without scrolling at 375 px.
// The tool slots (`fund-picker`, `fee-calculator`) show the static comparison until #11 and #12 make them interactive.
import { orderInteractiveTools, type AdVariant } from '../adVariant.ts'
import { DataSourceNote } from '../components/DataSourceNote.tsx'
import { FactGrid } from '../components/FactGrid.tsx'
import { csobAkciovy, findEtf, findUcitsEtf, typicalBankEquityFundTer, usEstateTaxThreshold } from '../data/figures.ts'
import { formatPercent } from '../format.ts'
import { Section } from './Section.tsx'
import { sectionLabelByInteractiveTool } from './sectionLabelByInteractiveTool.ts'

export type FirstScreenArgs = { adVariant: AdVariant }

/**
 * The First Screen the Ad Variant opens: `pain` shows VOO and its Twin, `money` a bank fund's TER against a Twin's.
 *
 * ```tsx
 * <FirstScreen adVariant="pain" />  // VOO struck out over SPYL, in the `fund-picker` slot
 * <FirstScreen adVariant="money" /> // 2,22 % over 0,03 %, in the `fee-calculator` slot
 * ```
 */
export function FirstScreen({ adVariant }: FirstScreenArgs) {
  const [firstInteractiveTool] = orderInteractiveTools(adVariant)

  return (
    <Section
      id="first-screen"
      number="01"
      label={sectionLabelByInteractiveTool[firstInteractiveTool]}
      data-ad-variant={adVariant}
    >
      {adVariant === 'money' ? <MoneyFirstScreen /> : <PainFirstScreen />}
    </Section>
  )
}

/**
 * Ad Variant A: the ETF the Visitor's app won't sell, struck out in grey, over its Twin in `brand`.
 *
 * ```tsx
 * <PainFirstScreen /> // <div id="fund-picker">VOO SPYL, then the Twin's index, TER, estate tax and domicile</div>
 * ```
 */
function PainFirstScreen() {
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

/**
 * Ad Variant B: the bank fund's TER in `signal` over a Twin's in `brand`, ahead of the Fee Calculator.
 *
 * ```tsx
 * <MoneyFirstScreen /> // <div id="fee-calculator">ČSOB Akciový 2,22 %, SPYL 0,03 %</div>
 * ```
 */
function MoneyFirstScreen() {
  const spyl = findUcitsEtf('SPYL')

  return (
    <>
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
    </>
  )
}

/** Whose TER a row shows: a Bank Fund's costs the Visitor, a Twin's is the good number (design-identity.md#colour). */
type FundKind = 'bank-fund' | 'twin'

// One plain string per kind: `cn` would read `text-ter` as a colour and drop it beside `text-signal` (tailwind.md#tokens).
const terClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'text-ter text-signal',
  twin: 'text-ter text-brand',
}

type TerRowArgs = {
  name: string
  description: string
  terPercent: number
  fundKind: FundKind
}

/**
 * One fund's TER, set giant on the right of a 2 px rule, with the fund's name on the left.
 *
 * ```tsx
 * <TerRow name="ČSOB Akciový" description="akciový fond banky" terPercent={2.22} fundKind="bank-fund" />
 * // ČSOB Akciový / akciový fond banky ……… 2,22 % (in `signal`)
 * ```
 */
function TerRow({ name, description, terPercent, fundKind }: TerRowArgs) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-3 border-t-2 border-heading pt-1">
      <dt className="text-label">
        {name}
        <span className="block font-normal text-muted-foreground">{description}</span>
      </dt>
      <dd className={terClassNameByFundKind[fundKind]}>{formatPercent(terPercent)}</dd>
    </div>
  )
}
