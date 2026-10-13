// Tests utm_content → Ad Variant resolution.
import { describe, expect, it } from 'vitest'
import { resolveAdVariant } from './adVariant.ts'

describe('resolveAdVariant', () => {
  it('resolves utm_content=pain to the pain Ad Variant', () => {
    expect(resolveAdVariant('pain')).toBe('pain')
  })

  it('resolves utm_content=money to the money Ad Variant', () => {
    expect(resolveAdVariant('money')).toBe('money')
  })

  it('falls back to pain when utm_content is missing', () => {
    expect(resolveAdVariant(null)).toBe('pain')
  })

  it('falls back to pain when utm_content is unknown', () => {
    expect(resolveAdVariant('pian')).toBe('pain')
  })
})
