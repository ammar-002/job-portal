import express from 'express'
import { Router } from 'express'
import { createJob, getJobById, getAdminJobs, deleteJob } from '../controllers/job.controller.js'
import { getAllJobs } from '../controllers/jobv2.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
const jobrouter = express.Router()

jobrouter.route('/createjob').post(isAuthenticated,createJob)
jobrouter.route('/getadminjobs').get(isAuthenticated,getAdminJobs)
jobrouter.route('/getjobby/:_id').get( getJobById)
jobrouter.route('/delete/:_id').delete(isAuthenticated,deleteJob )
jobrouter.route('/getAllJobs').get(getAllJobs)
export default jobrouter
    