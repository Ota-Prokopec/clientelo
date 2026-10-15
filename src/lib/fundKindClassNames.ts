// The colours of a fund's TER and bar in the Fee Calculator's result, shared by the page's RemainingAmountBar and the
// Lead Magnet PDF's PdfRemainingAmountRow: `pdfTw` reads the same Tailwind classes, and no component can render in
// both the DOM and the PDF (docs/standards/react.md#one-component-per-file). The Twin is `brand`, the Bank Fund
// `signal` (design-identity.md#colour).
import type { FundKind } from '@/types.ts'

export const terClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'text-signal',
  twin: 'text-brand',
}

export const fillClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'bg-signal',
  twin: 'bg-brand',
}
