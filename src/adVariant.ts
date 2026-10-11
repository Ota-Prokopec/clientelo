// Resolves which Ad Variant a Visitor arrived from (docs/ads.md), and the Interactive Tool order it implies.

/** One of the two Ad Variants, named as its `utm_content` value. */
export type AdVariant = 'pain' | 'money'

/** An Interactive Tool, named as its component id. */
export type InteractiveTool = 'fund-picker' | 'fee-calculator'

const adVariants: readonly AdVariant[] = ['pain', 'money']

/** The Ad Variant a Visitor without a known `utm_content` sees: it carries the Key Insight. */
const fallbackAdVariant: AdVariant = 'pain'

/**
 * Whether a `utm_content` value names an Ad Variant.
 *
 * ```ts
 * isAdVariant('pain') // true
 * isAdVariant(null)   // false
 * ```
 */
const isAdVariant = (utmContent: string | null): utmContent is AdVariant =>
  adVariants.some((adVariant) => adVariant === utmContent)

/**
 * The Ad Variant a `utm_content` value names, or `pain` when it is missing or unknown.
 *
 * ```ts
 * resolveAdVariant('money') // 'money'
 * resolveAdVariant('pian')  // 'pain'
 * resolveAdVariant(null)    // 'pain'
 * ```
 */
export function resolveAdVariant(utmContent: string | null): AdVariant {
  return isAdVariant(utmContent) ? utmContent : fallbackAdVariant
}

/**
 * The Interactive Tools in page order: the Ad Variant's own tool opens the First Screen.
 *
 * ```ts
 * orderInteractiveTools('pain')  // ['fund-picker', 'fee-calculator']
 * orderInteractiveTools('money') // ['fee-calculator', 'fund-picker']
 * ```
 */
export function orderInteractiveTools(adVariant: AdVariant): InteractiveTool[] {
  return adVariant === 'money' ? ['fee-calculator', 'fund-picker'] : ['fund-picker', 'fee-calculator']
}
