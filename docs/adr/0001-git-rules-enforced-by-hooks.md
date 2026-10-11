# Git and agent rules enforced by hooks

The rules in [`docs/agents/git-workflow.md`](../agents/git-workflow.md) (branch names, Conventional Commits subjects, no commits to `main`, no Claude mention on GitHub) and the ban on editing installed skills were prose only, so nothing caught an agent or a human breaking them. oxlint checks source files, not git operations, so it can't hold them.

We enforce them with hooks in a workspace package, [`@repo/conventions`](../../conventions/AGENTS.md): **lefthook** runs the fast part of the post-modification checklist on `pre-commit` and checks every commit subject on `commit-msg`, and Claude Code `PreToolUse` hooks (`.claude/settings.json`) deny a Bash command or file edit that breaks a rule. lefthook installs its git hooks from its `postinstall`, so `pnpm install` is the only setup.

## Consequences

- `git-workflow.md` stays the full statement of the rules: the Claude Code hooks bind only Claude Code, and `--no-verify` still skips lefthook for a human.
- A commit takes as long as `pnpm lint` plus `pnpm check-types`. The build stays in the checklist, not the hook.
- The hook scripts are TypeScript run by Node's type stripping, with no build step, like the rest of `scripts/`.
