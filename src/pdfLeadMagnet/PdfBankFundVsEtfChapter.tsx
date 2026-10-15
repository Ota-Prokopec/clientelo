// Chapter 5 of the Lead Magnet PDF, the Bank-Fund Saver's reason to download: what the Bank Fund's TER costs against a
// Twin's, in Kč, for the amount and years the Fee Calculator opens with. The same math as the page (src/lib/terCost.ts),
// so the PDF and the Fee Calculator never disagree.
import { View } from '@react-pdf/renderer'
import { csobAkciovy, findUcitsEtf, typicalBankEquityFundTer } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { feeCalculatorPrefill } from '@lib/feeCalculatorPrefill.ts'
import { formatAmount, formatPercent, formatYears } from '@lib/format.ts'
import { calculateTerCost } from '@lib/terCost.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfRemainingAmountRow } from './PdfRemainingAmountRow.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/**
 * The Kč difference set large in `signal`, the two funds' bars, and how it's counted.
 *
 * ```tsx
 * <PdfBankFundVsEtfChapter />
 * // 05 Bankovní fond vs. ETF za 20 let v korunách
 * // 100 000 Kč jednorázově na 20 let. ČSOB Akciový vám nechá o 40 236 Kč méně než dvojče SPYL, i bez růstu trhu.
 * ```
 */
export const PdfBankFundVsEtfChapter = () => {
  const { amountKc, years, twinTicker } = feeCalculatorPrefill
  const twin = findUcitsEtf(twinTicker)
  const { bankFundAmountKc, twinAmountKc, differenceKc, bankFundToTwinRatio } = calculateTerCost({
    amountKc,
    years,
    bankFundTerPercent: csobAkciovy.terPercent,
    twinTerPercent: twin.terPercent,
  })

  // The difference and the share are counted from both TERs, so they carry both Data Sources.
  const terSources = [csobAkciovy.source, twin.source]

  return (
    <PdfChapter chapter={leadMagnetChapters.bankFundVsEtf}>
      <View style={pdfTw('flex-row items-end gap-3')}>
        <View style={pdfTw('w-[42%] gap-1')}>
          <PdfText style={pdfTw('text-body')}>
            {formatAmount(amountKc, 'Kč')} jednorázově na {formatYears(years)}. {csobAkciovy.name} vám nechá o
          </PdfText>
          <PdfText style={pdfTw('text-difference text-signal')}>
            <PdfSourcedFigure sources={terSources}>{formatAmount(differenceKc, 'Kč')}</PdfSourcedFigure>
          </PdfText>
          <PdfText style={pdfTw('text-body')}>méně než dvojče {twin.ticker}, i bez růstu trhu.</PdfText>
        </View>
        <View style={pdfTw('flex-1 gap-1.5')}>
          <PdfRemainingAmountRow
            name={twin.ticker}
            terLabel={formatPercent(twin.terPercent)}
            terSource={twin.source}
            amountKc={twinAmountKc}
            shareOfTwinAmount={1}
            fundKind="twin"
          />
          <PdfRemainingAmountRow
            name={csobAkciovy.name}
            terLabel={formatPercent(csobAkciovy.terPercent)}
            terSource={csobAkciovy.source}
            amountKc={bankFundAmountKc}
            shareOfTwinAmount={bankFundToTwinRatio}
            fundKind="bank-fund"
          />
        </View>
      </View>
      <PdfText style={pdfTw('text-body')}>
        Každý fond si každý rok strhne svůj poplatek (TER) z celé částky. Z každých 100 Kč, které vám za{' '}
        {formatYears(years)} nechá dvojče, vám tak bankovní fond nechá jen{' '}
        <PdfSourcedFigure sources={terSources}>{formatAmount(bankFundToTwinRatio * 100, 'Kč')}</PdfSourcedFigure>. Trh
        se u obou vyvíjí stejně, a když roste, je rozdíl v korunách ještě větší. Akciové fondy bank si obvykle strhávají
        kolem{' '}
        <PdfSourcedFigure sources={typicalBankEquityFundTer.sources}>
          {formatPercent(typicalBankEquityFundTer.value)}
        </PdfSourcedFigure>{' '}
        ročně.
      </PdfText>
      <PdfDataSourceNote sources={[...terSources, ...typicalBankEquityFundTer.sources]} />
    </PdfChapter>
  )
}
