// One ruled fact (design-identity.md#layout): a small grey label over a bold value under a 2 px rule, and optionally
// what the value means for the Visitor below it. The fact grid sets these two to a row; the tax rules a Lead unlocks set
// them one to a row with their explanation.

export type RuledFactArgs = {
  label: string
  /** The value as Czech copy. */
  value: string
  /** What the value means, in a sentence or two, when the label and value alone don't say it. */
  explanation?: string
}

/**
 * A fact's label, value and explanation, as one entry of a description list: it renders inside a `<dl>`.
 *
 * ```tsx
 * <RuledFact label="Stejný index" value="S&P 500" />
 * // <div><dt>Stejný index</dt><dd>S&P 500</dd></div>
 * <RuledFact label="Časový test" value="více než 3 roky" explanation="Držíte-li fond déle než 3 roky, …" />
 * // <div><dt>Časový test</dt><dd>více než 3 roky</dd><dd>Držíte-li fond déle než 3 roky, …</dd></div>
 * ```
 */
export const RuledFact = ({ label, value, explanation }: RuledFactArgs) => {
  return (
    <div className="border-t-2 border-heading pt-1.5">
      <dt className="text-note text-muted-foreground">{label}</dt>
      <dd className="text-fact text-heading">{value}</dd>
      {explanation && <dd className="pt-1">{explanation}</dd>}
    </div>
  )
}
