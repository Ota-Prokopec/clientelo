// The types every field in src/components/fields/ shares. Each field's own Args extends FieldArgs and narrows `name` to
// the values that field can edit, so a form can hand a field only one of its own values.
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

/**
 * What every field takes from the form that renders it: the form's `control`, and the `name` of one of that form's
 * values. A name the form's values don't have is a type error.
 *
 * ```tsx
 * const { control } = useForm<{ name: string; surname: string; email: string }>()
 * <InputField control={control} name="email" label="E-mail" />  // compiles
 * <InputField control={control} name="phone" label="Telefon" /> // type error: the form has no `phone`
 * ```
 */
export type FieldArgs<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  /** The form's control, from useForm(), through which the field reads and writes the value at `name`. */
  control: Control<TFieldValues, unknown, TTransformedValues>
  /** The form value the field edits. */
  name: TName
}
