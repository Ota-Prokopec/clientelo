/**
 * Starts Claude Code with `--dangerously-skip-permissions` in a git worktree
 * picked from a `@clack/prompts` menu. The worktree this runs from is listed
 * first, so it is preselected; every other worktree follows; the green last
 * entry has Claude Code create a new worktree itself (`claude --worktree`,
 * which places it under `.claude/worktrees/`). Arguments given to the script
 * are forwarded to `claude`, so `pnpm claude --continue` works.
 */
import * as childProcess from 'node:child_process'
import * as util from 'node:util'
import { cancel, intro, isCancel, log, outro, select, text } from '@clack/prompts'
import { getCurrentWorktreePath, getMainCheckoutPath, labelWorktree, listWorktrees } from '@repo/git-worktrees'

/** The menu value of the "create a new worktree" entry; no path can equal it. */
const CREATE_WORKTREE = Symbol('create-worktree')

type LaunchClaudeProps = {
  cwd: string
  /** Arguments appended after the forwarded ones. */
  args: string[]
}

/**
 * Hands the terminal to `claude` and exits with its status. The extra `args` go
 * last because `--worktree`'s name is optional: a forwarded prompt placed after
 * a bare `--worktree` would be taken as the name.
 *
 * ```ts
 * // pnpm claude --continue
 * launchClaude({ cwd: '/repo', args: ['--worktree'] }) // claude --dangerously-skip-permissions --continue --worktree
 * ```
 */
const launchClaude = ({ cwd, args }: LaunchClaudeProps): never => {
  const { error, status } = childProcess.spawnSync(
    'claude',
    ['--dangerously-skip-permissions', ...process.argv.slice(2), ...args],
    {
      cwd,
      stdio: 'inherit',
    },
  )
  if (error !== undefined) {
    log.error(`Could not start claude: ${error.message}`)
    process.exit(1)
  }
  process.exit(status ?? 1)
}

const currentWorktreePath = getCurrentWorktreePath()
const mainCheckoutPath = getMainCheckoutPath()

const worktrees = listWorktrees()
const orderedWorktrees = [
  ...worktrees.filter((worktree) => worktree.path === currentWorktreePath),
  ...worktrees.filter((worktree) => worktree.path !== currentWorktreePath),
]

intro('Claude Code')

const pickedWorktreePath = await select<string | typeof CREATE_WORKTREE>({
  message: 'Which worktree should Claude Code work in?',
  options: [
    ...orderedWorktrees.map((worktree) => ({
      value: worktree.path,
      label: labelWorktree(worktree),
      hint: worktree.branch ?? 'detached HEAD',
    })),
    {
      value: CREATE_WORKTREE,
      label: util.styleText('green', '+ Create a new worktree'),
      hint: 'under .claude/worktrees/',
    },
  ],
})

if (isCancel(pickedWorktreePath)) {
  cancel('Claude Code was not started.')
  process.exit(0)
}

if (pickedWorktreePath !== CREATE_WORKTREE) {
  outro(`Starting Claude Code in ${pickedWorktreePath}`)
  launchClaude({ cwd: pickedWorktreePath, args: [] })
}

const worktreeName = await text({
  message: 'Name of the new worktree',
  placeholder: 'leave empty for a generated name',
  defaultValue: '',
})

if (isCancel(worktreeName)) {
  cancel('Claude Code was not started.')
  process.exit(0)
}

outro('Starting Claude Code in a new worktree')
// Run from the main checkout so the worktree lands in its `.claude/worktrees/`, not nested inside the current one.
launchClaude({
  cwd: mainCheckoutPath,
  args: worktreeName.trim() === '' ? ['--worktree'] : ['--worktree', worktreeName.trim()],
})
