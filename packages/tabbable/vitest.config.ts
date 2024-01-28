import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig({
    command: 'build',
    mode: 'production',
  }),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'tests/e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
