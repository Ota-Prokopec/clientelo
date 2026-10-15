// Renders a figure's Data Source and the date it was verified, so every figure on the page cites its origin.
import { listDistinctDataSources, type DataSource } from '@data/figures.ts'
import { formatVerification } from '@lib/format.ts'

export type DataSourceNoteProps = { sources: DataSource[] }

/**
 * Cites each distinct Data Source once, in the order given, with its verification date.
 *
 * ```tsx
 * <DataSourceNote sources={[voo.source]} />             // Zdroj: Vanguard, stránka fondu VOO (ověřeno 14. 10. 2026)
 * <DataSourceNote sources={[voo.source, voo.source]} /> // the same: VOO is cited once
 * <DataSourceNote sources={[unverified]} />             // Zdroj: … (zatím neověřeno)
 * ```
 */
export const DataSourceNote = ({ sources }: DataSourceNoteProps) => {
  const distinctSources = listDistinctDataSources(sources)

  return (
    <p className="text-note text-muted-foreground">
      {distinctSources.length > 1 ? 'Zdroje: ' : 'Zdroj: '}
      {distinctSources.map((source, sourceIndex) => (
        <span key={source.name}>
          {sourceIndex > 0 && '; '}
          {source.url ? (
            <a href={source.url} className="underline underline-offset-2">
              {source.name}
            </a>
          ) : (
            source.name
          )}{' '}
          ({formatVerification(source)})
        </span>
      ))}
    </p>
  )
}
