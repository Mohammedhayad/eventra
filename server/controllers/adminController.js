import mongoose from 'mongoose'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Payment from '../models/Payment.js'

export const getAnalytics = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalEvents,
      upcomingEvents,
      events,
      registrationStats,
      revenueStats,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: today } }),
      Event.find().select('title category date maxCapacity registrationFee'),
      // Confirmed registrations and check-ins, grouped by event
      Registration.aggregate([
        { $match: { registrationStatus: 'confirmed' } },
        {
          $group: {
            _id: '$event',
            registrations: { $sum: 1 },
            checkedIn: { $sum: { $cond: ['$checkedIn', 1, 0] } },
          },
        },
      ]),
      // Money received (paid payments only), grouped by event
      Payment.aggregate([
        { $match: { status: 'paid' } },
        {
          $lookup: {
            from: 'registrations',
            localField: 'registration',
            foreignField: '_id',
            as: 'registrationDoc',
          },
        },
        { $unwind: '$registrationDoc' },
        {
          $group: {
            _id: '$registrationDoc.event',
            revenue: { $sum: '$amount' },
          },
        },
      ]),
    ])

    const registrationMap = new Map(
      registrationStats.map((stat) => [String(stat._id), stat])
    )
    const revenueMap = new Map(
      revenueStats.map((stat) => [String(stat._id), stat.revenue])
    )

    const eventStats = events
      .map((event) => {
        const stat = registrationMap.get(String(event._id))
        return {
          id: event._id,
          title: event.title,
          category: event.category,
          date: event.date,
          maxCapacity: event.maxCapacity,
          registrations: stat?.registrations || 0,
          checkedIn: stat?.checkedIn || 0,
          revenue: revenueMap.get(String(event._id)) || 0,
        }
      })
      .sort((a, b) => b.registrations - a.registrations)

    const categoryMap = {}
    eventStats.forEach((stat) => {
      if (!categoryMap[stat.category]) {
        categoryMap[stat.category] = {
          category: stat.category,
          events: 0,
          registrations: 0,
        }
      }
      categoryMap[stat.category].events += 1
      categoryMap[stat.category].registrations += stat.registrations
    })

    const byCategory = Object.values(categoryMap).sort(
      (a, b) => b.registrations - a.registrations
    )

    res.json({
      totals: {
        users: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
        events: totalEvents,
        upcomingEvents,
        registrations: eventStats.reduce((sum, stat) => sum + stat.registrations, 0),
        checkedIn: eventStats.reduce((sum, stat) => sum + stat.checkedIn, 0),
        revenue: eventStats.reduce((sum, stat) => sum + stat.revenue, 0),
      },
      byCategory,
      events: eventStats,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getAllRegistrations = async (req, res) => {
  try {
    const filter = {}
    const { eventId } = req.query

    if (eventId !== undefined) {
      if (typeof eventId !== 'string' || !mongoose.isValidObjectId(eventId)) {
        return res.status(400).json({ message: 'Invalid event id' })
      }
      filter.event = eventId
    }

    const registrations = await Registration.find(filter)
      .populate('student', 'name email collegeId')
      .populate('event', 'title date')
      .sort({ registeredAt: -1 })

    // Skip registrations whose student or event no longer exists
    const validRegistrations = registrations.filter(
      (registration) => registration.student && registration.event
    )

    res.json({
      count: validRegistrations.length,
      registrations: validRegistrations,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ count: users.length, users })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}