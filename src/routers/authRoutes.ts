import express from 'express'

import { registerNewUser, loginUser, activateUser } from '../controllers/authController'
import { validateUserRegistration } from '../validation/validateUserRegistration'
import { validateUserLogin } from '../validation/validateUserLogin'
import { limiter } from '../utils/rateLimit'

const router = express.Router()

router.get('/activateUser/:activationToken', activateUser)

router.post('/register', validateUserRegistration, registerNewUser)

router.post('/login', limiter, validateUserLogin, loginUser)

export default router
