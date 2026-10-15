// Remembers that a Visitor has been here before with one localStorage flag, `clientelo:visited`, so a later Visit's
// Funnel Events count them as a returning Visitor (#51). It serves measurement only, so it is stored and read only while
// the Visitor's consent from the Consent Bar holds (§89(3) of Act No. 127/2005 Coll.), and removed once they refuse or
// withdraw it. A browser that blocks or refuses storage counts as a new Visitor, never an error.
import { readConsentChoice } from './consentChoice.ts'

/** The localStorage key of the flag, namespaced like `clientelo:lead`. */
const REMEMBERED_VISIT_STORAGE_KEY = 'clientelo:visited'

/**
 * Brings the flag in line with the Visitor's consent: stores it while consent is given, and removes it otherwise, after
 * a refusal, a withdrawal or with no choice made. Does nothing when the browser blocks storage or refuses the write.
 *
 * ```ts
 * syncRememberedVisit(now) // consent 'granted' → localStorage['clientelo:visited'] = '1'
 * syncRememberedVisit(now) // 'denied', expired or none → localStorage['clientelo:visited'] removed
 * ```
 */
export const syncRememberedVisit = (now: Date): void => {
  try {
    if (readConsentChoice(now) === 'granted') localStorage.setItem(REMEMBERED_VISIT_STORAGE_KEY, '1')
    else localStorage.removeItem(REMEMBERED_VISIT_STORAGE_KEY)
  } catch {
    // Without storage the Visit is forgotten, so the next one counts as a new Visitor's.
  }
}

/**
 * Whether an earlier Visit remembered this Visitor. Only while consent holds: an expired or withdrawn consent, or a
 * browser that blocks storage, counts as a new Visitor.
 *
 * ```ts
 * readHasVisitedBefore(now) // true: consent 'granted' and the flag stored on an earlier Visit
 * readHasVisitedBefore(now) // false: no flag, consent not given or 12 months old, or reading `localStorage` throws
 * ```
 */
export const readHasVisitedBefore = (now: Date): boolean => {
  if (readConsentChoice(now) !== 'granted') return false
  try {
    return localStorage.getItem(REMEMBERED_VISIT_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}
