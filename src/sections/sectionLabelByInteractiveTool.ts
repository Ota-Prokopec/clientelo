// The grid label an Interactive Tool's Section carries beside its number, whether it opens the page (01) or comes third (03).
import type { InteractiveTool } from '../adVariant.ts'

export const sectionLabelByInteractiveTool: Record<InteractiveTool, string> = {
  'fund-picker': 'Dvojče k americkému ETF',
  'fee-calculator': 'Poplatek banky vs ETF',
}
