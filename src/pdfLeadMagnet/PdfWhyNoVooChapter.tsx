// Chapter 1 of the Lead Magnet PDF (docs/strategy.md#lead-magnet): PRIIPs and the KID in three sentences, then the Fio
// and Patria exception with the reason ČNB gives for it, and the rules it rests on as its Data Sources.
import { findEtf, findUcitsEtf, keyInsightSources } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { formatPercent } from '@lib/format.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

/**
 * Why the Lead's app won't sell them VOO, and why its Twin is no worse.
 *
 * ```tsx
 * <PdfWhyNoVooChapter /> // 01 Proč vám aplikace VOO neprodá · Pravidla EU (nařízení PRIIPs) …
 * ```
 */
export const PdfWhyNoVooChapter = () => {
  const voo = findEtf('VOO')
  const spyl = findUcitsEtf('SPYL')

  return (
    <PdfChapter chapter={leadMagnetChapters.whyNoVoo}>
      <PdfText style={pdfTw('text-body')}>
        Pravidla EU (nařízení PRIIPs) dovolují nabídnout fond drobnému investorovi, jen když k němu existuje sdělení
        klíčových informací, dokument KID. Američtí emitenti jako Vanguard, iShares nebo SPDR ho k fondům z USA
        nevydávají. XTB, Trading 212 ani Revolut vám proto VOO, IVV ani SPY neprodají.
      </PdfText>
      <PdfText style={pdfTw('text-body')}>
        Každý z nich má ale evropské dvojče: fond se sídlem v Irsku, který sleduje stejný index. Často za stejný
        poplatek:{' '}
        <PdfText style={pdfTw('font-bold text-brand')}>
          {spyl.ticker} <PdfSourcedFigure sources={[spyl.source]}>{formatPercent(spyl.terPercent)}</PdfSourcedFigure>
        </PdfText>
        , stejně jako {voo.ticker} <PdfSourcedFigure sources={[voo.source]}>{formatPercent(voo.terPercent)}</PdfSourcedFigure>{' '}
        ročně.
      </PdfText>
      <PdfText style={pdfTw('text-body text-muted-foreground')}>
        Výjimkou jsou Fio e-Broker a Patria: když jen provedou váš pokyn a nic vám nedoporučují, povinnost KID se na ně
        podle ČNB nevztahuje, a americká ETF proto prodávají. I u nich ale dvojče vychází lépe: nehrozí u něj americká
        dědická daň (kapitola 4) a akumulační třída vám nepřidá dividendy do přiznání (kapitola 3).
      </PdfText>
      <PdfDataSourceNote sources={[...Object.values(keyInsightSources), spyl.source, voo.source]} />
    </PdfChapter>
  )
}
