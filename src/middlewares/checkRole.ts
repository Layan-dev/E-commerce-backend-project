import { Request, Response, NextFunction } from 'express'

import ApiError from '../errors/ApiError'
import { Role } from '../types'

export function checkRole(userRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.decodedUser

    if (decodedUser.role !== userRole) {
      next(ApiError.forbidden('User Not Authorized'))
      return
    }
    next()
  }
}
