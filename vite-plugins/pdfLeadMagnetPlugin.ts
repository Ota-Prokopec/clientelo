// Builds the Lead Magnet PDF from the data module (ADR-0002): renders src/pdfLeadMagnet/ through Vite's module runner.
// `vite build` emits it into dist/, and `pnpm dev` serves it, rendered again after any file changes. A render error, or
// a PDF with a page count other than the one every Lead Ask promises, fails the build.
import { PDFDocument } from 'pdf-lib'
import type { AliasOptions, Plugin } from 'vite'
import { LEAD_MAGNET_PAGE_COUNT, LEAD_MAGNET_PDF_FILE_NAME, LEAD_MAGNET_PDF_PATH } from '../src/data/leadMagnetFiles.ts'
import { createBuildTimeAssetPlugin } from './buildTimeAssetPlugin.ts'

export type PdfLeadMagnetPluginProps = {
  /** The app's `resolve.alias`, which src/pdfLeadMagnet/ imports through. */
  alias: AliasOptions
}

/** What src/pdfLeadMagnet/renderLeadMagnetPdf.tsx exports. Its JSX and aliases are outside this tsconfig, so it's named here. */
type RenderLeadMagnetPdfModule = { renderLeadMagnetPdf: () => Promise<Uint8Array> }

/**
 * Throws when the PDF's page count isn't LEAD_MAGNET_PAGE_COUNT, the count every Lead Ask promises.
 *
 * ```ts
 * await checkLeadMagnetPageCount(twoPagePdf)   // passes
 * await checkLeadMagnetPageCount(threePagePdf) // throws: The Lead Magnet PDF has 3 pages, but every Lead Ask promises 2…
 * ```
 */
export const checkLeadMagnetPageCount = async (leadMagnetPdf: Uint8Array): Promise<void> => {
  const pageCount = (await PDFDocument.load(leadMagnetPdf)).getPageCount()
  if (pageCount !== LEAD_MAGNET_PAGE_COUNT) {
    throw new Error(
      `The Lead Magnet PDF has ${pageCount} pages, but every Lead Ask promises ${LEAD_MAGNET_PAGE_COUNT}. ` +
        'Shorten it, cutting Chapter 6 first (docs/strategy.md#lead-magnet).',
    )
  }
}

/**
 * The Vite plugin that builds the Lead Magnet PDF into dist/ and serves it in `pnpm dev`.
 *
 * ```ts
 * defineConfig({ plugins: [pdfLeadMagnetPlugin({ alias })] })
 * // dist/tahak-evropska-dvojcata-americkych-etf.pdf
 * ```
 */
export const pdfLeadMagnetPlugin = ({ alias }: PdfLeadMagnetPluginProps): Plugin => {
  return createBuildTimeAssetPlugin<RenderLeadMagnetPdfModule>({
    name: 'pdf-lead-magnet',
    alias,
    rendererModulePath: '/src/pdfLeadMagnet/renderLeadMagnetPdf.tsx',
    renderAsset: (rendererModule) => rendererModule.renderLeadMagnetPdf(),
    checkAsset: checkLeadMagnetPageCount,
    fileName: LEAD_MAGNET_PDF_FILE_NAME,
    servedPath: LEAD_MAGNET_PDF_PATH,
    contentType: 'application/pdf',
  })
}
