// The Fee Calculator's number of years: a slider, with the years it is set to beside its label.
import { useId } from 'react'
import { formatYears, yearsFormatOptions } from '@lib/format.ts'
import { FeeCalculatorSlider } from './FeeCalculatorSlider.tsx'

export type YearsFieldProps = {
  years: number
  onYearsChange: (years: number) => void
}

const yearsSliderRange = { min: 1, max: 40, step: 1 }

/**
 * The years' label and value over their slider.
 *
 * ```tsx
 * <YearsField years={20} onYearsChange={setYears} />
 * // Doba investice ……… 20 let
 * // ————————●———
 * ```
 */
export const YearsField = ({ years, onYearsChange }: YearsFieldProps) => {
  const labelId = useId()

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p id={labelId} className="text-label">
          Doba investice
        </p>
        <p className="text-fact text-heading tabular-nums">{formatYears(years)}</p>
      </div>
      <FeeCalculatorSlider
        value={years}
        labelId={labelId}
        format={yearsFormatOptions}
        onValueChange={onYearsChange}
        {...yearsSliderRange}
      />
    </div>
  )
}
