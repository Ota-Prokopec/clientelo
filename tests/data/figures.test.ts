// Tests the data module's figures and Data Sources beyond single readings: the typical Bank Fund TER behind "kolem 2 %",
// computed as the median of the surveyed Bank Funds' TERs, and the list of Data Sources the footer cites in full.
import { describe, expect, it } from 'vitest'
import {
  calculateTypicalTerPercent,
  isVerified,
  listDataSources,
  typicalBankEquityFundTer,
  type BankFund,
} from '../../src/data/figures.ts'

/** A Bank Fund at the given TER, whose name and Data Source don't matter to the computation. */
const createBankFund = (terPercent: number): BankFund => ({
  name: `Fond za ${terPercent} %`,
  terPercent,
  source: { name: 'KID', url: null, verifiedOn: null },
})

describe('calculateTypicalTerPercent', () => {
  // Sorted 1.2, 1.4, 2.6, 5.0: the median 2.0 rounds to 2, where the lower middle (1), the upper middle (3) and the
  // mean 2.55 (3) would not.
  it('takes the mean of the two middle TERs of an even count, rounded to a whole percent', () => {
    const bankFunds = [2.6, 1.4, 1.2, 5.0].map(createBankFund)

    expect(calculateTypicalTerPercent(bankFunds)).toBe(2)
  })

  // Sorted 1.0, 2.6, 3.4: the middle 2.6 rounds to 3, where the mean 2.33 would round to 2.
  it('takes the middle TER of an odd count, rounded to a whole percent', () => {
    const bankFunds = [3.4, 1.0, 2.6].map(createBankFund)

    expect(calculateTypicalTerPercent(bankFunds)).toBe(3)
  })

  it('throws on no Bank Funds, which have no typical TER', () => {
    expect(() => calculateTypicalTerPercent([])).toThrow()
  })
})

describe('typicalBankEquityFundTer', () => {
  // Ad Variant B claims "Akciové fondy od bank si strhávají kolem 2 % ročně" (docs/ads.md). A re-read TER that moves the
  // median off 2 % breaks that claim, which #29 decides before the figure lands.
  it('keeps "kolem 2 %" true: the surveyed Bank Funds’ median TER rounds to 2 %', () => {
    expect(typicalBankEquityFundTer).toMatchObject({ value: 2, unit: '%' })
  })

  it('cites the verified KID of each surveyed Bank Fund', () => {
    expect(typicalBankEquityFundTer.sources.map((source) => source.name)).toEqual([
      'ČSOB, KID fondu ČSOB Akciový',
      'Erste, KID fondu TOP STOCKS',
      'Amundi, KID fondu KB Portfolio – Dividendové',
      'Raiffeisen, KID fondu Raiffeisen fond amerických akcií',
    ])
    expect(typicalBankEquityFundTer.sources.every(isVerified)).toBe(true)
  })
})

describe('listDataSources', () => {
  it('lists the rules and broker statements the Key Insight rests on, beside the figures', () => {
    const sourceNames = listDataSources().map((source) => source.name)

    expect(sourceNames).toEqual(
      expect.arrayContaining([
        'Nařízení (EU) č. 1286/2014 (PRIIPs), čl. 5 a 13',
        'XTB, centrum nápovědy: ETF z USA bez dokumentu KID',
        'Trading 212, odpověď týmu v komunitě z 2. 8. 2024: ETF z USA bez souladu s PRIIPs',
        'Revolut, centrum nápovědy: jen ETF registrované v EU',
        'ČNB, stanovisko RS2018-12, část B.2',
      ]),
    )
  })
})
