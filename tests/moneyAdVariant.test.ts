// Tests what the money Ad Variant puts on the page: its First Screen, then the Fund Picker in Section 03.
import { describe, expect, it } from 'vitest'
import { MoneyAdVariant } from '../src/moneyAdVariant.ts'
import { MoneyFirstScreen } from '../src/sections/MoneyFirstScreen.tsx'
import { MoneyOtherTool } from '../src/sections/MoneyOtherTool.tsx'

describe('MoneyAdVariant', () => {
  it('opens the page with the money First Screen', () => {
    expect(MoneyAdVariant.FirstScreen).toBe(MoneyFirstScreen)
  })

  it('puts the Fund Picker in Section 03', () => {
    expect(MoneyAdVariant.OtherTool).toBe(MoneyOtherTool)
  })
})
