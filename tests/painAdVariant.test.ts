// Tests what the pain Ad Variant puts on the page: its First Screen, then the Fee Calculator in Section 03.
import { describe, expect, it } from 'vitest'
import { PainAdVariant } from '../src/painAdVariant.ts'
import { PainFirstScreen } from '../src/sections/PainFirstScreen.tsx'
import { PainOtherTool } from '../src/sections/PainOtherTool.tsx'

describe('PainAdVariant', () => {
  it('opens the page with the pain First Screen', () => {
    expect(PainAdVariant.FirstScreen).toBe(PainFirstScreen)
  })

  it('puts the Fee Calculator in Section 03', () => {
    expect(PainAdVariant.OtherTool).toBe(PainOtherTool)
  })
})
