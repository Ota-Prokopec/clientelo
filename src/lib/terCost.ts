// The Fee Calculator's math: what a Bank Fund's TER leaves of a one-off amount against a Twin's (docs/ads.md, Ad
// Variant B). The market return is the same for both funds, so it cancels out and is never assumed: each TER is taken
// off once a year.

export type CalculateTerCostProps = {
  amountKc: number
  years: number
  bankFundTerPercent: number
  twinTerPercent: number
}

/** What a one-off amount comes to in a Bank Fund and in a Twin after the years, before any market return. */
export type TerCost = {
  bankFundAmountKc: number
  twinAmountKc: number
  /** How many Kč more the Twin leaves than the Bank Fund. */
  differenceKc: number
  /** `((1 − TER_bank) / (1 − TER_twin))^years`: the share of the Twin's amount the Bank Fund leaves, whatever the market does. */
  bankFundToTwinRatio: number
}

/**
 * An amount the Visitor typed, or zero when the field is cleared (`NaN`) or negative.
 *
 * ```ts
 * clampToNonNegativeAmountKc(100_000)    // 100 000
 * clampToNonNegativeAmountKc(-50_000)    // 0
 * clampToNonNegativeAmountKc(Number.NaN) // 0
 * ```
 */
const clampToNonNegativeAmountKc = (amountKc: number): number => (amountKc > 0 ? amountKc : 0)

/**
 * The amount left in each fund once its TER has been taken off every year, and the difference in Kč. A cleared or
 * negative amount counts as 0 Kč, so the page never shows `NaN`.
 *
 * ```ts
 * calculateTerCost({ amountKc: 100_000, years: 20, bankFundTerPercent: 2.22, twinTerPercent: 0.03 })
 * // { bankFundAmountKc: 63 826.45…, twinAmountKc: 99 401.71…, differenceKc: 35 575.26…, bankFundToTwinRatio: 0.642… }
 * calculateTerCost({ amountKc: Number.NaN, years: 20, bankFundTerPercent: 2.22, twinTerPercent: 0.03 })
 * // { bankFundAmountKc: 0, twinAmountKc: 0, differenceKc: 0, bankFundToTwinRatio: 0.642… }
 * ```
 */
export const calculateTerCost = ({ years, bankFundTerPercent, twinTerPercent, ...args }: CalculateTerCostProps): TerCost => {
  const amountKc = clampToNonNegativeAmountKc(args.amountKc)
  // The share of the amount each fund keeps after one year's TER.
  const bankFundYearlyShare = 1 - bankFundTerPercent / 100
  const twinYearlyShare = 1 - twinTerPercent / 100
  const bankFundAmountKc = amountKc * bankFundYearlyShare ** years
  const twinAmountKc = amountKc * twinYearlyShare ** years

  return {
    bankFundAmountKc,
    twinAmountKc,
    differenceKc: twinAmountKc - bankFundAmountKc,
    bankFundToTwinRatio: (bankFundYearlyShare / twinYearlyShare) ** years,
  }
}
