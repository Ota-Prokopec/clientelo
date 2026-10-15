// The one Lead Form (`lead-form`): an email field, a honeypot no person sees, and the red CTA, validated by leadSchema
// and sent through the submitLead() seam. It moves through idle, typing, submitting, and success or error, shown on
// `data-state`, and gives way to Delivery once the Visitor is a Lead. A returning Lead's opens as "remembered", so a
// reload never reads as a submit. Each step is a Funnel Event, from lead_form_seen to lead_form_success or
// lead_form_error, and a filled honeypot records none of them. Section 04 renders it on the Lead Ask's band, which is
// why its texts take the band's colour.
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { shutOutBot, trackFunnelEvent } from '@/funnel/trackFunnelEvent.ts';
import { useOnFirstView, type ElementVisibility } from '@/hooks/useOnFirstView.ts';
import { submitLead } from '@/lead/submitLead.ts';
import { leadSchema, type LeadSubmission } from '@/schemas/leadSchema.ts';
import type { Lead } from '@/types.ts';
import { Delivery } from './Delivery.tsx';
import { HoneypotField } from './fields/HoneypotField.tsx';
import { InputField } from './fields/InputField.tsx';
import { LeadCta } from './LeadCta.tsx';

/** The Lead Form's id, which every link to the Lead Form targets. Step 5's Funnel Events hook onto it. */
export const leadFormId = 'lead-form';

/** The id of the Lead Form's email field, which a link to the Lead Form focuses. */
export const leadFormEmailId = 'lead-form-email';

/**
 * Where the Lead Form is: untouched, being filled in, waiting for submitLead(), submitted on this visit, failed and
 * ready to retry, or gone because an earlier visit remembers the Lead.
 */
export type LeadFormState = 'idle' | 'typing' | 'submitting' | 'success' | 'error' | 'remembered';

export type LeadFormProps = {
  /** The Visitor as a Lead once they are one, or null while they are a Visitor. */
  lead: Lead | null;
  /** Called once submitLead() resolves, with the email the new Lead left. */
  onLeadFormSubmitted: (email: string) => void;
};

/** The Lead Form's state once the Visitor is a Lead: a new Lead's submit succeeded, a returning Lead's is remembered. */
const leadFormStateByLeadKind: Record<Lead['kind'], LeadFormState> = {
  new: 'success',
  returning: 'remembered',
};

/** The submit's label while submitLead() runs and after it fails. In every other state, the CTA's own label. */
const submitLabelByLeadFormState: Partial<Record<LeadFormState, string>> = {
  submitting: 'Odesíláme…',
  error: 'Zkusit znovu',
};

/** The Lead Form's id, as the observer behind lead_form_seen watches it. */
const leadFormIds = [leadFormId] as const;

/**
 * Whether the Lead Form counts as seen: at least half of it on screen.
 *
 * ```ts
 * isLeadFormSeen({ visibleRatio: 0.5, visibleHeight: 160, viewportHeight: 667 }) // true
 * ```
 */
const isLeadFormSeen = ({ visibleRatio }: ElementVisibility) => visibleRatio >= 0.5;

/**
 * Records the Lead Form's first view.
 *
 * ```ts
 * trackLeadFormSeen() // lead_form_seen
 * ```
 */
const trackLeadFormSeen = () => {
  trackFunnelEvent({ event: 'lead_form_seen' });
};

/**
 * Records the first keystroke in the email field; the once-per-Visit rule drops every later one.
 *
 * ```ts
 * trackLeadFormStart() // lead_form_start
 * ```
 */
const trackLeadFormStart = () => {
  trackFunnelEvent({ event: 'lead_form_start' });
};

/**
 * Records a submit that leadSchema rejected, before anything is sent.
 *
 * ```ts
 * trackInvalidEmail() // lead_form_error { reason: 'invalid-email' }
 * ```
 */
const trackInvalidEmail = () => {
  trackFunnelEvent({ event: 'lead_form_error', reason: 'invalid-email' });
};

/**
 * The Lead Form, or Delivery once the Visitor is a Lead. It checks the email when the Visitor submits, then again as
 * they correct it, and keeps an error from submitLead() on screen until the next submit.
 *
 * ```tsx
 * <LeadForm lead={null} onLeadFormSubmitted={handleLeadFormSubmitted} />
 * // <div id="lead-form" data-state="idle">Kam vám tahák poslat? [e-mail] [Chci tahák zdarma →] E-mail použijeme…</div>
 * // typing jana@seznam.cz and submitting → data-state "typing", "submitting", then onLeadFormSubmitted('jana@seznam.cz')
 * // pnpm dev, /?submit-lead=fail          → "error": Tahák se nepodařilo odeslat… [Zkusit znovu →]
 * <LeadForm lead={{ kind: 'returning' }} onLeadFormSubmitted={handleLeadFormSubmitted} />
 * // <div id="lead-form" data-state="remembered"><Delivery /> E-mail použijeme…</div>
 * ```
 */
export const LeadForm = ({ lead, onLeadFormSubmitted }: LeadFormProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty, isSubmitting },
  } = useForm({ resolver: zodResolver(leadSchema), defaultValues: { email: '', honeypot: '' } });
  const [hasSubmitFailed, setHasSubmitFailed] = useState(false);
  useOnFirstView({ elementIds: leadFormIds, isViewed: isLeadFormSeen, onFirstView: trackLeadFormSeen });
  const leadFormState: LeadFormState = lead
    ? leadFormStateByLeadKind[lead.kind]
    : isSubmitting
      ? 'submitting'
      : hasSubmitFailed
        ? 'error'
        : isDirty
          ? 'typing'
          : 'idle';

  /**
   * Handles the form's submit event: validates the Lead Form against leadSchema, sends a valid one through
   * submitLead(), and reports the new Lead or records the failure. An invalid one shows its field errors and sends
   * nothing.
   *
   * ```tsx
   * <form onSubmit={submitHandler}>
   * // { email: 'jana.novakova@seznam.cz', honeypot: '' } → submitLead() resolves →
   * //   onLeadFormSubmitted('jana.novakova@seznam.cz'); it rejects → "error", and the Visitor can retry
   * // { email: 'jana@', honeypot: '' } → the email's field error, and submitLead() isn't called
   * ```
   */
  const submitHandler = handleSubmit(async (leadSubmission: LeadSubmission) => {
    setHasSubmitFailed(false);
    try {
      await submitLead(leadSubmission);
    } catch {
      trackFunnelEvent({ event: 'lead_form_error', reason: 'submit-failed' });
      setHasSubmitFailed(true);
      return;
    }
    trackFunnelEvent({ event: 'lead_form_success' });
    onLeadFormSubmitted(leadSubmission.email);
  }, trackInvalidEmail);

  /**
   * Records every submit attempt, then submits. A filled honeypot means a bot, which records nothing from here on, not
   * even this attempt, so bots never reach the Funnel.
   *
   * ```tsx
   * <form onSubmit={submitLeadForm}>
   * // a submit → lead_form_submit, then lead_form_success or lead_form_error
   * // a submit with the honeypot filled → nothing recorded
   * ```
   */
  const submitLeadForm = (event: FormEvent<HTMLFormElement>) => {
    if (getValues('honeypot') !== '') shutOutBot();
    trackFunnelEvent({ event: 'lead_form_submit' });
    return submitHandler(event);
  };

  return (
    <div id={leadFormId} data-state={leadFormState} className="grid scroll-mt-6 gap-4">
      {lead ? (
        <Delivery lead={lead} />
      ) : (
        <form noValidate onSubmit={submitLeadForm} className="grid gap-3">
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
            // `input` rather than `keydown`, which a phone's keyboard often reports without a key, and which an
            // autofilled address never fires.
            onInput={trackLeadFormStart}
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
