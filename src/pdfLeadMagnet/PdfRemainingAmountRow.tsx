// What one fund leaves of the amount in Chapter 5, drawn like the page's RemainingAmountBar: a ruled row over a bar on
// an `accent` track. The Twin's bar is full and `brand`, the Bank Fund's is `signal` and stops at its share.
import { View } from '@react-pdf/renderer'
import type { DataSource } from '@data/figures.ts'
import { formatAmount } from '@lib/format.ts'
import type { FundKind } from '@/types.ts'
import { PdfSourcedFigure } from './PdfSourcedFigure.tsx'
import { PdfText } from './PdfText.tsx'
import { pdfTw } from './pdfTw.ts'


const terClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'text-signal',
  twin: 'text-brand',
}

const fillClassNameByFundKind: Record<FundKind, string> = {
  'bank-fund': 'bg-signal',
  twin: 'bg-brand',
}

export type PdfRemainingAmountRowProps = {
  name: string
  terLabel: string
  /** The Data Source of the fund's TER, which the TER and the amount counted from it are marked by while unverified. */
  terSource: DataSource
  amountKc: number
  /** The share of the Twin's amount this fund leaves, from 0 to 1: the Twin's own row is 1. */
  shareOfTwinAmount: number
  fundKind: FundKind
}

/**
 * The fund's name and TER, its amount on the right, and a bar filled to its share of the Twin's amount.
 *
 * ```tsx
 * <PdfRemainingAmountRow name="ČSOB Akciový" terLabel="2,59 %" terSource={csobAkciovy.source} amountKc={59_166}
 *   shareOfTwinAmount={0.595} fundKind="bank-fund" />
 * // ČSOB Akciový · 2,59 % ……… 59 166 Kč
 * // [████████████░░░░░░░░]
 * ```
 */
export const PdfRemainingAmountRow = ({
  name,
  terLabel,
  terSource,
  amountKc,
  shareOfTwinAmount,
  fundKind,
}: PdfRemainingAmountRowProps) => {
  return (
    <View style={pdfTw('gap-1 border-t border-heading pt-1')}>
      <View style={pdfTw('flex-row items-baseline justify-between')}>
        <PdfText style={pdfTw('text-label text-heading')}>
          {name} ·{' '}
          <PdfText style={pdfTw(terClassNameByFundKind[fundKind])}>
            <PdfSourcedFigure sources={[terSource]}>{terLabel}</PdfSourcedFigure>
          </PdfText>
        </PdfText>
        <PdfText style={pdfTw('text-fact text-heading')}>
          <PdfSourcedFigure sources={[terSource]}>{formatAmount(amountKc, 'Kč')}</PdfSourcedFigure>
        </PdfText>
      </View>
      <View style={pdfTw('h-2 rounded-full bg-accent')}>
        {/* A computed width is the one style no class can carry. */}
        <View
          style={[pdfTw('h-full rounded-full'), pdfTw(fillClassNameByFundKind[fundKind]), { width: `${shareOfTwinAmount * 100}%` }]}
        />
      </View>
    </View>
  )
}
