import { plainToInstance } from 'class-transformer'
import { type Request } from 'express'
import createHttpError from 'http-errors'
import { Page } from '~/models/page'
import { localeByRequest } from '~/server/composables/useHelpers'
import pageEn from '~/server/test-data/test-page-en.json'
import pageRu from '~/server/test-data/test-page-ru.json'

const show = async (req: Request): Promise<Page | undefined> => {
  const locale = localeByRequest(req)
  const slug = req.params.slug
  const page = locale === 'ru' ? pageRu : pageEn

  /**
   * Return data with only Page model properties
   */
  const response = await new Promise((resolve) => {
    resolve('Success!')
  })
    .then(() =>
      plainToInstance(Page, page.data, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      }))
    .catch((error: unknown) => {
      throw createHttpError(500, { stack: error })
    })

  if (response.slug !== slug) {
    throw createHttpError(404)
  }

  return response
}

export const PageService = () => ({ show })
