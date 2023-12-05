import { NextFunction, Request, Response } from 'express'
import mongoose, { Types } from 'mongoose'

import ApiError from '../errors/ApiError'
import Order from '../models/order'
import User from '../models/user'
import Product from '../models/product'
import products from '../routers/productsRoutes'
import { orderStatus } from '../constants'
import Cart from '../models/cart'

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) {
      return next(ApiError.notFound('The order cannot be found'))
    }
    res.status(200).json(order)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  //WORKFLOW:
  // cart schema {userId, [{'productID', 'quantity'}], total price }
  //cart route
  //cart controller
  //post method i guess
  //the cart is empty array at the begginig
  // add products (if possible display info) to the cart and quantity of each product default:1
  // calculate the  total price of products
  //when checkout automatically create new order and decrease the products inStock depinding on quantity of each product in the cart

  //Preparations:
  //create cart model

  try {
    const userId = req.params.userId
    const productId = req.body.productId
    const cartId = req.body.cartId

    const user = await User.findById(userId)

    if (!user) {
      next(ApiError.notFound(`Product with ID ${userId} not found.`))
      return
    }

    if (!cartId) {
      const existingProduct = await Product.findById(productId)

      if (existingProduct) {
        const cart = new Cart({
          products: [productId],
          userId,
          totalPrice: existingProduct.price,
        })

        await cart.save()
        res.status(200).json({ msg: 'cart created successfully', cart })
      } else {
        res.status(404).json({ msg: 'product not found' })
      }
    } else {
      //..push to products and accumulate the total price
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $addToSet: { products: productId } }, // Use $addToSet to avoid duplicate product IDs
        { new: true, upsert: true } // Set upsert to true to create a new cart if it doesn't exist
      )
      res.status(200).json({
        message: 'Product added to the cart successfully',
        cart,
      })
    }
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cartId } = req.params

    await Cart.deleteOne({ _id: cartId })
    res.status(204).send()
  } catch (error: any) {
    next(ApiError.badRequest("Order Id is invailed or ca't delete the order"))
  }
}

export const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { products, userId } = req.body

    const order = new Order({
      products,
      userId,
      purchasedAt: new Date(),
    })

    await order.save()
    res.json(order)
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const reduceProductQtyByOne = async (productId: string, next: NextFunction) => {
  try {
    const product = await Product.findById(productId)

    if (!product) {
      next(ApiError.notFound(`Product with ID ${productId} not found.`))
      return
    }

    if (product.quantity > 0) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { quantity: -1 } },
        { new: true }
      )
      console.log('yes worked ')
      // Respond with the updated product
      // You might want to send a response to the client here
    } else {
      next(ApiError.unauthorized(`Product is out of stock.`))
    }
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId

  const order = await Order.findById(orderId)
  if (!order) {
    return next(ApiError.badRequest('order is not found'))
  }
  const products = order.products

  products.forEach((productId) => {
    // Perform some action for each productId
    const productID = productId.toString()
    reduceProductQtyByOne(productID, next)
  })

  // Update the order status to "accepted"
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: orderStatus.accepted },
    { new: true }
  )

  if (!updatedOrder) {
    return next(ApiError.badRequest('Failed to update order status'))
  } else {
    res.json({ message: 'Order accepted successfully', updatedOrder })
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId

    const order = await Order.findById(orderId)
    if (!order) {
      return next(ApiError.badRequest('order is not found'))
    }

    console.log(order)
    let currentStatus = order.orderStatus

    if (currentStatus === orderStatus.pending) {
      return res.status(400).json({ message: 'you should accept order first' })
    }

    if (currentStatus === orderStatus.accepted) {
      currentStatus = orderStatus.shipped
    } else {
      currentStatus = orderStatus.delivered
    }
    const newOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: currentStatus },
      { new: true }
    )

    res.status(201).json({
      newOrder,
      msg: 'order status has changed check it out ',
    })
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params

    await Order.deleteOne({ _id: orderId })
    res.status(204).send()
  } catch (error: any) {
    next(ApiError.badRequest("Order Id is invailed or ca't delete the order"))
  }
}
