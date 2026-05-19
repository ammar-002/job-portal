import express from 'express'
import { Router } from 'express'
import {register,login,updateProfile, logout} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.middleware.js'
import { loginLimiter,registerLimiter } from '../middlewares/rateLimiter.js'
import { validate } from '../middlewares/validate.middleware.js'
import { loginSchema, registerSchema, updateProfileSchema } from '../middlewares/z_validators.js'
const userrouter = express.Router()

userrouter.route('/register').post(registerLimiter, singleUpload,validate(registerSchema), register)
userrouter.route('/login').post(loginLimiter,validate(loginSchema) ,login)
userrouter.route('/logout').get(logout)
userrouter.route('/updateprofile').post(isAuthenticated,singleUpload,validate(updateProfileSchema),updateProfile)

export default userrouter