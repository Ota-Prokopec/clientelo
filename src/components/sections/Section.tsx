// The frame every numbered Section shares (design-identity.md#layout): a 2 px rule, the Section's number in `signal`
// and its label on the grid's 3 rem left column, then the Section's content. The Page sets its width and gutter.
import type { ComponentProps } from 'react'
import { cn } from '@lib/utils.ts'
import type { SectionId } from '@/types.ts'
import { NumberedLabel } from '@/components/NumberedLabel.tsx'

/** A Section's number on the grid: 01 First Screen, 02 Key Insight, 03 the other Interactive Tool, 04 the Lead Magnet. */
export type SectionNumber = '01' | '02' | '03' | '04'

export type SectionProps = ComponentProps<'section'> & {
  /** The Section's anchor, which the section_view Funnel Event names. The Footer is a `<footer>`, not a numbered one. */
  id: Exclude<SectionId, 'footer'>
  number: SectionNumber
  label: string
}

/**
 * A numbered Section: its rule, number and label, then its content. Other props land on the `<section>`, and a
 * `className` merges with the frame's.
 *
 * ```tsx
 * <Section id="key-insight" number="02" label="Pravidla EU">…</Section>
 * // <section id="key-insight"><p>02 Pravidla EU</p>…</section>
 * ```
 */
export const Section = ({ number, label, className, children, ...sectionProps }: SectionProps) => {
  return (
    <section className={cn('grid gap-5 pt-12', className)} {...sectionProps}>
      <NumberedLabel number={number} label={label} />
      {children}
    </section>
  )
}
