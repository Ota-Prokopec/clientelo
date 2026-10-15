// The trackFunnelEvent() seam every component records a Funnel Event through (#49, ADR-0005). It adds the properties
// every event carries, and pushes the event to `window.dataLayer`, an in-page array that sends nothing anywhere. In
// `pnpm dev`, each event is also logged to the console. No event ever carries the Lead's email.
import { readRememberedLead } from '@/lead/rememberedLead.ts'
import type { FunnelEvent } from './funnelEvent.ts'
import { createFunnelEventGate } from './funnelEventGate.ts'
import { buildVisitProperties, type VisitProperties } from './visitProperties.ts'

/** A Funnel Event as it lands in the dataLayer: `{ event: '<name>', ...its own properties, ...the Visit's }`. */
export type DataLayerFunnelEvent = FunnelEvent & VisitProperties

declare global {
  interface Window {
    /** The in-page array Funnel Events land in. A tag added later, behind the Visitor's consent, would read it. */
    dataLayer?: object[]
  }
}

// A Visit is one page load, so the gate and the Visit's properties live as long as this module.
const funnelEventGate = createFunnelEventGate()
let visitProperties: VisitProperties | null = null

/**
 * The Visit's properties, built on the Visit's first event, arrival, before the Lead Form can remember a new Lead, so a
 * new Lead's later events still count them as the Visitor they arrived as.
 *
 * ```ts
 * readVisitProperties() // /?utm_content=money on a first visit → { ad_variant: 'money', …, visitor_kind: 'new_visitor' }
 * ```
 */
const readVisitProperties = (): VisitProperties => {
  visitProperties ??= buildVisitProperties({ search: location.search, rememberedLead: readRememberedLead() })
  return visitProperties
}

/**
 * Records a Funnel Event in `window.dataLayer`, unless the once-per-Visit rules or a filled honeypot drop it.
 *
 * ```ts
 * trackFunnelEvent({ event: 'section_view', section: 'key-insight' })
 * // window.dataLayer.push({ event: 'section_view', section: 'key-insight', ad_variant: 'pain', utm_source: 'none',
 * //   utm_medium: 'none', utm_campaign: 'none', utm_content: 'none', visitor_kind: 'new_visitor' })
 * trackFunnelEvent({ event: 'section_view', section: 'key-insight' }) // nothing: once per Section
 * ```
 */
export const trackFunnelEvent = (funnelEvent: FunnelEvent): void => {
  if (!funnelEventGate.admitFunnelEvent(funnelEvent)) return
  const dataLayerFunnelEvent: DataLayerFunnelEvent = { ...funnelEvent, ...readVisitProperties() }
  window.dataLayer ??= []
  window.dataLayer.push(dataLayerFunnelEvent)
  if (import.meta.env.DEV) console.info('Funnel Event', dataLayerFunnelEvent)
}

/**
 * Records no more Funnel Events this Visit, once a bot filled the Lead Form's honeypot, so bots never reach the Funnel.
 *
 * ```ts
 * shutOutBot()
 * trackFunnelEvent({ event: 'lead_form_submit' }) // nothing
 * ```
 */
export const shutOutBot = (): void => {
  funnelEventGate.shutOutBot()
}
