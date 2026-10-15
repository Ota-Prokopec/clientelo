// The page's only door to localStorage. A browser that blocks storage (a private window, a storage policy) or refuses a
// write (a full quota) throws, and every caller treats that the same way: nothing stored reads as nothing remembered,
// never as an error. Each flag the page keeps is listed in README.md#consent.

/**
 * The value stored under `storageKey`, or null when there is none or the browser blocks storage.
 *
 * ```ts
 * readStoredItem('clientelo:lead') // '1' after storeItem('clientelo:lead', '1')
 * readStoredItem('clientelo:lead') // null on a first visit, or when reading `localStorage` throws
 * ```
 */
export const readStoredItem = (storageKey: string): string | null => {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

/**
 * Stores `value` under `storageKey`. Does nothing when the browser blocks storage or refuses the write.
 *
 * ```ts
 * storeItem('clientelo:visited', '1') // localStorage['clientelo:visited'] = '1'
 * ```
 */
export const storeItem = (storageKey: string, value: string): void => {
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    // Without storage the value is forgotten on the next reload, which every flag tolerates.
  }
}

/**
 * Removes whatever is stored under `storageKey`. Does nothing when the browser blocks storage.
 *
 * ```ts
 * removeStoredItem('clientelo:visited') // localStorage['clientelo:visited'] removed
 * ```
 */
export const removeStoredItem = (storageKey: string): void => {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // Without storage there is nothing to remove.
  }
}
