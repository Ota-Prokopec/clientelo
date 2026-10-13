// The segmented control (design-identity.md#components): a labelled, rounded `accent` track with 4 px of padding,
// holding rounded options, the picked one filled `brand` with `background` text. One option is always picked. The Fund
// Picker's Ticker and the Fee Calculator's Bank Fund are each picked on one.
import { useId, type ReactNode } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

/** One option: the value picking it reports, and what its button shows. */
export type SegmentedControlOption = { value: string; content: ReactNode }

export type SegmentedControlArgs = {
  label: string
  options: SegmentedControlOption[]
  pickedValue: string
  onPick: (value: string) => void
  /** Classes every option's button adds, such as its height. */
  optionClassName?: string
}

/**
 * A label over a track of options, the picked one filled `brand`.
 *
 * ```tsx
 * <SegmentedControl label="Bankovní fond" options={[{ value: 'a', content: 'A' }, { value: 'b', content: 'B' }]}
 *   pickedValue="a" onPick={setPickedValue} />
 * // Bankovní fond [A] B
 * // pressing B calls onPick('b'); pressing A again calls nothing
 * ```
 */
export const SegmentedControl = ({ label, options, pickedValue, onPick, optionClassName }: SegmentedControlArgs) => {
  const labelId = useId()

  return (
    <div className="grid gap-2">
      <p id={labelId} className="text-label">
        {label}
      </p>
      <ToggleGroup
        aria-labelledby={labelId}
        value={[pickedValue]}
        // Pressing the picked option again would leave nothing picked, so an empty value is ignored.
        onValueChange={([value]) => value && onPick(value)}
        spacing={1}
        className="w-full rounded-md bg-accent p-1"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={cn(
              'flex-1 rounded-sm text-heading hover:bg-background/60 aria-pressed:bg-brand aria-pressed:text-background aria-pressed:hover:bg-brand',
              optionClassName,
            )}
          >
            {option.content}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
