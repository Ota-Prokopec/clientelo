// Tests the Fee Calculator's math: what a Bank Fund's TER leaves of a one-off amount against a Twin's.
import { describe, expect, it } from 'vitest'
import { calculateTerCost } from '@lib/terCost.ts'

describe('calculateTerCost', () => {
  it('leaves 63 826 Kč in ČSOB Akciový and 99 402 Kč in SPYL from 100 000 Kč over 20 years', () => {
    const terCost = calculateTerCost({ amountKc: 100_000, years: 20, bankFundTerPercent: 2.22, twinTerPercent: 0.03 })

    expect(terCost.bankFundAmountKc).toBeCloseTo(63_826.45, 1)
    expect(terCost.twinAmountKc).toBeCloseTo(99_401.71, 1)
    expect(terCost.differenceKc).toBeCloseTo(35_575.26, 1)
  })

  // docs/ads.md derives "zhruba o třetinu méně" from this ratio: ((1 − 0.02) / (1 − 0.0003))^20 ≈ 0.67.
  it('leaves about two thirds in a Bank Fund at 2 % of what a Twin at 0.03 % leaves after 20 years', () => {
    const terCost = calculateTerCost({ amountKc: 100_000, years: 20, bankFundTerPercent: 2, twinTerPercent: 0.03 })

    expect(terCost.bankFundToTwinRatio).toBeCloseTo(0.6716, 4)
  })

  it.each([Number.NaN, -50_000])('counts an amount of %s, a cleared or negative field, as 0 Kč', (amountKc) => {
    const terCost = calculateTerCost({ amountKc, years: 20, bankFundTerPercent: 2.22, twinTerPercent: 0.03 })

    expect(terCost).toMatchObject({ bankFundAmountKc: 0, twinAmountKc: 0, differenceKc: 0 })
  })
})
