// Renders a figure's Data Source and the date it was verified, so every figure on the page cites its origin.
import type { DataSource } from '../data/figures.ts'
import { formatIsoDate } from '../format.ts'
import styles from './DataSourceNote.module.css'

export type DataSourceNoteArgs = { sources: DataSource[] }

/**
 * Cites one or more Data Sources, each with its verification date.
 *
 * ```tsx
 * <DataSourceNote sources={[voo.source]} /> // Zdroj: Vanguard, stránka fondu VOO (ověřeno 11. 10. 2026)
 * <DataSourceNote sources={[unverified]} /> // Zdroj: … (zatím neověřeno)
 * ```
 */
export function DataSourceNote({ sources }: DataSourceNoteArgs) {
  return (
    <p className={styles.note}>
      {sources.length > 1 ? 'Zdroje: ' : 'Zdroj: '}
      {sources.map((source, sourceIndex) => (
        <span key={source.name}>
          {sourceIndex > 0 && '; '}
          {source.url ? <a href={source.url}>{source.name}</a> : source.name}{' '}
          ({source.verifiedOn ? `ověřeno ${formatIsoDate(source.verifiedOn)}` : 'zatím neověřeno'})
        </span>
      ))}
    </p>
  )
}
