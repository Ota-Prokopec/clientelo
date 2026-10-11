# Skill extensions

Repo-specific rules layered on top of a skill, one section per skill. Before you run a skill listed here, apply its section on top of the skill's own instructions. [git-workflow.md](../agents/git-workflow.md) applies to every skill.

A skill listed in [`skills-lock.json`](../../skills-lock.json) is installed from an external source and stays exactly as installed, so its repo-specific changes go here ([AGENTS.md](../../AGENTS.md#skills)).

## The pipeline

A feature runs through the skills in this order: `/wayfinder` (map the unknowns), `/grill-with-docs` (settle what to build and why, recorded as ADRs, with nothing implemented yet), `/to-spec`, `/to-tickets`, then `/implement-spec` (the whole spec in one run) or `/implement` (one ticket at a time), and finally `/code-review`.

## `/grill-with-docs`

The session writes only `/prototype` code, which is deleted before the question closes. Once the session ends and the ADR and glossary changes are written, commit just those doc changes with type `docs` (`docs(adr): record ADR-0001`), so ADR-only commits stand out in history.

## `/grilling`

Until the interview is over and the user asks for implementation, the repository stays read-only, glossary and docs included. `/prototype` is the one writer, run to settle a question about code or UI shape. Its files are written mid-session and deleted once the user picks a winner. When no open questions remain and the user confirms shared understanding, stop.

## `/to-spec`

A spec is a parent issue, too large to land as one change, so `/to-tickets` breaks it down before anything is implemented. Label it `spec`, in addition to the skill's own labels, and keep `ready-for-agent` off it: that label means implementable as-is.

Besides publishing the issue, write the same spec to `docs/specifications/<slug>.md` and land it through a PR. Cross-link the two: the file's top names its issue number, and the issue body names the file path.

## `/to-tickets`

Each ticket is one self-contained unit of work, implementable as a single change. Publish every ticket as its own GitHub issue with the skill's `## Parent` section filled in, linking back to the spec issue. Pipeline tickets require that section, though the skill's template treats it as optional. Label each ticket `ticket`, in addition to the skill's own labels (e.g. `ready-for-agent`). `spec` belongs only on the parent.

## `/implement`

Scope: spec issues (labelled `spec`) and their child tickets (labelled `ticket`, with a `## Parent` link to a spec). Any other `#<int>` follows "Resolving an issue" in [git-workflow.md](../agents/git-workflow.md#resolving-an-issue).

Implement a ticket with [sub-issue-workflow.md](../agents/sub-issue-workflow.md), with the spec as the parent and the ticket as the child: the spec branch (`feat/etf-comparison`) is the parent branch, and each ticket branch (`feat/fee-calculator`) branches off it.

## `/implement-spec`

Scope: a spec issue (labelled `spec`) and its tickets, as `/implement` defines them.

The integration branch is the spec branch (`feat/etf-comparison`), off `main`. Implementer branches are the skill's internal worktrees, so they get no PR of their own: the merger subagent squash-merges each ticket onto the integration branch as one commit. The integration branch's single PR into `main` carries a closing keyword for the spec and for every ticket (`Closes #14. Closes #16.`). In place of the skill's step 8, leave that PR a draft and close no issue. The user promotes, merges and closes ([sub-issue-workflow.md](../agents/sub-issue-workflow.md)).

## `/pr`

Besides the skill's Summary, Evidence and Merge Danger sections, the body states the issue(s) it addresses and stays free of any Claude mention, as [git-workflow.md](../agents/git-workflow.md#pull-requests) requires.

## `/retro`

An accepted suggestion lands in the repo, in a doc (`AGENTS.md`, `docs/agents/`, this file), or a lint rule or hook in [`@repo/conventions`](../../conventions/AGENTS.md). Never in agent memory.

## `/code-review`

The standards sources are [`docs/standards/`](../standards/) (one file per technology) and the files in `docs/specifications/` that cover the changed area. The spec files are both standards and the Spec axis's reference for how a Section or component must behave. For a change to what the page does, [`docs/brief.md`](../brief.md) and [`docs/strategy.md`](../strategy.md) are Spec references too.

Run the post-modification checklist ([README.md](../../README.md#post-modification-checklist)) as part of the review, and report each failing step as a finding.
