import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './utils/db.js'
import companyrouter from './routes/company.route.js'
import userrouter from './routes/user.route.js'
import jobrouter from './routes/job.route.js'
import applicationrouter from './routes/application.route.js'


// dotenv.config() is used to load environment variables from a .env file into your Node.js application.
dotenv.config()
connectDB()
const PORT = process.env.PORT || 3000
const app = express()

// Enable cross-origin requests with credentials (cookies/sessions) from frontend
const corsOption = {
    origin: process.env.FRONTEND_URL, 
    credentials: true,

}
// MiddleWares
app.use(express.json())  //parse json data into js data as express doesnt know how to handle json data
app.use(cookieParser())  //
app.use(cors(corsOption))


// API
app.use('/api/v1/user', userrouter)
 
app.use('/api/v1/company', companyrouter)
app.use('/api/v1/job', jobrouter)
app.use('/api/v1/application', applicationrouter)
// app.listen(PORT, () => {
//     console.log(`App is Listening at PORT ${PORT}`)
// })

export default app
