// The Lead Magnet's first page in miniature: a white Card that stays in the light palette in both modes
// (design-identity.md#components). It's drawn in markup, not as an image of the PDF, and reads the title and the Twin
// from the same data module the PDF renders, so the preview never names anything the file doesn't.
import { Card } from '@/components/ui/card.tsx'
import { LEAD_MAGNET_TITLE } from '@data/leadMagnet.ts'
import { AD_PROMISE_ETF_TICKER } from '@data/adPromise.ts'
import { findSubstitutes } from '@lib/substitutes.ts'

/**
 * The PDF's first page, small: its title over the first row of its Twin table, VOO struck out beside its first Twin.
 *
 * ```tsx
 * <LeadMagnetThumbnail />
 * // <div role="img" aria-label="Náhled první strany taháku" data-palette="light">Tahák: evropská dvojčata amerických ETF
 * //   VOO SPYL</div>
 * ```
 */
export const LeadMagnetThumbnail = () => {
  const {
    etf,
    substitutes: [firstTwin],
  } = findSubstitutes(AD_PROMISE_ETF_TICKER)

  return (
    <Card
      role="img"
      aria-label="Náhled první strany taháku"
      data-palette="light"
      className="aspect-[1/1.414] w-24 gap-2 p-2.5 ring-0"
    >
      <p className="text-label text-heading">{LEAD_MAGNET_TITLE}</p>
      <dl className="grid grid-cols-2 border-t-2 border-heading pt-1">
        <dt className="text-note text-muted-foreground line-through">{etf.ticker}</dt>
        <dd className="text-note font-bold text-brand">{firstTwin?.ticker}</dd>
      </dl>
    </Card>
  )
}
