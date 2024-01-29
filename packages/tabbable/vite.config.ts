import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      fileName: () => 'index.js',
      formats: ['iife'],
      name: 'tabbable',
    },
    minify: false,
  },
})
