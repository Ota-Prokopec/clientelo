// A form's checkbox, wired to react-hook-form like InputField (shadcn.md#forms): a Checkbox beside its label, read from
// the form's `control` by `name`. It starts unticked unless the form's default says otherwise. The Lead Form's opt-in
// to the Welcome Emails is one: unticked, since ignoring it is no consent.
import { useId, type ReactNode } from 'react'
import { Controller, type FieldPathByValue, type FieldValues } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Field, FieldLabel } from '@/components/ui/field.tsx'
import type { FieldSurface } from './InputField.tsx'
import type { FieldProps } from './types.ts'

export type CheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
  TTransformedValues = TFieldValues,
> = FieldProps<TFieldValues, TName, TTransformedValues> & {
  label: ReactNode
  /** Defaults to `page`. */
  surface?: FieldSurface
  disabled?: boolean
}

// On a Lead Ask's `block` band the Checkbox takes the band's text colour, and fills with it once ticked.
const checkboxClassNameBySurface: Record<FieldSurface, string> = {
  page: 'size-5',
  band: 'size-5 border-block-foreground data-checked:border-block-foreground data-checked:bg-block-foreground data-checked:text-block',
}

/**
 * The checkbox beside its label, writing `true` or `false` to the form value at `name`.
 *
 * ```tsx
 * <CheckboxField control={control} name="welcomeEmailsConsent" label="Chci i navazující e-maily" surface="band" />
 * // [ ] Chci i navazující e-maily
 * // ticking it → welcomeEmailsConsent true; ticking it again → false
 * ```
 */
export const CheckboxField = <
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  label,
  surface = 'page',
  disabled,
}: CheckboxFieldProps<TFieldValues, TName, TTransformedValues>) => {
  const checkboxId = useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal" className="items-start gap-3">
          <Checkbox
            id={checkboxId}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            disabled={disabled}
            className={checkboxClassNameBySurface[surface]}
          />
          <FieldLabel htmlFor={checkboxId} className="text-note font-normal">
            {label}
          </FieldLabel>
        </Field>
      )}
    />
  )
}
