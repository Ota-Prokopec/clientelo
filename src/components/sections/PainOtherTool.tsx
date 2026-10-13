// Ad Variant A's Section 03: the Fee Calculator, the Interactive Tool its First Screen didn't open. #12 fills the slot.
import { Section } from './Section.tsx'

/**
 * Ad Variant A's Section 03: the Fee Calculator, its slot carrying the tool's id.
 *
 * ```tsx
 * <PainOtherTool />
 * // <section id="other-tool">03 Poplatek banky vs ETF
 * //   <h2>Kolik vás stojí poplatek bankovního fondu?</h2><div id="fee-calculator" /></section>
 * ```
 */
export const PainOtherTool = () => {
  return (
    <Section id="other-tool" number="03" label="Poplatek banky vs ETF">
      <h2 className="text-title text-heading">Kolik vás stojí poplatek bankovního fondu?</h2>
      <div id="fee-calculator" className="min-h-16" />
    </Section>
  )
}
