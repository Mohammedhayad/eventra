import crypto from 'crypto'
import mongoose from 'mongoose'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid event id' })
    }

    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (event.date < today) {
      return res.status(400).json({ message: 'This event has already taken place' })
    }

    if (event.registrationFee > 0) {
      return res.status(400).json({
        message: 'Registration for paid events will open once online payment is available',
      })
    }

    const existing = await Registration.findOne({
      student: req.user._id,
      event: event._id,
    })
    if (existing) {
      return res.status(409).json({ message: 'You are already registered for this event' })
    }

    const registeredCount = await Registration.countDocuments({
      event: event._id,
      registrationStatus: { $ne: 'cancelled' },
    })
    if (registeredCount >= event.maxCapacity) {
      return res.status(400).json({ message: 'Sorry, this event is full' })
    }

    const registration = await Registration.create({
      student: req.user._id,
      event: event._id,
      registrationCode: crypto.randomUUID(),
      paymentStatus: 'not_required',
      registrationStatus: 'confirmed',
    })

    res.status(201).json({ message: 'Registration confirmed', registration })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You are already registered for this event' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate('event')
      .sort({ registeredAt: -1 })

    // Skip registrations whose event was deleted
    const validRegistrations = registrations.filter((reg) => reg.event)

    res.json({ count: validRegistrations.length, registrations: validRegistrations })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}