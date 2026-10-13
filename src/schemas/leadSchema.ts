// The Lead Form's validation rules, with Czech messages. Step 7's /api/lead validates against the same schema, so the
// form and the server accept and reject the same input (ADR-0003, shadcn.md#forms).
import { z } from 'zod'

export const leadSchema = z.object({
  // Trimmed before it is checked, so a space a phone keyboard adds after the address isn't an error.
  email: z
    .string()
    .trim()
    .min(1, 'Vyplňte prosím e-mail, na který vám tahák pošleme.')
    .pipe(z.email('Tohle nevypadá jako e-mail. Zkontrolujte ho prosím.')),
  honeypot: z.string(),
})

/** What the Lead Form submits once it is valid: the Visitor's trimmed email and the honeypot a person never fills. */
export type LeadSubmission = z.output<typeof leadSchema>
