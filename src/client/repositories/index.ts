import { isSSR } from '~/utils/helpers'
import * as pageRepository from './pageRepository'

const host = import.meta.env.VITE_SERVER_HOST ?? 'http://localhost'
const port = import.meta.env.VITE_SERVER_PORT ?? '5173'

export const apiHost = isSSR ? `${host}:${port}/api` : '/api'

export default { page: pageRepository }
