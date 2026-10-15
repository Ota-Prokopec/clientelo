// Which Ad Variant a Visitor arrived from (docs/ads.md), by the `utm_content` value naming it. Pure, so the Funnel's
// Visit properties read it without reaching the components each Ad Variant puts on the page (src/adVariant/).

/** The `utm_content` value naming one of the two Ad Variants. */
export type AdVariantUtmContent = 'pain' | 'money'

const AD_VARIANT_UTM_CONTENTS: ReadonlySet<string> = new Set<AdVariantUtmContent>(['pain', 'money'])

/** The `utm_content` naming the Ad Variant a Visitor without a known one sees: it carries the Key Insight. */
const FALLBACK_AD_VARIANT_UTM_CONTENT: AdVariantUtmContent = 'pain'

/**
 * Whether a `utm_content` value names an Ad Variant.
 *
 * ```ts
 * isAdVariantUtmContent('pain')     // true
 * isAdVariantUtmContent('toString') // false
 * isAdVariantUtmContent(null)       // false
 * ```
 */
const isAdVariantUtmContent = (utmContent: string | null): utmContent is AdVariantUtmContent =>
  utmContent !== null && AD_VARIANT_UTM_CONTENTS.has(utmContent)

/**
 * The name of the Ad Variant whose First Screen a `utm_content` value opens: the value itself when it names one, or
 * `pain` when it is missing or unknown.
 *
 * ```ts
 * resolveAdVariantUtmContent('money') // 'money'
 * resolveAdVariantUtmContent('pian')  // 'pain'
 * resolveAdVariantUtmContent(null)    // 'pain'
 * ```
 */
export const resolveAdVariantUtmContent = (utmContent: string | null): AdVariantUtmContent => {
  return isAdVariantUtmContent(utmContent) ? utmContent : FALLBACK_AD_VARIANT_UTM_CONTENT
}
