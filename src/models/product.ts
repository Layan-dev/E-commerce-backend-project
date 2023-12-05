import mongoose from 'mongoose'

import { ProductDocument } from '../types'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },

  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  },
  variants: {
    type: [
      {
        type: String,
      },
    ],
  },
  sizes: {
    type: [
      {
        type: String,
      },
    ],
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)
