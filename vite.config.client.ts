import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'
import type { ConfigEnv } from 'vite'

export default ({ mode }: ConfigEnv) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  return defineConfig({
    server: {
      host: '0.0.0.0',
      allowedHosts: mode === 'development' ? true : undefined,
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    ssr: { noExternal: mode === 'development' ? ['vue-router', 'vite-imagetools'] : ['vite-imagetools'] },
    build: {
      outDir: 'dist/client',
      modulePreload: false,
      cssCodeSplit: true,
      ssrManifest: true,
      rolldownOptions: {
        output: {
          chunkFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash].[ext]'
        }
      }
    },
    resolve: { tsconfigPaths: true },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: mode === 'development'
          ? '[local]_[hash:base64:8]'
          : '_[hash:base64:8]'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${path.resolve(__dirname, 'src/client/assets/styles/mixins/_manifest.scss')}" as *;`,
          silenceDeprecations: ['legacy-js-api', 'import']
        }
      }
    },
    plugins: [
      VueRouter({
        dts: 'src/client/types/typed-router.d.ts',
        extensions: ['.vue'],
        routesFolder: 'src/client/pages',
        extendRoute: (route) => {
          if (route.fullPath.startsWith('/examples')) {
            route.addToMeta({ layout: 'example' })
          }
        }
      }),
      Vue(),
      VueI18n({
        include: [path.resolve(__dirname, './src/client/locales/general/*')],
        ssr: true
      }),
      Components({
        dirs: ['src/client/components'],
        extensions: ['vue'],
        include: [/\.vue$/, /\.vue\?vue/],
        resolvers: [IconsResolver({
          prefix: 'icon',
          customCollections: ['custom', 'ui']
        })],
        dts: 'src/client/types/components.d.ts'
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          custom: FileSystemIconLoader('src/client/assets/icons'),
          ui: FileSystemIconLoader('src/client/assets/icons/ui')
        }
      }),
      ViteWebfontDownload(
        ['https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'],
        { subsetsAllowed: ['latin', 'cyrillic'] }
      ),
      VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        devOptions: {
          enabled: false, // set true for testing
          type: 'module',
          suppressWarnings: true
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: ['**/*.{js,css,webp,jpg,jpeg,png,svg,gif,woff,woff2}'],
          navigateFallback: null,
          navigationPreload: true,
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'ssr-pages-cache',
                precacheFallback: { fallbackURL: '/' },
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: ({ url }) => /^\/api\//.exec(url.pathname),
              handler: 'StaleWhileRevalidate',
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                matchOptions: {
                  ignoreVary: true,
                  ignoreSearch: true
                },
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        },
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'Vue Vite SSR',
          short_name: 'Vue SSR',
          lang: 'en',
          icons: [
            { src: '/pwa-96x96.png', sizes: '96x96', type: 'image/png' },
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        }
      }),
      AutoImport({
        imports: [
          unheadVueComposablesImports,
          VueRouterAutoImports,
          'vue',
          'vue-i18n'
        ],
        dts: 'src/client/types/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      })
    ]
  })
}
