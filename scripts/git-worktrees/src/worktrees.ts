/**
 * Reads the repo's git worktrees for the developer scripts under `scripts/`
 * (`pnpm claude`, `pnpm claude-list`). Every function shells out to `git` in
 * the process's working directory.
 */
import * as childProcess from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

export type Worktree = {
  path: string
  /** The checked-out branch, or `undefined` on a detached HEAD. */
  branch: string | undefined
  /** Locked with `git worktree lock`, as Claude Code does to every worktree it creates. */
  locked: boolean
}

/**
 * Runs `git` and returns its trimmed stdout; a failure throws with git's stderr in the message.
 *
 * ```ts
 * git(['rev-parse', '--abbrev-ref', 'HEAD']) // 'feat/fee-calculator'
 * git(['no-such-command'])                  // throws
 * ```
 */
export const git = (args: string[]): string => {
  return childProcess.execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

/**
 * One `git worktree list --porcelain` block as attribute → value; a bare attribute such as `prunable` maps to `''`.
 *
 * ```ts
 * parseWorktreeBlock('worktree /repo\nbranch refs/heads/main\nlocked')
 * // Map { 'worktree' => '/repo', 'branch' => 'refs/heads/main', 'locked' => '' }
 * ```
 */
const parseWorktreeBlock = (block: string): Map<string, string> => {
  return new Map(
    block.split('\n').map((line): [string, string] => {
      const [attribute = '', ...valueWords] = line.split(' ')
      return [attribute, valueWords.join(' ')]
    }),
  )
}

/**
 * Every block of `git worktree list --porcelain`, parsed by `parseWorktreeBlock`.
 *
 * ```ts
 * readWorktreeBlocks() // [Map { 'worktree' => '/repo', … }, Map { 'worktree' => '/repo/.claude/worktrees/x', … }]
 * ```
 */
const readWorktreeBlocks = (): Map<string, string>[] => {
  return git(['worktree', 'list', '--porcelain']).split('\n\n').map(parseWorktreeBlock)
}

/**
 * Every worktree with files on disk: a bare repository has none, and a
 * `prunable` worktree's directory is gone. A locked worktree whose directory is
 * gone is never `prunable`, hence the separate existence check.
 *
 * ```ts
 * listWorktrees() // [{ path: '/repo', branch: 'main', locked: false }, …]
 * ```
 */
export const listWorktrees = (): Worktree[] => {
  return readWorktreeBlocks().flatMap((attributes): Worktree[] => {
    const worktreePath = attributes.get('worktree')
    if (
      worktreePath === undefined ||
      attributes.has('bare') ||
      attributes.has('prunable') ||
      !fs.existsSync(worktreePath)
    ) {
      return []
    }
    return [
      {
        path: fs.realpathSync(worktreePath),
        branch: attributes.get('branch')?.replace(/^refs\/heads\//, ''),
        locked: attributes.has('locked'),
      },
    ]
  })
}

/**
 * How many entries `git worktree prune` will remove: the unlocked worktrees whose directory is gone.
 *
 * ```ts
 * countPrunableWorktrees() // 2
 * ```
 */
export const countPrunableWorktrees = (): number => {
  return readWorktreeBlocks().filter((attributes) => attributes.has('prunable')).length
}

/**
 * The worktree the process runs in.
 *
 * ```ts
 * getCurrentWorktreePath() // '/repo/.claude/worktrees/x'
 * ```
 */
export const getCurrentWorktreePath = (): string => {
  return fs.realpathSync(git(['rev-parse', '--show-toplevel']))
}

/**
 * The main checkout: the common git dir is its `.git`, whichever worktree this runs in.
 *
 * ```ts
 * getMainCheckoutPath() // '/repo'
 * ```
 */
export const getMainCheckoutPath = (): string => {
  return path.dirname(fs.realpathSync(git(['rev-parse', '--path-format=absolute', '--git-common-dir'])))
}

// Read on the first label rather than at import, so importing this module runs no `git`.
let mainCheckoutPath: string | undefined
let currentWorktreePath: string | undefined

/**
 * A worktree's folder name, followed by "main checkout" and "current" where they apply, as both scripts' menus
 * label it.
 *
 * ```ts
 * labelWorktree({ path: '/repo', … })                 // 'repo · main checkout · current', run from the main checkout
 * labelWorktree({ path: '/repo/.claude/worktrees/x', … }) // 'x'
 * ```
 */
export const labelWorktree = (worktree: Worktree): string => {
  mainCheckoutPath ??= getMainCheckoutPath()
  currentWorktreePath ??= getCurrentWorktreePath()
  const roleTags = [
    worktree.path === mainCheckoutPath && 'main checkout',
    worktree.path === currentWorktreePath && 'current',
  ]
  return [path.basename(worktree.path), ...roleTags.filter((roleTag) => roleTag !== false)].join(' · ')
}
