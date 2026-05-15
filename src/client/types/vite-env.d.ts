declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>

  export default component
}

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST?: string
  readonly VITE_SERVER_PORT?: string
}

interface ImportMeta { readonly env: ImportMetaEnv }
