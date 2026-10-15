// Chapter 6 of the Lead Magnet PDF: one line per broker on what it sells and how to find a Twin in it, each cited to
// the broker's own statement. It is the first Chapter cut when the PDF runs over two pages
// (docs/strategy.md#lead-magnet), since it goes stale fastest.
import { View } from '@react-pdf/renderer'
import { keyInsightSources, usEstateTaxThreshold, type DataSource } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/** One broker's line: its name, what it sells and how to find a Twin in it, and the Data Sources the line rests on. */
type BrokerLine = { broker: string; howToBuy: string; sources: DataSource[] }

// Each line states only what the broker itself says it sells, never what it charges, which the PDF has no Data Source
// for.
const brokerLines: BrokerLine[] = [
  {
    broker: 'XTB',
    howToBuy: 'Americká ETF nenabízí, chybí k nim KID. Dvojče hledejte podle tickeru a ohlídejte si burzu a měnu.',
    sources: [keyInsightSources.xtbHelpCentre],
  },
  {
    broker: 'Trading 212',
    howToBuy: 'Americká ETF bez souladu s pravidly PRIIPs nenabízí. Dvojče hledejte podle tickeru nebo názvu.',
    sources: [keyInsightSources.trading212Community],
  },
  {
    broker: 'Revolut',
    howToBuy: 'Nabízí jen ETF registrovaná v EU. Dvojče hledejte podle tickeru nebo názvu.',
    sources: [keyInsightSources.revolutHelpCentre],
  },
  {
    broker: 'Fio e-Broker',
    howToBuy: 'Dovolí obchodovat i s americkými ETF. Dvojče vás ale ušetří americké dědické daně (kapitola 4).',
    sources: [keyInsightSources.fioEtfPage, usEstateTaxThreshold.source],
  },
]

/**
 * The ISIN check every broker shares, then the four brokers, each on its own ruled line.
 *
 * ```tsx
 * <PdfHowToBuyChapter /> // 06 Kde dvojče koupit… · Ticker se mezi burzami liší… · XTB  Americká ETF nenabízí… …
 * ```
 */
export const PdfHowToBuyChapter = () => {
  return (
    <PdfChapter chapter={leadMagnetChapters.howToBuy}>
      <PdfText style={pdfTw('text-body')}>
        Ticker se mezi burzami liší, ISIN ne. Než nákup potvrdíte, porovnejte ISIN fondu s tabulkou v kapitole 2.
      </PdfText>
      <View>
        {brokerLines.map(({ broker, howToBuy }) => (
          <View key={broker} style={pdfTw('flex-row border-t border-border py-1')}>
            <PdfText style={pdfTw('w-[64pt] text-label text-heading')}>{broker}</PdfText>
            <PdfText style={pdfTw('flex-1 text-body')}>{howToBuy}</PdfText>
          </View>
        ))}
      </View>
      <PdfDataSourceNote sources={brokerLines.flatMap((brokerLine) => brokerLine.sources)} />
    </PdfChapter>
  )
}
