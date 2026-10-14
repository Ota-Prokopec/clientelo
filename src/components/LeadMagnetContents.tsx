// The Lead Magnet's contents list, each Chapter's line under a rule and beside its number in the PDF, so a Lead Ask
// shows what the Visitor gets before they type. It sits on a Lead Ask's band and takes the band's text colour.
import type { LeadMagnetChapter } from '@data/leadMagnet.ts'
import { formatChapterNumber } from '@lib/format.ts'

export type LeadMagnetContentsProps = { chapters: LeadMagnetChapter[] }

/**
 * Lists the given Chapters, numbered as the PDF numbers them.
 *
 * ```tsx
 * <LeadMagnetContents chapters={[leadMagnetChapters.twinTable, leadMagnetChapters.czechTaxes]} />
 * // 02 Tabulka dvojčat s ISIN, burzou a měnou
 * // 03 Daně v Česku: časový test a dividendy
 * ```
 */
export const LeadMagnetContents = ({ chapters }: LeadMagnetContentsProps) => {
  return (
    <ol className="grid content-start gap-2">
      {chapters.map((chapter) => (
        <li
          key={chapter.number}
          value={chapter.number}
          className="grid grid-cols-[1.75rem_1fr] border-t-2 border-block-foreground/40 pt-1 text-contents"
        >
          <span>{formatChapterNumber(chapter.number)}</span>
          <span>{chapter.contentsLine}</span>
        </li>
      ))}
    </ol>
  )
}
