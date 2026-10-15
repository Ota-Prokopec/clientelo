// Tests the data module's figures and Data Sources beyond single readings: the typical Bank Fund TER behind "kolem 2 %",
// computed as the median of the surveyed Bank Funds' TERs, the list of Data Sources the footer cites in full, and that
// every Data Source the module exports is verified and in that list, so no unverified or uncited figure ships.
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import * as figuresModule from '../../src/data/figures.ts'
import {
  calculateTypicalTerPercent,
  isVerified,
  keyInsightSources,
  listDataSources,
  surveyedBankFunds,
  typicalBankEquityFundTer,
  type BankFund,
  type DataSource,
} from '../../src/data/figures.ts'

/** A Bank Fund at the given TER, whose name and Data Source don't matter to the computation. */
const createBankFund = (terPercent: number): BankFund => ({
  name: `Fond za ${terPercent} %`,
  terPercent,
  source: { name: 'KID', url: null, verifiedOn: null },
})

/**
 * Whether a value has a Data Source's keys: a name, a URL and a verification date, verified or not. The data module's
 * types already hold each key's type.
 *
 * ```ts
 * isDataSource(findEtf('VOO').source)         // true
 * isDataSource(unverifiedSource('Nový zdroj')) // true
 * isDataSource(findEtf('VOO'))                // false: an ETF holds a Data Source, it isn't one
 * ```
 */
const isDataSource = (value: unknown): value is DataSource =>
  typeof value === 'object' && value !== null && 'name' in value && 'url' in value && 'verifiedOn' in value

/**
 * Every Data Source a value holds, however deep in its objects and arrays, each object once. A function holds none.
 *
 * ```ts
 * collectDataSources({ etfs, unverifiedSource })        // each ETF's source
 * collectDataSources([csobAkciovy, surveyedBankFunds]) // each surveyed Bank Fund's source, ČSOB Akciový's once
 * ```
 */
const collectDataSources = (value: unknown): DataSource[] => {
  if (isDataSource(value)) return [value]
  if (typeof value !== 'object' || value === null) return []

  return [...new Set(Object.values(value).flatMap(collectDataSources))]
}

// Found by walking the module's exports rather than only read from listDataSources(), so a figure added to the module
// is held to the tests below before anyone lists it. The footer's list is walked too, in case it cites a Data Source
// that no export holds.
const exportedDataSources = collectDataSources([figuresModule, listDataSources()])

// Today's date at UTC+14, the first time zone to reach a new day, so a source read today never counts as in the future,
// whatever time zone the verifier or the build is in.
const todayAtUtcPlus14 = new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().slice(0, 10)

/**
 * A verified Data Source: the URL it was read on, and the real ISO date (`2026-10-14`) it was read, which isn't in the
 * future. It sets no age limit, so time passing never fails the build (ADR-0004).
 */
const verifiedDataSourceSchema = z.object({
  url: z.httpUrl(),
  verifiedOn: z.iso.date().refine((verifiedOn) => verifiedOn <= todayAtUtcPlus14, 'Verified on a future date'),
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

describe('every Data Source the data module exports', () => {
  // A walk that missed a nested Data Source would leave it out of every test below, which would then pass without it.
  it('includes those nested in the Bank Funds and the Key Insight', () => {
    expect(exportedDataSources).toEqual(
      expect.arrayContaining([
        ...surveyedBankFunds.map((bankFund) => bankFund.source),
        ...Object.values(keyInsightSources),
      ]),
    )
  })

  // A describe per Data Source, named in full: it.each cuts a long name short, so the two § 4 sources would read alike.
  for (const source of exportedDataSources) {
    describe(source.name, () => {
      it('is verified: a URL and a real ISO date not in the future', () => {
        expect(verifiedDataSourceSchema.safeParse(source).error?.issues).toBeUndefined()
      })

      it('is listed in the footer', () => {
        expect(listDataSources()).toContainEqual(source)
      })
    })
  }
})
