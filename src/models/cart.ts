import mongoose, { Document } from 'mongoose'

import { CartDocument } from '../types'

const cartSchema = new mongoose.Schema({
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
})

export default mongoose.model<CartDocument>('Cart', cartSchema)
