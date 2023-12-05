declare namespace Express {
  interface Request {
    msg: string
    validateRegisteredUser: {
      firstName: string
      lastName: string
      email: string
      password: string
    }
    validateLoginUser: {
      email: string
      password: string
    }
    validatedUserUpdate?: {
      firstName?: string | undefined
      lastName?: string | undefined
      email?: string | undefined
      password?: string | undefined
    }
    decodedUser: {
      userID: string
      email: string
      role: 'USER' | 'ADMIN'
      iat: number
      exp: number
    }
  }
}
