/**
 * The git and GitHub rules from `docs/agents/git-workflow.md` that a Bash
 * command can break, checked before Claude Code runs it. Pure: the current
 * branch and file contents come in through `CheckBashCommandProps`.
 */
import * as path from 'node:path'
import { parse } from 'shell-quote'
import { BRANCH_NAME, CONVENTIONAL_SUBJECT, MAIN_BRANCH } from './naming.ts'

const SEPARATORS = new Set(['&&', '||', ';', '|', '&', '|&', '(', ')'])
const GH_POSTING_COMMANDS = new Set([
  'pr create',
  'pr edit',
  'pr comment',
  'pr review',
  'issue create',
  'issue edit',
  'issue comment',
  'issue close',
])
const GH_TITLED_COMMANDS = new Set(['pr create', 'pr edit', 'issue create', 'issue edit'])

const SKIP_HOOK =
  'Never skip the pre-commit hook (no `--no-verify`/`-n`, `LEFTHOOK=0`, `LEFTHOOK_EXCLUDE` or `core.hooksPath` override). Fix what the hook reports and commit again.' as const
const NOT_ON_MAIN =
  'All finished work lands through a pull request: never commit on or push to `main`. Create a `<type>/<slug>` branch first.' as const
const NO_MERGE = 'The user merges every pull request; never merge one yourself.' as const
const NO_CLAUDE =
  'Nothing posted to GitHub mentions Claude: no `CLAUDE` prefix and no "Generated with Claude Code" footer.' as const

/**
 * The instruction to rename a branch whose name isn't `<type>/<slug>`.
 *
 * ```ts
 * createBranchNameReason('worktree-x') // 'The branch `worktree-x` doesn't match `<type>/<slug>` … Rename it with …'
 * ```
 */
const createBranchNameReason = (branch: string): string => {
  return `The branch \`${branch}\` doesn't match \`<type>/<slug>\` (e.g. \`feat/fee-calculator\`). Rename it with \`git branch -m <type>/<slug>\` before committing or pushing.`
}

/**
 * The instruction to reword a PR or issue title that isn't a Conventional Commits subject.
 *
 * ```ts
 * createTitleReason('Add form') // 'The title "Add form" doesn't follow `<type>(<scope>): <description>` …'
 * ```
 */
const createTitleReason = (title: string): string => {
  return `The title "${title}" doesn't follow \`<type>(<scope>): <description>\`, where \`<type>\` is feat, fix, docs, refactor, test or chore and the scope is optional.`
}

/**
 * The command split into its simple commands, each a list of words.
 *
 * ```ts
 * splitCommands('cd app && git commit -m "fix: x"') // [['cd', 'app'], ['git', 'commit', '-m', 'fix: x']]
 * splitCommands('echo $HOME')                       // [['echo', '$HOME']]
 * ```
 */
const splitCommands = (command: string): string[][] => {
  const commands: string[][] = [[]]
  for (const token of parse(command, (variableName): string => `$${variableName}`)) {
    if (typeof token === 'string') {
      commands[commands.length - 1]?.push(token)
    } else if ('op' in token && SEPARATORS.has(token.op)) {
      commands.push([])
    } else if ('op' in token && token.op === 'glob') {
      commands[commands.length - 1]?.push(token.pattern)
    }
  }
  return commands.filter((words): boolean => words.length > 0)
}

/**
 * The values given to any of `flags`, as `--flag value` or `--flag=value`.
 *
 * ```ts
 * findFlagValues(['--title', 'a', '-t=b'], ['--title', '-t']) // ['a', 'b']
 * findFlagValues(['--title'], ['--title'])                    // []
 * ```
 */
const findFlagValues = (words: string[], flags: string[]): string[] => {
  return words.flatMap((word, index): string[] => {
    if (flags.includes(word)) {
      const flagValue = words[index + 1]
      return flagValue === undefined ? [] : [flagValue]
    }
    const matchedFlag = flags.find((candidate): boolean => word.startsWith(`${candidate}=`))
    return matchedFlag === undefined ? [] : [word.slice(matchedFlag.length + 1)]
  })
}

/**
 * Whether a cluster of single-letter flags includes `flag`.
 *
 * ```ts
 * hasShortFlag(['-anm', 'fix: x'], 'n') // true
 * hasShortFlag(['--no-edit'], 'n')      // false
 * ```
 */
const hasShortFlag = (words: string[], flag: string): boolean => {
  return words.some((word): boolean => /^-[a-zA-Z]+$/.test(word) && word.includes(flag))
}

/**
 * Whether a word is an environment assignment that turns lefthook off.
 *
 * ```ts
 * isHookSkip('LEFTHOOK=0')            // true
 * isHookSkip('LEFTHOOK_EXCLUDE=lint') // true
 * isHookSkip('LEFTHOOK=1')            // false
 * ```
 */
const isHookSkip = (word: string): boolean => {
  return /^LEFTHOOK=(?:0|false)$/i.test(word) || word.startsWith('LEFTHOOK_EXCLUDE=')
}

/** The directory a command runs in and the branch an earlier command in it checked out there, if any. */
type GitState = { directory: string; branch: string | undefined }

/** A `git` call split into the directory it runs in, its subcommand and the subcommand's arguments. */
type GitInvocation = { directory: string; subcommand: string | undefined; subcommandArgs: string[] }

/**
 * Splits `git [global options] <subcommand> <args>`, applying `-C` to `directory` and reporting a
 * `-c core.hooksPath` override into `reasons`.
 *
 * ```ts
 * parseGit(['git', '-C', 'app', 'commit', '-m', 'x'], '/repo', reasons)
 * // { directory: '/repo/app', subcommand: 'commit', subcommandArgs: ['-m', 'x'] }
 * parseGit(['git', '-c', 'core.hooksPath=/dev/null', 'commit'], '/repo', reasons) // reasons gets SKIP_HOOK
 * ```
 */
const parseGit = (words: string[], directory: string, reasons: Set<string>): GitInvocation => {
  let index = 1
  let gitDirectory = directory
  while (index < words.length && words[index]?.startsWith('-')) {
    const globalOption = words[index]
    if (globalOption === '-C') {
      gitDirectory = path.resolve(gitDirectory, words[index + 1] ?? '.')
      index += 2
    } else if (globalOption === '-c') {
      if (words[index + 1]?.toLowerCase().startsWith('core.hookspath')) {
        reasons.add(SKIP_HOOK)
      }
      index += 2
    } else {
      index += 1
    }
  }
  return { directory: gitDirectory, subcommand: words[index], subcommandArgs: words.slice(index + 1) }
}

/**
 * Adds a reason to `reasons` when `branch` is `main` or isn't named `<type>/<slug>`; an unknown branch passes.
 *
 * ```ts
 * checkBranch('main', reasons)       // reasons gets NOT_ON_MAIN
 * checkBranch('worktree-x', reasons) // reasons gets the rename instruction
 * checkBranch('feat/x', reasons)     // nothing
 * ```
 */
const checkBranch = (branch: string | undefined, reasons: Set<string>): void => {
  if (branch === MAIN_BRANCH) {
    reasons.add(NOT_ON_MAIN)
  } else if (branch !== undefined && !BRANCH_NAME.test(branch)) {
    reasons.add(createBranchNameReason(branch))
  }
}

/**
 * Adds every rule one `git` command breaks to `reasons`, and returns the state the next command starts from: a
 * checkout, switch or rename changes the branch later commands land on.
 *
 * ```ts
 * checkGit(['git', 'commit', '-n'], state, props, reasons)          // reasons gets SKIP_HOOK; state unchanged
 * checkGit(['git', 'switch', '-c', 'feat/x'], state, props, reasons) // { directory, branch: 'feat/x' }
 * ```
 */
const checkGit = (words: string[], state: GitState, props: CheckBashCommandProps, reasons: Set<string>): GitState => {
  const gitInvocation = parseGit(words, state.directory, reasons)
  const { subcommandArgs } = gitInvocation
  const positionalArgs = subcommandArgs.filter((word): boolean => !word.startsWith('-'))
  const branch =
    gitInvocation.directory === state.directory && state.branch !== undefined
      ? state.branch
      : props.currentBranch(gitInvocation.directory)
  switch (gitInvocation.subcommand) {
    case 'commit':
      if (subcommandArgs.includes('--no-verify') || hasShortFlag(subcommandArgs, 'n')) {
        reasons.add(SKIP_HOOK)
      }
      checkBranch(branch, reasons)
      return state
    case 'push':
      if (
        positionalArgs
          .slice(1)
          .some((ref): boolean => ref === MAIN_BRANCH || /(?:^|:)(?:refs\/heads\/)?main$/.test(ref))
      ) {
        reasons.add(NOT_ON_MAIN)
      }
      checkBranch(branch, reasons)
      return state
    case 'config':
      if (subcommandArgs.some((word): boolean => word.toLowerCase() === 'core.hookspath')) {
        reasons.add(SKIP_HOOK)
      }
      return state
    case 'checkout':
    case 'switch': {
      const createdBranch = findFlagValues(subcommandArgs, ['-b', '-B', '-c', '-C', '--create', '--force-create'])[0]
      const nextBranch = createdBranch ?? (subcommandArgs.includes('--') ? undefined : positionalArgs[0])
      return nextBranch === undefined ? state : { directory: gitInvocation.directory, branch: nextBranch }
    }
    case 'branch':
      if (subcommandArgs.includes('-m') || subcommandArgs.includes('-M') || subcommandArgs.includes('--move')) {
        const renamedBranch = positionalArgs[positionalArgs.length - 1]
        return renamedBranch === undefined ? state : { directory: gitInvocation.directory, branch: renamedBranch }
      }
      return state
    default:
      return state
  }
}

/**
 * Adds every rule one `gh` command breaks to `reasons`: merging a PR, a non-conventional title, or a Claude mention
 * in anything it posts.
 *
 * ```ts
 * checkGh(['gh', 'pr', 'merge', '4'], command, props, reasons)               // reasons gets NO_MERGE
 * checkGh(['gh', 'pr', 'create', '--title', 'Add x'], command, props, reasons) // reasons gets the title instruction
 * ```
 */
const checkGh = (words: string[], command: string, props: CheckBashCommandProps, reasons: Set<string>): void => {
  const ghAction = `${words[1] ?? ''} ${words[2] ?? ''}`
  if (ghAction === 'pr merge') {
    reasons.add(NO_MERGE)
  }
  if (GH_TITLED_COMMANDS.has(ghAction)) {
    for (const title of findFlagValues(words, ['--title', '-t'])) {
      if (!CONVENTIONAL_SUBJECT.test(title)) {
        reasons.add(createTitleReason(title))
      }
    }
  }
  if (GH_POSTING_COMMANDS.has(ghAction)) {
    const bodyFileTexts = findFlagValues(words, ['--body-file', '-F'])
      .filter((bodyFilePath): boolean => bodyFilePath !== '-')
      .map((bodyFilePath): string => props.readFile(path.resolve(props.cwd, bodyFilePath)) ?? '')
    // `gh issue close` posts its closing comment through `--comment`/`-c`.
    const textFlags = ghAction === 'issue close' ? ['--comment', '-c'] : ['--title', '-t', '--body', '-b']
    const postedTexts = [...findFlagValues(words, textFlags), ...bodyFileTexts]
    // A heredoc fed to stdin never reaches the words, so the raw command stands in for it.
    if (command.includes('<<')) {
      postedTexts.push(command)
    }
    if (postedTexts.some((postedText): boolean => /claude/i.test(postedText))) {
      reasons.add(NO_CLAUDE)
    }
  }
}

export type CheckBashCommandProps = {
  command: string
  /** The directory the command starts in. */
  cwd: string
  /** The branch checked out in `directory`, or `undefined` on a detached HEAD or outside a repository. */
  currentBranch: (directory: string) => string | undefined
  /** The content of the file at `filePath`, or `undefined` when it can't be read. */
  readFile: (filePath: string) => string | undefined
}

/**
 * Every rule `command` breaks, each as the instruction to follow; empty when it may run.
 *
 * ```ts
 * checkBashCommand({ command: 'git commit --no-verify -m "fix: x"', … }) // ['Never skip the pre-commit hook …']
 * checkBashCommand({ command: 'pnpm lint && pnpm test', … })             // []
 * ```
 */
export const checkBashCommand = (props: CheckBashCommandProps): string[] => {
  const reasons = new Set<string>()
  let state: GitState = { directory: props.cwd, branch: undefined }
  for (const words of splitCommands(props.command)) {
    if (words.some(isHookSkip)) {
      reasons.add(SKIP_HOOK)
    }
    const commandWords = words.slice(words.findIndex((word): boolean => !/^[A-Za-z_][A-Za-z0-9_]*=/.test(word)))
    const [program] = commandWords
    if (program === 'cd') {
      state = { directory: path.resolve(state.directory, commandWords[1] ?? '.'), branch: undefined }
    } else if (program === 'git') {
      state = checkGit(commandWords, state, props, reasons)
    } else if (program === 'gh') {
      checkGh(commandWords, props.command, props, reasons)
    }
  }
  return [...reasons]
}
