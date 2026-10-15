// Chapter 4 of the Lead Magnet PDF: the US estate tax on a fund domiciled in the USA, and how a Twin avoids it.
import { usEstateTaxThreshold } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { formatAmount } from '@lib/format.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/**
 * Why a US-domiciled fund is riskier for a Czech investor, with the threshold from the data module.
 *
 * ```tsx
 * <PdfUsEstateTaxChapter /> // 04 Americká dědická daň a jak se jí vyhnout · Fond z USA je pro vás americký majetek. …
 * ```
 */
export const PdfUsEstateTaxChapter = () => {
  return (
    <PdfChapter chapter={leadMagnetChapters.usEstateTax}>
      <PdfText style={pdfTw('text-body')}>
        Fond z USA je pro vás americký majetek. Kdybyste zemřeli s americkými fondy nebo akciemi v hodnotě nad{' '}
        <PdfText style={pdfTw('font-bold text-signal')}>
          <PdfSourcedFigure sources={[usEstateTaxThreshold.source]}>
            {formatAmount(usEstateTaxThreshold.value, usEstateTaxThreshold.unit)}
          </PdfSourcedFigure>
        </PdfText>
        , vaši dědicové by z nich mohli platit americkou dědickou daň. Fond se sídlem v Irsku americkým majetkem není,
        takže se ho tato daň netýká.{' '}
        <PdfText style={pdfTw('font-bold text-brand')}>
          Jak se jí vyhnout: držte dvojče místo amerického originálu.
        </PdfText>
      </PdfText>
      <PdfDataSourceNote sources={[usEstateTaxThreshold.source]} />
    </PdfChapter>
  )
}
