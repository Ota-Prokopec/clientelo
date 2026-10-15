// How a cleared number field round-trips: the DOM reports it as NaN (`valueAsNumber`), and NaN has to show as an empty
// field again, so the Visitor can clear the field to type a new amount. The Fee Calculator's amount and any numeric
// InputField share it.

/**
 * The value a field shows for `value`: empty while it is NaN, otherwise the value itself.
 *
 * ```ts
 * toInputValue(100_000)    // 100000
 * toInputValue(Number.NaN) // ''
 * toInputValue('jana@')    // 'jana@'
 * ```
 */
export const toInputValue = <TValue>(value: TValue): TValue | '' =>
  typeof value === 'number' && Number.isNaN(value) ? '' : value
