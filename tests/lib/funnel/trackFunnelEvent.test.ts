// Tests the trackFunnelEvent() seam: each Funnel Event lands in window.dataLayer with the Visit's properties, the
// once-per-Visit rules and a filled honeypot drop events, and subscribers hear only what was recorded.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '../../memoryStorage.ts'

/** A fresh copy of the module, since a Visit (its gate and properties) lives as long as the module does. */
const importTrackFunnelEvent = async () => {
  vi.resetModules()
  return import('@lib/funnel/trackFunnelEvent.ts')
}

/** What the page pushed to `window.dataLayer` so far. */
const readDataLayer = (): object[] => (globalThis as { dataLayer?: object[] }).dataLayer ?? []

describe('trackFunnelEvent', () => {
  beforeEach(() => {
    // `window` is the global object in a browser, so the module's `window.dataLayer` is `globalThis.dataLayer`.
    vi.stubGlobal('window', globalThis)
    vi.stubGlobal('location', new URL('https://clientelo.example/?utm_source=meta&utm_content=money'))
    vi.stubGlobal('localStorage', createMemoryStorage())
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'dataLayer')
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('pushes the event with the Visit’s properties, and never an email', async () => {
    const { trackFunnelEvent } = await importTrackFunnelEvent()

    trackFunnelEvent({ event: 'section_view', section: 'key-insight' })

    expect(readDataLayer()).toEqual([
      {
        event: 'section_view',
        section: 'key-insight',
        ad_variant: 'money',
        utm_source: 'meta',
        utm_medium: 'none',
        utm_campaign: 'none',
        utm_content: 'money',
        visitor_kind: 'new_visitor',
      },
    ])
    expect(JSON.stringify(readDataLayer())).not.toContain('@')
  })

  it('keeps the Visit’s properties as the Visit began, after the Visitor becomes a Lead', async () => {
    const { trackFunnelEvent } = await importTrackFunnelEvent()
    trackFunnelEvent({ event: 'arrival' })
    localStorage.setItem('clientelo:lead', '1')

    trackFunnelEvent({ event: 'lead_form_success' })

    expect(readDataLayer().at(-1)).toMatchObject({ event: 'lead_form_success', visitor_kind: 'new_visitor' })
  })

  it('records a once-per-Visit event once', async () => {
    const { trackFunnelEvent } = await importTrackFunnelEvent()

    trackFunnelEvent({ event: 'arrival' })
    trackFunnelEvent({ event: 'arrival' })

    expect(readDataLayer()).toHaveLength(1)
  })

  it('records nothing once a bot is shut out', async () => {
    const { shutOutBot, trackFunnelEvent } = await importTrackFunnelEvent()

    shutOutBot()
    trackFunnelEvent({ event: 'lead_form_submit' })

    expect(readDataLayer()).toEqual([])
  })

  it('tells a subscriber each recorded event until it unsubscribes, and never a dropped one', async () => {
    const { subscribeToFunnelEvents, trackFunnelEvent } = await importTrackFunnelEvent()
    const funnelEventListener = vi.fn()
    const unsubscribe = subscribeToFunnelEvents(funnelEventListener)

    trackFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' })
    trackFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' })
    unsubscribe()
    trackFunnelEvent({ event: 'lead_form_submit' })

    expect(funnelEventListener).toHaveBeenCalledOnce()
    expect(funnelEventListener).toHaveBeenCalledWith(expect.objectContaining({ event: 'interactive_tool_use' }))
  })
})
