// One Chapter of the Lead Magnet PDF on the Swiss grid (design-identity.md#layout): its number in `signal` in the left
// column, and its contents line as the heading, so the PDF reads exactly as the Lead Asks promised it.
import type { ReactNode } from 'react'
import { View } from '@react-pdf/renderer'
import type { LeadMagnetChapter } from '@data/leadMagnet.ts'
import { formatChapterNumber } from '@lib/format.ts'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'

export type PdfChapterProps = {
  chapter: LeadMagnetChapter
  children: ReactNode
}

/**
 * A Chapter under a 2 pt rule, numbered on the left.
 *
 * ```tsx
 * <PdfChapter chapter={leadMagnetChapters.whyNoVoo}>…</PdfChapter>
 * // ──────────────────────────────────────
 * // 01  Proč vám aplikace VOO neprodá
 * //     …
 * ```
 */
export const PdfChapter = ({ chapter, children }: PdfChapterProps) => {
  return (
    <View wrap={false} style={pdfTw('flex-row gap-3 border-t-2 border-heading pt-1.5')}>
      <PdfText style={pdfTw('w-6 text-label text-signal')}>{formatChapterNumber(chapter.number)}</PdfText>
      <View style={pdfTw('flex-1 gap-2')}>
        <PdfText style={pdfTw('text-title text-heading')}>{chapter.contentsLine}</PdfText>
        {children}
      </View>
    </View>
  )
}
