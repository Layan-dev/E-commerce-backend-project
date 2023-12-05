import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'

import ApiError from '../errors/ApiError'

export function validateUserUpdate(req: Request, res: Response, next: NextFunction) {
  // Zod schema for user data validation
  const userUpdateSchema = z
    .object({
      firstName: z.string().min(3).max(50).optional(),
      lastName: z.string().min(3).max(50).optional(),
    })
    .optional()

  try {
    const validatedUserUpdate = userUpdateSchema.parse(req.body)
    req.validatedUserUpdate = validatedUserUpdate
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      const missingFields = error.errors.map((e) => e.path.join('.'))
      next(ApiError.badRequest(`Missing or invalid fields: ${missingFields.join(', ')}`))
      return
    }
    next(ApiError.internal('Something went wrong while updating the user.'))
  }
}
