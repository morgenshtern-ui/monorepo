import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
})
