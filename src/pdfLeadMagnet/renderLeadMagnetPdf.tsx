// Renders the Lead Magnet PDF from the data module (ADR-0002). The Vite plugin in vite-plugins/pdfLeadMagnetPlugin.ts loads this
// module at build time and in `pnpm dev`, so the PDF always shows the figures the page shows.
import { renderToBuffer } from '@react-pdf/renderer'
import { PdfLeadMagnetDocument } from './PdfLeadMagnetDocument.tsx'
import { registerPdfFonts } from './registerPdfFonts.ts'

/**
 * The Lead Magnet PDF's bytes.
 *
 * ```ts
 * await renderLeadMagnetPdf() // Uint8Array starting with '%PDF-'
 * ```
 */
export const renderLeadMagnetPdf = async (): Promise<Uint8Array> => {
  registerPdfFonts()

  return renderToBuffer(<PdfLeadMagnetDocument />)
}
