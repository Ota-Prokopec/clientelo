/** Reading a Claude Code hook's input and answering it. */
import * as fs from 'node:fs'

export type HookInput = {
  cwd: string
  toolInput: Record<string, unknown>
}

/**
 * Whether a parsed JSON value is a plain object.
 *
 * ```ts
 * isRecord({ cwd: '/repo' }) // true
 * isRecord(['a'])            // false
 * isRecord(null)             // false
 * ```
 */
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * The hook's JSON input from stdin, falling back to the process's directory and no tool input when a field is missing.
 *
 * ```ts
 * // stdin: {"cwd":"/repo","tool_input":{"command":"git status"}}
 * readHookInput() // { cwd: '/repo', toolInput: { command: 'git status' } }
 * ```
 */
export const readHookInput = (): HookInput => {
  const stdinJson: unknown = JSON.parse(fs.readFileSync(0, 'utf8'))
  const hookInputFields = isRecord(stdinJson) ? stdinJson : {}
  return {
    cwd: typeof hookInputFields.cwd === 'string' ? hookInputFields.cwd : process.cwd(),
    toolInput: isRecord(hookInputFields.tool_input) ? hookInputFields.tool_input : {},
  }
}

/** The UTF-8 contents of `filePath`, or `undefined` when it can't be read. */
export const readFile = (filePath: string): string | undefined => {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return undefined
  }
}

/** Denies the tool call with every broken rule as the reason; does nothing when `reasons` is empty. */
export const denyToolUse = (reasons: string[]): void => {
  if (reasons.length === 0) {
    return
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reasons.join('\n'),
      },
    }),
  )
}
