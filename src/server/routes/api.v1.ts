import { Router } from 'express'
import PageController from '~/server/controllers/PageController'
import ValidationMiddleware from '~/server/middlewares/validation-handler'
import PageValidation from './validation/PageValidation'

const router = Router()
const pageController = PageController()

/**
 * Show page by slug
 */
router.get(
  '/v1/pages/:slug',
  ValidationMiddleware(PageValidation, 404),
  pageController.show
)

export default router
