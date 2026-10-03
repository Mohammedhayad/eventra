import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

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
    time: new Date().toISOString(),
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})