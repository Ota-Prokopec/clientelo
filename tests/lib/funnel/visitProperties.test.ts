// Tests the properties every Funnel Event carries, built from the page's URL and what earlier Visits remember: a Lead,
// or, with the Visitor's consent, that they have been here before.
import { describe, expect, it } from 'vitest'
import { buildVisitProperties } from '@lib/funnel/visitProperties.ts'

describe('buildVisitProperties', () => {
  it('names the money First Screen for utm_content=money', () => {
    expect(
      buildVisitProperties({ search: '?utm_content=money', rememberedLead: null, hasVisitedBefore: false }).ad_variant,
    ).toBe('money')
  })

  it('names the fallback pain First Screen, and every UTM parameter none, for a Visitor without UTMs', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: null, hasVisitedBefore: false })).toMatchObject({
      ad_variant: 'pain',
      utm_source: 'none',
      utm_medium: 'none',
      utm_campaign: 'none',
      utm_content: 'none',
    })
  })

  // The Conversion Rate per Ad Variant counts arrivals by utm_content, so a mistyped one must not read as `pain`.
  it('keeps an Ad’s raw UTM parameters, an unknown utm_content too, while showing the pain First Screen', () => {
    const search = '?utm_source=facebook&utm_medium=paid_social&utm_campaign=etf-twins&utm_content=pian'

    expect(buildVisitProperties({ search, rememberedLead: null, hasVisitedBefore: false })).toEqual({
      ad_variant: 'pain',
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'etf-twins',
      utm_content: 'pian',
      visitor_kind: 'new_visitor',
    })
  })

  it('counts a Visitor the page doesn’t remember as a new Visitor', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: null, hasVisitedBefore: false }).visitor_kind).toBe(
      'new_visitor',
    )
  })

  it('counts a Visitor an earlier Visit remembers, with their consent, as a returning Visitor', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: null, hasVisitedBefore: true }).visitor_kind).toBe(
      'returning_visitor',
    )
  })

  it('counts a Lead an earlier Visit remembers as a returning Lead', () => {
    expect(
      buildVisitProperties({ search: '', rememberedLead: { kind: 'returning' }, hasVisitedBefore: false }).visitor_kind,
    ).toBe('returning_lead')
  })

  // The Funnel never counts a returning Lead, so a Lead who also allowed the remembered Visit must not slip back in.
  it('keeps a returning Lead a returning Lead when an earlier Visit was remembered too', () => {
    expect(
      buildVisitProperties({ search: '', rememberedLead: { kind: 'returning' }, hasVisitedBefore: true }).visitor_kind,
    ).toBe('returning_lead')
  })
})
