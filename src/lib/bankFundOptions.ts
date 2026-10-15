// The Bank Funds the Fee Calculator compares with a Twin (docs/ads.md, Ad Variant B): ČSOB Akciový, the Bank-Fund
// Saver's example in docs/strategy.md, and any other bank's equity fund at the typical "kolem 2 %". The Bank Fund
// choice lists them in this order, and the first one is prefilled.
import { csobAkciovy, typicalBankEquityFundTer, type DataSource } from '@data/figures.ts'
import { formatPercent } from '@lib/format.ts'

/** A Bank Fund the Visitor can pick, with its TER as the page names it. */
export type BankFundOption = {
  name: string
  terPercent: number
  /** The exact TER for a named fund, "kolem 2 %" for a typical one. */
  terLabel: string
  /** Where the TER comes from: a named fund's KID, or the KID of every surveyed Bank Fund for a typical one. */
  sources: DataSource[]
}

export const bankFundOptions: BankFundOption[] = [
  {
    name: csobAkciovy.name,
    terPercent: csobAkciovy.terPercent,
    terLabel: formatPercent(csobAkciovy.terPercent),
    sources: [csobAkciovy.source],
  },
  {
    name: 'Jiný fond banky',
    terPercent: typicalBankEquityFundTer.value,
    terLabel: `kolem ${formatPercent(typicalBankEquityFundTer.value)}`,
    sources: typicalBankEquityFundTer.sources,
  },
]
