import express from 'express'
import { Router } from 'express'
import {register,login,updateProfile, logout} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.middleware.js'
const userrouter = express.Router()
userrouter.route('/register').post(singleUpload, register)
userrouter.route('/login').post(login)
userrouter.route('/logout').get(logout)
userrouter.route('/updateprofile').post(isAuthenticated,singleUpload,updateProfile)

export default userrouter