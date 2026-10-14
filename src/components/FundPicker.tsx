// The Fund Picker (`fund-picker`): the Visitor picks the US ETF their app won't sell and sees its Twin, or its closest
// alternative where no UCITS ETF tracks the same index. It opens the `pain` First Screen and is Section 03 for `money`.
import { AnimatePresence, m } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { usEstateTaxThreshold } from '@data/figures.ts';
import { findSubstitutes, type EtfSubstitutes } from '@lib/substitutes.ts';
import { ClosestAlternativeNote } from './ClosestAlternativeNote.tsx';
import { DataSourceNote } from './DataSourceNote.tsx';
import { LeadAsk } from './LeadAsk.tsx';
import { OtherSubstitutes } from './OtherSubstitutes.tsx';
import { PrimarySubstitute } from './PrimarySubstitute.tsx';
import { StruckTicker } from './StruckTicker.tsx';
import { TickerChoice } from './TickerChoice.tsx';

export type FundPickerProps = {
  /** The First Screen's headline, which follows the picked ETF; a Section passes none, since its own heading leads. */
  renderHeadline?: (etfSubstitutes: EtfSubstitutes) => ReactNode;
};

/** The ETF preselected for `pain`, its fallback and Section 03: the one Ad Variant A names. */
const preselectedEtfTicker = 'VOO';

/**
 * The Fund Picker: a segmented choice of US ETF, the ETF struck out over its Twin or closest alternative with their
 * facts and Data Sources, ending in the inline Lead Ask.
 *
 * ```tsx
 * <FundPicker renderHeadline={({ etf }) => <h1>…</h1>} /> // VOO struck out over SPYL, then CSPX and VUAA
 * <FundPicker />                                          // the same, under the Section's own heading
 * ```
 */
export const FundPicker = ({ renderHeadline }: FundPickerProps) => {
  const [pickedEtfTicker, setPickedEtfTicker] = useState<string>(preselectedEtfTicker);
  const etfSubstitutes = findSubstitutes(pickedEtfTicker);
  const { etf, relation, substitutes } = etfSubstitutes;
  const [primarySubstitute, ...otherSubstitutes] = substitutes;

  return (
    <div id="fund-picker" className="grid gap-5">
      {renderHeadline?.(etfSubstitutes)}
      <TickerChoice pickedEtfTicker={pickedEtfTicker} onPick={setPickedEtfTicker} />
      <div className="grid" aria-live="polite">
        <StruckTicker ticker={etf.ticker} />
        {/* Each pick slides its answer in; the preselected one is already there when the page opens. */}
        <AnimatePresence initial={false}>
          <m.div
            key={etf.ticker}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="grid gap-5"
          >
            {primarySubstitute && (
              <PrimarySubstitute etf={etf} substitute={primarySubstitute} relation={relation} />
            )}
            {relation === 'closest-alternative' && (
              <ClosestAlternativeNote etf={etf} closestAlternative={primarySubstitute} />
            )}
            {otherSubstitutes.length > 0 && <OtherSubstitutes substitutes={otherSubstitutes} relation={relation} />}
          </m.div>
        </AnimatePresence>
      </div>
      <DataSourceNote
        sources={[
          etf.source,
          ...substitutes.map((substitute) => substitute.source),
          // The estate tax is a fact about a Substitute, so it is cited only when one is shown.
          ...(primarySubstitute ? [usEstateTaxThreshold.source] : []),
        ]}
      />
      <LeadAsk interactiveTool="fund-picker" />
    </div>
  );
};
