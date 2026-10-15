// Tests checkCommitMessage: the Conventional Commits subject rule lefthook's commit-msg hook applies.
import { describe, expect, it } from 'vitest'
import { checkCommitMessage } from '../src/checkCommitMessage.ts'

describe('checkCommitMessage', () => {
  it.each([
    'feat(lead-form): add the consent checkbox\n\nBody.',
    'chore: move the repo to TypeScript 6.0.3',
    'fix!: drop Node 22',
    '# comment line\ndocs(adr): record ADR-0001',
    "Merge branch 'main' into feat/thing",
    'Revert "feat: add consent"',
    'fixup! feat: add consent',
  ])('accepts %j', (message) => {
    expect(checkCommitMessage(message)).toBeUndefined()
  })

  it.each([
    'fix',
    'CLAUDE(feat): add consent',
    'feature: add consent',
    'feat(LeadForm): add consent',
    'feat:missing space',
    '',
  ])('rejects %j', (message) => {
    expect(checkCommitMessage(message)).toContain("doesn't follow `<type>(<scope>): <description>`")
  })
})
