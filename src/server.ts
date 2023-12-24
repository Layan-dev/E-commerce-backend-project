import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'

import usersRouter from './routers/usersRoutes'
import authRouter from './routers/authRoutes'
import productsRouter from './routers/productsRoutes'
import ordersRouter from './routers/ordersRoutes'
import categoryRouter from './routers/categoriesRoutes'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import cors, { CorsOptions } from 'cors'
import { dev } from './config/index'

config()

const app = express()
const PORT = dev.app.port || 8080
const URL = dev.app.db as string
const environment = process.env.NODE_ENV || 'development'

if (environment === 'development') {
  app.use(myLogger)
}

app.use(express.urlencoded({ extended: true }))

var whitelist = ['myowfrontenddomain.com']
if (environment == 'development') {
  whitelist.push('http://localhost:3000')
}
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.json({
    msg: 'hello!',
  })
})
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoryRouter)
app.use(apiErrorHandler)

app.use('/', (req, res) => {
  res.json({
    msg: ' hello, majedah is here',
  })
})
mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error, ', err)
  })
// app.use('/', (req,res)=>{
//   res.json({
//     msg:"hello"
//   })
//   res.end()
// })
app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})

export default app
