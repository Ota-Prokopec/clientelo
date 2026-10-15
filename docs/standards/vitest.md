# Vitest

Where tests go. Read this before you add, move or rename a test. `pnpm test` runs them ([README.md](../../README.md#commands)).

- **Every test lives in `tests/`, never beside the code in `src/`.** Vitest only collects `tests/**/*.test.ts` (`vite.config.ts`), so a test left in `src/` is skipped without any error.
- **A test file is named after the module it tests and mirrors its path under `src/`:** `src/adVariant/adVariant.ts` is tested by `tests/adVariant/adVariant.test.ts`, and `src/lib/lead/submitLead.ts` is tested by `tests/lib/lead/submitLead.test.ts`. It imports the module through the app's aliases (`@/`, `@lib/`, `@data/`), as `src/` does.
- **A workspace entry keeps its tests in its own `tests/`** (`conventions/tests/`), run by its own `test` script, which `pnpm test` calls after the app's.
