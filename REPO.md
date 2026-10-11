# Repo

The inventory of this pnpm workspace: the root app and every entry under `scripts/*`, and how they depend on each other. Each entry's own `AGENTS.md` holds its technology and rules, so how something _behaves_ belongs there, never here.

```
/                      (clientelo, private)      — the landing page: Vite + React + React Router app in src/
scripts/
├── claude/            (claude, private)         — starts Claude Code in a picked git worktree
├── claude-list/       (claude-list, private)    — removes picked git worktrees and their branches
└── git-worktrees/     (@repo/git-worktrees)     — the git worktree reader both scripts share
```

## Dependencies

- The landing page depends on no workspace entry, and nothing depends on it.
- Both scripts read worktrees through `@repo/git-worktrees`. Nothing depends on the scripts.

## Scripts

`scripts/` holds only folders. `git-worktrees/` is the library the scripts share. Every other folder is a script: its own workspace package `scripts/<name>/` with its own `package.json`, `tsconfig.json` and `AGENTS.md`, started from the root by a script of the same name in the root `package.json` ([`README.md`](./README.md) lists them). [`scripts/claude/AGENTS.md`](./scripts/claude/AGENTS.md) explains how they run.

## Wiring

`pnpm-workspace.yaml` declares the workspace globs and is the source of truth for which entries exist. There is no task runner: the root `package.json` scripts run the app's tasks directly.
