// How the Fund Picker's answer reads and looks for a Twin and for a closest alternative, shared by the Substitute it
// sets giant and the others it lists below.
import type { SubstituteRelation } from '@/types.ts';

/** How the answer reads and looks for a Twin and for a closest alternative. */
export type RelationPresentation = {
  substituteLabel: string;
  indexLabel: string;
  otherSubstitutesLabel: string;
  /** The colour of the Substitute's label, Ticker and TER, joined to a size in a plain string, never through `cn`. */
  colorClassName: 'text-brand' | 'text-heading';
};

// Only a Twin is set in `brand` (design-identity.md#colour), so a closest alternative never looks like one
// (docs/strategy.md#twins).
export const relationPresentationByRelation: Record<SubstituteRelation, RelationPresentation> = {
  twin: {
    substituteLabel: 'Dvojče',
    indexLabel: 'Stejný index',
    otherSubstitutesLabel: 'Další dvojčata',
    colorClassName: 'text-brand',
  },
  'closest-alternative': {
    substituteLabel: 'Nejbližší alternativa',
    indexLabel: 'Podobný index',
    otherSubstitutesLabel: 'Další alternativy',
    colorClassName: 'text-heading',
  },
};
