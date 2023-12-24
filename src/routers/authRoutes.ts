import express from 'express'

import { registerNewUser, loginUser, activateUser, resetUserPassword, forgotUserPassword } from '../controllers/authController'
import { validateUserRegistration } from '../validation/validateUserRegistration'
import { validateForgotPaswwordUser, validateResetPasswordUser, validateUserLogin } from '../validation/validateUserLogin'
import { limiter } from '../utils/rateLimit'

const router = express.Router()

router.get('/activateUser/:activationToken', activateUser)

router.post('/reset-pass', validateResetPasswordUser, resetUserPassword)

router.post('/forgot-password', validateForgotPaswwordUser, forgotUserPassword)

router.post('/register', validateUserRegistration, registerNewUser)

router.post('/login', limiter, validateUserLogin, loginUser)

export default router
