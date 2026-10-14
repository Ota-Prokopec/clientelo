// Chapter 6 of the Lead Magnet PDF: one line per broker on finding a Twin. It is the first Chapter cut when the PDF
// runs over two pages (docs/strategy.md#lead-magnet), since it goes stale fastest.
import { View } from '@react-pdf/renderer'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/** One broker's line: its name, and how to find a Twin in it. */
type BrokerLine = { broker: string; howToBuy: string }

// Each line says how to find the fund, never what a broker offers or charges, which the PDF has no Data Source for.
const brokerLines: BrokerLine[] = [
  {
    broker: 'XTB',
    howToBuy: 'Vyhledejte ticker z tabulky a zkontrolujte, že burza a měna odpovídají řádku v tabulce.',
  },
  {
    broker: 'Trading 212',
    howToBuy: 'Vyhledejte ticker nebo název fondu. Zkratka „Acc“ v názvu značí akumulační třídu.',
  },
  {
    broker: 'Revolut',
    howToBuy: 'Vyhledejte ticker nebo název fondu. Když aplikace najde víc fondů, rozhodne ISIN.',
  },
  {
    broker: 'Fio e-Broker',
    howToBuy: 'Hledejte podle ISIN dvojčete. Fio vám prodá i VOO, dvojče vás ale ušetří americké dědické daně.',
  },
]

/**
 * The four brokers, each on its own ruled line.
 *
 * ```tsx
 * <PdfHowToBuyChapter /> // 06 Kde dvojče koupit… · XTB  Vyhledejte ticker z tabulky a zkontrolujte… …
 * ```
 */
export const PdfHowToBuyChapter = () => {
  return (
    <PdfChapter chapter={leadMagnetChapters.howToBuy}>
      <View>
        {brokerLines.map(({ broker, howToBuy }) => (
          <View key={broker} style={pdfTw('flex-row border-t border-border py-1')}>
            <PdfText style={pdfTw('w-[64pt] text-label text-heading')}>{broker}</PdfText>
            <PdfText style={pdfTw('flex-1 text-body')}>{howToBuy}</PdfText>
          </View>
        ))}
      </View>
    </PdfChapter>
  )
}
