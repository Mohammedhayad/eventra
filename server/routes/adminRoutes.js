import express from 'express'
import {
  getAnalytics,
  getAllRegistrations,
  getAllUsers,
} from '../controllers/adminController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// Every route in this file is admin-only
router.use(protect, authorizeRoles('admin'))

router.get('/analytics', getAnalytics)
router.get('/registrations', getAllRegistrations)
router.get('/users', getAllUsers)

export default router