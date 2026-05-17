import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'
import { type ValidationChain } from 'express-validator'
import { apiResponse } from '~/server/utils/response'

export default function (validations: ValidationChain[], code = 400) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      next()

      return
    }

    const response = apiResponse(null, code, errors.array())

    res.status(response.error?.status ?? code).json(response)
  }
}
