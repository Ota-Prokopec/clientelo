// The Substitute the Fund Picker sets giant under the struck-out ETF: its Twin, or its closest alternative, with the
// ruled facts that make the case for it.
import type { Etf, UcitsEtf } from '@data/figures.ts';
import { formatPercent } from '@lib/format.ts';
import { relationPresentationByRelation } from '@lib/relationPresentationByRelation.ts';
import type { SubstituteRelation } from '@/types.ts';
import { FactGrid } from './FactGrid.tsx';

export type PrimarySubstituteProps = {
  etf: Etf;
  substitute: UcitsEtf;
  relation: SubstituteRelation;
};

/**
 * The Substitute's label and giant Ticker, over its index, its TER beside the ETF's own, and the estate tax it avoids.
 *
 * ```tsx
 * <PrimarySubstitute etf={voo} substitute={spyl} relation="twin" />
 * // Dvojče SPYL (in `brand`) / Stejný index S&P 500 · TER ročně (VOO 0,03 %) 0,03 % · Americká dědická daň žádná
 * <PrimarySubstitute etf={vt} substitute={vwce} relation="closest-alternative" />
 * // Nejbližší alternativa VWCE (in `heading`) / Podobný index FTSE All-World · …
 * ```
 */
export const PrimarySubstitute = ({ etf, substitute, relation }: PrimarySubstituteProps) => {
  const relationPresentation = relationPresentationByRelation[relation];

  return (
    <>
      <div className="grid gap-1 pt-2">
        <p className={`text-label ${relationPresentation.colorClassName}`}>{relationPresentation.substituteLabel}</p>
        <p className={`text-ticker ${relationPresentation.colorClassName}`}>{substitute.ticker}</p>
      </div>
      <FactGrid
        facts={[
          { label: relationPresentation.indexLabel, value: substitute.trackedIndex },
          {
            label: `TER ročně (${etf.ticker} ${formatPercent(etf.terPercent)})`,
            value: formatPercent(substitute.terPercent),
          },
          { label: 'Americká dědická daň', value: 'žádná' },
        ]}
      />
    </>
  );
};
