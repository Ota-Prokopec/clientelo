// Chapter 2 of the Lead Magnet PDF: the Twin table. One group per list of Substitutes, under the ETFs it replaces struck
// out, and per UCITS ETF its ISIN, TER, distribution policy, domicile, and exchange with currency. Twins are set in
// `brand`; a closest alternative stays in `heading`, so it never looks like a Twin (docs/strategy.md#twins). The page's
// TwinTable, which a Lead unlocks, lists the same groups.
import { Fragment } from 'react'
import { View } from '@react-pdf/renderer'
import { isVerified } from '@data/figures.ts'
import { leadMagnetChapters } from '@data/leadMagnet.ts'
import { formatPercent } from '@lib/format.ts'
import { relationPresentationByRelation } from '@lib/relationPresentationByRelation.ts'
import { groupEtfsBySubstitutes, listSubstituteGroupSources } from '@lib/substitutes.ts'
import { PdfChapter } from './PdfChapter.tsx'
import { PdfDataSourceNote } from './PdfDataSourceNote.tsx'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

// One column of the table: its heading, and its width in the row.
const tableColumns = [
  { heading: 'Ticker', widthClassName: 'w-[54pt]' },
  { heading: 'ISIN', widthClassName: 'w-[80pt]' },
  { heading: 'TER ročně', widthClassName: 'w-[52pt]' },
  { heading: 'Výnosy', widthClassName: 'w-[60pt]' },
  { heading: 'Sídlo', widthClassName: 'w-[40pt]' },
  { heading: 'Burza, měna', widthClassName: 'flex-1' },
]

/**
 * Every group of Substitutes as a ruled table, with the Data Source of every row.
 *
 * ```tsx
 * <PdfTwinTableChapter />
 * // 02 Tabulka dvojčat s ISIN, burzou a měnou
 * // Dvojčata na stejný index S&P 500 místo VOO 0,03 % · IVV 0,03 % · SPY 0,0945 %  (Tickers struck)
 * // SPYL  IE000XZSV718  0,03 %  akumulační  Irsko  Xetra, EUR  …
 * ```
 */
export const PdfTwinTableChapter = () => {
  const substituteGroups = groupEtfsBySubstitutes()
  const tableSources = listSubstituteGroupSources(substituteGroups)

  return (
    <PdfChapter chapter={leadMagnetChapters.twinTable}>
      <PdfText style={pdfTw('text-body')}>
        Ticker se mezi burzami liší, ISIN ne: podle ISIN najdete správný fond v každé aplikaci. Akumulační třída
        dividendy nevyplácí, ale rovnou je investuje.
      </PdfText>
      <View>
        <View style={pdfTw('flex-row border-b border-heading pb-0.5')}>
          {tableColumns.map(({ heading, widthClassName }) => (
            <PdfText key={heading} style={pdfTw(`${widthClassName} text-note text-muted-foreground`)}>
              {heading}
            </PdfText>
          ))}
        </View>
        {substituteGroups.map(({ etfs, relation, substitutes }) => {
          const { substituteGroupLabel, colorClassName } = relationPresentationByRelation[relation]
          const [firstSubstitute] = substitutes

          return (
            <View key={etfs.map((etf) => etf.ticker).join()} style={pdfTw('pt-2')}>
              <PdfText style={pdfTw('text-label text-heading')}>
                {substituteGroupLabel} {firstSubstitute?.trackedIndex} místo{' '}
                {etfs.map((etf, etfIndex) => (
                  <Fragment key={etf.ticker}>
                    {etfIndex > 0 && ' · '}
                    <PdfText style={pdfTw('text-muted-foreground line-through decoration-signal')}>{etf.ticker}</PdfText>{' '}
                    <PdfText style={pdfTw('text-muted-foreground')}>
                      <PdfSourcedFigure sources={[etf.source]}>{formatPercent(etf.terPercent)}</PdfSourcedFigure>
                    </PdfText>
                  </Fragment>
                ))}
              </PdfText>
              {substitutes.map((ucitsEtf) => (
                <View key={ucitsEtf.ticker} style={pdfTw('flex-row items-baseline border-b border-border py-1')}>
                  <PdfText style={pdfTw(`w-[54pt] text-fact ${colorClassName}`)}>
                    <PdfSourcedFigure sources={[ucitsEtf.source]}>{ucitsEtf.ticker}</PdfSourcedFigure>
                  </PdfText>
                  <PdfText style={pdfTw('w-[80pt] text-body')}>{ucitsEtf.isin}</PdfText>
                  <PdfText style={pdfTw(`w-[52pt] text-body font-bold ${colorClassName}`)}>
                    {formatPercent(ucitsEtf.terPercent)}
                  </PdfText>
                  <PdfText style={pdfTw('w-[60pt] text-body')}>{ucitsEtf.distributionPolicy}</PdfText>
                  <PdfText style={pdfTw('w-[40pt] text-body')}>{ucitsEtf.domicile}</PdfText>
                  <PdfText style={pdfTw('flex-1 text-body')}>
                    {ucitsEtf.exchange}, {ucitsEtf.currency}
                  </PdfText>
                </View>
              ))}
            </View>
          )
        })}
      </View>
      {!tableSources.every(isVerified) && (
        <PdfText style={pdfTw('text-note text-muted-foreground')}>
          Hvězdička u tickeru platí pro celý řádek: všechny jeho údaje pocházejí ze stejného zdroje.
        </PdfText>
      )}
      <PdfDataSourceNote sources={tableSources} />
    </PdfChapter>
  )
}
