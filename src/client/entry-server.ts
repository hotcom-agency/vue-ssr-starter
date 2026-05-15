import { isQueryCache, serializeQueryCache, useQueryCache } from '@pinia/colada'
import * as devalue from 'devalue'
import { type Request, type Response } from 'express'
import { renderToString } from 'vue/server-renderer'
import { type SSRContext } from 'vue/server-renderer'
import { createApp } from '~/main'
import { createServerUrlUtils, escapeCharacters } from './utils/ssr'

/**
 * Main SSR Entry Point for Server-Side Rendering.
 */
export async function render(
  url: string,
  req: Request,
  res: Response,
  manifest: object
) {
  const { createUrl, withoutSuffix, getFullPath } = createServerUrlUtils()

  /**
   * Factory function to initialize a fresh application instance.
   */
  const init = async () => {
    const instance = createApp({
      url: createUrl(url),
      request: req,
      response: res
    })

    // Normalize path and handle router base suffix
    const base = instance.router.options.history.base
    const path = getFullPath(url, base ? withoutSuffix(base, '/') : undefined)

    // Push requested route and wait until the router is fully resolved
    await instance.router.push(path)
    await instance.router.isReady()

    return instance
  }

  try {
    /**
     * Initial creation and rendering.
     */
    const instance = await init()
    const { response, isRedirect, isError } = instance.serverResponse
    let { app, store, head } = instance

    /**
     * Catch redirect: abort immediately to save CPU cycles.
     */
    if (isRedirect()) {
      return { head, ...response }
    }

    let ctx: SSRContext = {}
    let html = await renderToString(app, ctx)

    /**
     * Catch error and redirect after full component tree rendering: re-initialize
     * the app to ensure the State and HTML stay in sync.
     */
    if (isRedirect()) {
      return { head, ...response }
    }

    if (isError()) {
      // Set actual status.
      res.status(Number(response.status))

      const hook = await init()

      app = hook.app
      store = hook.store
      head = hook.head
      ctx = {}
      html = await renderToString(app, ctx)
    }

    /**
     * Serialization Pinia store and Pinia Colada cache.
     */
    const queryCache = useQueryCache(store)
    const query = escapeCharacters(devalue.stringify(queryCache, { PQ_Cache: (data) => isQueryCache(data) && serializeQueryCache(data) }))

    delete (store.state.value as any)._pc_query
    delete (store.state.value as any)._pc_mutation

    const state = escapeCharacters(devalue.stringify(store.state.value))

    return {
      state,
      query,
      head,
      html,
      teleports: renderTeleports(ctx.teleports),
      preloadLinks: renderPreloadLinks(ctx.modules, manifest),
      ...response
    }
  }
  catch (error: any) {
    console.error('[SSR] Critical Render Error:', error)
    throw error
  }
}

/**
 * Generate preload links.
 */
const renderPreloadLinks = (modules: Set<string> | string[], manifest: any) => {
  let links = ''
  const seen = new Set<string>()

  for (const id of modules) {
    const files = manifest[id]

    if (files) {
      for (const file of files) {
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreloadLink(file)
        }
      }
    }
  }

  return links
}

const renderPreloadLink = (file: string): string => {
  if (file.endsWith('.js')) { return `<link rel="modulepreload" crossorigin href="${file}">` }
  if (file.endsWith('.css')) { return `<link rel="stylesheet" href="${file}">` }
  if (/\.(woff2?)$/.test(file)) { return `<link rel="preload" href="${file}" as="font" type="font/${String(file.split('.').pop())}" crossorigin>` }

  return ''
}

/**
 * Handles Vue Teleport components by wrapping them in appropriate containers.
 */
function renderTeleports(teleports?: Record<string, string>) {
  if (!teleports) { return '' }

  return Object.entries(teleports).reduce((all, [key, value]) => {
    if (key.startsWith('#')) {
      return `${all}<div id="${key.slice(1)}">${value}</div>`
    }

    return all
  }, teleports.body || '')
}
