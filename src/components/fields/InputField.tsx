// A form's one-line field, wired to react-hook-form (shadcn.md#forms): its label, its Input and its error, read from
// the form's `control` by `name`. `type` makes it a text, email, number… field. The Lead Form's email is one.
import { useId, type ComponentProps, type ReactNode } from 'react'
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** What a field sits on: the page, or a Lead Ask's `block` band (design-identity.md#components). */
export type FieldSurface = 'page' | 'band'

export type InputFieldArgs<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | number>,
  TTransformedValues = TFieldValues,
> = Omit<ComponentProps<typeof Input>, keyof ControllerRenderProps | 'aria-invalid'> & {
  /** The form's control, from useForm(), which the field reads its value and its error from. */
  control: Control<TFieldValues, unknown, TTransformedValues>
  /** The form value the field edits. */
  name: TName
  label: ReactNode
  /** Defaults to `page`. */
  surface?: FieldSurface
}

type SurfaceClassNames = { field: string; input: string; error: string }

// `destructive` can't be read on the band, so there an invalid field keeps the band's text colour, its error turns
// bold, and only the input's border turns red.
const surfaceClassNamesBySurface: Record<FieldSurface, SurfaceClassNames> = {
  page: { field: '', input: '', error: '' },
  band: {
    field: 'data-[invalid=true]:text-block-foreground',
    input: 'bg-background text-foreground dark:bg-background',
    error: 'font-bold text-block-foreground',
  },
}

/**
 * The field: its label over its Input, and the error the form's resolver raised for `name`, once there is one. Every
 * other Input prop (`type`, `placeholder`, `autoComplete`, `className`…) goes to the Input. A `number` field hands the
 * form a number, and NaN while it's empty.
 *
 * ```tsx
 * <InputField control={control} name="email" label="Kam vám tahák poslat?" type="email" surface="band" />
 * // Kam vám tahák poslat? [e-mail]
 * // submitting "jana@" → Tohle nevypadá jako e-mail. Zkontrolujte ho prosím.
 * <InputField control={control} name="amountKc" label="Jednorázová investice" type="number" />
 * // typing 250000 → amountKc 250000; clearing the field → amountKc NaN
 * ```
 */
export const InputField = <
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | number>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  label,
  surface = 'page',
  id,
  type,
  className,
  ...inputArgs
}: InputFieldArgs<TFieldValues, TName, TTransformedValues>) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const surfaceClassNames = surfaceClassNamesBySurface[surface]

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn('gap-2', surfaceClassNames.field)}>
          <FieldLabel htmlFor={inputId}>
            <span className="text-label">{label}</span>
          </FieldLabel>
          <Input
            {...inputArgs}
            {...field}
            value={Number.isNaN(field.value) ? '' : field.value}
            onChange={(event) =>
              field.onChange(type === 'number' ? event.currentTarget.valueAsNumber : event.currentTarget.value)
            }
            id={inputId}
            type={type}
            aria-invalid={fieldState.invalid}
            className={cn(surfaceClassNames.input, className)}
          />
          <FieldError errors={[fieldState.error]} className={surfaceClassNames.error} />
        </Field>
      )}
    />
  )
}
