// Tests how a Data Source's verification reads, the same on the page and in the Lead Magnet PDF.
import { describe, expect, it } from 'vitest'
import { formatVerification } from '../../src/lib/format.ts'

describe('formatVerification', () => {
  it('dates a verified Data Source the Czech way', () => {
    expect(formatVerification({ name: 'Vanguard, stránka fondu VOO', url: 'https://example.com', verifiedOn: '2026-10-11' })).toBe(
      'ověřeno 11. 10. 2026',
    )
  })

  it('marks a Data Source no one has verified yet', () => {
    expect(formatVerification({ name: 'Vanguard, stránka fondu VOO', url: null, verifiedOn: null })).toBe('zatím neověřeno')
  })
})
