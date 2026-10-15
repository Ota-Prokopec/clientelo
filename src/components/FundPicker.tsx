// The Fund Picker (`fund-picker`): the Visitor picks the US ETF their app won't sell and sees its Twin, or its closest
// alternative where no UCITS ETF tracks the same index. It opens the `pain` First Screen and is Section 03 for `money`.
// The Visitor's first pick is its interactive_tool_use Funnel Event; the preselected VOO isn't use.
import { AnimatePresence, m } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { AD_PROMISE_ETF_TICKER } from '@data/adPromise.ts'
import { usEstateTaxThreshold, type EtfTicker } from '@data/figures.ts'
import { findSubstitutes, type EtfSubstitutes } from '@lib/substitutes.ts'
import { trackFunnelEvent } from '@lib/funnel/trackFunnelEvent.ts'
import { ClosestAlternativeNote } from './ClosestAlternativeNote.tsx'
import { DataSourceNote } from './DataSourceNote.tsx'
import { LeadAsk } from './LeadAsk.tsx'
import { OtherSubstitutes } from './OtherSubstitutes.tsx'
import { PrimarySubstitute } from './PrimarySubstitute.tsx'
import { StruckTicker } from './StruckTicker.tsx'
import { TickerChoice } from './TickerChoice.tsx'

export type FundPickerProps = {
  /** The First Screen's headline, which follows the picked ETF; a Section passes none, since its own heading leads. */
  renderHeadline?: (etfSubstitutes: EtfSubstitutes) => ReactNode
}

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
  const [pickedEtfTicker, setPickedEtfTicker] = useState<EtfTicker>(AD_PROMISE_ETF_TICKER)
  const etfSubstitutes = findSubstitutes(pickedEtfTicker)
  const { etf, relation, substitutes } = etfSubstitutes
  const [primarySubstitute, ...otherSubstitutes] = substitutes

  /**
   * Shows the picked ETF's answer, and records the pick as the Fund Picker's use, once per Visit.
   *
   * ```ts
   * pickEtfTicker('SPY') // SPY struck out over its Twins; interactive_tool_use { tool: 'fund-picker', ticker: 'SPY' }
   * ```
   */
  const pickEtfTicker = (etfTicker: EtfTicker) => {
    setPickedEtfTicker(etfTicker)
    trackFunnelEvent({ event: 'interactive_tool_use', tool: 'fund-picker', ticker: etfTicker })
  }

  return (
    <div id="fund-picker" className="grid gap-5">
      {renderHeadline?.(etfSubstitutes)}
      <TickerChoice pickedEtfTicker={pickedEtfTicker} onPick={pickEtfTicker} />
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
            <PrimarySubstitute etf={etf} substitute={primarySubstitute} relation={relation} />
            {relation === 'closest-alternative' && (
              <ClosestAlternativeNote etf={etf} closestAlternative={primarySubstitute} />
            )}
            {otherSubstitutes.length > 0 && <OtherSubstitutes substitutes={otherSubstitutes} relation={relation} />}
          </m.div>
        </AnimatePresence>
      </div>
      <DataSourceNote
        sources={[etf.source, ...substitutes.map((substitute) => substitute.source), usEstateTaxThreshold.source]}
      />
      <LeadAsk interactiveTool="fund-picker" />
    </div>
  )
}
