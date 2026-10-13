// The Fund Picker's other Substitutes for the picked ETF, listed below the one set giant, each with its index and TER.
import type { UcitsEtf } from '@data/figures.ts';
import { formatPercent } from '@lib/format.ts';
import { relationPresentationByRelation } from '@lib/relationPresentationByRelation.ts';
import type { SubstituteRelation } from '@lib/substitutes.ts';

export type OtherSubstitutesArgs = {
  substitutes: UcitsEtf[];
  relation: SubstituteRelation;
};

/**
 * The other Twins or alternatives as ruled rows: Ticker, index, and TER in the relation's colour.
 *
 * ```tsx
 * <OtherSubstitutes substitutes={[cspx, vuaa]} relation="twin" />
 * // Další dvojčata / CSPX S&P 500 0,07 % ročně / VUAA S&P 500 0,07 % ročně
 * ```
 */
export const OtherSubstitutes = ({ substitutes, relation }: OtherSubstitutesArgs) => {
  const relationPresentation = relationPresentationByRelation[relation];

  return (
    <div className="grid gap-2">
      <p className="text-label">{relationPresentation.otherSubstitutesLabel}</p>
      <ul className="grid gap-2">
        {substitutes.map((substitute) => (
          <li
            key={substitute.ticker}
            className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 border-t-2 border-heading pt-1.5"
          >
            <span className="text-fact text-heading">{substitute.ticker}</span>
            <span className="text-muted-foreground">{substitute.trackedIndex}</span>
            <span className={`text-fact ${relationPresentation.colorClassName}`}>
              {formatPercent(substitute.terPercent)} ročně
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
