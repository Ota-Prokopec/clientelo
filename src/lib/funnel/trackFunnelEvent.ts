// The trackFunnelEvent() seam every component records a Funnel Event through (#49, ADR-0005). It adds the properties
// every event carries, and pushes the event to `window.dataLayer`, an in-page array that sends nothing anywhere. In
// `pnpm dev`, each event is also logged to the console. No event ever carries the Lead's email. A component that reacts
// to the Visitor's journey, such as the Consent Bar to the first Interactive Tool use, subscribes to the recorded events.
import { readHasVisitedBefore } from '@lib/consent/rememberedVisit.ts'
import { readRememberedLead } from '@lib/lead/rememberedLead.ts'
import type { FunnelEvent } from './funnelEvent.ts'
import { createFunnelEventGate } from './funnelEventGate.ts'
import { buildVisitProperties, type VisitProperties } from './visitProperties.ts'

/** A Funnel Event as it lands in the dataLayer: `{ event: '<name>', ...its own properties, ...the Visit's }`. */
export type DataLayerFunnelEvent = FunnelEvent & VisitProperties

/** Called with each Funnel Event the Visit records, right after it lands in the dataLayer. */
export type FunnelEventListener = (dataLayerFunnelEvent: DataLayerFunnelEvent) => void

declare global {
  interface Window {
    /** The in-page array Funnel Events land in. A tag added later, behind the Visitor's consent, would read it. */
    dataLayer?: object[]
  }
}

// A Visit is one page load, so the gate and the Visit's properties live as long as this module.
const funnelEventGate = createFunnelEventGate()
let visitProperties: VisitProperties | null = null
const funnelEventListeners = new Set<FunnelEventListener>()

/**
 * The Visit's properties, built on the Visit's first event, arrival, before the Lead Form can remember a new Lead or
 * the Consent Bar this Visit, so the Visit's later events still count the Visitor as who they arrived as.
 *
 * ```ts
 * // /?utm_content=money on a first visit
 * readVisitProperties() // { ad_variant: 'money', …, visitor_kind: 'new_visitor' }
 * // / after "Povolit" in the Consent Bar on an earlier Visit
 * readVisitProperties() // { ad_variant: 'pain', …, visitor_kind: 'returning_visitor' }
 * ```
 */
const readVisitProperties = (): VisitProperties => {
  visitProperties ??= buildVisitProperties({
    search: location.search,
    rememberedLead: readRememberedLead(),
    hasVisitedBefore: readHasVisitedBefore(new Date()),
  })
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
  for (const funnelEventListener of funnelEventListeners) funnelEventListener(dataLayerFunnelEvent)
}

/**
 * Calls the listener with each Funnel Event recorded from now on, until the returned function unsubscribes it. An
 * event the once-per-Visit rules or a filled honeypot drop never reaches it.
 *
 * ```ts
 * const unsubscribe = subscribeToFunnelEvents(({ event }) => console.log(event))
 * trackFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' }) // logs 'interactive_tool_use'
 * unsubscribe()
 * ```
 */
export const subscribeToFunnelEvents = (funnelEventListener: FunnelEventListener): (() => void) => {
  funnelEventListeners.add(funnelEventListener)
  return () => {
    funnelEventListeners.delete(funnelEventListener)
  }
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
