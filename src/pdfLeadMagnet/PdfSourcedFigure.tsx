// A figure in the Lead Magnet PDF, marked with an asterisk while any Data Source it comes from is unverified. The header
// explains the asterisk, and step 4's verification removes both from the next build.
import type { ReactNode } from 'react'
import { isVerified, type DataSource } from '@data/figures.ts'
import { PdfText } from './PdfText.tsx'

export type PdfSourcedFigureProps = {
  /** Every Data Source the figure comes from: one for a figure from the data module, more for one computed from several. */
  sources: DataSource[]
  children: ReactNode
}

/** The marker an unverified figure carries, which the PDF's header explains. */
export const UNVERIFIED_MARKER = '*'

/**
 * The figure as given, with the marker unless every Data Source it comes from is verified. It takes the surrounding
 * text's style.
 *
 * ```tsx
 * <PdfSourcedFigure sources={[{ name: 'SPDR', url: null, verifiedOn: null }]}>0,03 %</PdfSourcedFigure>          // 0,03 %*
 * <PdfSourcedFigure sources={[{ name: 'SPDR', url: '…', verifiedOn: '2026-10-11' }]}>0,03 %</PdfSourcedFigure> // 0,03 %
 * ```
 */
export const PdfSourcedFigure = ({ sources, children }: PdfSourcedFigureProps) => {
  return (
    <PdfText>
      {children}
      {sources.every(isVerified) ? '' : UNVERIFIED_MARKER}
    </PdfText>
  )
}
