// Formats figures the Czech way for the page: decimal comma, a non-breaking space before the unit.

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
