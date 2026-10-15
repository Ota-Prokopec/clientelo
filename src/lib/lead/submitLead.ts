// The submitLead() seam the Lead Form calls. A final stub that sends nothing, since the page is frontend only
// (docs/plan.md#7-deployment). In `pnpm dev`, opening the page with `?submit-lead=fail` makes every send fail, so the
// Lead Form's error state can be reached.
import type { LeadSubmission } from '@/schemas/leadSchema.ts'
import { awaitStubbedRequest } from './stubbedRequest.ts'

/**
 * Submits the Lead Form, resolving once the Visitor is a Lead, and rejecting when the Lead couldn't be sent. The stub
 * sends nothing: it waits as a request would, then resolves, or rejects behind the dev toggle.
 *
 * ```ts
 * await submitLead({ email: 'jana.novakova@seznam.cz', honeypot: '' })         // resolves: the Visitor is a Lead
 * await submitLead({ email: 'bot@example.com', honeypot: 'https://spam.example' }) // resolves, and sends nothing
 * // pnpm dev, /?submit-lead=fail → a Visitor's submit rejects after 600 ms
 * ```
 */
export const submitLead = async ({ honeypot }: LeadSubmission): Promise<void> => {
  // A filled honeypot means a bot. It sees a success, so it has no reason to retry, and nothing is sent.
  if (honeypot !== '') return
  await awaitStubbedRequest('submit-lead')
}
