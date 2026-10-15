// Tests the Fund Picker's answer: the Substitutes shown for an ETF, and whether they are Twins or closest alternatives.
// Also tests the groups the Lead Magnet's Twin table lists them in.
import { describe, expect, it } from 'vitest'
import { etfs, type EtfTicker } from '@data/figures.ts'
import { findSubstitutes, groupEtfsBySubstitutes } from '@lib/substitutes.ts'

const etfTickers = etfs.map((etf) => etf.ticker)

describe('findSubstitutes', () => {
  it.each<EtfTicker>(['VOO', 'IVV', 'SPY'])('answers %s with its S&P 500 Twins, SPYL first', (etfTicker) => {
    const etfSubstitutes = findSubstitutes(etfTicker)

    expect(etfSubstitutes.relation).toBe('twin')
    expect(etfSubstitutes.substitutes.map((ucitsEtf) => ucitsEtf.ticker)).toEqual(['SPYL', 'CSPX', 'VUAA'])
  })

  it('answers VT with its FTSE Global All Cap Twin', () => {
    const etfSubstitutes = findSubstitutes('VT')

    expect(etfSubstitutes.relation).toBe('twin')
    expect(etfSubstitutes.substitutes.map((ucitsEtf) => ucitsEtf.ticker)).toEqual(['VGLA'])
  })

  it.each(etfTickers)('answers %s with at least one Substitute', (etfTicker) => {
    expect(findSubstitutes(etfTicker).substitutes).not.toEqual([])
  })

  it.each(etfTickers)('lists the accumulating Substitutes of %s ahead of distributing ones', (etfTicker) => {
    const distributionPolicies = findSubstitutes(etfTicker).substitutes.map((ucitsEtf) => ucitsEtf.distributionPolicy)
    const firstDistributingIndex = distributionPolicies.indexOf('distribuční')

    expect(firstDistributingIndex === -1 ? [] : distributionPolicies.slice(firstDistributingIndex)).not.toContain(
      'akumulační',
    )
  })
})

describe('groupEtfsBySubstitutes', () => {
  it('groups the ETFs that share Substitutes, in the data module order', () => {
    const substituteGroups = groupEtfsBySubstitutes().map((substituteGroup) => ({
      etfTickers: substituteGroup.etfs.map((etf) => etf.ticker),
      relation: substituteGroup.relation,
      substituteTickers: substituteGroup.substitutes.map((ucitsEtf) => ucitsEtf.ticker),
    }))

    expect(substituteGroups).toEqual([
      { etfTickers: ['VOO', 'IVV', 'SPY'], relation: 'twin', substituteTickers: ['SPYL', 'CSPX', 'VUAA'] },
      { etfTickers: ['VT'], relation: 'twin', substituteTickers: ['VGLA'] },
    ])
  })
})
