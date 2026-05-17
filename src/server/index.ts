import cookies from 'cookie-parser'
import cors from 'cors'
import { config as configEnv } from 'dotenv'
import express from 'express'
import { setupSSR } from './core/ssr'
import { errorNotFound, errorUnexpected } from './middlewares/error-handler'
import apiRoutesV1 from './routes/api.v1'
import { isProduction } from './utils/helpers'

configEnv()

const host = process.env.VITE_SERVER_HOST ?? 'http://localhost'
const port = process.env.VITE_SERVER_PORT ? Number(process.env.VITE_SERVER_PORT) : 5173

const createServer = async () => {
  const app = express().disable('x-powered-by')

  // Middlewares
  app.use(cors())
  app.use(cookies())

  // Api routes
  app.use('/api', apiRoutesV1, errorNotFound)

  // SSR with HMR
  const hmr = await setupSSR(app)

  // Error handler
  app.use(errorUnexpected)

  return isProduction ? app : hmr
}

export default await createServer().then((app) =>
  app?.listen(port, () => {
    console.info(
      '\u001B[36m%s\u001B[0m',
      `🚀 Server started at ${host}:${String(port)}`
    )
    process.on('SIGTERM', () => {
      console.info('🛑 Server stopped')
      process.exit()
    })
  })).catch((error: unknown) => { console.error(error) })
