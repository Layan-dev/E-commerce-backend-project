import express from 'express'

import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()

router.get('/', getOrders)

router.get('/:orderId', getOrderById)

router.put('/:orderId', updateOrderStatus)

router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

export default router
