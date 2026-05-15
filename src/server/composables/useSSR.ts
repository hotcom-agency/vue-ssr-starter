import fs from 'node:fs/promises'
import { createServer as createHmrServer } from 'node:http'
import { type Server } from 'node:http'
import { createRequire } from 'node:module'
import path from 'node:path'
import { transformHtmlTemplate } from '@unhead/vue/server'
import compression from 'compression'
import { static as static_ } from 'express'
import { type Express } from 'express'
import { type ViteDevServer } from 'vite'
import { isProduction } from './useHelpers'

export const useSSR = async (app: Express) => {
  let vite: ViteDevServer
  let hmrServer: Server | undefined = undefined

  const __dirname = import.meta.dirname
  const require = createRequire(import.meta.url)
  const resolve = (p: string) => path.resolve(__dirname, p)
  const manifest = isProduction ? require('./client/.vite/ssr-manifest.json') : {}

  if (isProduction) {
    app.use(static_(resolve('../dist/client'), {
      index: false,
      maxAge: '1y',
      immutable: true
    }))

    app.use(static_(resolve('../dist/client/assets'), {
      index: false,
      maxAge: '1y',
      immutable: true
    }))

    app.use(compression())
  }
  else {
    const { createServer } = await import('vite')

    hmrServer = createHmrServer(app)

    vite = await createServer({
      configFile: './vite.config.client.ts',
      server: {
        middlewareMode: true,
        hmr: { server: hmrServer, path: '/@vite/client' }
      },
      appType: 'custom'
    })

    app.use(vite.middlewares)
  }

  app.use('*all', async (request, response) => {
    try {
      let template, render
      const url = `${request.protocol}://${String(request.get('host'))}${request.originalUrl}`

      if (isProduction) {
        // eslint-disable-next-line unicorn/no-await-expression-member
        render = (await import(resolve('../dist/server/entry-server.js'))).render
        template = await fs.readFile('./dist/client/index.html', 'utf8')
      }
      else {
        // eslint-disable-next-line unicorn/no-await-expression-member
        render = (await vite.ssrLoadModule('./src/client/entry-server.ts')).render
        template = await fs.readFile('./index.html', 'utf8')
        template = await vite.transformIndexHtml(url, template)

        // fix for vue-router/auto-routes
        for (const [id, module] of vite.moduleGraph.idToModuleMap) {
          if (id.includes('vue-router/auto-routes')) {
            vite.moduleGraph.invalidateModule(module)
          }
        }
      }

      const rendered = await render(url, request, response, manifest)

      const ssrHtml = transformHtmlTemplate(
        rendered?.head,
        template
          .replace('<!--app-preload-links-->', rendered?.preloadLinks ?? '')
          .replace('<!--app-pinia-state-->', rendered?.state ?? '[{}]')
          .replace('<!--app-pinia-query-->', rendered?.query ?? '[{}]')
          .replace('<!--app-html-->', rendered?.html ?? '')
          .replace(/(\n|\r\n)\s*<!--app-teleports-->/, rendered?.teleports ?? '')
      )

      response.set({ 'Content-Type': 'text/html' })
        .writeHead(rendered?.status ?? 200, rendered?.statusText ?? rendered?.status, rendered?.headers)
        .end(ssrHtml)
    }
    catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (vite) {
        console.error('[SSR] On express rendering -', error.stack)

        vite.ssrFixStacktrace(error)
        vite.moduleGraph.invalidateAll()
        vite.ws.send({ type: 'full-reload' })

        return
      }
      response.status(500).end(error.stack)
    }
  })

  return hmrServer
}
