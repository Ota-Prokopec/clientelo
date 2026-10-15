// Decides which Funnel Events a Visit records (#49). A Visit is one page load. arrival, lead_form_seen and
// lead_form_start are recorded once per Visit, section_view once per Section, interactive_tool_use once per Interactive
// Tool, and every other event every time. Once a bot fills the Lead Form's honeypot, nothing more is recorded.
import type { FunnelEvent } from './funnelEvent.ts'

/** Which of a Visit's Funnel Events get recorded. */
export type FunnelEventGate = {
  /** Whether to record the event, remembering a once-per-Visit one for the rest of the Visit. */
  admitFunnelEvent: (funnelEvent: FunnelEvent) => boolean
  /** Records nothing more this Visit: a bot filled the Lead Form's honeypot. */
  shutOutBot: () => void
}

/**
 * What makes an event a repeat within one Visit, or null for an event recorded every time.
 *
 * ```ts
 * findOncePerVisitKey({ event: 'arrival' })                                          // 'arrival'
 * findOncePerVisitKey({ event: 'section_view', section: 'key-insight' })             // 'section_view:key-insight'
 * findOncePerVisitKey({ event: 'interactive_tool_use', tool: 'fund-picker', ticker: 'VT' }) // 'interactive_tool_use:fund-picker'
 * findOncePerVisitKey({ event: 'lead_form_submit' })                                 // null
 * ```
 */
const findOncePerVisitKey = (funnelEvent: FunnelEvent): string | null => {
  switch (funnelEvent.event) {
    case 'arrival':
    case 'lead_form_seen':
    case 'lead_form_start':
      return funnelEvent.event
    case 'section_view':
      return `${funnelEvent.event}:${funnelEvent.section}`
    case 'interactive_tool_use':
      return `${funnelEvent.event}:${funnelEvent.tool}`
    default:
      return null
  }
}

/**
 * A gate for one Visit, which has recorded nothing yet.
 *
 * ```ts
 * const funnelEventGate = createFunnelEventGate()
 * funnelEventGate.admitFunnelEvent({ event: 'arrival' })          // true
 * funnelEventGate.admitFunnelEvent({ event: 'arrival' })          // false
 * funnelEventGate.admitFunnelEvent({ event: 'lead_form_submit' }) // true, every time
 * funnelEventGate.shutOutBot()
 * funnelEventGate.admitFunnelEvent({ event: 'lead_form_submit' }) // false, from now on
 * ```
 */
export const createFunnelEventGate = (): FunnelEventGate => {
  const recordedOncePerVisitKeys = new Set<string>()
  let isBotShutOut = false

  return {
    /**
     * Whether to record the event: never once a bot is shut out, and a once-per-Visit event only the first time.
     *
     * ```ts
     * admitFunnelEvent({ event: 'section_view', section: 'footer' }) // true, then false for the rest of the Visit
     * ```
     */
    admitFunnelEvent: (funnelEvent) => {
      if (isBotShutOut) return false
      const oncePerVisitKey = findOncePerVisitKey(funnelEvent)
      if (oncePerVisitKey === null) return true
      if (recordedOncePerVisitKeys.has(oncePerVisitKey)) return false
      recordedOncePerVisitKeys.add(oncePerVisitKey)
      return true
    },
    /**
     * Admits nothing more this Visit.
     *
     * ```ts
     * shutOutBot() // admitFunnelEvent(…) is false from now on
     * ```
     */
    shutOutBot: () => {
      isBotShutOut = true
    },
  }
}
