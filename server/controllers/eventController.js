import mongoose from 'mongoose'
import Event from '../models/Event.js'
import { EVENT_CATEGORIES } from '../utils/constants.js'

const EVENT_FIELDS = [
  'title',
  'description',
  'category',
  'date',
  'time',
  'venue',
  'maxCapacity',
  'registrationFee',
  'imageUrl',
]

// Copies only the allowed fields from the request
const pickEventFields = (body) => {
  const data = {}
  EVENT_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field]
    }
  })
  return data
}

const handleError = (res, error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message)
    return res.status(400).json({ message: messages.join(', ') })
  }
  return res.status(500).json({ message: 'Server error', error: error.message })
}

export const getCategories = (req, res) => {
  res.json({ categories: EVENT_CATEGORIES })
}

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json({ count: events.length, events })
  } catch (error) {
    handleError(res, error)
  }
}

export const getEventById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' })
    }

    const event = await Event.findById(req.params.id).populate('createdBy', 'name')
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json({ event })
  } catch (error) {
    handleError(res, error)
  }
}

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...pickEventFields(req.body),
      createdBy: req.user._id,
    })

    res.status(201).json({ message: 'Event created successfully', event })
  } catch (error) {
    handleError(res, error)
  }
}

export const updateEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' })
    }

    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    Object.assign(event, pickEventFields(req.body))
    await event.save()

    res.json({ message: 'Event updated successfully', event })
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event id' })
    }

    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}