import { type Request, type Response } from 'express'
import { type Page } from '~/models/page'
import { PageService } from '~/server/services/PageService'
import { apiResponse } from '~/server/utils/response'

const show = async (request: Request, response: Response) => {
  const result = await PageService()
    .show(request)
    .then((response) => apiResponse<Page>(response))
    .catch((error: unknown) => apiResponse(null, (error as any)?.status ?? 500))

  response.status(result.error ? result.error.status : 200).json(result)
}

export default () => ({ show })
