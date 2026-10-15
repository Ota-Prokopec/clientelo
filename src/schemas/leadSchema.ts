// The Lead Form's validation rules, with Czech messages, kept apart from the form so they are tested on their own
// (ADR-0003, shadcn.md#forms). Zod Mini, whose checks tree-shake, keeps the validator off most of the First Screen's
// bundle.
import { z } from 'zod/mini'

export const leadSchema = z.object({
  // Trimmed before it is checked, so a space a phone keyboard adds after the address isn't an error. An empty field
  // stops at the first message, so the Visitor never reads two.
  email: z.pipe(
    z.string().check(z.trim(), z.minLength(1, 'Vyplňte prosím e-mail, na který vám tahák pošleme.')),
    z.email('Tohle nevypadá jako e-mail. Zkontrolujte ho prosím.'),
  ),
  honeypot: z.string(),
  // The Welcome Emails Consent: an unticked checkbox, so only a tick consents to the Day 2 and Day 5 Welcome Emails.
  welcomeEmailsConsent: z.boolean(),
})

/**
 * What the Lead Form submits once it is valid: the Visitor's trimmed email, the honeypot a person never fills, and
 * whether they ticked the Welcome Emails Consent.
 */
export type LeadSubmission = z.output<typeof leadSchema>
