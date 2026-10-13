// The single module holding every figure the page and the Lead Magnet show, each with its Data Source (ADR-0002).
// Step 4 of docs/plan.md verifies each figure and fills `url` and `verifiedOn`; until then they stay null.

/** Where a figure comes from, and the ISO date (`2026-10-11`) it was verified, or null while unverified. */
export type DataSource = {
  name: string
  url: string | null
  verifiedOn: string | null
}

/** The index an ETF or a Twin tracks. */
export type TrackedIndex = 'S&P 500' | 'FTSE Global All Cap' | 'CRSP US Total Market' | 'FTSE All-World'

/** An NYSE-listed ETF a Czech retail investor's app won't sell them. */
export type Etf = {
  ticker: string
  trackedIndex: TrackedIndex
  terPercent: number
  source: DataSource
}

/** A UCITS ETF a Czech retail investor can buy instead of an ETF. */
export type UcitsEtf = {
  ticker: string
  trackedIndex: TrackedIndex
  terPercent: number
  domicile: 'Irsko'
  distributionPolicy: 'akumulační' | 'distribuční'
  source: DataSource
}

/** How a UCITS ETF stands in for an ETF: a Twin tracks the same index, a closest alternative a similar one. */
export type Substitute = {
  ucitsTicker: string
  relation: 'twin' | 'closest-alternative'
}

/** A bank's equity fund the Bank-Fund Saver holds. */
export type BankFund = {
  name: string
  terPercent: number
  source: DataSource
}

/** A figure that is a single number, such as a tax threshold. */
export type NumericFigure = {
  value: number
  unit: 'Kč' | 'USD' | 'let' | '%'
  source: DataSource
}

/**
 * A Data Source no one has verified yet.
 *
 * ```ts
 * unverifiedSource('Vanguard, stránka fondu VOO') // { name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null }
 * ```
 */
const unverifiedSource = (name: string): DataSource => ({ name, url: null, verifiedOn: null })

export const etfs: Etf[] = [
  { ticker: 'VOO', trackedIndex: 'S&P 500', terPercent: 0.03, source: unverifiedSource('Vanguard, stránka fondu VOO') },
  { ticker: 'IVV', trackedIndex: 'S&P 500', terPercent: 0.03, source: unverifiedSource('iShares, stránka fondu IVV') },
  { ticker: 'SPY', trackedIndex: 'S&P 500', terPercent: 0.0945, source: unverifiedSource('SPDR, stránka fondu SPY') },
  {
    ticker: 'VTI',
    trackedIndex: 'CRSP US Total Market',
    terPercent: 0.03,
    source: unverifiedSource('Vanguard, stránka fondu VTI'),
  },
  {
    ticker: 'VT',
    trackedIndex: 'FTSE Global All Cap',
    terPercent: 0.06,
    source: unverifiedSource('Vanguard, stránka fondu VT'),
  },
]

export const ucitsEtfs: UcitsEtf[] = [
  {
    ticker: 'SPYL',
    trackedIndex: 'S&P 500',
    terPercent: 0.03,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    source: unverifiedSource('SPDR, stránka fondu SPYL a KID'),
  },
  {
    ticker: 'CSPX',
    trackedIndex: 'S&P 500',
    terPercent: 0.07,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    source: unverifiedSource('iShares, stránka fondu CSPX a KID'),
  },
  {
    ticker: 'VUAA',
    trackedIndex: 'S&P 500',
    terPercent: 0.07,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    source: unverifiedSource('Vanguard, stránka fondu VUAA a KID'),
  },
  {
    ticker: 'VWCE',
    trackedIndex: 'FTSE All-World',
    terPercent: 0.19,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    source: unverifiedSource('Vanguard, stránka fondu VWCE a KID'),
  },
  {
    ticker: 'FWRA',
    trackedIndex: 'FTSE All-World',
    terPercent: 0.15,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    source: unverifiedSource('Invesco, stránka fondu FWRA a KID'),
  },
]

// VTI's closest alternative is chosen in step 4.
export const substitutesByEtfTicker: Record<string, Substitute[]> = {
  VOO: [
    { ucitsTicker: 'SPYL', relation: 'twin' },
    { ucitsTicker: 'CSPX', relation: 'twin' },
    { ucitsTicker: 'VUAA', relation: 'twin' },
  ],
  IVV: [
    { ucitsTicker: 'SPYL', relation: 'twin' },
    { ucitsTicker: 'CSPX', relation: 'twin' },
    { ucitsTicker: 'VUAA', relation: 'twin' },
  ],
  SPY: [
    { ucitsTicker: 'SPYL', relation: 'twin' },
    { ucitsTicker: 'CSPX', relation: 'twin' },
    { ucitsTicker: 'VUAA', relation: 'twin' },
  ],
  VT: [
    { ucitsTicker: 'VWCE', relation: 'closest-alternative' },
    { ucitsTicker: 'FWRA', relation: 'closest-alternative' },
  ],
  VTI: [],
}

export const csobAkciovy: BankFund = {
  name: 'ČSOB Akciový',
  terPercent: 2.22,
  source: unverifiedSource('ČSOB, KID fondu ČSOB Akciový'),
}

/** The "about 2 %" a bank's equity fund charges a year (docs/ads.md, Ad Variant B). */
export const typicalBankEquityFundTer: NumericFigure = {
  value: 2,
  unit: '%',
  source: unverifiedSource('KID akciových fondů největších českých bank'),
}

export const czechTaxFigures = {
  holdingPeriodExemption: { value: 3, unit: 'let', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
  yearlyIncomeExemption: { value: 100_000, unit: 'Kč', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
  exemptIncomeCap: { value: 40_000_000, unit: 'Kč', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
} satisfies Record<string, NumericFigure>

export const usEstateTaxThreshold: NumericFigure = {
  value: 60_000,
  unit: 'USD',
  source: unverifiedSource('IRS, estate tax pro nerezidenty (US-situs assets)'),
}

/**
 * Finds the ETF with the given Ticker. Throws on a Ticker the data module doesn't hold, which is a programming error.
 *
 * ```ts
 * findEtf('VOO').terPercent // 0.03
 * findEtf('XYZ')            // throws
 * ```
 */
export const findEtf = (ticker: string): Etf => {
  const etf = etfs.find((candidate) => candidate.ticker === ticker)
  if (!etf) throw new Error(`No ETF with Ticker ${ticker}`)
  return etf
}

/**
 * Finds the UCITS ETF with the given Ticker. Throws on a Ticker the data module doesn't hold.
 *
 * ```ts
 * findUcitsEtf('SPYL').domicile // 'Irsko'
 * findUcitsEtf('VOO')           // throws: VOO is an ETF, not a UCITS ETF
 * ```
 */
export const findUcitsEtf = (ticker: string): UcitsEtf => {
  const ucitsEtf = ucitsEtfs.find((candidate) => candidate.ticker === ticker)
  if (!ucitsEtf) throw new Error(`No UCITS ETF with Ticker ${ticker}`)
  return ucitsEtf
}

/**
 * Every distinct Data Source the data module cites, in module order, for the footer.
 *
 * ```ts
 * listDataSources()[0] // { name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null }
 * ```
 */
export const listDataSources = (): DataSource[] => {
  const allSources = [
    ...etfs.map((etf) => etf.source),
    ...ucitsEtfs.map((ucitsEtf) => ucitsEtf.source),
    typicalBankEquityFundTer.source,
    csobAkciovy.source,
    ...Object.values(czechTaxFigures).map((figure) => figure.source),
    usEstateTaxThreshold.source,
  ]
  const sourceByName = new Map(allSources.map((source) => [source.name, source]))
  return [...sourceByName.values()]
}
