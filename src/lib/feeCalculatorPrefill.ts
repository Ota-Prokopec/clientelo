// What the Fee Calculator opens with, which Ad Variant B's First Screen headline names too (docs/ads.md): a one-off
// 100 000 Kč over 20 years, against SPYL, the S&P 500 Twin at 0.03 % a year that the Ad compares a bank fund with.
import { AD_PROMISE_TWIN_TICKER } from '@data/adPromise.ts'
import type { UcitsEtfTicker } from '@data/figures.ts'

/** The Fee Calculator's opening amount, years and Twin. */
export type FeeCalculatorPrefill = {
  amountKc: number
  years: number
  twinTicker: UcitsEtfTicker
}

export const feeCalculatorPrefill: FeeCalculatorPrefill = {
  amountKc: 100_000,
  years: 20,
  twinTicker: AD_PROMISE_TWIN_TICKER,
}
