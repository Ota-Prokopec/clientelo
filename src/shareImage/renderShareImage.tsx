// Renders the Share Image from code, the way the Lead Magnet PDF is rendered (ADR-0002): satori lays out the JSX into an
// SVG, and resvg rasterises it into a PNG. The Vite plugin in vite-plugins/sharePreviewPlugin.ts loads this module at
// build time and in `pnpm dev`, so the image always names the Tickers and the headline the page shows.
import { Resvg } from '@resvg/resvg-js'
import satori, { type Font } from 'satori'
import { findWoff, fontFileFamilies } from '@/design/fontFiles.ts'
import { shareImageHeight, shareImageWidth } from '@data/shareImageFile.ts'
import { ShareImage } from './ShareImage.tsx'

/** The one weight the Share Image sets its type in. */
const shareImageFontWeight = 900

/**
 * The page's font at the Share Image's weight, its latin-ext subset included, as satori loads it.
 *
 * ```ts
 * await loadShareImageFonts() // [{ name: 'Schibsted Grotesk', weight: 900, … }, { name: '… latin-ext', … }]
 * ```
 */
const loadShareImageFonts = async (): Promise<Font[]> =>
  Promise.all(
    fontFileFamilies.map(async (fontFileFamily) => ({
      name: fontFileFamily.family,
      // fetch() decodes a data URL into the bytes satori reads.
      data: await (await fetch(findWoff(fontFileFamily, shareImageFontWeight))).arrayBuffer(),
      weight: shareImageFontWeight,
      style: 'normal',
    })),
  )

/**
 * The Share Image's PNG bytes, 1200 × 630.
 *
 * ```ts
 * await renderShareImage() // Uint8Array starting with the PNG signature
 * ```
 */
export const renderShareImage = async (): Promise<Uint8Array> => {
  const shareImageSvg = await satori(<ShareImage />, {
    width: shareImageWidth,
    height: shareImageHeight,
    fonts: await loadShareImageFonts(),
  })

  return new Resvg(shareImageSvg, { font: { loadSystemFonts: false } }).render().asPng()
}
