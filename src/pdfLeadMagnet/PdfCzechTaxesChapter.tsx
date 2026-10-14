// Chapter 3 of the Lead Magnet PDF: Czech taxes on a fund, as a ruled fact grid (design-identity.md#layout). The
// holding-period test, the 100 000 Kč yearly exemption, the cap on exempt income, and dividends against an accumulating
// Twin, read from the same module as the content a Lead unlocks on the page.
import { View } from '@react-pdf/renderer'
import { czechTaxFacts, czechTaxSources } from '@data/czechTaxFacts.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/**
 * The four tax rules a Czech holder of a Twin needs, two to a row.
 *
 * ```tsx
 * <PdfCzechTaxesChapter />
 * // 03 Daně v Česku: časový test a dividendy
 * // Časový test: více než 3 roky*          Malé prodeje: do 100 000 Kč ročně*
 * // Strop osvobození: 40 000 000 Kč ročně* Dividendy: akumulační dvojče
 * ```
 */
export const PdfCzechTaxesChapter = () => {
  return (
    <PdfChapter chapter={leadMagnetChapters.czechTaxes}>
      <View style={pdfTw('flex-row flex-wrap gap-x-4 gap-y-2.5')}>
        {czechTaxFacts.map(({ label, figure, explanation, source }) => (
          <View key={label} style={pdfTw('w-[47%] gap-0.5 border-t border-heading pt-1')}>
            <PdfText style={pdfTw('text-note text-muted-foreground')}>{label}</PdfText>
            <PdfText style={pdfTw('text-fact text-heading')}>
              {source ? <PdfSourcedFigure sources={[source]}>{figure}</PdfSourcedFigure> : figure}
            </PdfText>
            <PdfText style={pdfTw('text-body')}>{explanation}</PdfText>
          </View>
        ))}
      </View>
      <PdfDataSourceNote sources={czechTaxSources} />
    </PdfChapter>
  )
}
