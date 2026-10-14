// The stand-in for a request to step 7's API, which the submitLead() and submitSegment() seams wait on until step 7 of
// docs/plan.md replaces each with a real request. In `pnpm dev`, opening the page with `?<toggle>=fail` makes one
// seam's stand-in fail, so the error state of what calls it can be reached.

/** How long the stand-in takes, about as long as a real request, so a form's submitting state shows. */
const stubbedRequestDurationMs = 600

/** The query parameter that makes one seam's stand-in fail in `pnpm dev`, set to `fail`. */
export type FailureToggle = 'submit-lead' | 'submit-segment'

/**
 * Whether the dev toggle asks the stand-in to fail. Always false in a production build.
 *
 * ```ts
 * // pnpm dev, /?utm_content=money&submit-lead=fail → isFailureSimulated('submit-lead') true, ('submit-segment') false
 * // pnpm dev, /?utm_content=money                  → false
 * // pnpm build                                     → false
 * ```
 */
const isFailureSimulated = (failureToggle: FailureToggle): boolean => {
  if (!import.meta.env.DEV) return false
  // `location` is missing outside a browser, such as in a test that doesn't set it.
  return new URLSearchParams(globalThis.location?.search).get(failureToggle) === 'fail'
}

/**
 * Waits as a request would, then resolves, or rejects behind the dev toggle.
 *
 * ```ts
 * await awaitStubbedRequest('submit-lead') // resolves after 600 ms
 * // pnpm dev, /?submit-lead=fail          → rejects after 600 ms
 * ```
 */
export const awaitStubbedRequest = async (failureToggle: FailureToggle): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, stubbedRequestDurationMs))
  if (isFailureSimulated(failureToggle)) throw new Error(`The stubbed request failed: simulated by ?${failureToggle}=fail`)
}
