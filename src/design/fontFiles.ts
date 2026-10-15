// The page's font as files a build-time renderer embeds: Schibsted Grotesk's static WOFF files from Fontsource, as data
// URLs, at the weights tokens.ts mirrors (design-identity.md#type). The Lead Magnet PDF and the Share Image both embed
// them. Fontsource splits each weight into subsets, and the Czech letters with a háček (č, ř, ž, ů) live in latin-ext,
// so a renderer registers it as a second family to fall back to, glyph by glyph.
import latin400Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-400-normal.woff?inline'
import latin700Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff?inline'
import latin900Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-900-normal.woff?inline'
import latinExt400Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-400-normal.woff?inline'
import latinExt700Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-700-normal.woff?inline'
import latinExt900Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-900-normal.woff?inline'
import { fontFamilyByRole } from './tokens.ts'

/** One family a renderer registers: its name, and its WOFF file as a data URL for each weight. */
export type FontFileFamily = { family: string; woffByWeight: Record<number, string> }

/** The page's family, then its latin-ext subset under its own name, which a renderer falls back to for Czech letters. */
export const fontFileFamilies: FontFileFamily[] = [
  { family: fontFamilyByRole.sans, woffByWeight: { 400: latin400Woff, 700: latin700Woff, 900: latin900Woff } },
  {
    family: `${fontFamilyByRole.sans} latin-ext`,
    woffByWeight: { 400: latinExt400Woff, 700: latinExt700Woff, 900: latinExt900Woff },
  },
]

/**
 * A family's WOFF file at one weight, as a data URL. Throws when tokens.ts lists a weight with no file here.
 *
 * ```ts
 * findWoff(fontFileFamilies[0], 900) // 'data:font/woff;base64,…'
 * findWoff(fontFileFamilies[0], 300) // throws: No WOFF file for Schibsted Grotesk at weight 300
 * ```
 */
export const findWoff = ({ family, woffByWeight }: FontFileFamily, fontWeight: number): string => {
  const woffDataUrl = woffByWeight[fontWeight]
  if (!woffDataUrl) throw new Error(`No WOFF file for ${family} at weight ${fontWeight}`)
  return woffDataUrl
}
