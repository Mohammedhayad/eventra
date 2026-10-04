import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
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

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()