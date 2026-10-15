/** Claude Code `PreToolUse` hook on Bash: denies a command that breaks a git or GitHub rule (`checkBashCommand.ts`). */
import * as childProcess from 'node:child_process'
import { checkBashCommand } from './checkBashCommand.ts'
import { denyToolUse, readFile, readHookInput } from './hookIo.ts'

/**
 * The branch checked out in `directory`, or `undefined` on a detached HEAD or outside a repository.
 *
 * ```ts
 * readCurrentBranch('/repo') // 'feat/fee-calculator'
 * readCurrentBranch('/tmp')  // undefined
 * ```
 */
const readCurrentBranch = (directory: string): string | undefined => {
  try {
    const branch = childProcess
      .execFileSync('git', ['-C', directory, 'symbolic-ref', '--short', 'HEAD'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
      .trim()
    return branch === '' ? undefined : branch
  } catch {
    return undefined
  }
}

const hookInput = readHookInput()
const command = hookInput.toolInput.command
if (typeof command === 'string') {
  denyToolUse(checkBashCommand({ command, cwd: hookInput.cwd, currentBranch: readCurrentBranch, readFile }))
}
