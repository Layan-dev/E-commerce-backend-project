import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import ApiError from '../errors/ApiError'
import {
  generateActivationToken,
  sendActivationEmail,
  sendForgotPasswordEmail,
} from '../utils/email'
import { dev } from '../config'
import { validateResetPasswordUser } from '../validation/validateUserLogin'

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { activationToken } = req.params
  const user = await User.findOne({ activationToken })

  if (!user) {
    return next(ApiError.badRequest('Invalid activation token'))
  }

  user.isActive = true
  user.activationToken = undefined

  await user.save()

  res.status(200).json({
    msg: 'Your account has been successfully activated!',
  })
}

// resest the password
export const resetUserPassword = async (req: Request, res: Response) => {
  const password = req.resetPassUser.password // we will return it from object in index file, not from body
  const forgotPasswordCode = req.resetPassUser.forgotPasswordCode
  const hashedPassword = await bcrypt.hash(password, 10)
  // find by this
  const user = await User.findOne({ forgotPasswordCode })
  if (!user) {
    return res.json({ msg: 'Password did not reset' })
  }
  user.forgotPasswordCode = undefined
  user.password = hashedPassword
  await user.save()
  res.json({
    msg: 'Password is reset ',
  })
}
// forgot password
export const forgotUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.forgotPassUser

  try {
    const userExists = await User.findOne({ email })
    if (!userExists || !userExists.isActive) {
      return next(
        ApiError.badRequest('Email does not exists or are you sure activated your email?')
      )
    }
    const forgotPasswordCode = generateActivationToken()
    await User.updateOne({ email }, { forgotPasswordCode })
    await sendForgotPasswordEmail(email, forgotPasswordCode)
    res.json({
      msg: ' Check your email to reset your password ',
    })
  } catch (error) {
    console.log('error:', error)
    next(ApiError.badRequest('somthing went wrong '))
  }
}
export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
  // as first step receive everything from the request body as it's in our schema
  const { firstName, lastName, email, password } = req.validateRegisteredUser

  // Check if the user is already registered by using the email as unique
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(ApiError.conflict('Email is already registered'))
  }
  const activationToken = generateActivationToken()

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    // create a new instant form the schema and provied the properites to it
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      activationToken,
    })

    await sendActivationEmail(email, activationToken, firstName)
    // save it to the database
    await user.save()
    res.status(201).json({
      msg: 'Your registration was successful!. Check your email to activate your account ',
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong with the registeration proccess'))
  }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.validateLoginUser

  // find the user uing its email
  const existingUser = await User.findOne({ email })
  if (!existingUser || existingUser.isActive !== true) {
    return next(ApiError.badRequest('Invalid email or account is not activated!'))
  }
  // Check if the entered password matches the stored hashed password
  const passwordMatch = await bcrypt.compare(password, existingUser.password)
  if (!passwordMatch) {
    return next(ApiError.unauthorized('Invalid email or password'))
  }

  const token = jwt.sign(
    {
      userID: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    },
    dev.auth.secretToken as string,
    {
      expiresIn: '24h',
      algorithm: 'HS256',
    }
  )

  const user = await User.findOne({ email }).select('-password')

  // At this point, the user is authenticated
  res.status(200).json({
    message: 'Login successful!',
    token: token,
    user,
  })
}
