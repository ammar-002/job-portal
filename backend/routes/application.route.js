import express from 'express'
import {Router} from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getApplicants, getAppliedJobs, postapplication, updateStatus } from '../controllers/application.controller.js'
import isRecruiter from '../middlewares/isRecruiter.js'
const applicationrouter = express.Router()

applicationrouter.route('/apply/:_id').get(isAuthenticated,isRecruiter,postapplication)
applicationrouter.route('/getappliedjobs').get(isAuthenticated,isRecruiter,getAppliedJobs)
applicationrouter.route('/:_id/applicants').get(isAuthenticated,isRecruiter,getApplicants)
applicationrouter.route('/status/:_id').post(isAuthenticated,isRecruiter,updateStatus)
export default applicationrouter

