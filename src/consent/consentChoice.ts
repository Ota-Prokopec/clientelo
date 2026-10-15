// The Visitor's choice in the Consent Bar (#51), kept in localStorage under `clientelo:consent` with the date it was
// made. A choice 12 months old counts as none, so the Consent Bar asks again. A browser that blocks or refuses storage,
// or holds a garbled record, gets no choice, never an error: the bar asks, and nothing is remembered without consent.
import { z } from 'zod'

/** The localStorage key of the record, namespaced like `clientelo:lead`. */
const consentChoiceStorageKey = 'clientelo:consent'

/** How long a choice holds before the Consent Bar asks again. */
const consentValidityMonths = 12

const consentChoiceSchema = z.enum(['granted', 'denied'])

/** What the Visitor chose in the Consent Bar: to let the page remember that they have been here before, or not. */
export type ConsentChoice = z.infer<typeof consentChoiceSchema>

/** The stored record: the choice, and when it was made as an ISO 8601 timestamp. */
const consentRecordSchema = z.object({
  consentChoice: consentChoiceSchema,
  chosenAt: z.iso.datetime(),
})

export type RememberConsentChoiceProps = {
  consentChoice: ConsentChoice
  /** When the Visitor chose, which starts the 12 months the choice holds. */
  chosenAt: Date
}

/**
 * Remembers the Visitor's choice with its date. Does nothing when the browser blocks storage or refuses the write.
 *
 * ```ts
 * rememberConsentChoice({ consentChoice: 'granted', chosenAt: new Date('2026-10-15T10:00:00Z') })
 * // localStorage['clientelo:consent'] = '{"consentChoice":"granted","chosenAt":"2026-10-15T10:00:00.000Z"}'
 * ```
 */
export const rememberConsentChoice = ({ consentChoice, chosenAt }: RememberConsentChoiceProps): void => {
  try {
    localStorage.setItem(consentChoiceStorageKey, JSON.stringify({ consentChoice, chosenAt: chosenAt.toISOString() }))
  } catch {
    // Without storage the choice is forgotten on the next reload, so the Consent Bar only asks again.
  }
}

/**
 * The Visitor's choice while it holds, or null when there is none to honour: no record, a record 12 months old or
 * more, a garbled one, or a browser that blocks storage.
 *
 * ```ts
 * // chosen 'granted' on 2025-10-15T10:00:00Z
 * readConsentChoice(new Date('2026-10-14T10:00:00Z')) // 'granted'
 * readConsentChoice(new Date('2026-10-15T10:00:00Z')) // null: 12 months old, the Consent Bar asks again
 * // nothing stored, '1', 'not json', or reading `localStorage` throws → null
 * ```
 */
export const readConsentChoice = (now: Date): ConsentChoice | null => {
  let storedConsentRecord: string | null
  try {
    storedConsentRecord = localStorage.getItem(consentChoiceStorageKey)
  } catch {
    return null
  }
  if (storedConsentRecord === null) return null

  let consentRecordJson: unknown
  try {
    consentRecordJson = JSON.parse(storedConsentRecord)
  } catch {
    return null
  }
  const consentRecordParse = consentRecordSchema.safeParse(consentRecordJson)
  if (!consentRecordParse.success) return null

  const consentExpiry = new Date(consentRecordParse.data.chosenAt)
  consentExpiry.setUTCMonth(consentExpiry.getUTCMonth() + consentValidityMonths)
  return now < consentExpiry ? consentRecordParse.data.consentChoice : null
}
