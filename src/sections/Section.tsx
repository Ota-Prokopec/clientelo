// The frame every numbered Section shares (design-identity.md#layout): a 2 px rule, the Section's number in `signal`
// and its label on the grid's 3 rem left column, then the Section's content in the 16 px gutter.
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** A Section's number on the grid: 01 First Screen, 02 Key Insight, 03 the other Interactive Tool, 04 the Lead Magnet. */
export type SectionNumber = '01' | '02' | '03' | '04'

export type SectionArgs = ComponentProps<'section'> & {
  id: string
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
export const Section = ({ number, label, className, children, ...sectionProps }: SectionArgs) => {
  return (
    <section className={cn('mx-auto grid max-w-xl gap-5 px-4 pt-12', className)} {...sectionProps}>
      <p className="grid grid-cols-[3rem_1fr] border-t-2 border-heading pt-1.5 text-label">
        <span className="text-signal">{number}</span>
        <span>{label}</span>
      </p>
      {children}
    </section>
  )
}
