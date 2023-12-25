import { NextFunction, Request, Response } from 'express'
import z, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    name: z
      .string()
      .min(3, { message: 'Product name must at least 3 characters' })
      .max(100, { message: 'Product name must be 100 characters or less' }),
    description: z
      .string()
      .min(10, { message: 'Product description must at least 3 characters' })
      .max(500, { message: 'Product description must be 500 characters or less' }),
    image: z.string().min(1, { message: 'Product image is required' }),
    quantity: z.number().nonnegative({ message: 'Quantity in stock must be non-negative number' }),
    price: z.number().nonnegative({ message: 'Product price must be nonnegative number' }),
    category: z.array(z.string()).min(1, { message: 'Please enter at least one category' }),
  })

  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      const validationErrorMessages = error.errors.map((error) => error.message)
      next(ApiError.badRequest(`Validation error: ${validationErrorMessages.join(', ')}`))
      return
    }

    next(ApiError.internal('Something went wrong'))
   
  }
}
