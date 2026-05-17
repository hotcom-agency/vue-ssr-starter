import { type NextFunction, type Request, type Response } from 'express'
import { apiResponse } from '~/server/utils/response'

export const errorNotFound = (_req: Request, res: Response) => {
  const response = apiResponse(null, 404)

  res.status(404).json(response)
}

export const errorUnexpected = (
  err: TApiResponse | undefined,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let response = err ?? {}

  if (!(response).error) {
    response = apiResponse(null, res.statusCode === 200 ? 500 : res.statusCode)
  }

  res.status((response).error?.status ?? 500).json(response)
}
