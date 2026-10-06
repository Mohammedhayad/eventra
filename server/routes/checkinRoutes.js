import express from 'express'
import { checkInStudent } from '../controllers/checkinController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('admin'), checkInStudent)

export default router