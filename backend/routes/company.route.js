import express from 'express'
import {Router} from 'express'
import { registerCompany,updateCompany,getCompanies,getCompanyById, deleteCompany } from '../controllers/company.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { registerCompanySchema, updateCompanySchema } from '../middlewares/z_validators.js'
import isRecruiter from '../middlewares/isRecruiter.js'
const companyrouter = express.Router()

companyrouter.route('/register').post(isAuthenticated,isRecruiter,validate(registerCompanySchema),registerCompany)
companyrouter.route('/get').get(isAuthenticated,isRecruiter,getCompanies)
companyrouter.route('/get/:_id').get(isAuthenticated,isRecruiter,getCompanyById)
companyrouter.route('/delete/:_id').delete(isAuthenticated,isRecruiter,deleteCompany)
companyrouter.route('/update/:_id').put(isAuthenticated,isRecruiter,singleUpload ,validate(updateCompanySchema),updateCompany)
export default companyrouter