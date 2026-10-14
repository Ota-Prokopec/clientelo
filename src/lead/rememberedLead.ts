// Remembers a Lead across visits with one localStorage flag, so a reload keeps the content unlocked and the Sticky CTA
// gone. The flag holds no contact. A browser that blocks or refuses storage gets the page as a Visitor sees it, with
// the content locked, never an error.
import type { Lead } from '@/types.ts'

/** The localStorage key of the flag, namespaced so it can't collide with another app on the same origin. */
const rememberedLeadStorageKey = 'clientelo:lead'

/**
 * Sets the flag. Does nothing when the browser blocks storage or refuses the write.
 *
 * ```ts
 * rememberLead() // localStorage['clientelo:lead'] = '1'
 * ```
 */
export const rememberLead = (): void => {
  try {
    localStorage.setItem(rememberedLeadStorageKey, '1')
  } catch {
    // Without storage the Lead is forgotten on the next reload, which only locks the content again.
  }
}

/**
 * The Lead an earlier visit remembered, or null for a Visitor, and for a browser that blocks storage.
 *
 * ```ts
 * readRememberedLead() // { kind: 'returning' } after rememberLead() on an earlier visit
 * readRememberedLead() // null on a first visit, or when reading `localStorage` throws
 * ```
 */
export const readRememberedLead = (): Lead | null => {
  try {
    return localStorage.getItem(rememberedLeadStorageKey) === '1' ? { kind: 'returning' } : null
  } catch {
    return null
  }
}
