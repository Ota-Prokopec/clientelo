// The Fee Calculator (`fee-calculator`): what a Bank Fund's TER costs in Kč against a Twin's, for a one-off amount
// (docs/ads.md, Ad Variant B). It opens the `money` First Screen prefilled and is Section 03 for `pain`. The answer comes
// first, so it shows on the First Screen without scrolling, and the tool ends in the inline Lead Ask. The Visitor's first
// change to the amount, the years or the Bank Fund is its interactive_tool_use Funnel Event; the prefill isn't use.
import { useState } from 'react'
import { findUcitsEtf } from '@data/figures.ts'
import { trackFunnelEvent } from '@/funnel/trackFunnelEvent.ts'
import { bankFundOptions, type BankFundOption } from '@lib/bankFundOptions.ts'
import { feeCalculatorPrefill } from '@lib/feeCalculatorPrefill.ts'
import { formatPercent } from '@lib/format.ts'
import { calculateTerCost } from '@lib/terCost.ts'
import { AmountField } from './AmountField.tsx'
import { BankFundChoice } from './BankFundChoice.tsx'
import { DataSourceNote } from './DataSourceNote.tsx'
import { LeadAsk } from './LeadAsk.tsx'
import { RemainingAmountBar } from './RemainingAmountBar.tsx'
import { TerCostDifference } from './TerCostDifference.tsx'
import { TerCostFormula } from './TerCostFormula.tsx'
import { YearsField } from './YearsField.tsx'

/**
 * Wraps one of the Fee Calculator's setters so that a change also records the tool's use, once per Visit.
 *
 * ```ts
 * const changeYears = addFeeCalculatorUseTracking(setYears)
 * changeYears(25) // setYears(25); interactive_tool_use { tool: 'fee-calculator' }
 * ```
 */
const addFeeCalculatorUseTracking =
  <TValue,>(setValue: (value: TValue) => void) =>
  (value: TValue) => {
    setValue(value)
    trackFunnelEvent({ event: 'interactive_tool_use', tool: 'fee-calculator' })
  }

/**
 * The Fee Calculator, prefilled with 100 000 Kč in ČSOB Akciový against the Twin SPYL over 20 years.
 *
 * ```tsx
 * <FeeCalculator />
 * // <div id="fee-calculator">Za 20 let vám bankovní fond nechá o 40 236 Kč méně než ETF SPYL, i bez růstu trhu.
 * //   ČSOB Akciový 59 166 Kč, SPYL 99 402 Kč, the amount, years and Bank Fund, the formula, the Lead Ask</div>
 * ```
 */
export const FeeCalculator = () => {
  const [amountKc, setAmountKc] = useState(feeCalculatorPrefill.amountKc)
  const [years, setYears] = useState(feeCalculatorPrefill.years)
  const [pickedBankFundOption, setPickedBankFundOption] = useState<BankFundOption>(bankFundOptions[0])
  const twin = findUcitsEtf(feeCalculatorPrefill.twinTicker)
  const terCost = calculateTerCost({
    amountKc,
    years,
    bankFundTerPercent: pickedBankFundOption.terPercent,
    twinTerPercent: twin.terPercent,
  })

  return (
    <div id="fee-calculator" className="grid gap-5">
      <TerCostDifference years={years} differenceKc={terCost.differenceKc} twin={twin} />
      <div className="grid gap-3">
        <RemainingAmountBar
          name={pickedBankFundOption.name}
          terLabel={pickedBankFundOption.terLabel}
          amountKc={terCost.bankFundAmountKc}
          shareOfTwinAmount={terCost.bankFundToTwinRatio}
          fundKind="bank-fund"
        />
        <RemainingAmountBar
          name={`ETF ${twin.ticker} na ${twin.trackedIndex}`}
          terLabel={formatPercent(twin.terPercent)}
          amountKc={terCost.twinAmountKc}
          shareOfTwinAmount={1}
          fundKind="twin"
        />
      </div>
      <AmountField amountKc={amountKc} onAmountChange={addFeeCalculatorUseTracking(setAmountKc)} />
      <YearsField years={years} onYearsChange={addFeeCalculatorUseTracking(setYears)} />
      <BankFundChoice
        pickedBankFundOption={pickedBankFundOption}
        onPick={addFeeCalculatorUseTracking(setPickedBankFundOption)}
      />
      <TerCostFormula
        years={years}
        bankFundTerPercent={pickedBankFundOption.terPercent}
        twinTerPercent={twin.terPercent}
        bankFundToTwinRatio={terCost.bankFundToTwinRatio}
      />
      {/* Both Bank Funds' TERs are on screen in the choice, so both are cited: "kolem 2 %" by every surveyed KID. */}
      <DataSourceNote sources={[...bankFundOptions.flatMap((option) => option.sources), twin.source]} />
      <LeadAsk interactiveTool="fee-calculator" />
    </div>
  )
}
