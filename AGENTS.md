# AGENTS.md

Each section below says when it applies and which file to read. Read only the sections the current task needs.

## Project

`clientelo` is a mobile-first **lead-magnet landing page** that compares NYSE-traded ETFs for Czech retail investors arriving from an ad. Its job is collecting contacts. Design and copy serve that goal. [`docs/brief.md`](./docs/brief.md) is the assignment and the source of truth for scope. Read it before you change what the page does, or when you review a change against its spec. [`docs/strategy.md`](./docs/strategy.md) defines the personas, the Key Insight, the Lead Magnet and the Lead Ask. Read it before you write copy, design a Section or change the Lead Form.

- **The bar is "could we launch an ad on it tomorrow?"** Every section, interactive element and line of copy has to move the visitor toward the Lead Form.
- **The visitor gives the page a few seconds, on a phone.** Design at 375 px width first. The First Screen has to deliver the Ad Promise without scrolling.
- **User-facing copy is Czech, written for this audience.** It should never read like generic generated text. Code, docs, commits and PRs are English.
- **Every figure shown (fee, return, size) is real data with its source cited** on the page.

The root is a Vite + React + React Router app (`src/`). [`REPO.md`](./REPO.md) lists the other workspace entries (the git and agent hooks in `conventions/`, developer scripts under `scripts/`). Each has its own `AGENTS.md`.

## Commands

Read [`README.md`](./README.md) before you run a command or check that a change is done. It holds every command and the post-modification checklist.

- **Commands live only in [`README.md`](./README.md).** No other doc, including an entry's `AGENTS.md`, lists them.
- **A task is done only when the post-modification checklist passes.** Fix the root cause of a failure. Never suppress it with an ignore comment or a skip flag, and never bypass the pre-commit hook (`--no-verify`/`-n`, `LEFTHOOK=0`/`LEFTHOOK_EXCLUDE`, a `core.hooksPath` override).
- **`README.md` is also the deliverable for the reviewer.** It must justify the order of the sections, state the expected conversion rate, and rank three A/B test hypotheses by expected impact. When you change the section order, the Funnel or the Lead Form, update it in the same change.

## GitHub

Read [`docs/agents/git-workflow.md`](./docs/agents/git-workflow.md) before you branch, commit, push, open a PR, or touch a GitHub issue. It covers naming, commits, pull requests and resolving an issue.

## Code

Read the standards in [`docs/standards/`](./docs/standards/) for the technology involved, plus any spec in [`docs/specifications/`](./docs/specifications/) for the area the change covers, before you write, refactor or review code.

- The linter (oxlint) enforces the mechanical conventions, so they aren't repeated in prose.
- Prefer an existing npm package over implementing functionality from scratch.
- **Supporting tooling stays proportionate** to a single landing page. Reach for an off-the-shelf mechanism (hosted analytics, a form service, Vercel defaults) before building your own.
- **Document a file's purpose in a short comment at the top of that file**, not in an `AGENTS.md` file tree.

## Domain and decisions

Read [`GLOSSARY.md`](./GLOSSARY.md) before you name a funnel, tracking or content concept. [`docs/agents/domain.md`](./docs/agents/domain.md) says how to use it.

- **Update a term's entry in `GLOSSARY.md` in the same change** that coins, renames or redefines it. Analytics event names and component names use its terms.
- A decision that is hard to reverse (analytics provider, form backend, data source, hosting) gets an ADR in `docs/adr/`.

## Skills

Read [`docs/specifications/skill-extensions.md`](./docs/specifications/skill-extensions.md) before you run any skill. It holds each skill's repo-specific rules.

- **Never edit a skill listed in [`skills-lock.json`](./skills-lock.json)** (under `.agents/skills/`, symlinked into `.claude/skills/`). Those skills are installed from an external source, so a hand edit is lost on the next install. Raise a needed behaviour change with the user. Repo-specific layers on top of a skill go in [`skill-extensions.md`](./docs/specifications/skill-extensions.md).

## Agent docs

- **Persist knowledge in the repo.** A workflow, convention or correction meant to outlive the session goes into an `AGENTS.md` or a doc under `docs/agents/` linked from one or, when it is mechanical, a lint rule or a hook in [`@repo/conventions`](./conventions/AGENTS.md), never into the agent's internal memory. Keep each file scoped to one concern.
