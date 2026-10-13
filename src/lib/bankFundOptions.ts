// The Bank Funds the Fee Calculator compares with a Twin (docs/ads.md, Ad Variant B): ČSOB Akciový, the Bank-Fund
// Saver's example in docs/strategy.md, and any other bank's equity fund at the typical "kolem 2 %". The Bank Fund
// choice lists them in this order, and the first one is prefilled.
import { csobAkciovy, typicalBankEquityFund, type BankFund } from '@data/figures.ts'
import { formatPercent } from '@lib/format.ts'

/** A Bank Fund the Visitor can pick, with its TER as the page names it. */
export type BankFundOption = {
  bankFund: BankFund
  /** The exact TER for a named fund, "kolem 2 %" for a typical one. */
  terLabel: string
}

export const bankFundOptions: BankFundOption[] = [
  { bankFund: csobAkciovy, terLabel: formatPercent(csobAkciovy.terPercent) },
  { bankFund: typicalBankEquityFund, terLabel: `kolem ${formatPercent(typicalBankEquityFund.terPercent)}` },
]
