// Ad Variant B's Section 03: the Fund Picker, the Interactive Tool its First Screen didn't open. #11 fills the slot.
import { Section } from './Section.tsx'

/**
 * Ad Variant B's Section 03: the Fund Picker, its slot carrying the tool's id.
 *
 * ```tsx
 * <MoneyOtherTool />
 * // <section id="other-tool">03 Dvojče k americkému ETF
 * //   <h2>Najděte dvojče ke svému americkému ETF</h2><div id="fund-picker" /></section>
 * ```
 */
export const MoneyOtherTool = () => {
  return (
    <Section id="other-tool" number="03" label="Dvojče k americkému ETF">
      <h2 className="text-title text-heading">Najděte dvojče ke svému americkému ETF</h2>
      <div id="fund-picker" className="min-h-16" />
    </Section>
  )
}
