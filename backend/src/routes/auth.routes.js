import express from 'express'
import {    
    registerUser,
    loginUser,
    logoutUser,
    checkUser
} from '../controllers/auth.controllers.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validators.middleware.js'
import { registerUserValidator } from '../validators/validators.js'
const authRoutes = express.Router()

authRoutes
    .route('/register') 
    .post(registerUserValidator(), validate,registerUser)

authRoutes
    .route('/login') 
    .post( loginUser)
    
authRoutes
    .route('/logout') 
    .get(isLoggedIn, logoutUser)
    
authRoutes
    .route('/check') 
    .get(isLoggedIn, checkUser)

export default authRoutes