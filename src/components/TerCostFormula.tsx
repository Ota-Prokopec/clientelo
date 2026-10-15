// How the Fee Calculator gets its answer, shown beside it as docs/ads.md#figures-flagged-1 requires: the formula, then
// the same formula with the Visitor's figures in it. No market return is assumed, which keeps it consistent with Ad
// Variant B's "jednorázová investice, stejný vývoj trhu".
import { formatRatio, formatTerFraction, formatYears } from '@lib/format.ts'

export type TerCostFormulaProps = {
  years: number
  bankFundTerPercent: number
  twinTerPercent: number
  bankFundToTwinRatio: number
}

/**
 * Explains the yearly fee, then shows `((1 − TER_bank) / (1 − TER_twin))^years` with the figures filled in.
 *
 * ```tsx
 * <TerCostFormula years={20} bankFundTerPercent={2.59} twinTerPercent={0.03} bankFundToTwinRatio={0.5952} />
 * // ((1 − TER banky) / (1 − TER ETF))^roky
 * // = ((1 − 0,0259) / (1 − 0,0003))^20
 * // = 0,595
 * ```
 */
export const TerCostFormula = ({
  years,
  bankFundTerPercent,
  twinTerPercent,
  bankFundToTwinRatio,
}: TerCostFormulaProps) => {
  return (
    <div className="grid gap-2">
      <p className="text-label">Jak počítáme</p>
      <p className="text-muted-foreground">
        Výpočet počítá s tím, že si každý fond každý rok strhne svůj poplatek (TER) z celé částky. Trh se u obou vyvíjí
        stejně, takže výnos odhadovat nemusíme. Bankovní fond vám za {formatYears(years)} nechá tento podíl z toho, co
        ETF:
      </p>
      <p className="font-bold text-heading">
        <span className="block">
          ((1 − TER<sub>banky</sub>) / (1 − TER<sub>ETF</sub>))<sup>roky</sup>
        </span>
        <span className="block">
          = ((1 − <span className="text-signal">{formatTerFraction(bankFundTerPercent)}</span>) / (1 −{' '}
          <span className="text-brand">{formatTerFraction(twinTerPercent)}</span>))<sup>{years}</sup>
        </span>
        <span className="block">= {formatRatio(bankFundToTwinRatio)}</span>
      </p>
      <p className="text-muted-foreground">
        Částky výše jsou spočítané bez růstu trhu. Když trh roste, roste u obou fondů stejně a rozdíl v korunách je
        ještě větší.
      </p>
    </div>
  )
}
