// Renders a figure's Data Source and the date it was verified, so every figure on the page cites its origin.
import type { DataSource } from '@data/figures.ts'
import { formatVerification } from '@lib/format.ts'

export type DataSourceNoteProps = { sources: DataSource[] }

/**
 * Cites one or more Data Sources, each with its verification date.
 *
 * ```tsx
 * <DataSourceNote sources={[voo.source]} /> // Zdroj: Vanguard, stránka fondu VOO (ověřeno 11. 10. 2026)
 * <DataSourceNote sources={[unverified]} /> // Zdroj: … (zatím neověřeno)
 * ```
 */
export const DataSourceNote = ({ sources }: DataSourceNoteProps) => {
  return (
    <p className="text-note text-muted-foreground">
      {sources.length > 1 ? 'Zdroje: ' : 'Zdroj: '}
      {sources.map((source, sourceIndex) => (
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
