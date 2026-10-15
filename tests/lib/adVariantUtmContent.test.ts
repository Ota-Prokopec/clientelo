// Tests utm_content → the name of the Ad Variant whose First Screen opens, which every Funnel Event reports.
import { describe, expect, it } from 'vitest'
import { resolveAdVariantUtmContent } from '@lib/adVariantUtmContent.ts'

describe('resolveAdVariantUtmContent', () => {
  it.each(['pain', 'money'] as const)('keeps utm_content=%s, which names an Ad Variant', (utmContent) => {
    expect(resolveAdVariantUtmContent(utmContent)).toBe(utmContent)
  })

  it.each([null, 'pian', 'toString', ''])('falls back to pain for utm_content %j', (utmContent) => {
    expect(resolveAdVariantUtmContent(utmContent)).toBe('pain')
  })
})
