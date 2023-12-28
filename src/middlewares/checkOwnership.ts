import { Request, Response, NextFunction } from 'express'

import ApiError from '../errors/ApiError'
import { Role } from '../types'
import { ROLE } from '../constants'

export function checkOwnership(req: Request, res: Response, next: NextFunction) {
  const decodedUser = req.decodedUser
  const userIdParams = req.params.userId

  const hasAccess = decodedUser.role === ROLE.ADMIN || decodedUser.userID === userIdParams

  if (!hasAccess) {
    next(ApiError.forbidden('User Not Authorized'))
    return
  }
  next()
}
