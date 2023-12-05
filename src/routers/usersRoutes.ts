import express from 'express'

import { deleteUser, getUsers, updateUser } from '../controllers/userController'
import {
  acceptOrder,
  addNewOrder,
  addToCart,
  deleteCart,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import { validateUserUpdate } from '../validation/validateUserUpdate'

const router = express.Router()

router.get('/admin/getAllUsers', checkAuth, checkRole('ADMIN'), getUsers)

router.delete('/admin/deleteUser/:userId', checkAuth, checkRole('ADMIN'), deleteUser)

router.put('/profile/:userId', validateUserUpdate, updateUser)

router.post('/orders/addNewOrder', addNewOrder)

router.post('/addToCart/:userId', addToCart)

router.delete('/deleteFromCart/:cartId', deleteCart)

router.put('/admin/orders/:orderId', checkAuth, checkRole('ADMIN'), acceptOrder)

router.put('/admin/orders/updatestatus/:orderId', checkAuth, checkRole('ADMIN'), updateOrderStatus)

export default router
