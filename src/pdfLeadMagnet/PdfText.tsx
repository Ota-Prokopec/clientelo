// react-pdf's Text, never broken inside a word. Its English hyphenation splits Czech words, and textkit treats a font
// switch as a place to hyphenate: "nejvýš" became "nejvý-š", because "š" comes from the latin-ext fallback
// (registerPdfFonts.ts). The Lead Magnet PDF uses only this Text, which .oxlintrc.json enforces.
import type { ComponentProps } from 'react'
import { Text as ReactPdfText } from '@react-pdf/renderer'

export type PdfTextProps = ComponentProps<typeof ReactPdfText>

// textkit's "infinity": its line breaker never takes a break with this penalty.
const FORBIDDEN_BREAK_PENALTY = 10_000

/**
 * A react-pdf Text whose lines break only between words.
 *
 * ```tsx
 * <PdfText style={pdfTw('text-body')}>… nejvýš za 100 000 Kč …</PdfText> // wraps before "nejvýš", never inside it
 * ```
 */
export const PdfText = (props: PdfTextProps) => {
  return <ReactPdfText hyphenationPenalty={FORBIDDEN_BREAK_PENALTY} {...props} />
}
