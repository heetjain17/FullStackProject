import bcrypt from 'bcryptjs'
import {db} from '../libs/db.js'
import {UserRole} from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ApiError, ApiSuccess } from '../utils/apiError.js'

dotenv.config()

const registerUser = async(req, res, next) => {
    const {email, password, name} = req.body

    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            return next(new ApiError(400, "User already exists"))
        }
        
        // const token =  
        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = await db.user.create({
            data:{
                email: email,
                password:hashedPassword,
                name: name,
                role:UserRole.USER
            }
        })

        const token = jwt.sign(
            {id:newUser.id} , 
            process.env.JWT_SECRET , 
            {expiresIn:"7d"}
        )

        res.cookie("jwt" , token , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
        })

        return res.status(200).json(
            new ApiSuccess(201, "User created successfully", 
                {
                    email:newUser.email,
                    name:newUser.name,
                    role:newUser.role,
                    image:newUser.image,
                    id:newUser.id,
                },
        ))

    } catch (error) {
        console.error("Error creating user:", error);
        next(new ApiError(500, "Error creating user", error))
    }
}

const loginUser = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return next(new ApiError(404, "User not found"))
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.status(401).json({
                error:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:user.id} , process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("jwt" , token , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
        })
        
        return res.status(200).json(
            new ApiSuccess(200, "User Logged in successfully", 
                {
                    email:user.email,
                    name:user.name,
                    role:user.role,
                    image:user.image,
                    id:user.id,
                },
        ))

    } catch (error) {
        console.error("Error creating user:", error);
        next(new ApiError(500, "Error logging in user", error))
    }
}

const logoutUser = async(req, res, next) => {
    try {
        res.clearCookie("jwt" , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        return res.status(200).json(
            new ApiSuccess(200, "User logged out successfully")
        )
       
    } catch (error) {
        console.error("Error logging out user:", error);
        next(new ApiError(500, "Error logging out user", error))
    }
}

const checkUser = async(req, res, next) => {
    try {
        return res.status(200).json(
            new ApiSuccess(200, "User authenticated successfully")
        )          
    } catch (error) {
        console.error("Error checking user:", error);
        next(new ApiError(500, "Error checking user", error))
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    checkUser
}