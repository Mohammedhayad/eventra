import express from 'express'
import {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
} from '../controllers/registrationController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/events/:id/register', protect, authorizeRoles('student'), registerForEvent)
router.get('/registrations/my', protect, authorizeRoles('student'), getMyRegistrations)
router.get('/registrations/:id', protect, authorizeRoles('student'), getRegistrationById)

export default router