import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './utils/db.js'
import companyrouter from './routes/company.route.js'
import userrouter from './routes/user.route.js'
import jobrouter from './routes/job.route.js'
import applicationrouter from './routes/application.route.js'
import dns from 'dns'


dns.setServers(["1.1.1.1", "8.8.8.8"]);
// dotenv.config() is used to load environment variables from a .env file into your Node.js application.

dotenv.config()
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        res.status(500).json({ message: "Database connection failed", success: false })
    }
})
const PORT = process.env.PORT || 3000
const app = express()
// MiddleWares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())  //parse json data into js data as express doesnt know how to handle json data
app.use(cookieParser())  

// API
app.use('/api/v1/user', userrouter)
app.use('/api/v1/company', companyrouter)
app.use('/api/v2/job', jobrouter)
app.use('/api/v1/application', applicationrouter)
app.get('/', (req, res) => {
    res.json({ 
        frontendUrl: process.env.FRONTEND_URL,
        status: "running" 
    })
})
// app.listen(PORT, () => {
//     console.log(`App is Listening at PORT ${PORT}`)
// })

export default app
