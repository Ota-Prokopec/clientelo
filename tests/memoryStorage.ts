// A localStorage stand-in the storage tests share: it keeps its items in memory, as a browser keeps them across a
// reload, so a test can stub `localStorage` with it and read back what the page stored.

/** The part of `Storage` the page's flags use. */
export type MemoryStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/**
 * An empty localStorage that keeps its items in memory.
 *
 * ```ts
 * const storage = createMemoryStorage()
 * storage.setItem('a', '1')
 * storage.getItem('a') // '1'
 * storage.removeItem('a')
 * storage.getItem('a') // null
 * ```
 */
export const createMemoryStorage = (): MemoryStorage => {
  const storedValueByKey = new Map<string, string>()

  return {
    getItem: (key) => storedValueByKey.get(key) ?? null,
    setItem: (key, storedValue) => {
      storedValueByKey.set(key, storedValue)
    },
    removeItem: (key) => {
      storedValueByKey.delete(key)
    },
  }
}
