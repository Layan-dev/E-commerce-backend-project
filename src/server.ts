import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'

import usersRouter from './routers/users'
import productsRouter from './routers/products'
import ordersRouter from './routers/orders'
import categoryRouter from './routers/categories'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import { dev } from './config/index'

config()
const app = express()
const PORT = dev.app.port ||8080
const URL = dev.app.db as string

if (process.env.NODE_ENV === 'development') {
  app.use(myLogger)
}
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories',categoryRouter )
app.get('/',(req,res)=>{
  res.json({
    msg:"hello!",
  })
})
app.use(apiErrorHandler)

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error, ', err)
  })
app.use('/hello', (req,res)=>{
  res.json({
    msg:"hello"
  })
  res.end()
})
app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})

export default app