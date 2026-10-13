// One fund's TER as a ruled row (design-identity.md#layout): the fund's name on the left, its TER set giant on the
// right. The Money First Screen sets a Bank Fund's row over a Twin's.
import { formatPercent } from '../format.ts'

/** Whose TER a row shows: a Bank Fund's costs the Visitor, a Twin's is the good number (design-identity.md#colour). */
export type FundKind = 'bank-fund' | 'twin'

// One plain string per kind: `cn` would read `text-ter` as a colour and drop it beside `text-signal` (tailwind.md#tokens).
const terClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'text-ter text-signal',
  twin: 'text-ter text-brand',
}

export type TerRowArgs = {
  name: string
  description: string
  terPercent: number
  fundKind: FundKind
}

/**
 * One fund's TER, set giant on the right of a 2 px rule, with the fund's name on the left.
 *
 * ```tsx
 * <TerRow name="ČSOB Akciový" description="akciový fond banky" terPercent={2.22} fundKind="bank-fund" />
 * // ČSOB Akciový / akciový fond banky ……… 2,22 % (in `signal`)
 * ```
 */
export const TerRow = ({ name, description, terPercent, fundKind }: TerRowArgs) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-3 border-t-2 border-heading pt-1">
      <dt className="text-label">
        {name}
        <span className="block font-normal text-muted-foreground">{description}</span>
      </dt>
      <dd className={terClassNameByFundKind[fundKind]}>{formatPercent(terPercent)}</dd>
    </div>
  )
}
