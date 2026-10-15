/** The rules a file edit can break, checked before Claude Code's Edit, Write or NotebookEdit runs. */
import * as path from 'node:path'

const SKILLS =
  'Skills listed in `skills-lock.json` (under `.agents/skills/` and their `.claude/skills` symlinks) are installed from an external source, so a hand edit is lost on the next install. Raise the change with the user, or layer it in `docs/specifications/skill-extensions.md`.' as const
const MEMORY =
  "Persist knowledge in the repo, never in the agent's internal memory: put the workflow, convention or correction in an `AGENTS.md`, or a doc under `docs/agents/` linked from one." as const

const SKILL_PATH = /^(?<root>.*)\/\.(?:agents|claude)\/skills\/(?<name>[^/]+)/

type IsInstalledSkillProps = {
  root: string
  name: string
  readFile: CheckEditedPathProps['readFile']
}

/** Whether `root`'s `skills-lock.json` lists the skill `name`; true when the lock can't be read, so the guard fails closed. */
const isInstalledSkill = ({ root, name, readFile }: IsInstalledSkillProps): boolean => {
  try {
    const skillsLock: unknown = JSON.parse(readFile(`${root}/skills-lock.json`) ?? '')
    const lockedSkills =
      typeof skillsLock === 'object' && skillsLock !== null && 'skills' in skillsLock ? skillsLock.skills : undefined
    return typeof lockedSkills !== 'object' || lockedSkills === null || name in lockedSkills
  } catch {
    return true
  }
}

export type CheckEditedPathProps = {
  editedPath: string
  cwd: string
  readFile: (filePath: string) => string | undefined
}

/**
 * Every rule editing `editedPath` (resolved against `cwd`) breaks; empty when the edit may run.
 *
 * ```ts
 * checkEditedPath({ editedPath: '.agents/skills/tdd/SKILL.md', cwd: '/repo', readFile }) // [SKILLS] when the lock lists tdd
 * checkEditedPath({ editedPath: 'src/main.tsx', cwd: '/repo', readFile })                // []
 * ```
 */
export const checkEditedPath = ({ editedPath, cwd, readFile }: CheckEditedPathProps): string[] => {
  const absoluteEditedPath = path.resolve(cwd, editedPath).split(path.sep).join('/')
  const reasons: string[] = []
  const skillPathGroups = SKILL_PATH.exec(absoluteEditedPath)?.groups
  if (
    skillPathGroups?.root !== undefined &&
    skillPathGroups.name !== undefined &&
    isInstalledSkill({ root: skillPathGroups.root, name: skillPathGroups.name, readFile })
  ) {
    reasons.push(SKILLS)
  }
  if (/\/\.claude\/projects\/[^/]+\/memory\//.test(absoluteEditedPath)) {
    reasons.push(MEMORY)
  }
  return reasons
}
