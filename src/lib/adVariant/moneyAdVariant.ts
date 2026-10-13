// Ad Variant B (`money`): what it puts on the page, from its First Screen to the Interactive Tool in Section 03.
import type { ComponentType } from 'react';
import type { AdVariant } from './adVariant.ts';
import { MoneyFirstScreen } from '../../components/sections/MoneyFirstScreen.tsx';
import { MoneyOtherTool } from '../../components/sections/MoneyOtherTool.tsx';

/**
 * Ad Variant B, for the Bank-Fund Saver: the Fee Calculator opens the page, the Fund Picker follows in Section 03.
 *
 * ```tsx
 * <MoneyAdVariant.FirstScreen /> // the Fee Calculator, prefilled with ČSOB Akciový against SPYL over 20 years
 * <MoneyAdVariant.OtherTool />   // the Fund Picker in Section 03
 * ```
 */
export class MoneyAdVariant {
  /** Section 01, the First Screen: the Fee Calculator, prefilled with ČSOB Akciový against SPYL over 20 years. */
  static readonly FirstScreen: ComponentType = MoneyFirstScreen;

  /** Section 03: the Fund Picker, the Interactive Tool the First Screen didn't open. */
  static readonly OtherTool: ComponentType = MoneyOtherTool;
}

// `implements` would check instances only; this checks the class's static properties against AdVariant.
MoneyAdVariant satisfies AdVariant;
