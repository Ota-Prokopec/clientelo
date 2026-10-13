// The ruled fact grid (design-identity.md#layout): facts in two columns, each a small grey label over a bold value
// under a 2 px rule. A Twin's index, TER and estate tax read this way.

/** One fact: what it is, and its value as Czech copy. */
export type Fact = { label: string; value: string }

export type FactGridArgs = { facts: Fact[] }

/**
 * Lays facts out two to a row, as a description list.
 *
 * ```tsx
 * <FactGrid facts={[{ label: 'Stejný index', value: 'S&P 500' }]} />
 * // <dl><div><dt>Stejný index</dt><dd>S&P 500</dd></div></dl>
 * ```
 */
export function FactGrid({ facts }: FactGridArgs) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {facts.map((fact) => (
        <div key={fact.label} className="border-t-2 border-heading pt-1.5">
          <dt className="text-note text-muted-foreground">{fact.label}</dt>
          <dd className="text-fact text-heading">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
