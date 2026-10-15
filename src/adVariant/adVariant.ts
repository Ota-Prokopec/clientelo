// Resolves which Ad Variant a Visitor arrived from (docs/ads.md) to the class holding what it puts on the page. It lives
// outside src/lib because each Ad Variant is made of Sections, and src/lib never imports a component.
import type { ComponentType } from 'react'
import { resolveAdVariantUtmContent, type AdVariantUtmContent } from '@lib/adVariantUtmContent.ts'
import { MoneyAdVariant } from './moneyAdVariant.ts'
import { PainAdVariant } from './painAdVariant.ts'

/** What an Ad Variant puts on the page, as the static properties of its class: `PainAdVariant` or `MoneyAdVariant`. */
export type AdVariant = {
  readonly FirstScreen: ComponentType
  readonly OtherTool: ComponentType
}

const adVariantByUtmContent: Record<AdVariantUtmContent, AdVariant> = {
  pain: PainAdVariant,
  money: MoneyAdVariant,
}

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
  return adVariantByUtmContent[resolveAdVariantUtmContent(utmContent)]
}
