import { type Request, type Response } from 'express'
import type Cookies from 'universal-cookie'
import type { createServerResponse, WriteServerResponse } from '~/utils/ssr'

declare global {
  type Context = {
    url: URL | Location
    cookies: Cookies
    isClient: boolean
    request?: Request
    response?: Response
    responseSSR?: ReturnType<typeof createServerResponse>
    redirect: (params: { location: string, status?: number }) => void
    writeServerResponse: (
      params: WriteServerResponse
    ) => void
  }

  type UserModule = (ctx: Context & { router: Router }) => void

  interface Window {
    __INITIAL_STATE__: any
    __INITIAL_QUERY__: any
  }

}
