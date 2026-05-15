import { param } from 'express-validator'
import { EPageSlug } from '~/models/page'

export default [param('slug').isIn(Object.keys(EPageSlug))]
