# SSR Starter (Vue + Vite)

Starter template for creating server-side rendering (SSR) applications based on Vue 3 and Vite. 

[Live Demo](https://starter.hotcom.agency)

## Features

- ⚙️ SSR (Server-Side Rendering) for better SEO and UX
  
- 🌍 Multi-language support via Vue I18n
  
- 🗂 Auto-generating typed routes based on files
  
- 📦 Pinia store with Pinia Colada
  
- 📲 PWA configuration ready
  
- 🦾 Full TypeScript support
  
- 🚀 Fastness with ESBuild
  
## Installation

To run the project, execute the following commands:

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Production preview
npm run preview
```

## Usage

### SSR Context

The project implements full server-side rendering (SSR) with context passing between server and client.

<details><summary><b>Type difinition</b></summary>

```typescript
type Context = {
  // Current request URL
  url: URL | Location   

  // Universal cookies handler
  cookies: Cookies

  // Boolean if running on client side
  isClient: boolean

  // Server (express) request object
  request?: Request

  // Server (express) response object
  response?: Response

  // Redirect function 
  redirect: (params: { 
    location: string, 
    status?: number 
  }) => void 
       
  // Function to write server response data 
  writeServerResponse: (params: { 
    status?: number, 
    statusText?: string, 
    headers?: Record<string, string> 
  }) => void                        
}
```
</details>

### Page state

Routes are automatically generated based on files in the `src/client/pages/` folder. To handle various HTTP statuses, a special wrapper `src/client/pages/[...state].vue` is used, which is responsible for displaying page content or error state.

Statuses can be set through stores, for example:

```typescript
<script setup lang="ts">
import { usePageStore } from '~/stores'

const pageStore = usePageStore()

pageStore.setStatus(401)
</script>
```

### Cookies

```typescript
<script setup lang="ts">
import { useContext } from '~/composables/useContext'
import { isClient } from '~/utils/helpers'

const context = useContext()
const authToken = context.cookies.get('auth-token')

console.info(`authToken cookie (${isClient ? 'client' : 'server'}):`, authToken)

onMounted(() => {
  if (!authToken) { context.cookies.set('auth-token', 'value') }
})
</script>
```
</details>

### Server response

```typescript
<script setup lang="ts">
import { useContext } from '~/composables/useContext'

const context = useContext()

onServerPrefetch(() => {
  context.writeServerResponse({
    status: 401,
    headers: { 'X-Custom-Header': 'custom-value' }
  })
})
</script>
```


### Redirect

```typescript
<script setup lang="ts">
import { useContext } from '~/composables/useContext'

const context = useContext()

context.redirect({ location: '/', status: 301 })
</script>
```

## Main plugins

[Vue Router](https://router.vuejs.org/) - Official router for Vue.js that enables seamless navigation and routing capabilities.

[Vue I18n](https://kazupon.github.io/vue-i18n/) - Internationalization plugin for multi-language support.

[@unhead/vue](https://github.com/unjs/unhead) - SEO toolkit for Vue that enables dynamic meta tags management.

[Pinia](https://pinia.vuejs.org/) - Intuitive store for Vue.js.

[Pinia Colada](https://github.com/posva/pinia-colada) - Provides declarative data fetching, caching and invalidation strategies for Pinia stores.

[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - On-demand component auto importing for Vue, automatically imports components when used in templates.

[unplugin-icons](https://github.com/antfu/unplugin-icons) - Allows using icons from various icon sets directly as Vue components, providing access to thousands of icons from popular collections.

[vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) - Enables Progressive Web App capabilities with zero configuration.

<br/>

[![figma design](figma-banner.png)](https://www.figma.com/site/5j5d1aYilIj5JiScTSxoYV/Starter)
