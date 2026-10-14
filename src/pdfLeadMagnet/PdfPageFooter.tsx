// The foot of each page of the Lead Magnet PDF: the disclaimer the page's Footer carries, and the page number. The
// number is passed in, not counted by react-pdf's `render` prop, which drops a styled dynamic Text inside a fixed View.
// The PDF always has leadMagnetPageCount pages, since the build fails otherwise.
import { View } from '@react-pdf/renderer'
import { leadMagnetPageCount } from '@data/leadMagnetFiles.ts'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

export type PdfPageFooterArgs = { pageNumber: number }

/**
 * Sits in the page's bottom margin.
 *
 * ```tsx
 * <PdfPageFooter pageNumber={1} /> // Nejde o investiční doporučení. Investování nese riziko ztráty.        1 / 2
 * ```
 */
export const PdfPageFooter = ({ pageNumber }: PdfPageFooterArgs) => {
  return (
    <View
      fixed
      style={pdfTw('absolute bottom-7 left-12 right-12 flex-row justify-between border-t border-border pt-1.5')}
    >
      <PdfText style={pdfTw('text-note text-muted-foreground')}>
        Nejde o investiční doporučení. Investování nese riziko ztráty.
      </PdfText>
      <PdfText style={pdfTw('text-note text-muted-foreground')}>
        {pageNumber} / {leadMagnetPageCount}
      </PdfText>
    </View>
  )
}
