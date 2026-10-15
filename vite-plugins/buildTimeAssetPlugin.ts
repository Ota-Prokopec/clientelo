// The shape both build-time assets share, the Lead Magnet PDF and the Share Image (ADR-0002): a renderer module under
// src/ loaded through Vite's module runner with the app's aliases, checked, emitted into dist/ by `vite build`, and
// served by `pnpm dev`, rendered again on the first request after any file changes. A render error or a failed check
// fails the build, and in `pnpm dev` goes to Vite's error page.
import { runnerImport, type AliasOptions, type Plugin } from 'vite'

export type BuildTimeAssetPluginProps<TRendererModule> = {
  /** The plugin's name, as Vite reports it. */
  name: string
  /** The app's `resolve.alias`, which the renderer imports through. */
  alias: AliasOptions
  /** The renderer module, from the app's root: `/src/pdfLeadMagnet/renderLeadMagnetPdf.tsx`. */
  rendererModulePath: string
  /** Renders the asset with the loaded renderer module. */
  renderAsset: (rendererModule: TRendererModule) => Promise<Uint8Array>
  /** Throws, with the instruction to follow, when the rendered asset breaks a rule: a page count, a size. */
  checkAsset: (asset: Uint8Array) => Promise<void> | void
  /** The asset's file name in dist/. */
  fileName: string
  /** The path `pnpm dev` serves it at. */
  servedPath: string
  contentType: string
}

/**
 * A Vite plugin that builds one asset from a renderer module into dist/ and serves it in `pnpm dev`.
 *
 * ```ts
 * createBuildTimeAssetPlugin({ name: 'share-preview', alias, rendererModulePath: '/src/shareImage/renderShareImage.tsx',
 *   renderAsset: (module) => module.renderShareImage(), checkAsset, fileName: 'share-image.png',
 *   servedPath: '/share-image.png', contentType: 'image/png' })
 * // vite build → dist/share-image.png; pnpm dev → GET /share-image.png is image/png, anything else passes on to Vite
 * ```
 */
export const createBuildTimeAssetPlugin = <TRendererModule>({
  name,
  alias,
  rendererModulePath,
  renderAsset,
  checkAsset,
  fileName,
  servedPath,
  contentType,
}: BuildTimeAssetPluginProps<TRendererModule>): Plugin => {
  let root = process.cwd()

  /**
   * Renders the asset from the app's `root` and checks it. Throws when rendering or the check fails.
   *
   * ```ts
   * await buildAsset() // Uint8Array
   * ```
   */
  const buildAsset = async (): Promise<Uint8Array> => {
    const { module: rendererModule } = await runnerImport<TRendererModule>(rendererModulePath, {
      root,
      resolve: { alias },
      logLevel: 'warn',
    })
    const asset = await renderAsset(rendererModule)
    await checkAsset(asset)
    return asset
  }

  return {
    name,
    /** Keeps the app's root for the module runner: `vite --root` or a config elsewhere moves it off the cwd. */
    configResolved(resolvedConfig) {
      root = resolvedConfig.root
    },
    /** Serves the asset in `pnpm dev`, built on the first request and again on the first one after any file changes. */
    configureServer(server) {
      let builtAsset: Promise<Uint8Array> | undefined
      server.watcher.on('change', () => {
        builtAsset = undefined
      })

      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== servedPath) return next()

        builtAsset ??= buildAsset()
        builtAsset.then(
          (asset) => {
            response.setHeader('Content-Type', contentType)
            response.end(asset)
          },
          (buildError: unknown) => {
            builtAsset = undefined
            next(buildError)
          },
        )
      })
    },
    /** Emits the asset into dist/ beside the page. A thrown error fails `vite build`. */
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName, source: await buildAsset() })
    },
  }
}
