// Embeds the page's font in the Lead Magnet PDF: the WOFF files src/design/fontFiles.ts lists, at the weights
// src/design/tokens.ts mirrors (design-identity.md#type). The latin-ext subset is a second family that react-pdf falls
// back to, glyph by glyph, for the Czech letters with a háček.
import { Font } from '@react-pdf/renderer'
import { findWoff, fontFileFamilies } from '@/design/fontFiles.ts'
import { fontWeights } from '@/design/tokens.ts'

/** The family list the PDF's pages set, so every text falls back to latin-ext for a Czech letter. */
export const pdfFontFamilyNames: string[] = fontFileFamilies.map(({ family }) => family)

/**
 * Registers the page's font with react-pdf, once per process. Throws when tokens.ts lists a weight with no file.
 *
 * ```ts
 * registerPdfFonts() // 'Schibsted Grotesk' and 'Schibsted Grotesk latin-ext', at 400, 700 and 900
 * ```
 */
export const registerPdfFonts = (): void => {
  const registeredFamilies = Font.getRegisteredFontFamilies()

  for (const fontFileFamily of fontFileFamilies) {
    if (registeredFamilies.includes(fontFileFamily.family)) continue
    Font.register({
      family: fontFileFamily.family,
      fonts: fontWeights.map((fontWeight) => ({ src: findWoff(fontFileFamily, fontWeight), fontWeight })),
    })
  }
}
