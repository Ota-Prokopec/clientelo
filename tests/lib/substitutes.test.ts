// Tests the Fund Picker's answer: the Substitutes shown for an ETF, and whether they are Twins or closest alternatives.
import { describe, expect, it } from 'vitest'
import { etfs } from '@data/figures.ts'
import { findSubstitutes } from '@lib/substitutes.ts'

describe('findSubstitutes', () => {
  it.each(['VOO', 'IVV', 'SPY'])('answers %s with its S&P 500 Twins, SPYL first', (etfTicker) => {
    const etfSubstitutes = findSubstitutes(etfTicker)

    expect(etfSubstitutes.relation).toBe('twin')
    expect(etfSubstitutes.substitutes.map((ucitsEtf) => ucitsEtf.ticker)).toEqual(['SPYL', 'CSPX', 'VUAA'])
  })

  it('answers VT with FTSE All-World funds as closest alternatives, never as Twins', () => {
    const etfSubstitutes = findSubstitutes('VT')

    expect(etfSubstitutes.relation).toBe('closest-alternative')
    expect(etfSubstitutes.substitutes.map((ucitsEtf) => ucitsEtf.ticker)).toEqual(['VWCE', 'FWRA'])
  })

  it('answers VTI as a closest alternative while no fund for it is chosen yet', () => {
    const etfSubstitutes = findSubstitutes('VTI')

    expect(etfSubstitutes.relation).toBe('closest-alternative')
    expect(etfSubstitutes.substitutes).toEqual([])
  })

  it.each(etfs.map((etf) => etf.ticker))('lists the accumulating Substitutes of %s ahead of distributing ones', (etfTicker) => {
    const distributionPolicies = findSubstitutes(etfTicker).substitutes.map((ucitsEtf) => ucitsEtf.distributionPolicy)
    const firstDistributingIndex = distributionPolicies.indexOf('distribuční')

    expect(firstDistributingIndex === -1 ? [] : distributionPolicies.slice(firstDistributingIndex)).not.toContain(
      'akumulační',
    )
  })
})
