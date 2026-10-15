// The Fee Calculator's one-off amount: a field in Kč for an exact figure, and a slider under it for a quick one.
import { useId } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group.tsx'
import { Label } from '@/components/ui/label.tsx'
import { amountKcFormatOptions } from '@lib/format.ts'
import { toInputValue } from '@lib/inputValue.ts'
import { FeeCalculatorSlider } from './FeeCalculatorSlider.tsx'

export type AmountFieldProps = {
  /** The amount in Kč, or NaN while the Visitor has cleared the field. */
  amountKc: number
  onAmountChange: (amountKc: number) => void
}

// The slider covers what a Bank-Fund Saver typically holds; the field takes any amount beyond it.
const amountSliderRange = { min: 10_000, max: 1_000_000, step: 10_000 }

/**
 * The amount's label, its field with "Kč" and its slider, both calling `onAmountChange`.
 *
 * ```tsx
 * <AmountField amountKc={100_000} onAmountChange={setAmountKc} />
 * // Jednorázová investice [100000 Kč] ——●————
 * // typing 250000 calls onAmountChange(250000); clearing the field calls onAmountChange(NaN)
 * ```
 */
export const AmountField = ({ amountKc, onAmountChange }: AmountFieldProps) => {
  const labelId = useId()
  const inputId = useId()

  return (
    <div className="grid gap-2">
      <Label id={labelId} htmlFor={inputId}>
        <span className="text-label">Jednorázová investice</span>
      </Label>
      <InputGroup className="h-11">
        <InputGroupInput
          id={inputId}
          type="number"
          inputMode="numeric"
          min={0}
          value={toInputValue(amountKc)}
          onChange={(event) => onAmountChange(event.currentTarget.valueAsNumber)}
          className="font-bold text-heading tabular-nums"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Kč</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FeeCalculatorSlider
        value={amountKc}
        labelId={labelId}
        format={amountKcFormatOptions}
        onValueChange={onAmountChange}
        {...amountSliderRange}
      />
    </div>
  )
}
