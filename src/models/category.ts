import mongoose, { Document } from 'mongoose'

export type CategoryDocument = Document & {
  name: string
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      // UNIQUE INDEX
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
  },
  { timestamps: true }
)

export default mongoose.model<CategoryDocument>('Category', categorySchema)
