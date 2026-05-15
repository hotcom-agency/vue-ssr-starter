import { type Request } from 'express'

export const isProduction = process.env.NODE_ENV === 'production'

export const requestParams = (
  _request: Request,
  parameters: { key: string, value: string }[] = []
) => {
  const urlParameters = new URLSearchParams({})

  for (const index of parameters) {
    urlParameters.append(index.key, index.value)
  }

  return urlParameters.toString()
}

export const localeByRequest = (request: Request) =>
  (request.acceptsLanguages ('ru', 'en') || 'en') as 'ru' | 'en'
