import express from 'express'
import {    
    registerUser,
    loginUser,
    logoutUser,
    checkUser
} from '../controllers/auth.controllers.js'
import { isLoggedIn } from '../middleware/auth.middlewares.js'
const authRoutes = express.Router()

authRoutes.post('/register', registerUser)

authRoutes.post('/login', loginUser)

authRoutes.get('/logout', isLoggedIn, logoutUser)

authRoutes.get('/check', isLoggedIn, checkUser)

export default authRoutes