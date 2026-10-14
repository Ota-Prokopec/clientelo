// Why the Fund Picker shows a closest alternative instead of a Twin: no UCITS ETF tracks the ETF's own index.
import type { Etf, UcitsEtf } from '@data/figures.ts';

export type ClosestAlternativeNoteProps = {
  etf: Etf;
  closestAlternative: UcitsEtf;
};

/**
 * Says that no European ETF tracks the ETF's index, and which one comes closest.
 *
 * ```tsx
 * <ClosestAlternativeNote etf={vt} closestAlternative={vwce} />
 * // Evropské ETF na index FTSE Global All Cap, který sleduje VT, neexistuje. Nejblíž mu je VWCE na podobný index …
 * ```
 */
export const ClosestAlternativeNote = ({ etf, closestAlternative }: ClosestAlternativeNoteProps) => {
  return (
    <p>
      Evropské ETF na index {etf.trackedIndex}, který sleduje {etf.ticker}, neexistuje. Nejblíž mu je{' '}
      {closestAlternative.ticker} na podobný index {closestAlternative.trackedIndex}.
    </p>
  );
};
