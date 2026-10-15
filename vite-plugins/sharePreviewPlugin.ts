// Builds the Share Preview: renders the Share Image from src/shareImage/ through Vite's module runner, the way the Lead
// Magnet PDF is built (ADR-0002), and writes the production origin into index.html's Open Graph tags, which crawlers
// need as absolute URLs. `vite build` emits the image into dist/, and `pnpm dev` serves it, rendered again after any
// file changes. A render error, or an image too large for WhatsApp, fails the build.
import { runnerImport, type AliasOptions, type Plugin } from 'vite'
import { SHARE_IMAGE_FILE_NAME, SHARE_IMAGE_MAX_BYTES, SHARE_IMAGE_PATH } from '../src/data/shareImageFile.ts'

export type SharePreviewPluginProps = {
  /** The app's `resolve.alias`, which src/shareImage/ imports through. */
  alias: AliasOptions
}

export type BuildShareImageProps = SharePreviewPluginProps & {
  /** The app's root, which the module runner resolves src/shareImage/ from. */
  root: string
}

/** What src/shareImage/renderShareImage.tsx exports. Its JSX and aliases are outside this tsconfig, so it's named here. */
type RenderShareImageModule = { renderShareImage: () => Promise<Uint8Array> }

/** The placeholder index.html writes before every absolute URL, replaced with the origin at build time. */
const SITE_ORIGIN_PLACEHOLDER = '%SITE_ORIGIN%'

/** Where `pnpm preview` serves a local build, the origin when Vercel's isn't set. */
const LOCAL_PREVIEW_ORIGIN = 'http://localhost:4173'

/**
 * The origin the page is shared from: Vercel's production domain, or `pnpm preview`'s when the build runs elsewhere.
 *
 * ```ts
 * resolveSiteOrigin('clientelo.vercel.app') // 'https://clientelo.vercel.app'
 * resolveSiteOrigin(undefined)              // 'http://localhost:4173'
 * ```
 */
const resolveSiteOrigin = (productionHostname: string | undefined): string =>
  productionHostname ? `https://${productionHostname}` : LOCAL_PREVIEW_ORIGIN

/**
 * Renders the Share Image. Throws when it's larger than WhatsApp shows.
 *
 * ```ts
 * await buildShareImage({ root, alias }) // Uint8Array, a 1200 × 630 PNG
 * ```
 */
const buildShareImage = async ({ root, alias }: BuildShareImageProps): Promise<Uint8Array> => {
  const { module } = await runnerImport<RenderShareImageModule>('/src/shareImage/renderShareImage.tsx', {
    root,
    resolve: { alias },
    logLevel: 'warn',
  })
  const shareImage = await module.renderShareImage()

  if (shareImage.byteLength > SHARE_IMAGE_MAX_BYTES) {
    throw new Error(
      `The Share Image is ${shareImage.byteLength} bytes, but WhatsApp drops one over ${SHARE_IMAGE_MAX_BYTES}. ` +
        'Simplify it (docs/specifications/design-identity.md#share-image).',
    )
  }

  return shareImage
}

/**
 * The Vite plugin that builds the Share Image into dist/, serves it in `pnpm dev`, and makes index.html's share URLs
 * absolute on the origin of Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.
 *
 * ```ts
 * defineConfig({ plugins: [sharePreviewPlugin({ alias })] })
 * // dist/share-image.png, and <meta property="og:image" content="https://…/share-image.png"> in dist/index.html
 * ```
 */
export const sharePreviewPlugin = ({ alias }: SharePreviewPluginProps): Plugin => {
  let root = process.cwd()
  const siteOrigin = resolveSiteOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)

  return {
    name: 'share-preview',
    /** Keeps the app's root for the module runner: `vite --root` or a config elsewhere moves it off the cwd. */
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
    },
    /**
     * Writes the origin into index.html's share URLs, before Vite's own `%ENV%` replacement sees the placeholder.
     *
     * ```html
     * <meta property="og:image" content="%SITE_ORIGIN%/share-image.png" />
     * → <meta property="og:image" content="https://clientelo.vercel.app/share-image.png" />
     * ```
     */
    transformIndexHtml: {
      order: 'pre',
      handler: (indexHtml) => indexHtml.replaceAll(SITE_ORIGIN_PLACEHOLDER, siteOrigin),
    },
    /**
     * Serves the Share Image in `pnpm dev`, rendered on the first request and again on the first one after any file
     * changes. A render error goes to Vite's error page.
     *
     * ```ts
     * GET /share-image.png // image/png
     * GET /anything-else   // passed on to Vite
     * ```
     */
    configureServer(server) {
      let shareImage: Promise<Uint8Array> | undefined
      server.watcher.on('change', () => {
        shareImage = undefined
      })

      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== SHARE_IMAGE_PATH) return next()

        shareImage ??= buildShareImage({ root, alias })
        shareImage.then(
          (builtShareImage) => {
            response.setHeader('Content-Type', 'image/png')
            response.end(builtShareImage)
          },
          (buildError: unknown) => {
            shareImage = undefined
            next(buildError)
          },
        )
      })
    },
    /** Emits the Share Image into dist/ beside the page. A thrown error fails `vite build`. */
    async generateBundle() {
      const builtShareImage = await buildShareImage({ root, alias })
      this.emitFile({ type: 'asset', fileName: SHARE_IMAGE_FILE_NAME, source: builtShareImage })
    },
  }
}
