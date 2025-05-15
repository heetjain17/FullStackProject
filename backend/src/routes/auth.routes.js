import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    checkUser,
    verifyUser,
    resendEmailVerification,
    resetPassword,
    changePassword,
    forgotPasswordRequest,
} from '../controllers/auth.controllers.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validators.middleware.js';
import {
    registerUserValidator,
    forgotPasswordValidator,
} from '../validators/validators.js';
const authRoutes = express.Router();

authRoutes
    .route('/register')
    .post(registerUserValidator(), validate, registerUser);

authRoutes.route('/verify/:token').get(verifyUser);

authRoutes.route('/login').post(loginUser);

authRoutes.route('/logout').get(isLoggedIn, logoutUser);

authRoutes.route('/check').get(isLoggedIn, checkUser);

authRoutes.route('/resendEmailVerification').post(resendEmailVerification);

authRoutes
    .route('/forgotPasswordRequest')
    .post(forgotPasswordValidator(), validate, forgotPasswordRequest);

authRoutes.route('/resetPassword/:token').post(resetPassword);

authRoutes
    .route('/changePassword')
    .post(forgotPasswordValidator(), validate, changePassword);

export default authRoutes;
