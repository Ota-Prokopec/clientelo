// The Lead Magnet's built files: where vite-plugins/pdfLeadMagnetPlugin.ts serves the PDF and its first page as an image,
// and how many pages the PDF must have. The plugin imports this module outside the app's aliases, so it imports nothing.

/** How many pages the Lead Magnet PDF has, as every Lead Ask promises. The build fails when the PDF has another count. */
export const leadMagnetPageCount = 2

/** Where the PDF is served, under the file name a Lead finds in their downloads. */
export const leadMagnetPdfPath = '/tahak-evropska-dvojcata-americkych-etf.pdf'

/** Where the PDF's first page is served as a PNG, for the thumbnail every Lead Ask shows. */
export const leadMagnetThumbnailPath = '/tahak-evropska-dvojcata-americkych-etf.png'
