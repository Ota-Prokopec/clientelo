// Tests the stubbed submitSegment() seam: it accepts a new Lead's Segment, and fails behind the dev toggle so the
// Segmentation Question's error state can be reached.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitSegment } from '@lib/lead/submitSegment.ts'

describe('submitSegment', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves for a new Lead’s Segment', async () => {
    await expect(submitSegment({ email: 'jana.novakova@seznam.cz', segment: 'xtb' })).resolves.toBeUndefined()
  })

  it('rejects in development when the page was opened with ?submit-segment=fail', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?utm_content=pain&submit-segment=fail'))

    await expect(submitSegment({ email: 'jana.novakova@seznam.cz', segment: 'xtb' })).rejects.toThrow(
      '?submit-segment=fail',
    )
  })

  it('resolves when only the Lead Form’s toggle is on, so the Lead can reach the Segmentation Question', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?submit-lead=fail'))

    await expect(submitSegment({ email: 'jana.novakova@seznam.cz', segment: 'bank-fund' })).resolves.toBeUndefined()
  })
})
