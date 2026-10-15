// The segmented control (design-identity.md#components): a labelled, rounded `accent` track with 4 px of padding,
// holding rounded options that wrap onto rows when one row can't hold them, the picked one filled `brand` with
// `background` text. Pressing the picked option again keeps it picked. The Fund Picker's Ticker and the Fee Calculator's
// Bank Fund are each picked on one, and a new Lead answers the Segmentation Question on one that starts with none picked.
import { useId, type ReactNode } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { cn } from '@lib/utils.ts'

/** One option: the value picking it reports, and what its button shows. */
export type SegmentedControlOption<TValue extends string> = { value: TValue; content: ReactNode }

export type SegmentedControlProps<TValue extends string> = {
  label: string
  options: SegmentedControlOption<TValue>[]
  /** The picked option's value, or null while none is picked yet. */
  pickedValue: TValue | null
  onPick: (value: TValue) => void
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
export const SegmentedControl = <TValue extends string>({
  label,
  options,
  pickedValue,
  onPick,
  optionClassName,
}: SegmentedControlProps<TValue>) => {
  const labelId = useId()

  return (
    <div className="grid gap-2">
      <p id={labelId} className="text-label">
        {label}
      </p>
      <ToggleGroup
        aria-labelledby={labelId}
        value={pickedValue === null ? [] : [pickedValue]}
        // Pressing the picked option again would leave nothing picked, so an empty value is ignored. Looking the value up
        // among the options gives it back its type, which the toggle group's untyped value loses.
        onValueChange={([toggledValue]) => {
          const pickedOption = options.find((option) => option.value === toggledValue)
          if (pickedOption) onPick(pickedOption.value)
        }}
        spacing={1}
        className="w-full flex-wrap rounded-md bg-accent p-1"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            // `flex-1` shares a row equally, and `min-w-max` keeps each option as wide as its content, so a row that
            // can't hold every option breaks onto the next. The picked option drops the page's button pointer (index.css),
            // since pressing it does nothing.
            className={cn(
              'min-w-max flex-1 rounded-sm text-heading hover:bg-background/60 aria-pressed:bg-brand aria-pressed:text-background aria-pressed:hover:bg-brand aria-pressed:cursor-default',
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
