// The Data Sources of a Chapter's figures, each with the date it was verified, as the page's DataSourceNote cites them.
// A source with a URL is a link, so a Lead can check the figure from the PDF.
import { Link } from '@react-pdf/renderer'
import { listDistinctDataSources, type DataSource } from '@data/figures.ts'
import { formatVerification } from '@lib/format.ts'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

export type PdfDataSourceNoteProps = { sources: DataSource[] }

/**
 * Cites each distinct Data Source once, in the order given.
 *
 * ```tsx
 * <PdfDataSourceNote sources={[voo.source, spyl.source, voo.source]} />
 * // Zdroje: Vanguard, stránka fondu VOO (ověřeno 14. 10. 2026); SPDR, stránka fondu SPYL a KID (zatím neověřeno)
 * ```
 */
export const PdfDataSourceNote = ({ sources }: PdfDataSourceNoteProps) => {
  const distinctSources = listDistinctDataSources(sources)

  return (
    <PdfText style={pdfTw('text-note text-muted-foreground')}>
      {distinctSources.length > 1 ? 'Zdroje: ' : 'Zdroj: '}
      {distinctSources.map((source, sourceIndex) => (
        <PdfText key={source.name}>
          {sourceIndex > 0 && '; '}
          {source.url ? (
            <Link src={source.url} style={pdfTw('text-muted-foreground')}>
              {source.name}
            </Link>
          ) : (
            source.name
          )}{' '}
          ({formatVerification(source)})
        </PdfText>
      ))}
    </PdfText>
  )
}
