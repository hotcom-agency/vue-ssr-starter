import { type Request, type Response } from 'express'
import { type Page } from '~/models/page'
import { ApiResponse } from '~/server/composables'
import { PageService } from '~/server/services/PageService'

const show = async (request: Request, response: Response) => {
  const result = await PageService()
    .show(request)
    .then((response) => ApiResponse<Page>(response))
    .catch((error: unknown) => ApiResponse(null, (error as any)?.status ?? 500))

  response.status(result.error ? result.error.status : 200).json(result)
}

export default () => ({ show })
