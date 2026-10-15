// Tests utm_content → Ad Variant resolution.
import { describe, expect, it } from 'vitest'
import { resolveAdVariant } from '@/adVariant/adVariant.ts'
import { MoneyAdVariant } from '@/adVariant/moneyAdVariant.ts'
import { PainAdVariant } from '@/adVariant/painAdVariant.ts'

describe('resolveAdVariant', () => {
  it('resolves utm_content=pain to the pain Ad Variant', () => {
    expect(resolveAdVariant('pain')).toBe(PainAdVariant)
  })

  it('resolves utm_content=money to the money Ad Variant', () => {
    expect(resolveAdVariant('money')).toBe(MoneyAdVariant)
  })

  it('falls back to pain when utm_content is missing', () => {
    expect(resolveAdVariant(null)).toBe(PainAdVariant)
  })

  it('falls back to pain when utm_content is unknown', () => {
    expect(resolveAdVariant('pian')).toBe(PainAdVariant)
  })

  it('falls back to pain when utm_content names an inherited object property', () => {
    expect(resolveAdVariant('toString')).toBe(PainAdVariant)
  })
})
