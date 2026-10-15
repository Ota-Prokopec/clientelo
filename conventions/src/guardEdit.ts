/** Claude Code `PreToolUse` hook on Edit, Write and NotebookEdit: denies an edit `checkEditedPath.ts` forbids. */
import { checkEditedPath } from './checkEditedPath.ts'
import { denyToolUse, readFile, readHookInput } from './hookIo.ts'

const hookInput = readHookInput()
const editedPath = hookInput.toolInput.file_path ?? hookInput.toolInput.notebook_path
if (typeof editedPath === 'string') {
  denyToolUse(checkEditedPath({ editedPath, cwd: hookInput.cwd, readFile }))
}
