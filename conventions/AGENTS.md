# `@repo/conventions`

The repo's git and agent rules as code: hooks for the rules oxlint can't see. A private package with no build. Node runs the hook scripts directly by stripping their types, so the `tsconfig.json` limits (`erasableSyntaxOnly`, `verbatimModuleSyntax`, `.ts` import extensions) apply.

## Hooks

Each hook script is a thin entry that reads its input and calls a pure `check*` function, which returns every broken rule as the instruction to follow. Tests in `tests/` call the `check*` functions directly. Word each message as the instruction to follow, not as a description of the problem.

| Script             | Runs as                                                        | Denies                                                                                                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/guardBash.ts` | Claude Code `PreToolUse` on `Bash` (`.claude/settings.json`)   | skipping the pre-commit hook; committing on or pushing to `main`; committing or pushing from a branch that isn't `<type>/<slug>`; `gh pr merge`; a non-conventional `gh` PR/issue title; a Claude mention in anything posted with `gh` |
| `src/guardEdit.ts` | Claude Code `PreToolUse` on `Edit`, `Write` and `NotebookEdit` | editing a skill `skills-lock.json` lists (under `.agents/skills/` or `.claude/skills/`), or any skill when the lock file can't be read; writing to Claude Code's memory directory                                                      |
| `src/commitMsg.ts` | lefthook `commit-msg` (`lefthook.yml`)                         | a commit subject that isn't `<type>(<scope>): <description>`, for every commit, human ones included. Git's own merge, revert and autosquash subjects pass                                                                              |

`guardBash` follows `cd`, `git -C`, and a `git checkout -b`/`switch -c`/`branch -m` earlier in the same command, so it checks the branch the commit actually lands on. It can't see through scripts, aliases or `eval`. The hooks back up [`docs/agents/git-workflow.md`](../docs/agents/git-workflow.md), which stays the full statement of these rules, because agents other than Claude Code aren't bound by them.

A hook script can't run in a checkout that hasn't had `pnpm install`, because `shell-quote` resolves from this package's `node_modules`. Claude Code then reports a hook error and lets the call through.
