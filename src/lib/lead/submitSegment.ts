// The submitSegment() seam the Segmentation Question calls. A final stub that stores and sends nothing, since the
// page is frontend only (docs/plan.md#7-deployment). In `pnpm dev`, opening the page with `?submit-segment=fail` makes
// every send fail, so the question's error state can be reached.
import type { Segment } from '@/types.ts'
import { awaitStubbedRequest } from './stubbedRequest.ts'

/** What the Segmentation Question submits: the new Lead's email, which the Segment is stored with, and their Segment. */
export type SegmentSubmission = { email: string; segment: Segment }

/**
 * Submits a new Lead's Segment, resolving once it is stored, and rejecting when it couldn't be sent. The stub stores
 * nothing: it waits as a request would, then resolves, or rejects behind the dev toggle.
 *
 * ```ts
 * await submitSegment({ email: 'jana.novakova@seznam.cz', segment: 'xtb' }) // resolves after 600 ms
 * // pnpm dev, /?submit-segment=fail                                     → rejects after 600 ms
 * ```
 */
export const submitSegment = async (_segmentSubmission: SegmentSubmission): Promise<void> => {
  await awaitStubbedRequest('submit-segment')
}
