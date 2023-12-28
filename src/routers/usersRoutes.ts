import express from 'express'

import {
  deleteUser,
  getUserById,
  getUsers,
  grantUserRole,
  updateUser,
} from '../controllers/userController'
import {
  acceptOrder,
  addNewOrder,
  addToCart,
  deleteCart,
  updateOrderStatus,
  getCartByUserId,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import { validateUserUpdate } from '../validation/validateUserUpdate'
import { checkOwnership } from '../middlewares/checkOwnership'

const router = express.Router()

router.get('/admin/getAllUsers', checkAuth, checkRole('ADMIN'), getUsers)

router.get('/:userId', checkAuth, checkOwnership, getUserById)

router.delete('/admin/deleteUser/:userId', checkAuth, checkRole('ADMIN'), deleteUser)

router.put('/profile/:userId', validateUserUpdate, updateUser)

router.post('/orders/addNewOrder', addNewOrder)

router.post('/addToCart/:userId', addToCart)

router.get('/cart/:userId', getCartByUserId)

router.put('/role', checkAuth, checkRole('ADMIN'), grantUserRole)

router.delete('/deleteFromCart/:cartId', deleteCart)

router.put('/admin/orders/:orderId', checkAuth, checkRole('ADMIN'), acceptOrder)

router.put('/admin/orders/updatestatus/:orderId', checkAuth, checkRole('ADMIN'), updateOrderStatus)

export default router
