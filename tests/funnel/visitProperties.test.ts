// Tests the properties every Funnel Event carries, built from the page's URL and the Lead an earlier visit remembers.
import { describe, expect, it } from 'vitest'
import { buildVisitProperties } from '@/funnel/visitProperties.ts'

describe('buildVisitProperties', () => {
  it('names the money First Screen for utm_content=money', () => {
    expect(buildVisitProperties({ search: '?utm_content=money', rememberedLead: null }).ad_variant).toBe('money')
  })

  it('names the fallback pain First Screen, and every UTM parameter none, for a Visitor without UTMs', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: null })).toMatchObject({
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

    expect(buildVisitProperties({ search, rememberedLead: null })).toEqual({
      ad_variant: 'pain',
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'etf-twins',
      utm_content: 'pian',
      visitor_kind: 'new_visitor',
    })
  })

  it('counts a Visitor the page doesn’t remember as a new Visitor', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: null }).visitor_kind).toBe('new_visitor')
  })

  it('counts a Lead an earlier Visit remembers as a returning Lead', () => {
    expect(buildVisitProperties({ search: '', rememberedLead: { kind: 'returning' } }).visitor_kind).toBe(
      'returning_lead',
    )
  })
})
