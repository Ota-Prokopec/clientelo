// The line that opens a numbered block on the Swiss grid (design-identity.md#layout): a 2 px rule, the number in
// `signal` on the grid's 3 rem left column, and beside it a bold 12 px label. Every Section opens with one, and so does
// each Chapter a Lead unlocks.

export type NumberedLabelArgs = {
  /** The number as the grid sets it, two digits: a Section's `02`, or a Chapter's from formatChapterNumber(). */
  number: string
  label: string
}

/**
 * The number beside its label, under the rule.
 *
 * ```tsx
 * <NumberedLabel number="02" label="Pravidla EU" /> // ──── 02  Pravidla EU
 * ```
 */
export const NumberedLabel = ({ number, label }: NumberedLabelArgs) => {
  return (
    <p className="grid grid-cols-[3rem_1fr] border-t-2 border-heading pt-1.5 text-label">
      <span className="text-signal">{number}</span>
      <span>{label}</span>
    </p>
  )
}
