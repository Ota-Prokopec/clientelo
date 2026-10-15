// Why the Fund Picker shows a closest alternative instead of a Twin: we found no UCITS ETF on the ETF's own index. No
// ETF the page offers has one today, since each has a Twin (docs/strategy.md#twins).
import type { Etf, UcitsEtf } from '@data/figures.ts'

export type ClosestAlternativeNoteProps = {
  etf: Etf
  closestAlternative: UcitsEtf
}

/**
 * Says that we found no European ETF on the ETF's index, and which one comes closest. It claims our search, never that
 * no such fund exists, which no Data Source could show.
 *
 * ```tsx
 * <ClosestAlternativeNote etf={etf} closestAlternative={ucitsEtf} />
 * // Evropské ETF na index …, který sleduje …, jsme nenašli. Nejblíž mu je … na podobný index …
 * ```
 */
export const ClosestAlternativeNote = ({ etf, closestAlternative }: ClosestAlternativeNoteProps) => {
  return (
    <p>
      Evropské ETF na index {etf.trackedIndex}, který sleduje {etf.ticker}, jsme nenašli. Nejblíž mu je{' '}
      {closestAlternative.ticker} na podobný index {closestAlternative.trackedIndex}.
    </p>
  )
}
