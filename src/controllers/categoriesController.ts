import { NextFunction, Request, Response } from 'express'
import Category from '../models/category'
import ApiError from '../errors/ApiError'

              // GET ALL CATEGORIES
export const getAllcategories = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (error) {
        next(ApiError.badRequest('Something went wrong while fetching categories.'))
    }
  }
}             // GET CRUD FOR SINGLE CATEGORY
export const getcategory = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const categoryId = req.params.categoryId
      const category = await Category.findById(categoryId)
      if (!category) {
        next(ApiError.badRequest('Category not found.'))
        return
    }
    res.status(200).json(category)
} catch (error) {
        next(ApiError.badRequest('Something went wrong while fetching the category.'))
    }
  }
}             //POST CRUD
export const newCategory = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const name = req.body.name
      // Check if name is missing
      if (!name) {
        next(ApiError.badRequest('Name is required'))
        return
      }

      // Check if name length is valid
      if (name.length < 2 || name.length > 10) {
        next(ApiError.badRequest('Category name must be between 3 and 10 characters.'))
        return
      }
      const category = new Category({
        name,
      })

      await category.save()

      res.status(201).json({
        status: true,
        name,
        category,
      })
    } catch (error) {
        next(ApiError.badRequest('Something went wrong while creating the category.'))

    }
  }
}
               // DELETE CRUD
export const deletecategory = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const { categoryId } = req.params
      await Category.deleteOne({
        _id: categoryId,
      })
      res.status(204).send()
    } catch (error) {
        next(ApiError.badRequest('Something went wrong while deleting the category.'))
    }
  }
}
              //PUT CRUD
export const update = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const UpdateName = req.body.name
      const { categoryId } = req.params
      const UpdateCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name: UpdateName },
        {
          new: true,
        }
      )
      res.json({
        category: UpdateCategory,
      })
    } catch (error) {
        next(ApiError.badRequest('Something went wrong while updating the category.'))
    }
  }
}
