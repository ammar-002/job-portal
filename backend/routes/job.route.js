import express from 'express'
import { Router } from 'express'
import { createJob, getJobById, getAllJobs, getAdminJobs, deleteJob } from '../controllers/job.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
const jobrouter = express.Router()

jobrouter.route('/createjob').post(isAuthenticated,createJob)
jobrouter.route('/getalljobs').get( getAllJobs)
jobrouter.route('/getadminjobs').get(isAuthenticated,getAdminJobs)
jobrouter.route('/getjobby/:_id').get( getJobById)
jobrouter.route('/delete/:_id').delete(isAuthenticated,deleteJob )
export default jobrouter
