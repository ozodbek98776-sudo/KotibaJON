import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

import { authRouter } from './routes/auth'
import { tasksRouter } from './routes/tasks'
import { remindersRouter } from './routes/reminders'
import { transactionsRouter } from './routes/transactions'
import { budgetsRouter } from './routes/budgets'
import { goalsRouter } from './routes/goals'
import { datesRouter } from './routes/dates'
import { reportsRouter } from './routes/reports'
import { usersRouter } from './routes/users'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:7000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Juda ko\'p so\'rov. Bir daqiqadan so\'ng qaytadan urinib ko\'ring.' } },
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// API Routes
const API_PREFIX = '/api/v1'
app.use(`${API_PREFIX}/auth`, authRouter)
app.use(`${API_PREFIX}/tasks`, tasksRouter)
app.use(`${API_PREFIX}/reminders`, remindersRouter)
app.use(`${API_PREFIX}/transactions`, transactionsRouter)
app.use(`${API_PREFIX}/budgets`, budgetsRouter)
app.use(`${API_PREFIX}/goals`, goalsRouter)
app.use(`${API_PREFIX}/dates`, datesRouter)
app.use(`${API_PREFIX}/reports`, reportsRouter)
app.use(`${API_PREFIX}/users`, usersRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 KOTIBAJON API ishga tushdi: http://localhost:${PORT}`)
  console.log(`📋 API manzili: http://localhost:${PORT}/api/v1`)
  console.log(`❤️  Health check: http://localhost:${PORT}/health`)
})

export default app
