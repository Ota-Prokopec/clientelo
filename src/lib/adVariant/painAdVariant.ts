// Ad Variant A (`pain`): what it puts on the page, from its First Screen to the Interactive Tool in Section 03.
import type { ComponentType } from 'react'
import type { AdVariant } from './adVariant.ts'
import { PainFirstScreen } from '../../components/sections/PainFirstScreen.tsx'
import { PainOtherTool } from '../../components/sections/PainOtherTool.tsx'

/**
 * Ad Variant A, for the App Investor: the Fund Picker opens the page, the Fee Calculator follows in Section 03.
 *
 * ```tsx
 * <PainAdVariant.FirstScreen /> // the Fund Picker, VOO struck out over its Twin SPYL
 * <PainAdVariant.OtherTool />   // the Fee Calculator in Section 03
 * ```
 */
export class PainAdVariant {
  /** Section 01, the First Screen: the Fund Picker, VOO struck out over its Twin SPYL. */
  static readonly FirstScreen: ComponentType = PainFirstScreen

  /** Section 03: the Fee Calculator, the Interactive Tool the First Screen didn't open. */
  static readonly OtherTool: ComponentType = PainOtherTool
}

// `implements` would check instances only; this checks the class's static properties against AdVariant.
PainAdVariant satisfies AdVariant
