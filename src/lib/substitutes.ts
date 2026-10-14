// The Fund Picker's answer: the Substitutes the page shows for an ETF, and whether they are Twins, and the groups the
// Lead Magnet's Twin table lists them in. A Twin tracks the same index (docs/strategy.md#twins), so the relation is derived from the two indices, never
// recorded: a fund on a merely similar index can't be called "dvojče" by a slip in the data.
import {
  etfs,
  findEtf,
  findUcitsEtf,
  listDistinctDataSources,
  substituteTickersByEtfTicker,
  type DataSource,
  type Etf,
  type UcitsEtf,
} from '@data/figures.ts'
import type { SubstituteRelation } from '@/types.ts'

/** An ETF with the Substitutes the page shows for it, all sharing one relation. */
export type EtfSubstitutes = {
  etf: Etf
  relation: SubstituteRelation
  substitutes: UcitsEtf[]
}

/** The ETFs that share one list of Substitutes: one group of the Lead Magnet's Twin table. */
export type SubstituteGroup = {
  etfs: Etf[]
  relation: SubstituteRelation
  substitutes: UcitsEtf[]
}

/**
 * A UCITS ETF's place in a Substitute list by distribution policy: accumulating before distributing.
 *
 * ```ts
 * rankDistributionPolicy(findUcitsEtf('SPYL')) // 0 (akumulační)
 * ```
 */
const rankDistributionPolicy = (ucitsEtf: UcitsEtf): number => (ucitsEtf.distributionPolicy === 'akumulační' ? 0 : 1)

/**
 * The Substitutes the page shows for an ETF Ticker: its Twins, or, where no UCITS ETF tracks its index, its closest
 * alternatives. Accumulating ones come first, otherwise in the data module's order.
 *
 * ```ts
 * findSubstitutes('VOO') // { etf: VOO, relation: 'twin', substitutes: [SPYL, CSPX, VUAA] }
 * findSubstitutes('VT')  // { etf: VT, relation: 'closest-alternative', substitutes: [VWCE, FWRA] }
 * findSubstitutes('VTI') // { etf: VTI, relation: 'closest-alternative', substitutes: [] } until step 4 picks one
 * ```
 */
export const findSubstitutes = (etfTicker: string): EtfSubstitutes => {
  const etf = findEtf(etfTicker)
  const substitutes = (substituteTickersByEtfTicker[etfTicker] ?? [])
    .map(findUcitsEtf)
    // An accumulating fund pays no dividends, so it leaves nothing for the Czech tax return. The sort is stable.
    .toSorted((first, second) => rankDistributionPolicy(first) - rankDistributionPolicy(second))
  const twins = substitutes.filter((ucitsEtf) => ucitsEtf.trackedIndex === etf.trackedIndex)

  return twins.length > 0
    ? { etf, relation: 'twin', substitutes: twins }
    : { etf, relation: 'closest-alternative', substitutes }
}

/**
 * Every ETF with Substitutes, grouped with the ETFs that share them, in the data module's order. An ETF whose
 * Substitute isn't chosen yet is left out, so the Twin table never lists an empty row.
 *
 * ```ts
 * groupEtfsBySubstitutes()
 * // [{ etfs: [VOO, IVV, SPY], relation: 'twin', substitutes: [SPYL, CSPX, VUAA] },
 * //  { etfs: [VT], relation: 'closest-alternative', substitutes: [VWCE, FWRA] }]  (VTI has none yet)
 * ```
 */
export const groupEtfsBySubstitutes = (): SubstituteGroup[] => {
  // Keyed by the relation and the Substitutes' Tickers, such as 'twin SPYL CSPX VUAA'.
  const substituteGroupBySubstitutesKey = new Map<string, SubstituteGroup>()

  for (const etf of etfs) {
    const { relation, substitutes } = findSubstitutes(etf.ticker)
    if (substitutes.length === 0) continue
    const substitutesKey = [relation, ...substitutes.map((ucitsEtf) => ucitsEtf.ticker)].join(' ')
    const substituteGroup = substituteGroupBySubstitutesKey.get(substitutesKey)

    if (substituteGroup) substituteGroup.etfs.push(etf)
    else substituteGroupBySubstitutesKey.set(substitutesKey, { etfs: [etf], relation, substitutes })
  }

  return [...substituteGroupBySubstitutesKey.values()]
}

/**
 * The Data Sources of every row of the Twin table, each once: each Substitute's, then the ETFs' it replaces, group by
 * group.
 *
 * ```ts
 * listSubstituteGroupSources(groupEtfsBySubstitutes())
 * // [SPYL's, CSPX's, VUAA's, VOO's, IVV's, SPY's, VWCE's, FWRA's, VT's Data Source]
 * ```
 */
export const listSubstituteGroupSources = (substituteGroups: SubstituteGroup[]): DataSource[] => {
  return listDistinctDataSources(
    substituteGroups.flatMap(({ etfs, substitutes }) => [
      ...substitutes.map((ucitsEtf) => ucitsEtf.source),
      ...etfs.map((etf) => etf.source),
    ]),
  )
}
