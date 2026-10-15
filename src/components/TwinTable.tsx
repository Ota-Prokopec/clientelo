// Chapter 2 unlocked on the page: the Twin table, with the groups the Lead Magnet PDF lists (PdfTwinTableChapter.tsx).
// One group per list of Substitutes, under the ETFs it replaces struck out, and per UCITS ETF its Ticker and TER over its
// ISIN, distribution policy, domicile, and exchange with currency. A 375 px screen can't hold the PDF's six columns, so
// each UCITS ETF is a ruled row with its facts two to a line. Twins are set in `brand`; a closest alternative stays in
// `heading`, so it never looks like a Twin (docs/strategy.md#twins).
import { Fragment } from 'react'
import type { UcitsEtf } from '@data/figures.ts'
import { formatPercent } from '@lib/format.ts'
import { relationPresentationByRelation } from '@lib/relationPresentationByRelation.ts'
import { groupEtfsBySubstitutes, listSubstituteGroupSources } from '@lib/substitutes.ts'
import type { Fact } from './FactGrid.tsx'
import { DataSourceNote } from './DataSourceNote.tsx'
import { SubstituteFigure } from './SubstituteFigure.tsx'

/**
 * A UCITS ETF's facts below its Ticker and TER, labelled as the PDF's columns are.
 *
 * ```ts
 * listUcitsEtfFacts(findUcitsEtf('SPYL'))
 * // [{ label: 'ISIN', value: 'IE000XZSV718' }, { label: 'Výnosy', value: 'akumulační' }, { label: 'Sídlo', value: 'Irsko' },
 * //  { label: 'Burza, měna', value: 'Xetra, EUR' }]
 * ```
 */
const listUcitsEtfFacts = (ucitsEtf: UcitsEtf): Fact[] => [
  { label: 'ISIN', value: ucitsEtf.isin },
  { label: 'Výnosy', value: ucitsEtf.distributionPolicy },
  { label: 'Sídlo', value: ucitsEtf.domicile },
  { label: 'Burza, měna', value: `${ucitsEtf.exchange}, ${ucitsEtf.currency}` },
]

/**
 * Every group of Substitutes as ruled rows, with the Data Source of every row.
 *
 * ```tsx
 * <TwinTable />
 * // Dvojčata na stejný index S&P 500 místo VOO 0,03 % · IVV 0,03 % · SPY 0,0945 %  (Tickers struck)
 * // SPYL  0,03 % ročně / ISIN IE000XZSV718 · Výnosy akumulační · Sídlo Irsko · Burza, měna Xetra, EUR  …
 * ```
 */
export const TwinTable = () => {
  const substituteGroups = groupEtfsBySubstitutes()
  const tableSources = listSubstituteGroupSources(substituteGroups)

  return (
    <div className="grid gap-6">
      <p>
        Ticker se mezi burzami liší, ISIN ne: podle ISIN najdete správný fond v každé aplikaci. Akumulační třída
        dividendy nevyplácí, ale rovnou je investuje.
      </p>
      {substituteGroups.map(({ etfs, relation, substitutes }) => {
        const { substituteGroupLabel } = relationPresentationByRelation[relation]
        const [firstSubstitute] = substitutes

        return (
          <div key={etfs.map((etf) => etf.ticker).join()} className="grid gap-3">
            <h4 className="text-label">
              {substituteGroupLabel[substitutes.length === 1 ? 'one' : 'many']} {firstSubstitute?.trackedIndex} místo{' '}
              {etfs.map((etf, etfIndex) => (
                <Fragment key={etf.ticker}>
                  {etfIndex > 0 && ' · '}
                  <s className="text-muted-foreground decoration-signal decoration-2">{etf.ticker}</s>{' '}
                  <span className="text-muted-foreground">{formatPercent(etf.terPercent)}</span>
                </Fragment>
              ))}
            </h4>
            <ul className="grid gap-4">
              {substitutes.map((ucitsEtf) => (
                <li key={ucitsEtf.ticker} className="grid gap-2 border-t-2 border-heading pt-1.5">
                  <p className="flex items-baseline justify-between gap-3">
                    <SubstituteFigure relation={relation} render={<span className="text-fact" />}>
                      {ucitsEtf.ticker}
                    </SubstituteFigure>
                    <SubstituteFigure relation={relation} render={<span className="text-fact" />}>
                      {formatPercent(ucitsEtf.terPercent)} ročně
                    </SubstituteFigure>
                  </p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {listUcitsEtfFacts(ucitsEtf).map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-note text-muted-foreground">{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <DataSourceNote sources={tableSources} />
    </div>
  )
}
