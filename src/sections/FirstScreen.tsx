// The First Screen: the Ad Variant's Ad Promise and its Interactive Tool, deliverable without scrolling at 375 px.
// The tool slots (`fund-picker`, `fee-calculator`) show the static comparison until #11 and #12 make them interactive.
import { orderInteractiveTools, type AdVariant } from '../adVariant.ts'
import { MoneyFirstScreen } from './MoneyFirstScreen.tsx'
import { PainFirstScreen } from './PainFirstScreen.tsx'
import { Section } from './Section.tsx'
import { sectionLabelByInteractiveTool } from './sectionLabelByInteractiveTool.ts'

export type FirstScreenArgs = { adVariant: AdVariant }

/**
 * The First Screen the Ad Variant opens: `pain` shows VOO and its Twin, `money` a bank fund's TER against a Twin's.
 *
 * ```tsx
 * <FirstScreen adVariant="pain" />  // VOO struck out over SPYL, in the `fund-picker` slot
 * <FirstScreen adVariant="money" /> // 2,22 % over 0,03 %, in the `fee-calculator` slot
 * ```
 */
export function FirstScreen({ adVariant }: FirstScreenArgs) {
  const [firstInteractiveTool] = orderInteractiveTools(adVariant)

  return (
    <Section
      id="first-screen"
      number="01"
      label={sectionLabelByInteractiveTool[firstInteractiveTool]}
      data-ad-variant={adVariant}
    >
      {adVariant === 'money' ? <MoneyFirstScreen /> : <PainFirstScreen />}
    </Section>
  )
}
