// Tests the Interactive Tool order each Ad Variant implies and the label each tool's Section carries.
import { describe, expect, it } from 'vitest'
import { findInteractiveToolSectionLabel, listInteractiveToolsInPageOrder } from '../src/interactiveTool.ts'

describe('listInteractiveToolsInPageOrder', () => {
  it('puts the Fund Picker first for the pain Ad Variant', () => {
    expect(listInteractiveToolsInPageOrder('pain')).toEqual(['fund-picker', 'fee-calculator'])
  })

  it('puts the Fee Calculator first for the money Ad Variant', () => {
    expect(listInteractiveToolsInPageOrder('money')).toEqual(['fee-calculator', 'fund-picker'])
  })
})

describe('findInteractiveToolSectionLabel', () => {
  it("labels the Fund Picker's Section with the Twin", () => {
    expect(findInteractiveToolSectionLabel('fund-picker')).toBe('Dvojče k americkému ETF')
  })

  it("labels the Fee Calculator's Section with the fee comparison", () => {
    expect(findInteractiveToolSectionLabel('fee-calculator')).toBe('Poplatek banky vs ETF')
  })
})
