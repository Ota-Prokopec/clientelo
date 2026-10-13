// The one Lead Form (`lead-form`): an email field, a honeypot no person sees, and the red CTA, validated by leadSchema
// and sent through the submitLead() seam. It moves through idle, typing, submitting, and success or error, shown on
// `data-state` for step 5's Funnel Events, and gives way to Delivery once the Visitor is a Lead. Section 04
// renders it on the Lead Ask's band, which is why its texts take the band's colour.
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { submitLead } from '@/lead/submitLead.ts'
import { cn } from '@/lib/utils'
import { leadSchema, type LeadSubmission } from '@/schemas/leadSchema.ts'
import { Delivery } from './Delivery.tsx'
import { leadCtaClassName, leadCtaLabel } from './leadCta.ts'
import { leadFormEmailId, leadFormId } from './leadFormIds.ts'

/** Where the Lead Form is: untouched, being filled in, waiting for submitLead(), done, or failed and ready to retry. */
export type LeadFormState = 'idle' | 'typing' | 'submitting' | 'success' | 'error'

/** How the last submit ended, until the next one starts. */
type SubmitOutcome = Extract<LeadFormState, 'success' | 'error'>

export type LeadFormArgs = {
  /** Called once submitLead() resolves: the Visitor is now a Lead. */
  onLeadFormSubmitted: () => void
}

const submitLabelByLeadFormState: Record<Exclude<LeadFormState, 'success'>, string> = {
  idle: leadCtaLabel,
  typing: leadCtaLabel,
  submitting: 'Odesíláme…',
  error: 'Zkusit znovu',
}

/**
 * The Lead Form. It checks the email when the Visitor submits, then again as they correct it, and keeps an error
 * from submitLead() on screen until the next submit.
 *
 * ```tsx
 * <LeadForm onLeadFormSubmitted={() => setIsLead(true)} />
 * // <div id="lead-form" data-state="idle">Kam vám tahák poslat? [e-mail] [Chci tahák zdarma →] E-mail použijeme…</div>
 * // typing jana@seznam.cz and submitting → data-state "typing", "submitting", then "success" and Delivery
 * // pnpm dev, /?submit-lead=fail          → "error": Tahák se nepodařilo odeslat… [Zkusit znovu →]
 * ```
 */
export const LeadForm = ({ onLeadFormSubmitted }: LeadFormArgs) => {
  const honeypotId = useId()
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({ resolver: zodResolver(leadSchema), defaultValues: { email: '', honeypot: '' } })
  const [submitOutcome, setSubmitOutcome] = useState<SubmitOutcome | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const leadFormState: LeadFormState = isSubmitting ? 'submitting' : (submitOutcome ?? (isDirty ? 'typing' : 'idle'))

  /**
   * Sends a valid Lead Form through submitLead(), and records how it ended.
   *
   * ```ts
   * await sendLeadForm({ email: 'jana.novakova@seznam.cz', honeypot: '' })
   * // resolves → "success", and onLeadFormSubmitted() runs; rejects → "error", and the Visitor can retry
   * ```
   */
  const sendLeadForm = async (leadSubmission: LeadSubmission) => {
    setSubmitOutcome(null)
    try {
      await submitLead(leadSubmission)
    } catch {
      setSubmitOutcome('error')
      return
    }
    setSubmittedEmail(leadSubmission.email)
    setSubmitOutcome('success')
    onLeadFormSubmitted()
  }

  return (
    <div id={leadFormId} data-state={leadFormState} className="grid scroll-mt-6 gap-4">
      {leadFormState === 'success' ? (
        <Delivery email={submittedEmail} />
      ) : (
        <form noValidate onSubmit={handleSubmit(sendLeadForm)} className="grid gap-3">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              // The band is `block`, on which `destructive` can't be read, so an invalid field keeps the band's text
              // colour and only the input's border turns red.
              <Field data-invalid={fieldState.invalid} className="gap-2 data-[invalid=true]:text-block-foreground">
                <FieldLabel htmlFor={leadFormEmailId}>
                  <span className="text-label">Kam vám tahák poslat?</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={leadFormEmailId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="např. jana@seznam.cz"
                  readOnly={isSubmitting}
                  aria-invalid={fieldState.invalid}
                  className="h-12 bg-background text-foreground dark:bg-background"
                />
                <FieldError errors={[fieldState.error]} className="font-bold text-block-foreground" />
              </Field>
            )}
          />
          <Controller
            name="honeypot"
            control={control}
            render={({ field }) => (
              // Hidden from every person, sighted or not, and out of the tab order. A bot that fills in every field
              // fills this one too, and submitLead() then sends nothing.
              // The wrapper, not the Field, is `sr-only`: the Field's own `w-full` would outweigh its 1 px width and
              // stretch the page sideways.
              <div aria-hidden="true" className="sr-only">
                <Field>
                  <FieldLabel htmlFor={honeypotId}>Toto pole nevyplňujte</FieldLabel>
                  <Input {...field} id={honeypotId} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </Field>
              </div>
            )}
          />
          {leadFormState === 'error' && (
            <p role="alert" className="font-bold">
              Tahák se nepodařilo odeslat. Zkontrolujte prosím připojení a zkuste to znovu.
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className={cn(leadCtaClassName, 'w-full')}>
            {submitLabelByLeadFormState[leadFormState]}
            <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-5" />
          </Button>
        </form>
      )}
      <p className="text-note">
        E-mail použijeme jen k zaslání taháku a několika e-mailů o ETF, z jejichž odběru se kdykoli odhlásíte jedním
        kliknutím (
        <Link to="/ochrana-osobnich-udaju" className="underline underline-offset-2">
          zásady ochrany osobních údajů
        </Link>
        ).
      </p>
    </div>
  )
}
