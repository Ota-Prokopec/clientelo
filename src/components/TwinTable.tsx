// Chapter 2 unlocked on the page: the Twin table, with the groups the Lead Magnet PDF lists (PdfTwinTableChapter.tsx).
// One group per list of Substitutes, under the ETFs it replaces struck out, and per UCITS ETF its Ticker and TER over its
// ISIN, distribution policy, domicile, and exchange with currency. A 375 px screen can't hold the PDF's six columns, so
// each UCITS ETF is a ruled row with its facts two to a line (TwinTableItem.tsx). Twins are set in `brand`; a closest
// alternative stays in `heading`, so it never looks like a Twin (docs/strategy.md#twins).
import { Fragment } from 'react'
import { formatPercent } from '@lib/format.ts'
import { relationPresentationByRelation } from '@lib/relationPresentationByRelation.ts'
import { groupEtfsBySubstitutes, listSubstituteGroupSources } from '@lib/substitutes.ts'
import { DataSourceNote } from './DataSourceNote.tsx'
import { TwinTableItem } from './TwinTableItem.tsx'

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
              {substitutes.map((substitute) => (
                <TwinTableItem key={substitute.ticker} substitute={substitute} relation={relation} />
              ))}
            </ul>
          </div>
        )
      })}
      <DataSourceNote sources={tableSources} />
    </div>
  )
}
