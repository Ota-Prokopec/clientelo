// What the Fee Calculator opens with, which Ad Variant B's First Screen headline names too (docs/ads.md): a one-off
// 100 000 Kč over 20 years in a bank fund at "kolem 2 %", against SPYL, the S&P 500 Twin at 0.03 % a year that the Ad
// compares a bank fund with. At those TERs the bank fund leaves about two thirds, the "zhruba o třetinu méně" the Ad says.
import { AD_PROMISE_TWIN_TICKER } from '@data/adPromise.ts'
import type { UcitsEtfTicker } from '@data/figures.ts'
import { typicalBankFundOption, type BankFundOption } from './bankFundOptions.ts'

/** The Fee Calculator's opening amount, years, Bank Fund and Twin. */
export type FeeCalculatorPrefill = {
  amountKc: number
  years: number
  bankFundOption: BankFundOption
  twinTicker: UcitsEtfTicker
}

export const feeCalculatorPrefill: FeeCalculatorPrefill = {
  amountKc: 100_000,
  years: 20,
  bankFundOption: typicalBankFundOption,
  twinTicker: AD_PROMISE_TWIN_TICKER,
}
