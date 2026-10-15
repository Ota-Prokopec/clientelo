// Tests the stand-in request the submitLead() and submitSegment() seams wait on: it resolves, and in development fails
// only behind its own seam's `?<toggle>=fail`.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { awaitStubbedRequest } from '@lib/lead/stubbedRequest.ts'

describe('awaitStubbedRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves outside a browser, where there is no `location`', async () => {
    await expect(awaitStubbedRequest('submit-lead')).resolves.toBeUndefined()
  })

  it('rejects behind its own toggle', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?submit-segment=fail'))

    await expect(awaitStubbedRequest('submit-segment')).rejects.toThrow('?submit-segment=fail')
  })

  it('resolves behind another seam’s toggle', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?submit-lead=fail'))

    await expect(awaitStubbedRequest('submit-segment')).resolves.toBeUndefined()
  })

  it('resolves when the toggle is set to anything but `fail`', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?submit-lead=1'))

    await expect(awaitStubbedRequest('submit-lead')).resolves.toBeUndefined()
  })
})
