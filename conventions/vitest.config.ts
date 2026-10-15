// Vitest config for @repo/conventions: collects the hook rule tests in tests/, which call the pure check* functions.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
