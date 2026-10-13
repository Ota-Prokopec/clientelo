// The Lead Magnet's first page in miniature, drawn from the PDF by the same build that makes the PDF
// (vite-plugins/pdfLeadMagnetPlugin.ts), so the preview always matches the file. It sits on a white Card that stays in the
// light palette in both modes, like the PDF itself (design-identity.md#components).
import { Card } from '@/components/ui/card'
import { leadMagnetThumbnailPath } from '@data/leadMagnetFiles.ts'

/**
 * The PDF's first page, small.
 *
 * ```tsx
 * <LeadMagnetThumbnail />
 * // <div data-palette="light"><img src="/tahak-evropska-dvojcata-americkych-etf.png" alt="Náhled první strany taháku"></div>
 * ```
 */
export const LeadMagnetThumbnail = () => {
  return (
    <Card data-palette="light" className="w-24 gap-0 py-0 ring-0">
      <img src={leadMagnetThumbnailPath} alt="Náhled první strany taháku" className="aspect-[1/1.414] w-full" />
    </Card>
  )
}
