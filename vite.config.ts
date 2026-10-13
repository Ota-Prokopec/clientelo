// Vite build and dev-server config, plus the root Vitest config for the app's pure-logic tests.
import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // `@/` is src/, the alias shadcn's components import through (components.json). `@lib/` and `@data/` are
    // shortcuts into src/lib and src/data. tsconfig.app.json mirrors all three.
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@lib': path.resolve(import.meta.dirname, 'src/lib'),
      '@data': path.resolve(import.meta.dirname, 'src/data'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // Vitest stubs CSS imports as empty; index.css.test.ts reads the theme's source through `?raw`.
    css: { include: [/src\/index\.css/] },
  },
})
