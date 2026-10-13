// Embeds the page's font in the Lead Magnet PDF: Schibsted Grotesk's static WOFF files from Fontsource, at the weights
// src/design/tokens.ts mirrors (design-identity.md#type). Fontsource splits each weight into subsets, and the Czech
// letters with a háček (č, ř, ž, ů) live in latin-ext, so the PDF registers it as a second family that react-pdf falls
// back to, glyph by glyph.
import { Font } from '@react-pdf/renderer'
import latin400Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-400-normal.woff?inline'
import latin700Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff?inline'
import latin900Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-900-normal.woff?inline'
import latinExt400Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-400-normal.woff?inline'
import latinExt700Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-700-normal.woff?inline'
import latinExt900Woff from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-ext-900-normal.woff?inline'
import { fontFamilyByRole, fontWeights } from '@/design/tokens.ts'

/** One family the PDF registers: its name, and its WOFF file as a data URL for each weight. */
type PdfFontFamily = { family: string; woffByWeight: Record<number, string> }

const pdfFontFamilies: PdfFontFamily[] = [
  { family: fontFamilyByRole.sans, woffByWeight: { 400: latin400Woff, 700: latin700Woff, 900: latin900Woff } },
  {
    family: `${fontFamilyByRole.sans} latin-ext`,
    woffByWeight: { 400: latinExt400Woff, 700: latinExt700Woff, 900: latinExt900Woff },
  },
]

/** The family list the PDF's pages set, so every text falls back to latin-ext for a Czech letter. */
export const pdfFontFamilyNames: string[] = pdfFontFamilies.map(({ family }) => family)

/**
 * Registers the page's font with react-pdf, once per process. Throws when tokens.ts lists a weight with no file here.
 *
 * ```ts
 * registerPdfFonts() // 'Schibsted Grotesk' and 'Schibsted Grotesk latin-ext', at 400, 700 and 900
 * ```
 */
export const registerPdfFonts = (): void => {
  const registeredFamilies = Font.getRegisteredFontFamilies()

  for (const { family, woffByWeight } of pdfFontFamilies) {
    if (registeredFamilies.includes(family)) continue
    Font.register({
      family,
      fonts: fontWeights.map((fontWeight) => {
        const woff = woffByWeight[fontWeight]
        if (!woff) throw new Error(`No WOFF file for ${family} at weight ${fontWeight}`)
        return { src: woff, fontWeight }
      }),
    })
  }
}
