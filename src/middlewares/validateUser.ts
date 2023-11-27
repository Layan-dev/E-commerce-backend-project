import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'
import ApiError from '../errors/ApiError'
export function validateUser(req: Request, res: Response, next: NextFunction) {
  // Zod schema for user data validation
  const userSchemaValidator = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
  })
  try {
    const validatedUser = userSchemaValidator.parse(req.body)
    req.validateUser = validatedUser
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      const missingFields = error.errors.map((e) => e.path.join('.'))
      next(ApiError.badRequest(`Missing or invalid fields: ${missingFields.join(', ')}`))
      return
    }
    // Handle other types of errors here...
    next(ApiError.internal('Something went wrong while creating the user.'))
  }
}
