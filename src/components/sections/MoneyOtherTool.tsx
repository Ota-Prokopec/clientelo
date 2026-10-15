// Ad Variant B's Section 03: the Fund Picker, the Interactive Tool its First Screen didn't open.
import { FundPicker } from '@/components/FundPicker.tsx'
import { Section } from './Section.tsx'

/**
 * Ad Variant B's Section 03: the Fund Picker under the Section's own heading.
 *
 * ```tsx
 * <MoneyOtherTool />
 * // <section id="other-tool">03 Dvojče k americkému ETF
 * //   <h2>Najděte dvojče ke svému americkému ETF</h2><div id="fund-picker">…</div></section>
 * ```
 */
export const MoneyOtherTool = () => {
  return (
    <Section id="other-tool" number="03" label="Dvojče k americkému ETF">
      <h2 className="text-title text-heading">Najděte dvojče ke svému americkému ETF</h2>
      <FundPicker />
    </Section>
  )
}
