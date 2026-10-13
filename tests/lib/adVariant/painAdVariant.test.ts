// Tests what the pain Ad Variant puts on the page: its First Screen, then the Fee Calculator in Section 03.
import { describe, expect, it } from 'vitest'
import { PainAdVariant } from '@lib/adVariant/painAdVariant.ts'
import { PainFirstScreen } from '../../../src/components/sections/PainFirstScreen.tsx'
import { PainOtherTool } from '../../../src/components/sections/PainOtherTool.tsx'

describe('PainAdVariant', () => {
  it('opens the page with the pain First Screen', () => {
    expect(PainAdVariant.FirstScreen).toBe(PainFirstScreen)
  })

  it('puts the Fee Calculator in Section 03', () => {
    expect(PainAdVariant.OtherTool).toBe(PainOtherTool)
  })
})
