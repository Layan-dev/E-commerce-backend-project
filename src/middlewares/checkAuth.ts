import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import { UserRole } from '../models/user'
import { DecodedUser } from '../types'

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (token) {
    try {
      const decodedUser = jwt.verify(token, dev.auth.secretToken as string) as DecodedUser
      req.decodedUser = decodedUser
      next()
    } catch (error) {
      next(ApiError.forbidden('invaild credentials'))
    }
    return
  }
  next(ApiError.forbidden('Token is requierd'))
}
