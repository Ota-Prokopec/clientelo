// Tests the page's door to localStorage: what it stores reads back, and a browser that blocks or refuses storage reads
// as nothing stored instead of throwing.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStoredItem, removeStoredItem, storeItem } from '@lib/browserStorage.ts'
import { createMemoryStorage } from '../memoryStorage.ts'

/** Stubs a localStorage whose every method throws, as a browser that blocks site data or is over quota does. */
const stubThrowingStorage = () => {
  const throwSecurityError = () => {
    throw new DOMException('The operation is insecure.', 'SecurityError')
  }
  vi.stubGlobal('localStorage', {
    getItem: throwSecurityError,
    setItem: throwSecurityError,
    removeItem: throwSecurityError,
  })
}

describe('browserStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads back what it stored, and nothing once it is removed', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())

    expect(readStoredItem('clientelo:lead')).toBeNull()
    storeItem('clientelo:lead', '1')
    expect(readStoredItem('clientelo:lead')).toBe('1')
    removeStoredItem('clientelo:lead')
    expect(readStoredItem('clientelo:lead')).toBeNull()
  })

  it('reads nothing, and never throws, when the browser blocks storage', () => {
    stubThrowingStorage()

    expect(() => storeItem('clientelo:lead', '1')).not.toThrow()
    expect(() => removeStoredItem('clientelo:lead')).not.toThrow()
    expect(readStoredItem('clientelo:lead')).toBeNull()
  })
})
