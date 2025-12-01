import express from 'express'
import {Router} from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getApplicants, getAppliedJobs, postapplication, updateStatus } from '../controllers/application.controller.js'
const applicationrouter = express.Router()

applicationrouter.route('/apply/:_id').get(isAuthenticated,postapplication)
applicationrouter.route('/getappliedjobs').get(isAuthenticated,getAppliedJobs)
applicationrouter.route('/:_id/applicants').get(isAuthenticated,getApplicants)
applicationrouter.route('/status/:_id').post(isAuthenticated,updateStatus)
export default applicationrouter
