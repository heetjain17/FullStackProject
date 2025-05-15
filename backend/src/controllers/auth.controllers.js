import bcrypt from 'bcryptjs';
import { db } from '../libs/db.js';
import { UserRole } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { ApiError, ApiSuccess } from '../utils/apiError.js';
import {
    sendMail,
    emailVerificationContent,
    forgotPasswordContent,
} from '../utils/mail.js';

dotenv.config();

const registerUser = async (req, res, next) => {
    const { email, password, name } = req.body;
    console.log(req.body);
    console.log('wdjikuwahdjilu');

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return next(new ApiError(400, 'User already exists'));
        }

        // const token =
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now());
        const newUser = await db.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
                emailVerificationToken: token,
                emailVerificationExpiry: tokenExpiry,
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerificationToken: true,
                emailVerificationExpiry: true,
            },
        });

        if (!newUser) {
            return next(new ApiError(400, 'User not created'));
        }

        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${newUser.emailVerificationToken}`;

        //sending mail
        await sendMail({
            email: newUser.email,
            subject: 'Email verification',
            mailGenContent: emailVerificationContent(
                newUser.name,
                verificationUrl
            ),
        });

        return res
            .status(201)
            .json(
                new ApiSuccess(
                    201,
                    'User created successfully \n Verify your email please',
                    newUser
                )
            );
    } catch (error) {
        console.error('Error creating user:', error);
        next(new ApiError(500, 'Error creating user', error));
    }
};

const verifyUser = async (req, res, next) => {
    const { token } = req.params;
    try {
        if (!token) {
            return next(new ApiError(404, 'User not found'));
        }
        console.log(token);

        const user = await db.user.updateMany({
            where: {
                emailVerificationToken: token,
            },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiry: null,
            },
        });

        if (user.count === 0) {
            return next(new ApiError(404, 'User not found'));
        }

        return res
            .status(200)
            .json(new ApiSuccess(200, 'Email verified successfully'));
    } catch (error) {
        console.error('Error verifying user:', error);
        next(new ApiError(500, 'Error verifying user', error));
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        if (!user.isEmailVerified) {
            return next(new ApiError(400, 'Verify your email first'));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ApiError(400, 'Invalid credentials'));
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        return res.status(200).json(
            new ApiSuccess(200, 'User Logged in successfully', {
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
                id: user.id,
            })
        );
    } catch (error) {
        console.error('Error creating user:', error);
        next(new ApiError(500, 'Error logging in user', error));
    }
};

const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });
        
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        next(new ApiError(500, 'Error logging out user', error));
    }
};

const checkUser = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'User authenticated successfully',
            user: req.user,
        });
    } catch (error) {
        console.error('Error checking user:', error);
        next(new ApiError(500, 'Error checking user', error));
    }
};

const resendEmailVerification = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        if (user.isEmailVerified) {
            return next(new ApiError(400, 'Email is already verified'));
        }

        if (
            user.emailVerificationExpiry &&
            user.emailVerificationExpiry > new Date()
        ) {
            return next(
                new ApiError(
                    400,
                    'Email already sent. Please wait or check spam',
                    err
                )
            );
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 60 * 1000);

        const newUser = await db.user.update({
            where: {
                email: email,
            },
            data: {
                emailVerificationToken: token,
                emailVerificationExpiry: tokenExpiry,
            },
        });

        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${newUser.emailVerificationToken}`;

        await sendMail({
            email: newUser.email,
            subject: 'Email verifcation',
            mailGenContent: emailVerificationContent(
                newUser.name,
                verificationUrl
            ),
        });

        return res
            .status(200)
            .json(new ApiSuccess(200, 'Verification Email sent again'));
    } catch (error) {
        console.error('Resend email verification failed:', error);
        next(new ApiError(500, 'Resend email verification failed:', error));
    }
};
// pending
const forgotPasswordRequest = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 4 * 60 * 60 * 1000;

        const newUser = await db.user.update({
            where: {
                email: email,
            },
            data: {
                forgotPasswordToken: token,
                forgotPasswordExpiry: tokenExpiry,
            },
        });

        const resetPasswordUrl = `${process.env.BASE_URL}/api/v1/auth/resetPassword/${newUser.forgotPasswordToken}`;

        await sendMail({
            email: newUser.email,
            subject: 'Reset password',
            mailGenContent: forgotPasswordContent(
                newUser.name,
                resetPasswordUrl
            ),
        });
        return res
            .status(200)
            .json(new ApiSuccess(200, 'Forgot password request initiated'));
    } catch (error) {
        console.error('Forgot password request failed:', error);
        next(new ApiError(500, 'Forgot password request failed:', error));
    }
};
// pending
const resetPassword = async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(new ApiSuccess(200, 'reset password successful'));
    } catch (error) {
        console.error('reset password failed:', error);
        next(new ApiError(500, 'reset password failed:', error));
    }
};
// pending
const changePassword = async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(new ApiSuccess(200, 'Verification Email sent again'));
    } catch (error) {
        console.error('Resend email verification failed:', error);
        next(new ApiError(500, 'Resend email verification failed:', error));
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    checkUser,
    verifyUser,
    resendEmailVerification,
    forgotPasswordRequest,
    resetPassword,
    changePassword,
};
