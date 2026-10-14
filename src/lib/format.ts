// Formats figures the Czech way for the page and the Lead Magnet PDF: decimal comma, a non-breaking space before the unit.
import type { DataSource } from '@data/figures.ts'

const percentFormat = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 4 })
const amountFormat = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })
const dateFormat = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })

/**
 * A TER or other percentage as Czech copy.
 *
 * ```ts
 * formatPercent(0.0945) // '0,0945 %'
 * ```
 */
export const formatPercent = (percent: number): string => {
  return `${percentFormat.format(percent)} %`
}

/**
 * A whole amount with its unit as Czech copy.
 *
 * ```ts
 * formatAmount(60000, 'USD') // '60 000 USD'
 * ```
 */
export const formatAmount = (amount: number, unit: string): string => {
  return `${amountFormat.format(amount)} ${unit}`
}

/**
 * An ISO date (`2026-10-11`) as a Czech date.
 *
 * ```ts
 * formatIsoDate('2026-10-11') // '11. 10. 2026'
 * ```
 */
export const formatIsoDate = (isoDate: string): string => {
  return dateFormat.format(new Date(`${isoDate}T00:00:00`))
}

/**
 * Whether a Data Source has been verified, and when, as the note beside its name says it.
 *
 * ```ts
 * formatVerification({ name: 'Vanguard, stránka fondu VOO', url: '…', verifiedOn: '2026-10-11' }) // 'ověřeno 11. 10. 2026'
 * formatVerification({ name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null })       // 'zatím neověřeno'
 * ```
 */
export const formatVerification = (source: DataSource): string => {
  return source.verifiedOn ? `ověřeno ${formatIsoDate(source.verifiedOn)}` : 'zatím neověřeno'
}

/** How a number of years reads in Czech: 20 as "20 let". A slider passes it on to a screen reader. */
export const yearsFormatOptions: Intl.NumberFormatOptions = { style: 'unit', unit: 'year', unitDisplay: 'long' }

/** How an amount in Kč reads in Czech: 100000 as "100 000 Kč". A slider passes it on to a screen reader. */
export const amountKcFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'CZK',
  maximumFractionDigits: 0,
}

const yearsFormat = new Intl.NumberFormat('cs-CZ', yearsFormatOptions)
const chapterNumberFormat = new Intl.NumberFormat('cs-CZ', { minimumIntegerDigits: 2 })
const terFractionFormat = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 6 })
const ratioFormat = new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 3, maximumFractionDigits: 3 })

/**
 * A number of years with the Czech word that agrees with it, the same after "za" as on its own.
 *
 * ```ts
 * formatYears(1)  // '1 rok'
 * formatYears(3)  // '3 roky'
 * formatYears(20) // '20 let'
 * ```
 */
export const formatYears = (years: number): string => {
  return yearsFormat.format(years)
}

/**
 * A TER in percent as the fraction a formula uses.
 *
 * ```ts
 * formatTerFraction(2.22) // '0,0222'
 * ```
 */
export const formatTerFraction = (terPercent: number): string => {
  return terFractionFormat.format(terPercent / 100)
}

/**
 * A ratio to three decimal places.
 *
 * ```ts
 * formatRatio(0.6421) // '0,642'
 * ```
 */
export const formatRatio = (ratio: number): string => {
  return ratioFormat.format(ratio)
}

/**
 * A Chapter's number as the Lead Magnet PDF and every Lead Ask set it, two digits like a Section number.
 *
 * ```ts
 * formatChapterNumber(2) // '02'
 * ```
 */
export const formatChapterNumber = (chapterNumber: number): string => {
  return chapterNumberFormat.format(chapterNumber)
}
