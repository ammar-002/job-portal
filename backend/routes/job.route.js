import express from 'express'
import { Router } from 'express'
import { createJob, getJobById, getAdminJobs, deleteJob,updateJob } from '../controllers/job.controller.js'
import { getAllJobs } from '../controllers/jobv2.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createJobSchema, updateJobSchema } from '../middlewares/z_validators.js'
import { validate } from '../middlewares/validate.middleware.js'
const jobrouter = express.Router()

jobrouter.route('/createjob').post(isAuthenticated, validate(createJobSchema),createJob)
jobrouter.route('/getadminjobs').get(isAuthenticated,getAdminJobs)
jobrouter.route('/getjobby/:_id').get( getJobById)
jobrouter.route('/delete/:_id').delete(isAuthenticated,deleteJob )
jobrouter.route('/getalljobs').get(getAllJobs)
jobrouter.route('/update/:_id').put(isAuthenticated, validate(updateJobSchema), updateJob)
export default jobrouter