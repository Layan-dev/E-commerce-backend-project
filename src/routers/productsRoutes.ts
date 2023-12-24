import express from 'express'

import {
  createNewProduct,
  deleteProductById,
  // filterProductByVariantstoSize,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()

router.get('/',  getAllProducts)

router.get('/:productId', getProductById)

router.post('/', checkAuth, checkRole('ADMIN'), validateProduct, createNewProduct)

router.put('/:productId', checkAuth, checkRole('ADMIN'), updateProductById)

router.delete('/:productId', checkAuth, checkRole('ADMIN'), deleteProductById)
//Implement a route to handle GET requests with query parameters for filtering items
//or products based on specific criteria (e.g., by category, price range).

export default router
