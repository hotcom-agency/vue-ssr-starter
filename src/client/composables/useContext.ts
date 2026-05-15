import { type App } from 'vue'
import { inject } from 'vue'

const CONTEXT_SYMBOL = Symbol.for('v-ssr-context')

export const installContext = (app: App, context: Context) => {
  if (!app._context.provides[CONTEXT_SYMBOL]) {
    app.provide(CONTEXT_SYMBOL, context)
  }
}

export const useContext = (): Context => {
  const context = inject<Context>(CONTEXT_SYMBOL)

  if (!context) {
    throw new Error('[SSR Context] useContext() was called outside of an active Vue application instance or before installContext().')
  }

  return context
}
