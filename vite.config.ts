// Vite build and dev-server config, plus the root Vitest config for the app's pure-logic tests.
import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // `@/` is src/, the alias shadcn's components import through (components.json). tsconfig.app.json mirrors it.
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    include: ['src/**/*.test.ts'],
    // Vitest stubs CSS imports as empty; index.css.test.ts reads the theme's source through `?raw`.
    css: { include: [/src\/index\.css/] },
  },
})
