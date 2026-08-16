const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('../src/Routes/authRoutes')
const goalsRoutes = require('../src/Routes/goalsRoutes')
const mealRoutes = require('../src/Routes/mealRoutes')
const dashboardRoutes = require('./Routes/dashBoardRoutes')
const { authUser } = require('./Middleware/authMiddleware')

const app = express()

app.use(express.json())
app.use(cookieParser())

// Define allowed domains (Local + Vercel Production)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://cal-ai-omega.vercel.app" // Add your live Vercel frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or server-to-server requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use('/api/auth', authRoutes)
app.use('/api/goals', authUser, goalsRoutes)
app.use('/api/meal', authUser, mealRoutes)
app.use('/api/dashboard', authUser, dashboardRoutes)

module.exports = app