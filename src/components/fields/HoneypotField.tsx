// A form's honeypot, wired to react-hook-form like InputField: a field hidden from every person, which a bot that
// fills in every field fills too. The Lead Form's `honeypot` is one, and submitLead() sends nothing once it's filled.
import { useId } from 'react'
import { Controller, type Control, type FieldPathByValue, type FieldValues } from 'react-hook-form'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export type HoneypotFieldArgs<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
  TTransformedValues = TFieldValues,
> = {
  /** The form's control, from useForm(), which the field writes a bot's input to. */
  control: Control<TFieldValues, unknown, TTransformedValues>
  /** The form value a bot fills. */
  name: TName
}

/**
 * The honeypot: an Input named `website`, a name a bot fills, out of sight and out of the tab order.
 *
 * ```tsx
 * <HoneypotField control={control} name="honeypot" />
 * // nothing on screen, and nothing a screen reader reads
 * // a bot typing https://spam.example into `website` → honeypot "https://spam.example"
 * ```
 */
export const HoneypotField = <
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
}: HoneypotFieldArgs<TFieldValues, TName, TTransformedValues>) => {
  const inputId = useId()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        // The wrapper, not the Field, is `sr-only`: the Field's own `w-full` would outweigh its 1 px width and
        // stretch the page sideways.
        <div aria-hidden="true" className="sr-only">
          <Field>
            <FieldLabel htmlFor={inputId}>Toto pole nevyplňujte</FieldLabel>
            <Input {...field} id={inputId} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </Field>
        </div>
      )}
    />
  )
}
