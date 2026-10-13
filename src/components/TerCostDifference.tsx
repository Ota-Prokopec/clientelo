// The Fee Calculator's answer: how many Kč less the Bank Fund leaves than the Twin, set giant in `signal`, since it is
// what the fee costs the Visitor (design-identity.md#colour). A screen reader reads the whole sentence on each change.
import type { UcitsEtf } from '@data/figures.ts'
import { formatAmount, formatYears } from '@lib/format.ts'

export type TerCostDifferenceArgs = {
  years: number
  differenceKc: number
  twin: UcitsEtf
}

/**
 * The Kč difference, inside the sentence that says what it is.
 *
 * ```tsx
 * <TerCostDifference years={20} differenceKc={35_575.26} twin={spyl} />
 * // Za 20 let vám bankovní fond nechá o / 35 575 Kč / méně než ETF SPYL, i bez růstu trhu.
 * ```
 */
export const TerCostDifference = ({ years, differenceKc, twin }: TerCostDifferenceArgs) => {
  return (
    <div aria-live="polite" aria-atomic="true" className="grid gap-1">
      <p>Za {formatYears(years)} vám bankovní fond nechá o</p>
      {/* Tabular figures keep the number from jittering while a slider moves (design-identity.md#type). */}
      <p className="text-difference text-signal tabular-nums">{formatAmount(differenceKc, 'Kč')}</p>
      {/* The Kč figures assume no market return; any growth makes the gap bigger (TerCostFormula says so). */}
      <p className="text-pretty">méně než ETF {twin.ticker}, i bez růstu trhu.</p>
    </div>
  )
}
