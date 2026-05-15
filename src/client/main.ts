import { PiniaColada } from '@pinia/colada'
import { createHead as createHeadCient } from '@unhead/vue/client'
import { createHead as createHeadSSR } from '@unhead/vue/server'
import { type Request, type Response } from 'express'
import { createPinia } from 'pinia'
import { CanonicalPlugin } from 'unhead/plugins'
import Cookies from 'universal-cookie'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { type Router } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import App from '~/App.vue'
import { installContext } from '~/composables'
import { isClient } from '~/utils/helpers'
import { createI18nInstance, defaultLocale, extractLocaleFromPath } from '~/utils/locale'
import { createClientResponse, createServerResponse } from '~/utils/ssr'

import '~/assets/styles/main.scss'

export const createApp = ({ url, request, response }: { url: URL, request?: Request, response?: Response }) => {
  /**
   *  Vue applicaltion.
   */
  const app = createSSRApp(App)

  /**
   * Pinia store & Pinia Colada cache.
   */
  const store = createPinia()

  app.use(store)
  app.use(PiniaColada)

  /**
   * Meta tags (unhead).
   */
  const headPlugins = [CanonicalPlugin({ canonicalHost: `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}` })]
  const head = isClient ? createHeadCient({ plugins: headPlugins }) : createHeadSSR({ plugins: headPlugins })

  app.use(head)

  /**
   * Vue Router.
   */
  const routerLocale = extractLocaleFromPath(url.pathname)
  const routerBase = routerLocale === defaultLocale ? '/' : `/${routerLocale}/`
  const router = createRouter({ history: isClient ? createWebHistory(routerBase) : createMemoryHistory(routerBase), routes })

  app.use(router)

  if (import.meta.hot) {
    handleHotUpdate(router)
  }

  /**
   * Localization.
   */
  const i18n = createI18nInstance(routerLocale)

  app.use(i18n)

  /**
   * SSR Context.
   */
  const responseClient = createClientResponse()
  const responseSSR = createServerResponse()

  const context: Context = {
    url: url,
    cookies: isClient
      ? new Cookies(null, { path: '/' })
      : new Cookies(request?.headers.cookie, { path: '/' }),
    writeServerResponse: isClient ? responseClient.writeServerResponse : responseSSR.writeServerResponse,
    redirect: isClient ? responseClient.redirect : responseSSR.redirect,
    isClient,
    request,
    response
  }

  installContext(app, context)

  /**
   * User modules.
   */
  for (const i of Object.values(import.meta.glob<{ install?(ctx: Context & { router: Router }): void }>('./modules/*.ts', { eager: true }))) {
    i.install?.({ ...context, router })
  }

  return {
    app,
    store,
    head,
    router,
    context,
    serverResponse: responseSSR
  }
}
