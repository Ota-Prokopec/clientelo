// Ad Variant A (`pain`): what it puts on the page, from its First Screen to the Interactive Tool in Section 03.
import type { ComponentType } from 'react'
import type { AdVariant } from './adVariant.ts'
import { PainFirstScreen } from './sections/PainFirstScreen.tsx'
import { PainOtherTool } from './sections/PainOtherTool.tsx'

/**
 * Ad Variant A, for the App Investor: the Fund Picker opens the page, the Fee Calculator follows in Section 03.
 *
 * ```tsx
 * <PainAdVariant.FirstScreen /> // VOO struck out over its Twin SPYL, in the `fund-picker` slot
 * <PainAdVariant.OtherTool />   // the Fee Calculator in Section 03
 * ```
 */
export class PainAdVariant {
  /** Section 01, the First Screen: VOO struck out over its Twin SPYL, in the `fund-picker` slot. */
  static readonly FirstScreen: ComponentType = PainFirstScreen

  /** Section 03: the Fee Calculator, the Interactive Tool the First Screen didn't open. */
  static readonly OtherTool: ComponentType = PainOtherTool
}

// `implements` would check instances only; this checks the class's static properties against AdVariant.
PainAdVariant satisfies AdVariant
