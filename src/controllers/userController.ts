import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user'
import ApiError from '../errors/ApiError'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
  res.status(200).json({
    users,
  })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  await User.deleteOne({
    _id: userId,
  })
  res.status(204).send()
}

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { firstName, lastName, email, password } = req.body

  // Validate the user
  if (!userId) {
    return ApiError.badRequest('Invalid user ID')
  }

  // Hash the password if provided
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

  // Find and update the user in one step
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    },
    // Save the updated user to the database
    { new: true }
  )
  // Check if the user exists
  if (!updatedUser) {
    throw ApiError.notFound('User not found')
  }

  res.status(200).json({
    msg: 'User updated successfully',
    user: updatedUser,
  })
}
