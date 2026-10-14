// The segmented control (design-identity.md#components): a labelled, rounded `accent` track with 4 px of padding,
// holding rounded options that wrap onto rows when one row can't hold them, the picked one filled `brand` with
// `background` text. Pressing the picked option again keeps it picked. The Fund Picker's Ticker and the Fee Calculator's
// Bank Fund are each picked on one, and a new Lead answers the Segmentation Question on one that starts with none picked.
import { useId, type ReactNode } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

/** One option: the value picking it reports, and what its button shows. */
export type SegmentedControlOption = { value: string; content: ReactNode }

export type SegmentedControlProps = {
  label: string
  options: SegmentedControlOption[]
  /** The picked option's value, or null while none is picked yet. */
  pickedValue: string | null
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
 * // pickedValue={null} → Bankovní fond A B, none filled until one is pressed
 * ```
 */
export const SegmentedControl = ({ label, options, pickedValue, onPick, optionClassName }: SegmentedControlProps) => {
  const labelId = useId()

  return (
    <div className="grid gap-2">
      <p id={labelId} className="text-label">
        {label}
      </p>
      <ToggleGroup
        aria-labelledby={labelId}
        value={pickedValue === null ? [] : [pickedValue]}
        // Pressing the picked option again would leave nothing picked, so an empty value is ignored.
        onValueChange={([value]) => value && onPick(value)}
        spacing={1}
        className="w-full flex-wrap rounded-md bg-accent p-1"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            // `flex-1` shares a row equally, and `min-w-max` keeps each option as wide as its content, so a row that
            // can't hold every option breaks onto the next.
            className={cn(
              'min-w-max flex-1 rounded-sm text-heading hover:bg-background/60 aria-pressed:bg-brand aria-pressed:text-background aria-pressed:hover:bg-brand',
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
