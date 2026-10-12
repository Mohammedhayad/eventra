import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import registrationRoutes from './routes/registrationRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import checkinRoutes from './routes/checkinRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Websites allowed to call this API (comma-separated list in CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an origin (Thunder Client, health checks) are allowed
      callback(null, !origin || allowedOrigins.includes(origin))
    },
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Eventra API is running')
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Eventra server is healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/checkin', checkinRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', registrationRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()