// The Lead Magnet's title and its Chapters (docs/strategy.md#lead-magnet), which every Lead Ask shows before it asks.
// The contents lines name what each Chapter covers without quoting a figure, so a Lead Ask needs no Data Source of its
// own.

/** The Lead Magnet's title, as the PDF and every Lead Ask set it. */
export const leadMagnetTitle = 'Tahák: evropská dvojčata amerických ETF'

/** One Chapter of the Lead Magnet PDF: its number in the PDF, and its line in the contents list. */
export type LeadMagnetChapter = { number: number; contentsLine: string }

/** The Lead Magnet's Chapters, in the PDF's order (docs/strategy.md#lead-magnet). */
export const leadMagnetChapters = {
  whyNoVoo: { number: 1, contentsLine: 'Proč vám aplikace VOO neprodá' },
  twinTable: { number: 2, contentsLine: 'Tabulka dvojčat s ISIN, burzou a měnou' },
  czechTaxes: { number: 3, contentsLine: 'Daně v Česku: časový test a dividendy' },
  usEstateTax: { number: 4, contentsLine: 'Americká dědická daň a jak se jí vyhnout' },
  bankFundVsEtf: { number: 5, contentsLine: 'Bankovní fond vs. ETF za 20 let v korunách' },
  howToBuy: { number: 6, contentsLine: 'Kde dvojče koupit: XTB, Trading 212, Revolut, Fio' },
} satisfies Record<string, LeadMagnetChapter>

/**
 * The three Chapters an inline Lead Ask lists after either Interactive Tool: the rest of the answer, meaning the full
 * Twin table, the taxes and the estate tax (docs/strategy.md#lead-ask). Chapter 6, the first cut if the PDF runs over,
 * is never promised here.
 */
export const leadAskChapters: LeadMagnetChapter[] = [
  leadMagnetChapters.twinTable,
  leadMagnetChapters.czechTaxes,
  leadMagnetChapters.usEstateTax,
]
