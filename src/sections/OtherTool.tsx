// The Section holding the Interactive Tool the First Screen didn't open. #11 and #12 fill the tool slots.
import type { InteractiveTool } from '../adVariant.ts'
import styles from './Section.module.css'

export type OtherToolArgs = { interactiveTool: InteractiveTool }

const headingByInteractiveTool: Record<InteractiveTool, string> = {
  'fund-picker': 'Najděte dvojče ke svému americkému ETF',
  'fee-calculator': 'Kolik vás stojí poplatek bankovního fondu?',
}

/**
 * The second Interactive Tool's Section, its slot carrying the tool's id.
 *
 * ```tsx
 * <OtherTool interactiveTool="fee-calculator" /> // <section id="other-tool">…<div id="fee-calculator" /></section>
 * ```
 */
export function OtherTool({ interactiveTool }: OtherToolArgs) {
  return (
    <section id="other-tool" className={styles.section}>
      <h2 className={styles.heading}>{headingByInteractiveTool[interactiveTool]}</h2>
      <div id={interactiveTool} className={styles.slot} />
    </section>
  )
}
