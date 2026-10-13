// The struck-out Ticker (design-identity.md#colour): the ETF the Visitor's app won't sell, set giant in grey under a
// `signal` bar.
export type StruckTickerArgs = { ticker: string };

/**
 * A giant Ticker struck out by a slanted `signal` bar.
 *
 * ```tsx
 * <StruckTicker ticker="VOO" /> // <s>VOO</s>, grey, under a red bar
 * ```
 */
export const StruckTicker = ({ ticker }: StruckTickerArgs) => {
  return (
    <s className="relative w-fit text-ticker text-muted-foreground no-underline">
      {ticker}
      <span aria-hidden="true" className="absolute -inset-x-2 top-[46%] h-3 -rotate-6 rounded-full bg-signal" />
    </s>
  );
};
