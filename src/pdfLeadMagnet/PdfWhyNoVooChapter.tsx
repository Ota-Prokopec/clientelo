// Chapter 1 of the Lead Magnet PDF (docs/strategy.md#lead-magnet): PRIIPs and the KID in three sentences, then the Fio
// exception with the reason ČNB gives for it, and the rules and fund pages it rests on as its Data Sources.
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
  // The three ETFs the text names, so each one's issuer page is cited.
  const namedEtfs = [voo, findEtf('IVV'), findEtf('SPY')]
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
        , stejně jako {voo.ticker}{' '}
        <PdfSourcedFigure sources={[voo.source]}>{formatPercent(voo.terPercent)}</PdfSourcedFigure> ročně.
      </PdfText>
      <PdfText style={pdfTw('text-body text-muted-foreground')}>
        Výjimkou je Fio e-Broker: když jen provede váš pokyn a nic vám nedoporučuje, povinnost KID se na něj podle ČNB
        nevztahuje, a americká ETF u něj proto koupíte. I tam ale dvojče vychází lépe: nehrozí u něj americká dědická
        daň (kapitola 4) a akumulační třída vám nepřidá dividendy do přiznání (kapitola 3).
      </PdfText>
      <PdfDataSourceNote
        sources={[...Object.values(keyInsightSources), ...namedEtfs.map((etf) => etf.source), spyl.source]}
      />
    </PdfChapter>
  )
}
