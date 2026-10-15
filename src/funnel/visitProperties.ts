// The properties every Funnel Event carries, which describe the Visit: the Ad Variant whose First Screen opened the
// page, the raw UTM parameters, and what kind of Visitor arrived. A Visit is one page load, so they are built once.
import { resolveAdVariantUtmContent, type AdVariantUtmContent } from '@lib/adVariant/adVariant.ts'
import type { Lead } from '@/types.ts'

/**
 * Who arrived: a Visitor the page doesn't remember, or a Lead an earlier Visit remembers, whom the Funnel never counts.
 * #51 adds `returning_visitor`, a Visitor an earlier Visit remembers.
 */
export type VisitorKind = 'new_visitor' | 'returning_lead'

/** What every Funnel Event carries besides its own properties. */
export type VisitProperties = {
  /** The Ad Variant whose First Screen the Visitor saw, `pain` also for a missing or unknown `utm_content`. */
  ad_variant: AdVariantUtmContent
  /** The raw UTM parameters, each `none` when the URL doesn't carry it. */
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  visitor_kind: VisitorKind
}

export type BuildVisitPropertiesProps = {
  /** The page URL's query string, such as `location.search`. */
  search: string
  /** The Lead an earlier Visit remembers, or null for a Visitor. */
  rememberedLead: Lead | null
}

/**
 * What kind of Visitor arrived, from what the page remembers of earlier Visits.
 *
 * ```ts
 * resolveVisitorKind(null)                   // 'new_visitor'
 * resolveVisitorKind({ kind: 'returning' })  // 'returning_lead'
 * ```
 */
const resolveVisitorKind = (rememberedLead: Lead | null): VisitorKind => {
  return rememberedLead ? 'returning_lead' : 'new_visitor'
}

/**
 * The Visit's properties, read from the page's query string and the remembered Lead. A UTM parameter keeps its raw
 * value, and is `none` when it is missing or empty.
 *
 * ```ts
 * buildVisitProperties({ search: '?utm_content=money', rememberedLead: null })
 * // { ad_variant: 'money', utm_source: 'none', utm_medium: 'none', utm_campaign: 'none', utm_content: 'money',
 * //   visitor_kind: 'new_visitor' }
 * buildVisitProperties({ search: '?utm_content=pian', rememberedLead: { kind: 'returning' } })
 * // { ad_variant: 'pain', …, utm_content: 'pian', visitor_kind: 'returning_lead' }
 * ```
 */
export const buildVisitProperties = ({ search, rememberedLead }: BuildVisitPropertiesProps): VisitProperties => {
  const searchParams = new URLSearchParams(search)

  /**
   * A UTM parameter's raw value, or `none` when it is missing or empty.
   *
   * ```ts
   * readUtmParameter('utm_source') // 'facebook' for ?utm_source=facebook, 'none' for ?utm_source= or no parameter
   * ```
   */
  const readUtmParameter = (utmParameterName: string): string => searchParams.get(utmParameterName) || 'none'

  return {
    ad_variant: resolveAdVariantUtmContent(searchParams.get('utm_content')),
    utm_source: readUtmParameter('utm_source'),
    utm_medium: readUtmParameter('utm_medium'),
    utm_campaign: readUtmParameter('utm_campaign'),
    utm_content: readUtmParameter('utm_content'),
    visitor_kind: resolveVisitorKind(rememberedLead),
  }
}
