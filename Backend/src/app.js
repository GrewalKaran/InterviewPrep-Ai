const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.route')
const interviewRouter = require('./routes/interview.routes')
const cors = require('cors')


const app = express()
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.com"
  ],
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/interview',interviewRouter)


module.exports = app