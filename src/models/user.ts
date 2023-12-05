import mongoose from 'mongoose'

import { UserDocument } from '../types'

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}

function validateRole(role: string) {
  if (role === 'USER' || role === 'ADMIN') {
    return true
  }
  return false
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // this is a unique index
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole, // Literal values using enum
      validate: [validateRole, 'Role has to be either USER or ADMIN'],
      default: UserRole.User, // Default value for the 'role' is a user
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
)

export default mongoose.model<UserDocument>('User', userSchema)
