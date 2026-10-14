// The single module holding every figure the page and the Lead Magnet show, each with its Data Source (ADR-0002).
// A verified figure's Data Source is its primary source, read on `verifiedOn` (ADR-0004); an unverified one keeps both
// `url` and `verifiedOn` null.

/** Where a figure comes from, and the ISO date (`2026-10-11`) it was verified, or null while unverified. */
export type DataSource = {
  name: string;
  url: string | null;
  verifiedOn: string | null;
};

/** The index an ETF or a Twin tracks. */
export type TrackedIndex = 'S&P 500' | 'FTSE Global All Cap' | 'FTSE All-World';

/** An NYSE-listed ETF a Czech retail investor's app won't sell them. */
export type Etf = {
  ticker: string;
  trackedIndex: TrackedIndex;
  terPercent: number;
  source: DataSource;
};

/** A UCITS ETF a Czech retail investor can buy instead of an ETF. */
export type UcitsEtf = {
  ticker: string;
  isin: string;
  trackedIndex: TrackedIndex;
  terPercent: number;
  domicile: 'Irsko';
  distributionPolicy: 'akumulační' | 'distribuční';
  /** The exchange the Ticker is listed under: the same fund has another Ticker on another exchange. */
  exchange: 'Xetra' | 'LSE';
  /** The currency the fund trades in on that exchange. */
  currency: 'EUR' | 'USD';
  source: DataSource;
};

/** A bank's equity fund the Bank-Fund Saver holds. */
export type BankFund = {
  name: string;
  terPercent: number;
  source: DataSource;
};

/** A figure that is a single number, such as a tax threshold. */
export type NumericFigure = {
  value: number;
  unit: 'Kč' | 'USD' | 'let' | '%';
  source: DataSource;
};

/**
 * A Data Source no one has verified yet.
 *
 * ```ts
 * unverifiedSource('Vanguard, stránka fondu VOO') // { name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null }
 * ```
 */
const unverifiedSource = (name: string): DataSource => ({ name, url: null, verifiedOn: null });

export const etfs: Etf[] = [
  {
    ticker: 'VOO',
    trackedIndex: 'S&P 500',
    terPercent: 0.03,
    source: {
      name: 'Vanguard, stránka fondu VOO',
      url: 'https://investor.vanguard.com/investment-products/etfs/profile/voo',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'IVV',
    trackedIndex: 'S&P 500',
    terPercent: 0.03,
    source: {
      name: 'iShares, stránka fondu IVV',
      url: 'https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'SPY',
    trackedIndex: 'S&P 500',
    terPercent: 0.0945,
    source: {
      name: 'SPDR, stránka fondu SPY',
      url: 'https://www.ssga.com/us/en/individual/etfs/state-street-spdr-sp-500-etf-trust-spy',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'VT',
    trackedIndex: 'FTSE Global All Cap',
    terPercent: 0.06,
    source: {
      name: 'Vanguard, stránka fondu VT',
      url: 'https://investor.vanguard.com/investment-products/etfs/profile/vt',
      verifiedOn: '2026-10-14',
    },
  },
];

export const ucitsEtfs: UcitsEtf[] = [
  {
    ticker: 'SPYL',
    isin: 'IE000XZSV718',
    trackedIndex: 'S&P 500',
    terPercent: 0.03,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    exchange: 'Xetra',
    currency: 'EUR',
    source: {
      name: 'SPDR, stránka fondu SPYL',
      url: 'https://www.ssga.com/cz/en_gb/institutional/etfs/state-street-spdr-sp-500-ucits-etf-acc-spyl-gy',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'CSPX',
    isin: 'IE00B5BMR087',
    trackedIndex: 'S&P 500',
    terPercent: 0.07,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    exchange: 'LSE',
    currency: 'USD',
    source: {
      name: 'iShares, stránka fondu CSPX',
      url: 'https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'VUAA',
    isin: 'IE00BFMXXD54',
    trackedIndex: 'S&P 500',
    terPercent: 0.07,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    exchange: 'Xetra',
    currency: 'EUR',
    source: {
      name: 'Vanguard, stránka fondu VUAA',
      url: 'https://global.vanguard.com/de-de/investment-products/etf/equities/9694/sp-500-ucits-etf-usd-accumulating',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'VWCE',
    isin: 'IE00BK5BQT80',
    trackedIndex: 'FTSE All-World',
    terPercent: 0.14,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    exchange: 'Xetra',
    currency: 'EUR',
    source: {
      name: 'Vanguard, stránka fondu VWCE',
      url: 'https://global.vanguard.com/de-de/investment-products/etf/equities/9679/ftse-all-world-ucits-etf-usd-accumulating',
      verifiedOn: '2026-10-14',
    },
  },
  {
    ticker: 'FWRA',
    isin: 'IE000716YHJ7',
    trackedIndex: 'FTSE All-World',
    terPercent: 0.15,
    domicile: 'Irsko',
    distributionPolicy: 'akumulační',
    exchange: 'LSE',
    currency: 'USD',
    source: {
      name: 'Invesco, stránka fondu FWRA',
      url: 'https://www.invesco.com/uk/en/financial-products/etfs/invesco-ftse-all-world-ucits-etf-acc.html',
      verifiedOn: '2026-10-14',
    },
  },
];

// The UCITS ETF Tickers that stand in for each ETF. Whether one is the ETF's Twin or its closest alternative is derived
// from the two indices (src/lib/substitutes.ts), never recorded here. Every ETF has at least one, which is why VTI isn't
// offered (docs/strategy.md#twins).
export const substituteTickersByEtfTicker: Record<string, string[]> = {
  VOO: ['SPYL', 'CSPX', 'VUAA'],
  IVV: ['SPYL', 'CSPX', 'VUAA'],
  SPY: ['SPYL', 'CSPX', 'VUAA'],
  VT: ['VWCE', 'FWRA'],
};

export const csobAkciovy: BankFund = {
  name: 'ČSOB Akciový',
  terPercent: 2.22,
  source: unverifiedSource('ČSOB, KID fondu ČSOB Akciový'),
};

/** The "about 2 %" a bank's equity fund charges a year (docs/ads.md, Ad Variant B). */
export const typicalBankEquityFundTer: NumericFigure = {
  value: 2,
  unit: '%',
  source: unverifiedSource('KID akciových fondů největších českých bank'),
};

/** Any other bank's equity fund, at the typical TER: the Fee Calculator's "kolem 2 %" option. */
export const typicalBankEquityFund: BankFund = {
  name: 'Jiný fond banky',
  terPercent: typicalBankEquityFundTer.value,
  source: typicalBankEquityFundTer.source,
};

export const czechTaxFigures = {
  holdingPeriodExemption: { value: 3, unit: 'let', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
  yearlyIncomeExemption: { value: 100_000, unit: 'Kč', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
  exemptIncomeCap: { value: 40_000_000, unit: 'Kč', source: unverifiedSource('Zákon o daních z příjmů, § 4') },
} satisfies Record<string, NumericFigure>;

/**
 * The rules and statements the Key Insight rests on (docs/strategy.md#key-insight): why the apps won't sell a US ETF,
 * and why Fio e-Broker and Patria may. Not figures, but cited wherever the Lead Magnet explains the block.
 */
export const keyInsightSources = {
  priips: unverifiedSource('Nařízení (EU) č. 1286/2014 (PRIIPs), čl. 5 a 13'),
  xtbHelpCentre: unverifiedSource('XTB, centrum nápovědy: ETF z USA bez dokumentu KID'),
  cnbExecutionOnly: unverifiedSource('ČNB, stanovisko RS2018-12, část B.2'),
} satisfies Record<string, DataSource>;

export const usEstateTaxThreshold: NumericFigure = {
  value: 60_000,
  unit: 'USD',
  source: unverifiedSource('IRS, estate tax pro nerezidenty (US-situs assets)'),
};

/**
 * Finds the ETF with the given Ticker. Throws on a Ticker the data module doesn't hold, which is a programming error.
 *
 * ```ts
 * findEtf('VOO').terPercent // 0.03
 * findEtf('XYZ')            // throws
 * ```
 */
export const findEtf = (ticker: string): Etf => {
  const etf = etfs.find((candidate) => candidate.ticker === ticker);
  if (!etf) throw new Error(`No ETF with Ticker ${ticker}`);

  return etf;
};

/**
 * Finds the UCITS ETF with the given Ticker. Throws on a Ticker the data module doesn't hold.
 *
 * ```ts
 * findUcitsEtf('SPYL').domicile // 'Irsko'
 * findUcitsEtf('VOO')           // throws: VOO is an ETF, not a UCITS ETF
 * ```
 */
export const findUcitsEtf = (ticker: string): UcitsEtf => {
  const ucitsEtf = ucitsEtfs.find((candidate) => candidate.ticker === ticker);
  if (!ucitsEtf) throw new Error(`No UCITS ETF with Ticker ${ticker}`);

  return ucitsEtf;
};

/**
 * Whether a Data Source has been verified (step 4 of docs/plan.md).
 *
 * ```ts
 * isVerified({ name: 'Vanguard, stránka fondu VOO', url: '…', verifiedOn: '2026-10-11' }) // true
 * isVerified({ name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null })       // false
 * ```
 */
export const isVerified = (source: DataSource): boolean => source.verifiedOn !== null;

/**
 * Each Data Source once, by name, in the order first given.
 *
 * ```ts
 * listDistinctDataSources([voo.source, spyl.source, voo.source]) // [voo.source, spyl.source]
 * ```
 */
export const listDistinctDataSources = (sources: DataSource[]): DataSource[] => {
  const sourceByName = new Map(sources.map((source) => [source.name, source]));

  return [...sourceByName.values()];
};

/**
 * Every distinct Data Source the data module cites, in module order, for the footer.
 *
 * ```ts
 * listDataSources()[0] // { name: 'Vanguard, stránka fondu VOO', url: 'https://investor.vanguard.com/…/voo', verifiedOn: '2026-10-14' }
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
  ];

  return listDistinctDataSources(allSources);
};
