import express from 'express'
import {Router} from 'express'
import { registerCompany,updateCompany,getCompanies,getCompanyById, deleteCompany } from '../controllers/company.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.middleware.js'
const companyrouter = express.Router()

companyrouter.route('/register').post(isAuthenticated,registerCompany)
companyrouter.route('/get').get(isAuthenticated,getCompanies)
companyrouter.route('/get/:_id').get(isAuthenticated,getCompanyById)
companyrouter.route('/delete/:_id').delete(isAuthenticated,deleteCompany)
companyrouter.route('/update/:_id').put(isAuthenticated,singleUpload ,updateCompany)
export default companyrouter