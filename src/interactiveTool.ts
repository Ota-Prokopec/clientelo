// The Interactive Tools: the order an Ad Variant puts them in on the page, and the label each one's Section carries.
import type { AdVariant } from './adVariant.ts'

/** An Interactive Tool, named as its component id. */
export type InteractiveTool = 'fund-picker' | 'fee-calculator'

const sectionLabelByInteractiveTool: Record<InteractiveTool, string> = {
  'fund-picker': 'Dvojče k americkému ETF',
  'fee-calculator': 'Poplatek banky vs ETF',
}

/**
 * The Interactive Tools in the order they appear on the page: the Ad Variant's own tool opens the First Screen, the
 * other one follows in Section 03.
 *
 * ```ts
 * listInteractiveToolsInPageOrder('pain')  // ['fund-picker', 'fee-calculator']
 * listInteractiveToolsInPageOrder('money') // ['fee-calculator', 'fund-picker']
 * ```
 */
export function listInteractiveToolsInPageOrder(adVariant: AdVariant): InteractiveTool[] {
  return adVariant === 'money' ? ['fee-calculator', 'fund-picker'] : ['fund-picker', 'fee-calculator']
}

/**
 * The grid label the Section holding an Interactive Tool carries beside its number, whether it opens the page (01) or
 * comes third (03).
 *
 * ```ts
 * findInteractiveToolSectionLabel('fund-picker')    // 'Dvojče k americkému ETF'
 * findInteractiveToolSectionLabel('fee-calculator') // 'Poplatek banky vs ETF'
 * ```
 */
export function findInteractiveToolSectionLabel(interactiveTool: InteractiveTool): string {
  return sectionLabelByInteractiveTool[interactiveTool]
}
