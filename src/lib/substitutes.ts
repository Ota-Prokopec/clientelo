// The Fund Picker's answer: the Substitutes the page shows for an ETF, and whether they are Twins.
// A Twin tracks the same index (docs/strategy.md#twins), so the relation is derived from the two indices, never
// recorded: a fund on a merely similar index can't be called "dvojče" by a slip in the data.
import { findEtf, findUcitsEtf, substituteTickersByEtfTicker, type Etf, type UcitsEtf } from '@data/figures.ts'
import type { SubstituteRelation } from '@/types.ts'

/** An ETF with the Substitutes the page shows for it, all sharing one relation. */
export type EtfSubstitutes = {
  etf: Etf
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
