// The Lead Magnet PDF (docs/strategy.md#lead-magnet): two A4 pages in Czech, in the design identity's light palette,
// type and Swiss grid. Chapters 1 and 2 fill page 1, and 3 to 6 page 2. Every figure comes from the data module with
// its Data Source, so the PDF can't disagree with the page (ADR-0002).
import { Document, Page, View } from '@react-pdf/renderer'
import { isVerified, listDataSources } from '@data/figures.ts'
import { LEAD_MAGNET_TITLE } from '@data/leadMagnet.ts'
import { feeCalculatorPrefill } from '@lib/feeCalculatorPrefill.ts'
import { formatYears } from '@lib/format.ts'
import { PdfBankFundVsEtfChapter } from './PdfBankFundVsEtfChapter.tsx'
import { PdfCzechTaxesChapter } from './PdfCzechTaxesChapter.tsx'
import { PdfHowToBuyChapter } from './PdfHowToBuyChapter.tsx'
import { PdfPageFooter } from './PdfPageFooter.tsx'
import { pdfFontFamilyNames } from './registerPdfFonts.ts'
import { UNVERIFIED_MARKER } from './PdfSourcedFigure.tsx'
import { PdfTwinTableChapter } from './PdfTwinTableChapter.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'
import { PdfUsEstateTaxChapter } from './PdfUsEstateTaxChapter.tsx'
import { PdfWhyNoVooChapter } from './PdfWhyNoVooChapter.tsx'

// The subtitle carries both Ad Promises, so each Ad Variant can quote its half (docs/strategy.md#lead-magnet).
const leadMagnetSubtitle = `Co koupit místo VOO, co stojí poplatek bankovního fondu za ${formatYears(feeCalculatorPrefill.years)} a jak na daně v Česku`

// A page's base: the light palette, and the family list that falls back to latin-ext for Czech letters, the one
// style pdfTw() can't set (tw.ts). The bottom padding keeps the text clear of the PdfPageFooter.
const pageStyle = [pdfTw('gap-4 bg-background px-12 pt-10 pb-16 text-foreground'), { fontFamily: pdfFontFamilyNames }]

/**
 * The whole PDF, for renderLeadMagnetPdf() to render.
 *
 * ```tsx
 * <PdfLeadMagnetDocument />
 * // page 1: title, subtitle, 01 Proč vám aplikace VOO neprodá, 02 Tabulka dvojčat…
 * // page 2: 03 Daně v Česku…, 04 Americká dědická daň…, 05 Bankovní fond vs. ETF…, 06 Kde dvojče koupit…
 * ```
 */
export const PdfLeadMagnetDocument = () => {
  const hasUnverifiedFigure = !listDataSources().every(isVerified)

  return (
    <Document title={LEAD_MAGNET_TITLE} subject={leadMagnetSubtitle} language="cs">
      <Page size="A4" style={pageStyle}>
        <View style={pdfTw('gap-2 pb-2')}>
          <PdfText style={pdfTw('text-headline text-heading')}>{LEAD_MAGNET_TITLE}</PdfText>
          <PdfText style={pdfTw('text-fact text-heading')}>{leadMagnetSubtitle}</PdfText>
          {hasUnverifiedFigure && (
            <PdfText style={pdfTw('text-label text-heading')}>
              Pracovní verze: údaje označené {UNVERIFIED_MARKER} zatím čekají na ověření u zdroje.
            </PdfText>
          )}
        </View>
        <PdfWhyNoVooChapter />
        <PdfTwinTableChapter />
        <PdfPageFooter pageNumber={1} />
      </Page>
      <Page size="A4" style={pageStyle}>
        <PdfCzechTaxesChapter />
        <PdfUsEstateTaxChapter />
        <PdfBankFundVsEtfChapter />
        <PdfHowToBuyChapter />
        <PdfPageFooter pageNumber={2} />
      </Page>
    </Document>
  )
}
