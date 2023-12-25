import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Product from '../models/product'

// type Filter = {
//   variants?: string
//   sizes?: string
// }

// interface CustomRequest extends Request {
//   filters?: Filter
// }

// export const filterProductByVariantstoSize = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const filters: Filter = {}
//   const variants = req.query.variants
//   const sizes = req.query.sizes
//   if ((variants && typeof variants === 'string') || variants === 'string[]') {
//     filters.variants = variants
//   }
//   if (sizes && typeof sizes === 'string') {
//     filters.sizes = sizes
//   }
//   req.filters = filters
//   next()
// }

export type SortOrder = 1 | -1
type Filter = {
  category?: string
  name?: { $regex: RegExp }
}
export const getAllProducts = async (req: Request, res: Response) => {
  console.log('first')
  const filters: Filter = {}
  const pageNumber: number = Number(req.query.pageNumber) || 1
  const perPage: number = Number(req.query.perPage) || 3
  const categoryId: string = req.query.categoryId as string
  const sortField: string = (req.query.sortField as string) || 'price' // Explicitly assert type, we can sort by name or price or other
  const sortOrder: SortOrder = req.query.sortOrder === 'dec' ? -1 : 1
  const sortOptions: { [key: string]: SortOrder } = { [sortField]: sortOrder }
  console.log(sortOptions)
  const search: string = (req.query.search as string) || ''
  const name = req.query.name
  // const filterByName = { name: { $regex: search, $options: 'i' } }
  console.log('categoryId', categoryId)
  if (categoryId && typeof categoryId === 'string') {
    //@ts-ignore
    filters.category = { $in: categoryId }
  }

  if (search && typeof search === 'string') {
    filters.name = { $regex: new RegExp(search, 'i') }
  }
  console.log(filters)
  try {
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .populate('category')
    // Use $regex to search for documents where the 'name' field
    // matches the specified pattern (provided by the 'search' variable),
    // and $options: 'i' ensures a case-insensitive match.
    const totalProducts = await Product.countDocuments(filters)
    const totalPages = Math.ceil(totalProducts / perPage)
    res.json({
      pageNumber,
      perPage,
      totalProducts,
      totalPages,
      products,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId

    const product = await Product.findById({
      _id: productId,
    })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
}

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, quantity, image, price, category, variants, sizes } = req.body

  if (!name || !description || !image || !price || !category) {
    next(ApiError.badRequest('Name, Description, image, price and category are requried'))
    return
  }
  const product = new Product({
    name,
    description,
    quantity,
    image,
    price,
    category,
    variants,
    sizes,
  })

  await product.save()
  res.status(201).json(product)
}

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId

  await Product.deleteOne({
    _id: productId,
  })
  res.status(204).send()
}

export const updateProductById = async (req: Request, res: Response) => {
  const newName = req.body.name
  const newDescription = req.body.description
  const newQuantity = req.body.quantity
  const newImage = req.body.image
  const newPrice = req.body.price
  const newCategory = req.body.category
  const newVariant = req.body.variants
  const newSize = req.body.sizes
  const productId = req.params.productId

  const newProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name: newName,
      description: newDescription,
      quantity: newQuantity,
      image: newImage,
      price: newPrice,
      category: newCategory,
      variants: newVariant,
      sizes: newSize,
    },
    {
      new: true,
    }
  ).populate('category')

  res.json({
    newProduct,
  })
}
