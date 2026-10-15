// Tests the data module's list of Data Sources, which the footer cites in full.
import { describe, expect, it } from 'vitest'
import { listDataSources } from '../../src/data/figures.ts'

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
