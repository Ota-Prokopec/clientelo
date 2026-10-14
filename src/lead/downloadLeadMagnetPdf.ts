// Starts the Lead Magnet PDF's download the moment a Visitor becomes a Lead. A browser may refuse a download that no tap
// started directly, as Safari on iOS can, so Delivery always shows the same file as a visible link too.
import { leadMagnetPdfPath } from '@data/leadMagnetFiles.ts'

/**
 * Downloads the PDF under its own file name, through a link clicked for the Lead.
 *
 * ```ts
 * downloadLeadMagnetPdf() // the browser saves tahak-evropska-dvojcata-americkych-etf.pdf
 * ```
 */
export const downloadLeadMagnetPdf = (): void => {
  const downloadLink = document.createElement('a')
  downloadLink.href = leadMagnetPdfPath
  // An empty `download` keeps the file name from the path.
  downloadLink.download = ''
  // Added to the document for the click, which some browsers ignore on a link outside it.
  document.body.append(downloadLink)
  downloadLink.click()
  downloadLink.remove()
}
