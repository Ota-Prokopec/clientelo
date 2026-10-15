// Tests the remembered Visit: `clientelo:visited` is stored only while the Visitor's consent is given, so a later Visit
// counts them as a returning Visitor, and it is removed once they refuse or withdraw it.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rememberConsentChoice } from '../../src/consent/consentChoice.ts'
import { readHasVisitedBefore, syncRememberedVisit } from '../../src/consent/rememberedVisit.ts'
import { createMemoryStorage } from '../memoryStorage.ts'

const firstVisitDate = new Date('2026-10-15T10:00:00Z')
const laterVisitDate = new Date('2026-11-02T18:30:00Z')

describe('syncRememberedVisit', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('remembers the Visit once the Visitor allows it, for the next Visit', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: firstVisitDate })
    syncRememberedVisit(firstVisitDate)

    expect(readHasVisitedBefore(laterVisitDate)).toBe(true)
  })

  // Ignoring the Consent Bar isn't consent.
  it('stores nothing while the Visitor hasn’t chosen', () => {
    const storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)
    syncRememberedVisit(firstVisitDate)

    expect(storage.getItem('clientelo:visited')).toBeNull()
    expect(readHasVisitedBefore(laterVisitDate)).toBe(false)
  })

  it('stores nothing once the Visitor refuses', () => {
    const storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)
    rememberConsentChoice({ consentChoice: 'denied', chosenAt: firstVisitDate })
    syncRememberedVisit(firstVisitDate)

    expect(storage.getItem('clientelo:visited')).toBeNull()
    expect(readHasVisitedBefore(laterVisitDate)).toBe(false)
  })

  it('removes the remembered Visit once the Visitor withdraws consent', () => {
    const storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: firstVisitDate })
    syncRememberedVisit(firstVisitDate)
    rememberConsentChoice({ consentChoice: 'denied', chosenAt: laterVisitDate })
    syncRememberedVisit(laterVisitDate)

    expect(storage.getItem('clientelo:visited')).toBeNull()
    expect(readHasVisitedBefore(laterVisitDate)).toBe(false)
  })
})

describe('readHasVisitedBefore', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  // The flag may be read only while consent holds, and a choice 12 months old counts as none.
  it('doesn’t count an earlier Visit once the Visitor’s consent is 12 months old', () => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: new Date('2025-09-15T10:00:00Z') })
    syncRememberedVisit(new Date('2025-09-15T10:00:00Z'))

    expect(readHasVisitedBefore(new Date('2026-10-15T10:00:00Z'))).toBe(false)
  })

  it('counts no earlier Visit, and doesn’t throw, when the browser blocks storage', () => {
    // A browser that blocks site data throws as soon as the page reads `localStorage`.
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new DOMException('The operation is insecure.', 'SecurityError')
      },
    })

    expect(() => syncRememberedVisit(firstVisitDate)).not.toThrow()
    expect(readHasVisitedBefore(laterVisitDate)).toBe(false)
  })

  it('counts no earlier Visit, and doesn’t throw, when the browser refuses to write', () => {
    // Safari's private browsing used to hand out a storage whose setItem() throws.
    const storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)
    rememberConsentChoice({ consentChoice: 'granted', chosenAt: firstVisitDate })
    storage.setItem = () => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    }

    expect(() => syncRememberedVisit(firstVisitDate)).not.toThrow()
    expect(readHasVisitedBefore(laterVisitDate)).toBe(false)
  })
})
