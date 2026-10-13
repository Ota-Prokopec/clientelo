// Resolves which Ad Variant a Visitor arrived from (docs/ads.md) to the class holding what it puts on the page.
import type { ComponentType } from 'react';
import { MoneyAdVariant } from './moneyAdVariant.ts';
import { PainAdVariant } from './painAdVariant.ts';

/** The `utm_content` value naming one of the two Ad Variants. */
export type AdVariantUtmContent = 'pain' | 'money';

/** What an Ad Variant puts on the page, as the static properties of its class: `PainAdVariant` or `MoneyAdVariant`. */
export type AdVariant = {
  readonly FirstScreen: ComponentType;
  readonly OtherTool: ComponentType;
};

const adVariantByUtmContent: Record<AdVariantUtmContent, AdVariant> = {
  pain: PainAdVariant,
  money: MoneyAdVariant,
};

/** The Ad Variant a Visitor without a known `utm_content` sees: it carries the Key Insight. */
const fallbackAdVariant: AdVariant = PainAdVariant;

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
  utmContent !== null && Object.hasOwn(adVariantByUtmContent, utmContent);

/**
 * The Ad Variant a `utm_content` value names, or `PainAdVariant` when it is missing or unknown.
 *
 * ```ts
 * resolveAdVariant('money') // MoneyAdVariant
 * resolveAdVariant('pian')  // PainAdVariant
 * resolveAdVariant(null)    // PainAdVariant
 * ```
 */
export const resolveAdVariant = (utmContent: string | null): AdVariant => {
  return isAdVariantUtmContent(utmContent) ? adVariantByUtmContent[utmContent] : fallbackAdVariant;
};
