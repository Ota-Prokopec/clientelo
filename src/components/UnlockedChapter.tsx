// One Chapter of the Lead Magnet unlocked on the page for a Lead, below Section 04's band. It is framed like a Section
// (design-identity.md#layout): a 2 px rule, the Chapter's number in `signal` on the grid's 3 rem left column, then its
// contents line as the heading, so it reads as the Chapter the Lead Asks listed.
import type { ReactNode } from 'react'
import type { LeadMagnetChapter } from '@data/leadMagnet.ts'
import { formatChapterNumber } from '@lib/format.ts'
import { NumberedLabel } from './NumberedLabel.tsx'

export type UnlockedChapterArgs = {
  chapter: LeadMagnetChapter
  children: ReactNode
}

/**
 * A Chapter under its rule and number, then its content.
 *
 * ```tsx
 * <UnlockedChapter chapter={leadMagnetChapters.twinTable}><TwinTable /></UnlockedChapter>
 * // 02 Odemčeno z taháku
 * // <h3>Tabulka dvojčat s ISIN, burzou a měnou</h3> …
 * ```
 */
export const UnlockedChapter = ({ chapter, children }: UnlockedChapterArgs) => {
  return (
    <div className="grid gap-4">
      <NumberedLabel number={formatChapterNumber(chapter.number)} label="Odemčeno z taháku" />
      <h3 className="text-title text-heading">{chapter.contentsLine}</h3>
      {children}
    </div>
  )
}
