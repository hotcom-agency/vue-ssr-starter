import { type Request } from 'express'

export const isProduction = process.env.NODE_ENV === 'production'
export const localeByRequest = (request: Request): 'ru' | 'en' => (request.acceptsLanguages('ru', 'en') || 'en') as 'ru' | 'en'
