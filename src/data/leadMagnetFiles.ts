// The Lead Magnet PDF's built file: where vite-plugins/pdfLeadMagnetPlugin.ts serves it, and how many pages it must
// have. The plugin imports this module outside the app's aliases, so it imports nothing.

/** How many pages the Lead Magnet PDF has, as every Lead Ask promises. The build fails when the PDF has another count. */
export const LEAD_MAGNET_PAGE_COUNT = 2

/** The file name a Lead finds in their downloads. */
export const LEAD_MAGNET_PDF_FILE_NAME = 'tahak-evropska-dvojcata-americkych-etf.pdf'

/** Where the PDF is served, under its file name. */
export const LEAD_MAGNET_PDF_PATH = `/${LEAD_MAGNET_PDF_FILE_NAME}`
