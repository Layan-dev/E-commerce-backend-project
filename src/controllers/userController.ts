import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user'
import ApiError from '../errors/ApiError'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}, { password: 0 })
  res.status(200).json({
    users,
  })
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await User.findById({
      _id: userId,
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
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
  const { firstName, lastName } = req.validatedUserUpdate || {}

  // Validate the user
  if (!userId) {
    return ApiError.badRequest('Invalid user ID')
  }

  // Find and update the user in one step
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName,
        lastName,
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
export const grantUserRole=async (req:Request, res:Response) => {
  const userId = req.body.userId
  const role = req.body.role
  const user = await User.findOneAndUpdate({ _id: userId }, { role }, { new: true })
  res.json({
    user,
  })
}
