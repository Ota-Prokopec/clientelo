// Tests which Funnel Events a Visit records: the once-per-Visit rules, and nothing at all once a bot fills the honeypot.
import { describe, expect, it } from 'vitest'
import { createFunnelEventGate } from '@/funnel/funnelEventGate.ts'

describe('createFunnelEventGate', () => {
  it.each(['arrival', 'lead_form_seen', 'lead_form_start'] as const)('records %s once per Visit', (event) => {
    const funnelEventGate = createFunnelEventGate()

    expect(funnelEventGate.admitFunnelEvent({ event })).toBe(true)
    expect(funnelEventGate.admitFunnelEvent({ event })).toBe(false)
  })

  it('records section_view once per Section', () => {
    const funnelEventGate = createFunnelEventGate()

    expect(funnelEventGate.admitFunnelEvent({ event: 'section_view', section: 'first-screen' })).toBe(true)
    expect(funnelEventGate.admitFunnelEvent({ event: 'section_view', section: 'key-insight' })).toBe(true)
    expect(funnelEventGate.admitFunnelEvent({ event: 'section_view', section: 'first-screen' })).toBe(false)
  })

  it('records interactive_tool_use once per Interactive Tool, whatever Ticker is picked later', () => {
    const funnelEventGate = createFunnelEventGate()

    expect(funnelEventGate.admitFunnelEvent({ event: 'interactive_tool_use', tool: 'fund-picker', ticker: 'SPY' })).toBe(
      true,
    )
    expect(funnelEventGate.admitFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' })).toBe(true)
    expect(funnelEventGate.admitFunnelEvent({ event: 'interactive_tool_use', tool: 'fund-picker', ticker: 'VT' })).toBe(
      false,
    )
    expect(funnelEventGate.admitFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' })).toBe(false)
  })

  it.each([
    { event: 'lead_ask_click', placement: 'sticky-cta' },
    { event: 'lead_form_submit' },
    { event: 'lead_form_success' },
    { event: 'lead_form_error', reason: 'invalid-email' },
    { event: 'pdf_download', trigger: 'link' },
    { event: 'segment_answer', segment: 'xtb' },
  ] as const)('records $event every time it happens', (funnelEvent) => {
    const funnelEventGate = createFunnelEventGate()

    expect(funnelEventGate.admitFunnelEvent(funnelEvent)).toBe(true)
    expect(funnelEventGate.admitFunnelEvent(funnelEvent)).toBe(true)
  })

  it('records nothing more once a bot filled the honeypot, so it never reaches the Funnel', () => {
    const funnelEventGate = createFunnelEventGate()
    funnelEventGate.admitFunnelEvent({ event: 'arrival' })

    funnelEventGate.shutOutBot()

    expect(funnelEventGate.admitFunnelEvent({ event: 'lead_form_submit' })).toBe(false)
    expect(funnelEventGate.admitFunnelEvent({ event: 'lead_form_success' })).toBe(false)
    expect(funnelEventGate.admitFunnelEvent({ event: 'pdf_download', trigger: 'auto' })).toBe(false)
    expect(funnelEventGate.admitFunnelEvent({ event: 'section_view', section: 'footer' })).toBe(false)
  })
})
