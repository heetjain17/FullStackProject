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
  refreshAccessToken,
  googleOAuthRedirect,
  googleOAuthCallback,
  githubOAuthRedirect,
  githubOAuthCallback,
  updateProfile,
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

authRoutes.route('/refresh-token').post(refreshAccessToken);

authRoutes.route('/logout').get(isLoggedIn, logoutUser);

authRoutes.route('/check').get(isLoggedIn, checkUser);

authRoutes.route('/resendEmailVerification').post(resendEmailVerification);

authRoutes.route('/google').get(googleOAuthRedirect);

authRoutes.route('/google/callback').get(googleOAuthCallback);

authRoutes.route('/github').get(githubOAuthRedirect);

authRoutes.route('/github/callback').get(githubOAuthCallback);

authRoutes.route('/forgotPasswordRequest').post(forgotPasswordRequest);

authRoutes.route('/resetPassword/:token').post(resetPassword);

authRoutes
  .route('/changePassword')
  .post(isLoggedIn, forgotPasswordValidator(), validate, changePassword);

authRoutes.route('/profile').put(isLoggedIn, updateProfile);

export default authRoutes;
