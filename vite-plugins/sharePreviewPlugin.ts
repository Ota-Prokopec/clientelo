// Builds the Share Preview: renders the Share Image from src/shareImage/ through Vite's module runner, the way the Lead
// Magnet PDF is built (ADR-0002), and writes the production origin into index.html's Open Graph tags, which crawlers
// need as absolute URLs. `vite build` emits the image into dist/, and `pnpm dev` serves it, rendered again after any
// file changes. A render error, or an image too large for WhatsApp, fails the build.
import type { AliasOptions, Plugin } from 'vite'
import { SHARE_IMAGE_FILE_NAME, SHARE_IMAGE_MAX_BYTES, SHARE_IMAGE_PATH } from '../src/data/shareImageFile.ts'
import { createBuildTimeAssetPlugin } from './buildTimeAssetPlugin.ts'

export type SharePreviewPluginProps = {
  /** The app's `resolve.alias`, which src/shareImage/ imports through. */
  alias: AliasOptions
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
 * Throws when the Share Image is larger than WhatsApp shows.
 *
 * ```ts
 * checkShareImageSize(new Uint8Array(36_000))  // passes
 * checkShareImageSize(new Uint8Array(400_000)) // throws: The Share Image is 400000 bytes, but WhatsApp drops one over…
 * ```
 */
const checkShareImageSize = (shareImage: Uint8Array): void => {
  if (shareImage.byteLength > SHARE_IMAGE_MAX_BYTES) {
    throw new Error(
      `The Share Image is ${shareImage.byteLength} bytes, but WhatsApp drops one over ${SHARE_IMAGE_MAX_BYTES}. ` +
        'Simplify it (docs/specifications/design-identity.md#share-image).',
    )
  }
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
  const siteOrigin = resolveSiteOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)

  return {
    ...createBuildTimeAssetPlugin<RenderShareImageModule>({
      name: 'share-preview',
      alias,
      rendererModulePath: '/src/shareImage/renderShareImage.tsx',
      renderAsset: (rendererModule) => rendererModule.renderShareImage(),
      checkAsset: checkShareImageSize,
      fileName: SHARE_IMAGE_FILE_NAME,
      servedPath: SHARE_IMAGE_PATH,
      contentType: 'image/png',
    }),
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
  }
}
