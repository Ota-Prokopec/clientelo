// One UCITS ETF's row in the Twin table (TwinTable.tsx): a 2 px rule over its Ticker and TER in the relation's colour,
// then its ISIN, distribution policy, domicile, and exchange with currency two to a line, labelled as the Lead Magnet
// PDF's columns are (PdfTwinTableChapter.tsx).
import type { UcitsEtf } from '@data/figures.ts'
import { formatPercent } from '@lib/format.ts'
import type { SubstituteRelation } from '@/types.ts'
import type { Fact } from './FactGrid.tsx'
import { SubstituteFigure } from './SubstituteFigure.tsx'

export type TwinTableItemProps = {
  substitute: UcitsEtf
  relation: SubstituteRelation
}

/**
 * A UCITS ETF's facts below its Ticker and TER, labelled as the PDF's columns are.
 *
 * ```ts
 * listUcitsEtfFacts(findUcitsEtf('SPYL'))
 * // [{ label: 'ISIN', value: 'IE000XZSV718' }, { label: 'Výnosy', value: 'akumulační' }, { label: 'Sídlo', value: 'Irsko' },
 * //  { label: 'Burza, měna', value: 'Xetra, EUR' }]
 * ```
 */
const listUcitsEtfFacts = (substitute: UcitsEtf): Fact[] => [
  { label: 'ISIN', value: substitute.isin },
  { label: 'Výnosy', value: substitute.distributionPolicy },
  { label: 'Sídlo', value: substitute.domicile },
  { label: 'Burza, měna', value: `${substitute.exchange}, ${substitute.currency}` },
]

/**
 * A UCITS ETF as one ruled row of a Twin table group: it renders inside a `<ul>`.
 *
 * ```tsx
 * <TwinTableItem substitute={findUcitsEtf('SPYL')} relation="twin" />
 * // <li>SPYL  0,03 % ročně / ISIN IE000XZSV718 · Výnosy akumulační · Sídlo Irsko · Burza, měna Xetra, EUR</li>
 * ```
 */
export const TwinTableItem = ({ substitute, relation }: TwinTableItemProps) => {
  return (
    <li className="grid gap-2 border-t-2 border-heading pt-1.5">
      <p className="flex items-baseline justify-between gap-3">
        <SubstituteFigure relation={relation} render={<span className="text-fact" />}>
          {substitute.ticker}
        </SubstituteFigure>
        <SubstituteFigure relation={relation} render={<span className="text-fact" />}>
          {formatPercent(substitute.terPercent)} ročně
        </SubstituteFigure>
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {listUcitsEtfFacts(substitute).map((fact) => (
          <div key={fact.label}>
            <dt className="text-note text-muted-foreground">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </li>
  )
}
