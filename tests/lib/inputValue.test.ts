// Tests how a field shows its value: a cleared number field's NaN shows as empty, so the Visitor can type a new amount.
import { describe, expect, it } from 'vitest'
import { toInputValue } from '@lib/inputValue.ts'

describe('toInputValue', () => {
  it('shows NaN, a cleared number field, as an empty field', () => {
    expect(toInputValue(Number.NaN)).toBe('')
  })

  it.each([100_000, 0, 'jana@seznam.cz', ''])('shows %j as itself', (value) => {
    expect(toInputValue(value)).toBe(value)
  })
})
