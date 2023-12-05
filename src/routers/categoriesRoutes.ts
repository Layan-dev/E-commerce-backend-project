import { Router } from 'express'

import {
  getAllcategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../controllers/categoriesController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import { validateCategory } from '../validation/validateCategory'

const router = Router()

//-- CRUD OPREATIONS --

//  GET all categories
router.get('/', getAllcategories)

// GET single category
router.get('/:categoryId', getCategory)

// CREATE category
router.post('/', validateCategory, createCategory)

// DELETE category by id
router.delete('/:categoryId', checkAuth, checkRole('ADMIN'), deleteCategory)

router.put('/:categoryId', updateCategory)

export default router
