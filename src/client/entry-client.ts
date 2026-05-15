import { hydrateQueryCache, useQueryCache } from '@pinia/colada'
import * as devalue from 'devalue'
import { createApp } from './main'

const { app, router, store } = createApp({ url: new URL(window.location.href) })

/**
 * Deserialize Pinia store state and Pinia Colada cache.
 */
const initSsrState = () => {
  try {
    if (window.__INITIAL_QUERY__) {
      const queryData = devalue.parse(window.__INITIAL_QUERY__, { PQ_Cache: (data) => data })

      hydrateQueryCache(useQueryCache(store), queryData)
    }

    if (window.__INITIAL_STATE__) {
      store.state.value = devalue.parse(window.__INITIAL_STATE__)
    }
  }
  catch (error) {
    console.error('[SSR] State hydration failed:', error)
  }
}

initSsrState()

/**
 * Use .then() instead of top-level await.
 */
void router.isReady()
  .then(() => {
    app.mount('#app')
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error: unknown) => {
    console.error('[SSR] Router initialization error:', error)
  })
