// The submitLead() seam the Lead Form calls. A stub until step 7 of docs/plan.md replaces sendLead() with a request
// to /api/lead. In `pnpm dev`, opening the page with `?submit-lead=fail` makes every send fail, so the Lead Form's
// error state can be reached.
import type { LeadSubmission } from '@/schemas/leadSchema.ts'

/** How long the stub takes, about as long as a real request, so the Lead Form's submitting state shows. */
const stubbedSendDurationMs = 600

/**
 * Whether the dev toggle asks the stub to fail. Always false in a production build.
 *
 * ```ts
 * // pnpm dev, /?utm_content=money&submit-lead=fail → true
 * // pnpm dev, /?utm_content=money                  → false
 * // pnpm build                                     → false
 * ```
 */
const isFailureSimulated = (): boolean => {
  if (!import.meta.env.DEV) return false
  // `location` is missing outside a browser, such as in a test that doesn't set it.
  return new URLSearchParams(globalThis.location?.search).get('submit-lead') === 'fail'
}

/**
 * Sends the Lead's email on. The stub sends nothing: it waits as a request would, then resolves, or rejects behind
 * the dev toggle.
 *
 * ```ts
 * await sendLead('jana.novakova@seznam.cz') // resolves after 600 ms
 * // pnpm dev, /?submit-lead=fail          → rejects after 600 ms
 * ```
 */
const sendLead = async (_email: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, stubbedSendDurationMs))
  if (isFailureSimulated()) throw new Error('submitLead() failed: simulated by ?submit-lead=fail')
}

/**
 * Submits the Lead Form, resolving once the Visitor is a Lead, and rejecting when the Lead couldn't be sent.
 *
 * ```ts
 * await submitLead({ email: 'jana.novakova@seznam.cz', honeypot: '' })         // resolves: the Visitor is a Lead
 * await submitLead({ email: 'bot@example.com', honeypot: 'https://spam.example' }) // resolves, and sends nothing
 * ```
 */
export const submitLead = async ({ email, honeypot }: LeadSubmission): Promise<void> => {
  // A filled honeypot means a bot. It sees a success, so it has no reason to retry, and nothing is sent.
  if (honeypot !== '') return
  await sendLead(email)
}
