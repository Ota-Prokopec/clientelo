/** The naming patterns from `docs/agents/git-workflow.md`, shared by the hooks. */

/** `<type>/<slug>`, e.g. `feat/fee-calculator`. */
export const BRANCH_NAME = /^(?:feat|fix|docs|refactor|test|chore)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** `<type>(<scope>): <description>`, the scope optional, e.g. `feat(lead-form): add the consent checkbox`. */
export const CONVENTIONAL_SUBJECT =
  /^(?:feat|fix|docs|refactor|test|chore)(?:\([a-z0-9-]+\))?!?: \S/;
