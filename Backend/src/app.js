const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const authRoutes = require('../src/Routes/authRoutes')
const goalsRoutes = require('../src/Routes/goalsRoutes')
const mealRoutes = require('../src/Routes/mealRoutes')
const dashboardRoutes = require('./Routes/dashBoardRoutes')
const {authUser} = require('./Middleware/authMiddleware')




const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth',authRoutes)

app.use('/api/goals',authUser,goalsRoutes)

app.use('/api/meal',authUser,mealRoutes)

app.use('/api/dashboard',authUser,dashboardRoutes)


module.exports = app