import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'

import ApiError from '../errors/ApiError'

export function validateUserLogin(req: Request, res: Response, next: NextFunction) {
  const userloginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  try {
    const validatedUser = userloginSchema.parse(req.body)
    req.validateLoginUser = validatedUser
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle the email and password validation error
      const missingFields = error.errors.map((e) => e.path.join('.'))
      return next(ApiError.badRequest(`Missing or invalid fields: ${missingFields.join(', ')}`))
    }
    return next(ApiError.internal('Something went wrong while validating login data.'))
  }
}
