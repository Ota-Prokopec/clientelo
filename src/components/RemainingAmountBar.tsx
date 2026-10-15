// What one fund leaves of the amount, as a ruled row over a bar, like the bars in Ad Variant B's creative (docs/ads.md):
// the Twin's bar is full, and the Bank Fund's stops at its share of the Twin's amount.
import type { CSSProperties } from 'react'
import { cn } from '@lib/utils.ts'
import { formatAmount } from '@lib/format.ts'
import type { FundKind } from '@/types.ts'

const terClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'text-signal',
  twin: 'text-brand',
}

const fillClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'bg-signal',
  twin: 'bg-brand',
}

export type RemainingAmountBarProps = {
  name: string
  /** The TER as the page names it, such as "2,59 %" or "kolem 2 %". */
  terLabel: string
  amountKc: number
  /** The share of the Twin's amount this fund leaves, from 0 to 1: the Twin's own bar is 1. */
  shareOfTwinAmount: number
  fundKind: FundKind
}

/**
 * The fund's name and TER, its amount on the right, and a bar filled to its share of the Twin's amount.
 *
 * ```tsx
 * <RemainingAmountBar name="ČSOB Akciový" terLabel="2,59 %" amountKc={59_166} shareOfTwinAmount={0.595} fundKind="bank-fund" />
 * // ČSOB Akciový · 2,59 % (in `signal`) ……… 59 166 Kč
 * // [████████████░░░░░░░░] a `signal` bar across 59.5 % of the row
 * ```
 */
export const RemainingAmountBar = ({
  name,
  terLabel,
  amountKc,
  shareOfTwinAmount,
  fundKind,
}: RemainingAmountBarProps) => {
  // A custom property isn't one of CSSProperties' keys, so the object is widened to it (tailwind.md#one-way-to-style).
  const shareStyle = { '--share': shareOfTwinAmount } as CSSProperties

  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1.5 border-t-2 border-heading pt-1.5">
      <p className="text-label">
        {name} · <span className={terClassNameByFundKind[fundKind]}>{terLabel}</span>
      </p>
      <p className="text-fact text-heading tabular-nums">{formatAmount(amountKc, 'Kč')}</p>
      <div aria-hidden="true" className="col-span-2 h-4 overflow-hidden rounded-md bg-accent">
        <div
          style={shareStyle}
          className={cn(
            'h-full w-[calc(var(--share)*100%)] rounded-md transition-[width] duration-200 motion-reduce:transition-none',
            fillClassNameByFundKind[fundKind],
          )}
        />
      </div>
    </div>
  )
}
