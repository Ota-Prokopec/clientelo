// The colour of a Substitute's label, Ticker and TER, shared by the page's SubstituteFigure and the Lead Magnet PDF's
// Twin table: `pdfTw` reads the same Tailwind classes, and no component can render in both the DOM and the PDF
// (docs/standards/react.md#one-component-per-file). Only a Twin is set in `brand` (design-identity.md#colour), so a
// closest alternative never looks like one (docs/strategy.md#twins).
import type { SubstituteRelation } from '@/types.ts'

export const colorClassNameByRelation: Record<SubstituteRelation, string> = {
  twin: 'text-brand',
  'closest-alternative': 'text-heading',
}
