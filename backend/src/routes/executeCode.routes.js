import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js'
import { executeCode } from '../controllers/executeCode.controllers.js'

const executionRoutes = express.Router()

executionRoutes
    .route('/')
    .post(isLoggedIn, executeCode)
    
executionRoutes
    .route('/')
    .post(isLoggedIn, executeCode)

export default executionRoutes