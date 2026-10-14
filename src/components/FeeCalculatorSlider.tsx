// The Fee Calculator's slider for one value, the amount or the years, in the design identity (design-identity.md#shape):
// an `accent` track filled `brand` up to a round thumb large enough to drag with a thumb on a phone.
import { Slider } from '@/components/ui/slider'

export type FeeCalculatorSliderProps = {
  value: number
  min: number
  max: number
  step: number
  /** The id of the label naming what the slider sets. */
  labelId: string
  /** How a screen reader reads the value, such as `yearsFormatOptions` for "20 let". */
  format: Intl.NumberFormatOptions
  onValueChange: (value: number) => void
}

/**
 * A slider over one value, labelled by `labelId`. A value outside `min` to `max`, such as an amount typed past the
 * slider's end or a cleared field, puts the thumb at the nearer end.
 *
 * ```tsx
 * <FeeCalculatorSlider value={20} min={1} max={40} step={1} labelId={labelId} format={yearsFormatOptions} onValueChange={setYears} />
 * // dragging to 25 calls setYears(25); a screen reader reads "25 let"
 * <FeeCalculatorSlider value={5_000_000} min={10_000} max={1_000_000} … /> // the thumb sits at 1 000 000
 * ```
 */
export const FeeCalculatorSlider = ({ value, min, max, labelId, onValueChange, ...sliderProps }: FeeCalculatorSliderProps) => {
  // A cleared field is NaN, which `||` turns into the start of the track.
  const thumbValue = Math.min(Math.max(value || min, min), max)

  return (
    <Slider
      aria-labelledby={labelId}
      value={[thumbValue]}
      min={min}
      max={max}
      locale="cs-CZ"
      onValueChange={(sliderValue) => onValueChange(typeof sliderValue === 'number' ? sliderValue : sliderValue[0])}
      className="py-2 [&_[data-slot=slider-range]]:bg-brand [&_[data-slot=slider-thumb]]:size-7 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-track]]:bg-accent [&_[data-slot=slider-track]]:data-horizontal:h-2"
      {...sliderProps}
    />
  )
}
