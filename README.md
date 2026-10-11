# clientelo

A mobile-first lead-magnet landing page comparing NYSE-traded ETFs for Czech retail investors. See [docs/brief.md](./docs/brief.md).

## Commands

Run from the repo root.

| Command            | What it does                                                 |
| ------------------ | ------------------------------------------------------------ |
| `pnpm install`     | Install dependencies for the app and every workspace entry   |
| `pnpm dev`         | Start the Vite dev server with HMR                           |
| `pnpm build`       | Type-check and build the production bundle into `dist/`      |
| `pnpm preview`     | Serve the production build locally                           |
| `pnpm lint`        | Lint the whole repo with oxlint                              |
| `pnpm check-types` | Type-check the app and every workspace entry                 |
| `pnpm claude`      | Start Claude Code in a picked git worktree                   |
| `pnpm claude-list` | Remove picked git worktrees and their branches               |

## Post-modification checklist

A change is done when all of these pass:

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm build`
4. For a UI change: the change works in `pnpm dev` at 375 px phone width.
