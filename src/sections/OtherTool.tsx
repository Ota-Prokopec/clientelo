// The Section holding the Interactive Tool the First Screen didn't open. #11 and #12 fill the tool slots.
import type { InteractiveTool } from '../adVariant.ts'
import { Section } from './Section.tsx'
import { sectionLabelByInteractiveTool } from './sectionLabelByInteractiveTool.ts'

export type OtherToolArgs = { interactiveTool: InteractiveTool }

const headingByInteractiveTool: Record<InteractiveTool, string> = {
  'fund-picker': 'Najděte dvojče ke svému americkému ETF',
  'fee-calculator': 'Kolik vás stojí poplatek bankovního fondu?',
}

/**
 * The second Interactive Tool's Section, its slot carrying the tool's id.
 *
 * ```tsx
 * <OtherTool interactiveTool="fee-calculator" /> // <section id="other-tool">03 …<div id="fee-calculator" /></section>
 * ```
 */
export function OtherTool({ interactiveTool }: OtherToolArgs) {
  return (
    <Section id="other-tool" number="03" label={sectionLabelByInteractiveTool[interactiveTool]}>
      <h2 className="text-title text-heading">{headingByInteractiveTool[interactiveTool]}</h2>
      <div id={interactiveTool} className="min-h-16" />
    </Section>
  )
}
