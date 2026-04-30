import express from 'express'
import { Router } from 'express'
import { createJob, getJobById, getAdminJobs, deleteJob } from '../controllers/job.controller.js'
import { getAllJobs } from '../controllers/jobv2.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
const jobrouter = express.Router()

jobrouter.route('/v1/job/createjob').post(isAuthenticated,createJob)
// jobrouter.route('/v1/job/getalljobs').get( getAllJobs)
jobrouter.route('/v1/job/getadminjobs').get(isAuthenticated,getAdminJobs)
jobrouter.route('/v1/job/getjobby/:_id').get( getJobById)
jobrouter.route('/v1/job/delete/:_id').delete(isAuthenticated,deleteJob )
jobrouter.route('/v2/job/getAllJobs').get(getAllJobs)
export default jobrouter
