import express from 'express'
import { registerUser, loginUser, getMe } from '../controllers/authController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

// Temporary test route (we will remove it later)
router.get('/admin-check', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are an admin` })
})

export default router