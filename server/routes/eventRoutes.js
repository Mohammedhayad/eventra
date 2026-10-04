import express from 'express'
import {
  getCategories,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// Anyone can read events
router.get('/categories', getCategories)
router.get('/', getEvents)
router.get('/:id', getEventById)

// Only admins can create, edit and delete
router.post('/', protect, authorizeRoles('admin'), createEvent)
router.put('/:id', protect, authorizeRoles('admin'), updateEvent)
router.delete('/:id', protect, authorizeRoles('admin'), deleteEvent)

export default router