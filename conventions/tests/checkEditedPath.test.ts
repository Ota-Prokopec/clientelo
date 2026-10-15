// Tests checkEditedPath: the installed-skill and agent-memory rules an Edit, Write or NotebookEdit can break.
import { describe, expect, it } from 'vitest'
import { checkEditedPath } from '../src/checkEditedPath.ts'

const REPO = '/repo' as const

const SKILLS_LOCK = JSON.stringify({ version: 1, skills: { tdd: {}, zod: {} } })

/**
 * The reasons the edit guard denies editing `editedPath`, as run from `/repo`
 * with `lock` as its `skills-lock.json` (`null`: the file is missing). By
 * default the lock lists the `tdd` and `zod` skills.
 *
 * ```ts
 * checkEdit('src/App.tsx')    // []: allowed
 * checkEdit('.agents/skills/tdd/SKILL.md')   // one reason: an installed skill
 * checkEdit('.agents/skills/my-skill/SKILL.md') // []: a skill the repo owns
 * checkEdit('.agents/skills/my-skill/SKILL.md', null) // one reason: no lock, so any skill may be installed
 * ```
 */
const checkEdit = (editedPath: string, lock: string | null = SKILLS_LOCK): string[] => {
  return checkEditedPath({
    editedPath,
    cwd: REPO,
    readFile: (filePath): string | undefined =>
      filePath === `${REPO}/skills-lock.json` ? (lock ?? undefined) : undefined,
  })
}

describe('checkEditedPath', () => {
  it.each([
    'src/App.tsx',
    '/repo/AGENTS.md',
    '/repo/.claude/settings.json',
    '.agents/skills/my-skill/SKILL.md',
    '/repo/.claude/skills/my-skill/SKILL.md',
  ])('allows editing %s', (editedPath) => {
    expect(checkEdit(editedPath)).toEqual([])
  })

  it.each(['.agents/skills/tdd/SKILL.md', '/repo/.claude/skills/zod/SKILL.md'])(
    'denies editing the installed skill file %s',
    (editedPath) => {
      expect(checkEdit(editedPath)).toEqual([expect.stringContaining('installed from an external source')])
    },
  )

  it.each([null, 'not json'])('denies editing any skill when the lock file is %j', (lock) => {
    expect(checkEdit('.agents/skills/my-skill/SKILL.md', lock)).toEqual([
      expect.stringContaining('installed from an external source'),
    ])
  })

  it('denies writing to the agent memory', () => {
    expect(checkEdit('/home/me/.claude/projects/-repo/memory/MEMORY.md')).toEqual([
      expect.stringContaining('Persist knowledge in the repo'),
    ])
  })
})
