// Tests the Lead Magnet PDF's build check: a PDF with the page count every Lead Ask promises passes, and any other
// count fails the build with the instruction to shorten it.
import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import { LEAD_MAGNET_PAGE_COUNT } from '@data/leadMagnetFiles.ts'
import { checkLeadMagnetPageCount } from '../../vite-plugins/pdfLeadMagnetPlugin.ts'

/**
 * A blank PDF with `pageCount` pages.
 *
 * ```ts
 * await createBlankPdf(2) // Uint8Array, a 2-page PDF
 * ```
 */
const createBlankPdf = async (pageCount: number): Promise<Uint8Array> => {
  const pdfDocument = await PDFDocument.create()
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) pdfDocument.addPage()
  return pdfDocument.save()
}

describe('checkLeadMagnetPageCount', () => {
  it('passes the page count every Lead Ask promises', async () => {
    await expect(checkLeadMagnetPageCount(await createBlankPdf(LEAD_MAGNET_PAGE_COUNT))).resolves.toBeUndefined()
  })

  it.each([LEAD_MAGNET_PAGE_COUNT - 1, LEAD_MAGNET_PAGE_COUNT + 1])('fails a PDF of %i pages', async (pageCount) => {
    await expect(checkLeadMagnetPageCount(await createBlankPdf(pageCount))).rejects.toThrow(
      `has ${pageCount} pages, but every Lead Ask promises ${LEAD_MAGNET_PAGE_COUNT}`,
    )
  })
})
