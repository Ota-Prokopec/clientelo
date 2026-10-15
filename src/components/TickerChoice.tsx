// The Fund Picker's Ticker choice: the US ETFs as a segmented control (design-identity.md#components), one always picked.
import { etfs, type EtfTicker } from '@data/figures.ts'
import { SegmentedControl } from './SegmentedControl.tsx'

export type TickerChoiceProps = {
  pickedEtfTicker: EtfTicker
  onPick: (etfTicker: EtfTicker) => void
}

/**
 * A labelled segmented control of every ETF's Ticker, the picked one filled `brand`.
 *
 * ```tsx
 * <TickerChoice pickedEtfTicker="VOO" onPick={setPickedEtfTicker} />
 * // Který fond vám aplikace nenabídla? [VOO] IVV SPY VT
 * // pressing SPY calls onPick('SPY'); pressing VOO again calls nothing
 * ```
 */
export const TickerChoice = ({ pickedEtfTicker, onPick }: TickerChoiceProps) => {
  return (
    <SegmentedControl
      label="Který fond vám aplikace nenabídla?"
      options={etfs.map((etf) => ({ value: etf.ticker, content: <span className="text-fact">{etf.ticker}</span> }))}
      pickedValue={pickedEtfTicker}
      onPick={onPick}
      optionClassName="h-11"
    />
  )
}
