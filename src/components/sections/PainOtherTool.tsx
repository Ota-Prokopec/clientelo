// Ad Variant A's Section 03: the Fee Calculator, the Interactive Tool its First Screen didn't open.
import { FeeCalculator } from '../FeeCalculator.tsx'
import { Section } from './Section.tsx'

/**
 * Ad Variant A's Section 03: the Fee Calculator under the Section's own heading.
 *
 * ```tsx
 * <PainOtherTool />
 * // <section id="other-tool">03 Poplatek banky vs ETF
 * //   <h2>Kolik vás stojí poplatek bankovního fondu?</h2><div id="fee-calculator">…</div></section>
 * ```
 */
export const PainOtherTool = () => {
  return (
    <Section id="other-tool" number="03" label="Poplatek banky vs ETF">
      <h2 className="text-title text-heading">Kolik vás stojí poplatek bankovního fondu?</h2>
      <FeeCalculator />
    </Section>
  )
}
