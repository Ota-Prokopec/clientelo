// The one Lead Form (`lead-form`): an email field, a honeypot no person sees, and the red CTA, validated by leadSchema
// and sent through the submitLead() seam. It moves through idle, typing, submitting, and success or error, shown on
// `data-state` for step 5's Funnel Events, and gives way to Delivery once the Visitor is a Lead. Section 04
// renders it on the Lead Ask's band, which is why its texts take the band's colour.
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { submitLead } from '@/lead/submitLead.ts';
import { leadSchema, type LeadSubmission } from '@/schemas/leadSchema.ts';
import { Delivery } from './Delivery.tsx';
import { HoneypotField } from './fields/HoneypotField.tsx';
import { InputField } from './fields/InputField.tsx';
import { LeadCta } from './LeadCta.tsx';

/** The Lead Form's id, which every link to the Lead Form targets. Step 5's Funnel Events hook onto it. */
export const leadFormId = 'lead-form';

/** The id of the Lead Form's email field, which a link to the Lead Form focuses. */
export const leadFormEmailId = 'lead-form-email';

/** Where the Lead Form is: untouched, being filled in, waiting for submitLead(), done, or failed and ready to retry. */
export type LeadFormState = 'idle' | 'typing' | 'submitting' | 'success' | 'error';

/** How the last submit ended, until the next one starts. */
type SubmitOutcome = Extract<LeadFormState, 'success' | 'error'>;

export type LeadFormArgs = {
  /** Called once submitLead() resolves: the Visitor is now a Lead. */
  onLeadFormSubmitted: () => void;
};

/** The submit's label while submitLead() runs and after it fails. In every other state, the CTA's own label. */
const submitLabelByLeadFormState: Partial<Record<LeadFormState, string>> = {
  submitting: 'Odesíláme…',
  error: 'Zkusit znovu',
};

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
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({ resolver: zodResolver(leadSchema), defaultValues: { email: '', honeypot: '' } });
  const [submitOutcome, setSubmitOutcome] = useState<SubmitOutcome | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const leadFormState: LeadFormState = isSubmitting ? 'submitting' : (submitOutcome ?? (isDirty ? 'typing' : 'idle'));

  /**
   * Handles the form's submit event: validates the Lead Form against leadSchema, sends a valid one through
   * submitLead(), and records how it ended. An invalid one shows its field errors and sends nothing.
   *
   * ```tsx
   * <form onSubmit={submitHandler}>
   * // { email: 'jana.novakova@seznam.cz', honeypot: '' } → submitLead() resolves → "success", and
   * //   onLeadFormSubmitted() runs; it rejects → "error", and the Visitor can retry
   * // { email: 'jana@', honeypot: '' } → the email's field error, and submitLead() isn't called
   * ```
   */
  const submitHandler = handleSubmit(async (leadSubmission: LeadSubmission) => {
    setSubmitOutcome(null);
    try {
      await submitLead(leadSubmission);
    } catch {
      setSubmitOutcome('error');
      return;
    }
    setSubmittedEmail(leadSubmission.email);
    setSubmitOutcome('success');
    onLeadFormSubmitted();
  });

  return (
    <div id={leadFormId} data-state={leadFormState} className="grid scroll-mt-6 gap-4">
      {leadFormState === 'success' ? (
        <Delivery email={submittedEmail} />
      ) : (
        <form noValidate onSubmit={submitHandler} className="grid gap-3">
          <InputField
            control={control}
            name="email"
            label="Kam vám tahák poslat?"
            surface="band"
            id={leadFormEmailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="např. jana@seznam.cz"
            readOnly={isSubmitting}
            className="h-12"
          />
          <HoneypotField control={control} name="honeypot" />
          {leadFormState === 'error' && (
            <p role="alert" className="font-bold">
              Tahák se nepodařilo odeslat. Zkontrolujte prosím připojení a zkuste to znovu.
            </p>
          )}
          <LeadCta render={<Button type="submit" disabled={isSubmitting} />} className="w-full">
            {submitLabelByLeadFormState[leadFormState]}
          </LeadCta>
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
  );
};
