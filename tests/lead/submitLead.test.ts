// Tests the stubbed submitLead() seam: it accepts a Visitor's email, fails behind the dev toggle, and drops a bot's
// submit silently.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitLead } from '@/lead/submitLead.ts'

describe('submitLead', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves for a Visitor’s email', async () => {
    await expect(submitLead({ email: 'jana.novakova@seznam.cz', honeypot: '' })).resolves.toBeUndefined()
  })

  it('rejects in development when the page was opened with ?submit-lead=fail', async () => {
    vi.stubGlobal('location', new URL('http://localhost:5173/?utm_content=money&submit-lead=fail'))

    await expect(submitLead({ email: 'jana.novakova@seznam.cz', honeypot: '' })).rejects.toThrow('?submit-lead=fail')
  })

  it('resolves for a bot that filled the honeypot, without sending anything', async () => {
    // With the failure toggle on, every send fails, so only a submit that never sends can resolve.
    vi.stubGlobal('location', new URL('http://localhost:5173/?submit-lead=fail'))

    await expect(submitLead({ email: 'bot@example.com', honeypot: 'https://spam.example' })).resolves.toBeUndefined()
  })
})
