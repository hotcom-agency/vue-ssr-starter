import { builtinModules } from 'node:module'
import { defineConfig, type UserConfig } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'

const serverConfig: UserConfig = {
  publicDir: false,
  build: {
    ssr: true,
    manifest: false,
    ssrManifest: false,
    target: 'node22',
    outDir: 'dist',
    lib: {
      entry: './src/server/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rolldownOptions: {
      external: [
        'express',
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`)
      ]
    },
    sourcemap: !isProduction,
    emptyOutDir: true
  },
  resolve: { tsconfigPaths: true }
}

export default defineConfig(serverConfig)
