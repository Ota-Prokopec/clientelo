/**
 * Removes git worktrees picked from a `@clack/prompts` multiselect. The main
 * checkout and the worktree this runs from are listed first but can't be
 * picked (gray); a worktree with uncommitted changes is yellow. After a
 * confirmation listing every pick, each worktree is force-removed (overriding
 * Claude Code's lock and any uncommitted changes), its branch is deleted when
 * merged into `main`, and a second multiselect offers the unmerged branches
 * for deletion. `git worktree prune` and a summary end the run; the exit code
 * is 1 if any removal or deletion failed.
 */
import * as util from 'node:util'
import { cancel, confirm, intro, isCancel, log, multiselect, outro } from '@clack/prompts'
import { MAIN_BRANCH } from '@repo/conventions/naming'
import {
  countPrunableWorktrees,
  getCurrentWorktreePath,
  getMainCheckoutPath,
  git,
  labelWorktree,
  listWorktrees,
  type Worktree,
} from '@repo/git-worktrees'

/** A worktree as the removal menu shows it: whether it can be picked, how dirty it is, and whether it is merged. */
type ListedWorktree = Worktree & {
  /** The main checkout or the current worktree, neither of which can be removed. */
  isProtected: boolean
  /** Uncommitted changes, untracked files included. */
  changedFileCount: number
  /** The branch is merged into `main`; `false` on a detached HEAD, which has no branch. */
  isMerged: boolean
}

/** A failed `git` call, as the summary reports it. */
type GitFailure = {
  subject: string
  message: string
}

type FormatCountProps = {
  count: number
  singular: string
  plural: string
}

/**
 * A count followed by the noun in the matching number.
 *
 * ```ts
 * formatCount({ count: 1, singular: 'file', plural: 'files' }) // '1 file'
 * formatCount({ count: 3, singular: 'file', plural: 'files' }) // '3 files'
 * ```
 */
const formatCount = ({ count, singular, plural }: FormatCountProps): string => {
  return `${count} ${count === 1 ? singular : plural}`
}

const currentWorktreePath = getCurrentWorktreePath()
const mainCheckoutPath = getMainCheckoutPath()
const mergedBranches = new Set(git(['branch', '--merged', MAIN_BRANCH, '--format=%(refname:short)']).split('\n'))

/**
 * How many files in the worktree at `worktreePath` have uncommitted changes, untracked files included.
 *
 * ```ts
 * countChangedFiles('/repo/.claude/worktrees/x') // 2
 * ```
 */
const countChangedFiles = (worktreePath: string): number => {
  return git(['-C', worktreePath, 'status', '--porcelain'])
    .split('\n')
    .filter((statusLine) => statusLine !== '').length
}

/**
 * The worktree with what the removal menu needs to know about it.
 *
 * ```ts
 * createListedWorktree({ path: '/repo', branch: 'main', locked: false })
 * // { …, isProtected: true, changedFileCount: 0, isMerged: true }
 * ```
 */
const createListedWorktree = (worktree: Worktree): ListedWorktree => {
  return {
    ...worktree,
    isProtected: worktree.path === mainCheckoutPath || worktree.path === currentWorktreePath,
    changedFileCount: countChangedFiles(worktree.path),
    isMerged: worktree.branch !== undefined && mergedBranches.has(worktree.branch),
  }
}

/**
 * The worktree's menu label: gray when it can't be removed, yellow when it has uncommitted changes.
 *
 * ```ts
 * colorWorktreeLabel(mainCheckout)  // gray 'repo · main checkout'
 * colorWorktreeLabel(dirtyWorktree) // yellow 'x'
 * ```
 */
const colorWorktreeLabel = (listedWorktree: ListedWorktree): string => {
  const label = labelWorktree(listedWorktree)
  if (listedWorktree.isProtected) return util.styleText('gray', label)
  if (listedWorktree.changedFileCount > 0) return util.styleText('yellow', label)
  return label
}

/**
 * The worktree's menu hint: its branch, then "unmerged", "locked" and "dirty" where they apply.
 *
 * ```ts
 * hintWorktree(lockedDirtyWorktree) // 'feat/x · unmerged · locked · dirty (2 files)'
 * hintWorktree(detachedWorktree)    // 'detached HEAD'
 * ```
 */
const hintWorktree = (listedWorktree: ListedWorktree): string => {
  const stateTags = [
    listedWorktree.branch ?? 'detached HEAD',
    listedWorktree.branch !== undefined && !listedWorktree.isMerged && 'unmerged',
    listedWorktree.locked && 'locked',
    listedWorktree.changedFileCount > 0 &&
      `dirty (${formatCount({ count: listedWorktree.changedFileCount, singular: 'file', plural: 'files' })})`,
  ]
  return stateTags.filter((stateTag) => stateTag !== false).join(' · ')
}

type TryGitProps = {
  args: string[]
  /** What the call does, completing "Could not …" in the summary. */
  subject: string
}

/**
 * Runs `git`, turning a failure into a `GitFailure` for the summary instead of a throw.
 *
 * ```ts
 * tryGit({ args: ['branch', '-D', 'feat/x'], subject: 'delete branch feat/x' }) // undefined on success
 * tryGit({ args: ['branch', '-D', 'nope'], subject: 'delete branch nope' })     // { subject, message: 'error: …' }
 * ```
 */
const tryGit = ({ args, subject }: TryGitProps): GitFailure | undefined => {
  try {
    git(args)
    return undefined
  } catch (error) {
    return { subject, message: error instanceof Error ? error.message : String(error) }
  }
}

const allListedWorktrees = listWorktrees().map(createListedWorktree)
const listedWorktrees = [
  ...allListedWorktrees.filter((listedWorktree) => listedWorktree.path === mainCheckoutPath),
  ...allListedWorktrees.filter(
    (listedWorktree) => listedWorktree.path === currentWorktreePath && listedWorktree.path !== mainCheckoutPath,
  ),
  ...allListedWorktrees.filter((listedWorktree) => !listedWorktree.isProtected),
]

intro('Remove worktrees')

if (listedWorktrees.every((listedWorktree) => listedWorktree.isProtected)) {
  outro('There is no worktree to remove.')
  process.exit(0)
}

const pickedPaths = await multiselect<string>({
  message: 'Which worktrees should be removed?',
  options: listedWorktrees.map((listedWorktree) => ({
    value: listedWorktree.path,
    label: colorWorktreeLabel(listedWorktree),
    hint: hintWorktree(listedWorktree),
    disabled: listedWorktree.isProtected,
  })),
  required: false,
})

if (isCancel(pickedPaths) || pickedPaths.length === 0) {
  cancel('Nothing was removed.')
  process.exit(0)
}

const pickedWorktrees = listedWorktrees.filter((listedWorktree) => pickedPaths.includes(listedWorktree.path))

log.message(
  pickedWorktrees
    .map(
      (pickedWorktree) =>
        `${colorWorktreeLabel(pickedWorktree)}  ${util.styleText('dim', hintWorktree(pickedWorktree))}`,
    )
    .join('\n'),
)
const isConfirmed = await confirm({
  message: `Remove ${formatCount({ count: pickedWorktrees.length, singular: 'worktree', plural: 'worktrees' })}?`,
  initialValue: false,
})

if (isCancel(isConfirmed) || !isConfirmed) {
  cancel('Nothing was removed.')
  process.exit(0)
}

const gitFailures: GitFailure[] = []
const removedWorktrees: ListedWorktree[] = []

for (const pickedWorktree of pickedWorktrees) {
  // Two `--force`s: one overrides uncommitted changes, the second the lock.
  const gitFailure = tryGit({
    args: ['worktree', 'remove', '--force', '--force', pickedWorktree.path],
    subject: `remove worktree ${pickedWorktree.path}`,
  })
  if (gitFailure === undefined) removedWorktrees.push(pickedWorktree)
  else gitFailures.push(gitFailure)
}

const deletedBranches: string[] = []

/**
 * Deletes each branch, recording it in `deletedBranches` or its failure in `gitFailures`.
 *
 * ```ts
 * deleteBranches(['feat/x', 'fix/y']) // deletedBranches: ['feat/x', 'fix/y']
 * ```
 */
const deleteBranches = (branches: string[]): void => {
  for (const branch of branches) {
    // `-D`: `-d` checks the branch against the current HEAD, not `main`.
    const gitFailure = tryGit({ args: ['branch', '-D', branch], subject: `delete branch ${branch}` })
    if (gitFailure === undefined) deletedBranches.push(branch)
    else gitFailures.push(gitFailure)
  }
}

// `main` itself is always merged into `main`; a removed worktree that had it checked out keeps it.
const removedBranches = removedWorktrees.flatMap((removedWorktree) =>
  removedWorktree.branch === undefined || removedWorktree.branch === MAIN_BRANCH
    ? []
    : [{ branch: removedWorktree.branch, isMerged: removedWorktree.isMerged }],
)
deleteBranches(removedBranches.filter(({ isMerged }) => isMerged).map(({ branch }) => branch))

const unmergedBranches = removedBranches.filter(({ isMerged }) => !isMerged).map(({ branch }) => branch)

if (unmergedBranches.length > 0) {
  const pickedBranches = await multiselect<string>({
    message: `These branches are not merged into ${MAIN_BRANCH}. Delete them anyway?`,
    options: unmergedBranches.map((branch) => ({ value: branch, label: branch })),
    initialValues: [],
    required: false,
  })
  // Cancelling keeps every unmerged branch, as picking none does.
  deleteBranches(isCancel(pickedBranches) ? [] : pickedBranches)
}

const prunableCount = countPrunableWorktrees()
const pruneFailure = tryGit({
  args: ['worktree', 'prune'],
  subject: 'prune stale worktree entries',
})
if (pruneFailure !== undefined) gitFailures.push(pruneFailure)

const keptBranches = unmergedBranches.filter((branch) => !deletedBranches.includes(branch))

if (removedWorktrees.length > 0) {
  log.success(`Removed worktrees:\n${removedWorktrees.map((removedWorktree) => removedWorktree.path).join('\n')}`)
}
if (deletedBranches.length > 0) log.success(`Deleted branches: ${deletedBranches.join(', ')}`)
if (keptBranches.length > 0) log.info(`Kept unmerged branches: ${keptBranches.join(', ')}`)
if (pruneFailure === undefined && prunableCount > 0) {
  log.success(
    `Pruned ${formatCount({ count: prunableCount, singular: 'stale worktree entry', plural: 'stale worktree entries' })}`,
  )
}
for (const gitFailure of gitFailures) log.error(`Could not ${gitFailure.subject}:\n${gitFailure.message}`)

if (gitFailures.length > 0) {
  outro(
    util.styleText('red', `${formatCount({ count: gitFailures.length, singular: 'step', plural: 'steps' })} failed.`),
  )
  process.exit(1)
}
outro('Done.')
