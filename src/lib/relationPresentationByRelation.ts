// How a Substitute reads and looks for a Twin and for a closest alternative: in the Fund Picker's answer, the Substitute
// it sets giant and the others it lists below, and in the Twin table, which the Lead Magnet PDF and the content a Lead
// unlocks on the page both group by relation.
import type { SubstituteRelation } from '@/types.ts'

/** How the answer reads and looks for a Twin and for a closest alternative. */
export type RelationPresentation = {
  substituteLabel: string
  indexLabel: string
  otherSubstitutesLabel: string
  /**
   * The Twin table's heading for a group of Substitutes, followed by their index and the ETFs they replace: `one` for a
   * group of a single Substitute, `many` for more.
   */
  substituteGroupLabel: { one: string; many: string }
  /** The colour of the Substitute's label, Ticker and TER, joined to a size in a plain string, never through `cn`. */
  colorClassName: 'text-brand' | 'text-heading'
}

// Only a Twin is set in `brand` (design-identity.md#colour), so a closest alternative never looks like one
// (docs/strategy.md#twins).
export const relationPresentationByRelation: Record<SubstituteRelation, RelationPresentation> = {
  twin: {
    substituteLabel: 'Dvojče',
    indexLabel: 'Stejný index',
    otherSubstitutesLabel: 'Další dvojčata',
    substituteGroupLabel: { one: 'Dvojče na stejný index', many: 'Dvojčata na stejný index' },
    colorClassName: 'text-brand',
  },
  'closest-alternative': {
    substituteLabel: 'Nejbližší alternativa',
    indexLabel: 'Podobný index',
    otherSubstitutesLabel: 'Další alternativy',
    substituteGroupLabel: {
      one: 'Nejbližší alternativa na podobný index',
      many: 'Nejbližší alternativy na podobný index',
    },
    colorClassName: 'text-heading',
  },
}
