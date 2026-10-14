// The Segmentation Question (`segmentation-question`): "Kde investujete?", asked once of a new Lead in Delivery, after the
// PDF has started downloading, so answering never delays it. It is optional and takes one tap, on a segmented control
// whose options wrap onto rows (design-identity.md#components). The answer, the Lead's Segment, goes through the
// submitSegment() seam and picks their Day 5 Welcome Email (docs/welcome-emails.md). It shows unanswered, submitting,
// answered or error on `data-state`, for step 5's Funnel Events.
import { useState } from 'react'
import { submitSegment } from '@/lead/submitSegment.ts'
import type { Segment } from '@/types.ts'
import { SegmentedControl } from './SegmentedControl.tsx'

/** Where the question is: not answered yet, waiting for submitSegment(), answered, or failed and ready to answer again. */
export type SegmentationQuestionState = 'unanswered' | 'submitting' | 'answered' | 'error'

export type SegmentationQuestionProps = {
  /** The new Lead's email, which their Segment is stored with. */
  email: string
}

// Each Segment as its option names it, in the order the options show.
const segmentLabelBySegment: Record<Segment, string> = {
  xtb: 'XTB',
  'trading-212': 'Trading 212',
  revolut: 'Revolut',
  'fio-patria': 'Fio / Patria',
  'robo-advisor': 'Portu nebo jiný robo-advisor',
  'bank-fund': 'Fond u banky',
  'nowhere-yet': 'Zatím nikde',
}

// The line under the options: why to answer, then whether the answer arrived.
const statusLineBySegmentationQuestionState: Record<SegmentationQuestionState, string> = {
  unanswered: 'Nepovinné. Podle odpovědi vám za pár dní pošleme, jak dvojče koupit.',
  submitting: 'Ukládáme odpověď…',
  answered: 'Díky. Návod podle vaší odpovědi vám přijde e-mailem za pár dní.',
  error: 'Odpověď se nepodařilo uložit. Zkuste ji prosím vybrat znovu.',
}

/**
 * Whether an option's value is a Segment.
 *
 * ```ts
 * isSegment('xtb')      // true
 * isSegment('toString') // false
 * ```
 */
const isSegment = (optionValue: string): optionValue is Segment => Object.hasOwn(segmentLabelBySegment, optionValue)

/**
 * The question, its options, and a status line that changes as the answer is sent.
 *
 * ```tsx
 * <SegmentationQuestion email="jana.novakova@seznam.cz" />
 * // Kde investujete? XTB · Trading 212 · Revolut · Fio / Patria · Portu nebo jiný robo-advisor · Fond u banky · Zatím nikde
 * // pressing XTB → submitSegment({ email, segment: 'xtb' }), "submitting", then "answered": Díky. Návod…
 * // pressing Revolut while XTB is still "submitting" → nothing; once XTB is answered, Revolut replaces it
 * // pnpm dev, /?submit-segment=fail → "error", and no option stays picked, so the Lead can pick again
 * ```
 */
export const SegmentationQuestion = ({ email }: SegmentationQuestionProps) => {
  const [pickedSegment, setPickedSegment] = useState<Segment | null>(null)
  const [segmentationQuestionState, setSegmentationQuestionState] = useState<SegmentationQuestionState>('unanswered')

  /**
   * Sends the picked option's Segment through submitSegment(), and records how it ended. A pick while the last one is
   * still being sent is ignored, so two answers never race each other.
   *
   * ```ts
   * await pickSegment('revolut') // "answered"; it rejects → "error", and Revolut is no longer picked
   * ```
   */
  const pickSegment = async (pickedOptionValue: string) => {
    if (segmentationQuestionState === 'submitting' || !isSegment(pickedOptionValue)) return
    setPickedSegment(pickedOptionValue)
    setSegmentationQuestionState('submitting')
    try {
      await submitSegment({ email, segment: pickedOptionValue })
    } catch {
      // Nothing stays picked, since pressing the picked option again does nothing and the Lead may retry that one.
      setPickedSegment(null)
      setSegmentationQuestionState('error')
      return
    }
    setSegmentationQuestionState('answered')
  }

  return (
    <div id="segmentation-question" data-state={segmentationQuestionState} className="grid gap-2">
      <SegmentedControl
        label="Kde investujete?"
        options={Object.entries(segmentLabelBySegment).map(([segment, segmentLabel]) => ({
          value: segment,
          content: segmentLabel,
        }))}
        pickedValue={pickedSegment}
        onPick={pickSegment}
        optionClassName="h-11 px-3 font-bold"
      />
      {/* `destructive` can't be read on the band, so an error is bold `block-foreground` (design-identity.md#components). */}
      <p aria-live="polite" className={segmentationQuestionState === 'error' ? 'font-bold' : undefined}>
        {statusLineBySegmentationQuestionState[segmentationQuestionState]}
      </p>
    </div>
  )
}
