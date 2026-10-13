// The Fund Picker's Ticker choice: the US ETFs as a segmented control (design-identity.md#components), one always picked.
import { useId } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { etfs } from '@data/figures.ts';

export type TickerChoiceArgs = {
  pickedEtfTicker: string;
  onPick: (etfTicker: string) => void;
};

/**
 * A labelled segmented control of every ETF's Ticker, the picked one filled `brand`.
 *
 * ```tsx
 * <TickerChoice pickedEtfTicker="VOO" onPick={setPickedEtfTicker} />
 * // Který fond vám aplikace nenabídla? [VOO] IVV SPY VTI VT
 * // pressing SPY calls onPick('SPY'); pressing VOO again calls nothing
 * ```
 */
export const TickerChoice = ({ pickedEtfTicker, onPick }: TickerChoiceArgs) => {
  const labelId = useId();

  return (
    <div className="grid gap-2">
      <p id={labelId} className="text-label">
        Který fond vám aplikace nenabídla?
      </p>
      <ToggleGroup
        aria-labelledby={labelId}
        value={[pickedEtfTicker]}
        // Pressing the picked ETF again would leave nothing picked, so an empty value is ignored.
        onValueChange={([etfTicker]) => etfTicker && onPick(etfTicker)}
        spacing={1}
        className="w-full rounded-md bg-accent p-1"
      >
        {etfs.map((etf) => (
          <ToggleGroupItem
            key={etf.ticker}
            value={etf.ticker}
            className="h-11 flex-1 rounded-sm text-heading hover:bg-background/60 aria-pressed:bg-brand aria-pressed:text-background aria-pressed:hover:bg-brand"
          >
            <span className="text-fact">{etf.ticker}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
