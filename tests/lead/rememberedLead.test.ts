// Tests the remembered Lead: a Lead stays a Lead across a reload, and a browser whose storage throws falls back to a
// Visitor with the content locked, instead of breaking the page.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readRememberedLead, rememberLead } from '../../src/lead/rememberedLead.ts'
import { createMemoryStorage } from '../memoryStorage.ts'

describe('readRememberedLead', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('remembers no one on a first visit', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())

    expect(readRememberedLead()).toBeNull()
  })

  it('remembers a returning Lead once the Lead Form was submitted on an earlier visit', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberLead()

    expect(readRememberedLead()).toEqual({ kind: 'returning' })
  })

  it('remembers no one, and doesn’t throw, when the browser blocks storage', () => {
    // A browser that blocks site data throws as soon as the page reads `localStorage`.
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new DOMException('The operation is insecure.', 'SecurityError')
      },
    })

    expect(() => rememberLead()).not.toThrow()
    expect(readRememberedLead()).toBeNull()
  })

  it('remembers no one, and doesn’t throw, when the browser refuses to write', () => {
    // Safari's private browsing used to hand out a storage whose setItem() throws.
    vi.stubGlobal('localStorage', {
      ...createMemoryStorage(),
      setItem: () => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      },
    })

    expect(() => rememberLead()).not.toThrow()
    expect(readRememberedLead()).toBeNull()
  })
})
