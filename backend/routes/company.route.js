import express from 'express'
import {Router} from 'express'
import { registerCompany,updateCompany,getCompanies,getCompanyById, deleteCompany } from '../controllers/company.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { registerCompanySchema, updateCompanySchema } from '../middlewares/z_validators.js'
const companyrouter = express.Router()

companyrouter.route('/register').post(isAuthenticated,validate(registerCompanySchema),registerCompany)
companyrouter.route('/get').get(isAuthenticated,getCompanies)
companyrouter.route('/get/:_id').get(isAuthenticated,getCompanyById)
companyrouter.route('/delete/:_id').delete(isAuthenticated,deleteCompany)
companyrouter.route('/update/:_id').put(isAuthenticated,singleUpload ,validate(updateCompanySchema),updateCompany)
export default companyrouter