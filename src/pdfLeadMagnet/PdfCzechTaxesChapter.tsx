// Chapter 3 of the Lead Magnet PDF: Czech taxes on a fund, as a ruled fact grid (design-identity.md#layout). The
// holding-period test, the 100 000 Kč yearly exemption, the cap on exempt income, and dividends against an accumulating
// Twin, each figure from the data module.
import { View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import { czechTaxFigures } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { formatAmount, formatYears } from '@lib/format.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/** One rule of the Czech tax grid: what it is, its figure, and what it means for the Lead. */
type TaxFact = { label: string; figure: ReactNode; explanation: string }

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
  const { holdingPeriodExemption, yearlyIncomeExemption, exemptIncomeCap } = czechTaxFigures
  const holdingPeriod = formatYears(holdingPeriodExemption.value)
  const yearlyIncome = formatAmount(yearlyIncomeExemption.value, yearlyIncomeExemption.unit)
  const exemptIncome = formatAmount(exemptIncomeCap.value, exemptIncomeCap.unit)

  const taxFacts: TaxFact[] = [
    {
      label: 'Časový test',
      figure: <PdfSourcedFigure sources={[holdingPeriodExemption.source]}>více než {holdingPeriod}</PdfSourcedFigure>,
      explanation: `Držíte-li fond déle než ${holdingPeriod}, příjem z jeho prodeje je od daně osvobozený.`,
    },
    {
      label: 'Malé prodeje',
      figure: <PdfSourcedFigure sources={[yearlyIncomeExemption.source]}>do {yearlyIncome} ročně</PdfSourcedFigure>,
      explanation: `Když za rok prodáte cenné papíry celkem nejvýš za ${yearlyIncome}, příjem je osvobozený i bez časového testu.`,
    },
    {
      label: 'Strop osvobození',
      figure: <PdfSourcedFigure sources={[exemptIncomeCap.source]}>{exemptIncome} ročně</PdfSourcedFigure>,
      explanation: `Časový test osvobodí příjem z prodeje nejvýš ${exemptIncome} za rok. Co je nad tuto hranici, zdaníte.`,
    },
    {
      label: 'Dividendy',
      figure: 'akumulační dvojče',
      explanation:
        'Distribuční fond vyplácí dividendy a ty patří každý rok do přiznání. Akumulační dvojče je rovnou investuje, takže dividendy k přiznání nemáte.',
    },
  ]

  return (
    <PdfChapter chapter={leadMagnetChapters.czechTaxes}>
      <View style={pdfTw('flex-row flex-wrap gap-x-4 gap-y-2.5')}>
        {taxFacts.map(({ label, figure, explanation }) => (
          <View key={label} style={pdfTw('w-[47%] gap-0.5 border-t border-heading pt-1')}>
            <PdfText style={pdfTw('text-note text-muted-foreground')}>{label}</PdfText>
            <PdfText style={pdfTw('text-fact text-heading')}>{figure}</PdfText>
            <PdfText style={pdfTw('text-body')}>{explanation}</PdfText>
          </View>
        ))}
      </View>
      <PdfDataSourceNote sources={Object.values(czechTaxFigures).map((figure) => figure.source)} />
    </PdfChapter>
  )
}
