// Builds the Lead Magnet PDF and its thumbnail from the data module (ADR-0002): renders src/pdfLeadMagnet/ through Vite's
// module runner, then draws the PDF's first page as the image every Lead Ask shows, so the preview always matches the
// file. `vite build` emits both into dist/, and `pnpm dev` serves them, rendered again after any file changes. A render
// error, or a PDF with a page count other than the one every Lead Ask promises, fails the build.
import { pdf } from 'pdf-to-img'
import { runnerImport, type AliasOptions, type Plugin } from 'vite'
import { leadMagnetPageCount, leadMagnetPdfPath, leadMagnetThumbnailPath } from '../src/data/leadMagnetFiles.ts'

export type PdfLeadMagnetPluginArgs = {
  /** The app's `resolve.alias`, which src/pdfLeadMagnet/ imports through. */
  alias: AliasOptions
}

export type BuildLeadMagnetFilesArgs = PdfLeadMagnetPluginArgs & {
  /** The app's root, which the module runner resolves src/pdfLeadMagnet/ from. */
  root: string
}

/** The two files the plugin builds: the PDF, and its first page as a PNG. */
type LeadMagnetFiles = { pdf: Uint8Array; thumbnail: Uint8Array }

/** What src/pdfLeadMagnet/renderLeadMagnetPdf.tsx exports. Its JSX and aliases are outside this tsconfig, so it's named here. */
type RenderLeadMagnetPdfModule = { renderLeadMagnetPdf: () => Promise<Uint8Array> }

// A Lead Ask shows the thumbnail 96 CSS px wide. Half of A4's 595 pt is 298 px: three device pixels for each.
const thumbnailScale = 0.5

/**
 * Renders the PDF and draws its first page. Throws when the PDF's page count isn't leadMagnetPageCount.
 *
 * ```ts
 * await buildLeadMagnetFiles({ root, alias }) // { pdf: <2 pages>, thumbnail: <PNG, 298 × 421> }
 * ```
 */
const buildLeadMagnetFiles = async ({ root, alias }: BuildLeadMagnetFilesArgs): Promise<LeadMagnetFiles> => {
  const { module } = await runnerImport<RenderLeadMagnetPdfModule>('/src/pdfLeadMagnet/renderLeadMagnetPdf.tsx', {
    root,
    resolve: { alias },
    logLevel: 'warn',
  })
  const leadMagnetPdf = await module.renderLeadMagnetPdf()
  // pdfjs may take over the bytes it's given, so it gets a copy and the PDF stays whole for the build.
  const renderedPdf = await pdf(Buffer.from(leadMagnetPdf), { scale: thumbnailScale })

  try {
    if (renderedPdf.length !== leadMagnetPageCount) {
      throw new Error(
        `The Lead Magnet PDF has ${renderedPdf.length} pages, but every Lead Ask promises ${leadMagnetPageCount}. ` +
          'Shorten it, cutting Chapter 6 first (docs/strategy.md#lead-magnet).',
      )
    }

    return { pdf: leadMagnetPdf, thumbnail: await renderedPdf.getPage(1) }
  } finally {
    await renderedPdf.destroy()
  }
}

/**
 * The Vite plugin that builds the Lead Magnet's files into dist/ and serves them in `pnpm dev`.
 *
 * ```ts
 * defineConfig({ plugins: [pdfLeadMagnetPlugin({ alias })] })
 * // dist/tahak-evropska-dvojcata-americkych-etf.pdf and .png
 * ```
 */
export const pdfLeadMagnetPlugin = ({ alias }: PdfLeadMagnetPluginArgs): Plugin => {
  let root = process.cwd()

  return {
    name: 'pdf-lead-magnet',
    /** Keeps the app's root for the module runner: `vite --root` or a config elsewhere moves it off the cwd. */
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
    },
    /**
     * Serves the PDF and the thumbnail in `pnpm dev`, built on the first request and again on the first one after any
     * file changes. A build error goes to Vite's error page.
     *
     * ```ts
     * GET /tahak-evropska-dvojcata-americkych-etf.pdf // application/pdf
     * GET /tahak-evropska-dvojcata-americkych-etf.png // image/png
     * GET /anything-else                              // passed on to Vite
     * ```
     */
    configureServer(server) {
      let leadMagnetFiles: Promise<LeadMagnetFiles> | undefined
      server.watcher.on('change', () => {
        leadMagnetFiles = undefined
      })

      server.middlewares.use((request, response, next) => {
        const requestPath = request.url?.split('?')[0]
        if (requestPath !== leadMagnetPdfPath && requestPath !== leadMagnetThumbnailPath) return next()

        leadMagnetFiles ??= buildLeadMagnetFiles({ root, alias })
        leadMagnetFiles.then(
          (builtFiles) => {
            const isPdf = requestPath === leadMagnetPdfPath
            response.setHeader('Content-Type', isPdf ? 'application/pdf' : 'image/png')
            response.end(isPdf ? builtFiles.pdf : builtFiles.thumbnail)
          },
          (buildError: unknown) => {
            leadMagnetFiles = undefined
            next(buildError)
          },
        )
      })
    },
    /** Emits the PDF and the thumbnail into dist/ beside the page. A thrown error fails `vite build`. */
    async generateBundle() {
      const builtFiles = await buildLeadMagnetFiles({ root, alias })
      this.emitFile({ type: 'asset', fileName: leadMagnetPdfPath.slice(1), source: builtFiles.pdf })
      this.emitFile({ type: 'asset', fileName: leadMagnetThumbnailPath.slice(1), source: builtFiles.thumbnail })
    },
  }
}
