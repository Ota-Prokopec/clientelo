// The pair Ad Variant A's Ad Promise names (docs/ads.md): VOO, which the App Investor's app won't sell, and SPYL, its
// Twin. The `pain` First Screen, the Key Insight, the Lead Magnet's thumbnail and Chapter 1, the Share Image and the
// Fee Calculator's Twin all show this pair, so changing the Ad's pair is one edit here.
import type { EtfTicker, UcitsEtfTicker } from './figures.ts'

/** The ETF the Ad names and the Fund Picker preselects. */
export const AD_PROMISE_ETF_TICKER: EtfTicker = 'VOO'

/** The Twin the Ad promises in its place. */
export const AD_PROMISE_TWIN_TICKER: UcitsEtfTicker = 'SPYL'
