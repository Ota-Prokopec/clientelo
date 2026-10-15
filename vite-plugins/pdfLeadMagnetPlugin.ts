// Builds the Lead Magnet PDF from the data module (ADR-0002): renders src/pdfLeadMagnet/ through Vite's module runner.
// `vite build` emits it into dist/, and `pnpm dev` serves it, rendered again after any file changes. A render error, or
// a PDF with a page count other than the one every Lead Ask promises, fails the build.
import { PDFDocument } from 'pdf-lib'
import { runnerImport, type AliasOptions, type Plugin } from 'vite'
import { LEAD_MAGNET_PAGE_COUNT, LEAD_MAGNET_PDF_FILE_NAME, LEAD_MAGNET_PDF_PATH } from '../src/data/leadMagnetFiles.ts'

export type PdfLeadMagnetPluginProps = {
  /** The app's `resolve.alias`, which src/pdfLeadMagnet/ imports through. */
  alias: AliasOptions
}

export type BuildLeadMagnetPdfProps = PdfLeadMagnetPluginProps & {
  /** The app's root, which the module runner resolves src/pdfLeadMagnet/ from. */
  root: string
}

/** What src/pdfLeadMagnet/renderLeadMagnetPdf.tsx exports. Its JSX and aliases are outside this tsconfig, so it's named here. */
type RenderLeadMagnetPdfModule = { renderLeadMagnetPdf: () => Promise<Uint8Array> }

/**
 * Renders the PDF. Throws when its page count isn't LEAD_MAGNET_PAGE_COUNT.
 *
 * ```ts
 * await buildLeadMagnetPdf({ root, alias }) // Uint8Array, 2 pages
 * ```
 */
const buildLeadMagnetPdf = async ({ root, alias }: BuildLeadMagnetPdfProps): Promise<Uint8Array> => {
  const { module } = await runnerImport<RenderLeadMagnetPdfModule>('/src/pdfLeadMagnet/renderLeadMagnetPdf.tsx', {
    root,
    resolve: { alias },
    logLevel: 'warn',
  })
  const leadMagnetPdf = await module.renderLeadMagnetPdf()
  const pageCount = (await PDFDocument.load(leadMagnetPdf)).getPageCount()

  if (pageCount !== LEAD_MAGNET_PAGE_COUNT) {
    throw new Error(
      `The Lead Magnet PDF has ${pageCount} pages, but every Lead Ask promises ${LEAD_MAGNET_PAGE_COUNT}. ` +
        'Shorten it, cutting Chapter 6 first (docs/strategy.md#lead-magnet).',
    )
  }

  return leadMagnetPdf
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
  let root = process.cwd()

  return {
    name: 'pdf-lead-magnet',
    /** Keeps the app's root for the module runner: `vite --root` or a config elsewhere moves it off the cwd. */
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
    },
    /**
     * Serves the PDF in `pnpm dev`, built on the first request and again on the first one after any file changes. A
     * build error goes to Vite's error page.
     *
     * ```ts
     * GET /tahak-evropska-dvojcata-americkych-etf.pdf // application/pdf
     * GET /anything-else                              // passed on to Vite
     * ```
     */
    configureServer(server) {
      let leadMagnetPdf: Promise<Uint8Array> | undefined
      server.watcher.on('change', () => {
        leadMagnetPdf = undefined
      })

      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== LEAD_MAGNET_PDF_PATH) return next()

        leadMagnetPdf ??= buildLeadMagnetPdf({ root, alias })
        leadMagnetPdf.then(
          (builtPdf) => {
            response.setHeader('Content-Type', 'application/pdf')
            response.end(builtPdf)
          },
          (buildError: unknown) => {
            leadMagnetPdf = undefined
            next(buildError)
          },
        )
      })
    },
    /** Emits the PDF into dist/ beside the page. A thrown error fails `vite build`. */
    async generateBundle() {
      const builtPdf = await buildLeadMagnetPdf({ root, alias })
      this.emitFile({ type: 'asset', fileName: LEAD_MAGNET_PDF_FILE_NAME, source: builtPdf })
    },
  }
}
