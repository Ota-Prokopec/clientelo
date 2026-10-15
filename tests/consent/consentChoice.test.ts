// Tests the Visitor's choice in the Consent Bar: it is remembered with its date, counts as none once it is 12 months
// old so the bar asks again, and a browser whose storage throws or holds a garbled record gets no choice, never an error.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readConsentChoice, rememberConsentChoice } from '../../src/consent/consentChoice.ts'
import { createMemoryStorage } from '../memoryStorage.ts'

describe('readConsentChoice', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('finds no choice on a first visit', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())

    expect(readConsentChoice(new Date('2026-10-15T10:00:00Z'))).toBeNull()
  })

  it.each(['granted', 'denied'] as const)('finds the Visitor’s %s choice on a later visit', (consentChoice) => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice, chosenAt: new Date('2026-10-15T10:00:00Z') })

    expect(readConsentChoice(new Date('2026-10-20T08:00:00Z'))).toBe(consentChoice)
  })

  it('still finds a choice the day before it is 12 months old', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: new Date('2025-10-15T10:00:00Z') })

    expect(readConsentChoice(new Date('2026-10-14T10:00:00Z'))).toBe('granted')
  })

  it('finds no choice once it is 12 months old, so the Consent Bar asks again', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: new Date('2025-10-15T10:00:00Z') })

    expect(readConsentChoice(new Date('2026-10-15T10:00:00Z'))).toBeNull()
  })

  it('finds no choice 13 months on', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice: 'denied', chosenAt: new Date('2025-09-15T10:00:00Z') })

    expect(readConsentChoice(new Date('2026-10-15T10:00:00Z'))).toBeNull()
  })

  it.each([
    '1',
    'not json',
    '{"consentChoice":"maybe","chosenAt":"2026-10-15T10:00:00.000Z"}',
    '{"consentChoice":"granted"}',
  ])(
    'finds no choice in a garbled record (%s), so the Consent Bar asks again',
    (storedConsentRecord) => {
      const storage = createMemoryStorage()
      storage.setItem('clientelo:consent', storedConsentRecord)
      vi.stubGlobal('localStorage', storage)

      expect(readConsentChoice(new Date('2026-10-15T10:00:00Z'))).toBeNull()
    },
  )

  it('finds no choice, and doesn’t throw, when the browser blocks storage', () => {
    // A browser that blocks site data throws as soon as the page reads `localStorage`.
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new DOMException('The operation is insecure.', 'SecurityError')
      },
    })

    expect(() =>
      rememberConsentChoice({ consentChoice: 'granted', chosenAt: new Date('2026-10-15T10:00:00Z') }),
    ).not.toThrow()
    expect(readConsentChoice(new Date('2026-10-15T10:00:00Z'))).toBeNull()
  })
})
