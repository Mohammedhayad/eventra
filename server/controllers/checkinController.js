import Registration from '../models/Registration.js'

const cleanCode = (value) => (typeof value === 'string' ? value.trim() : '')

export const checkInStudent = async (req, res) => {
  try {
    const code = cleanCode(req.body.registrationCode)

    if (!code) {
      return res.status(400).json({ message: 'QR code is missing' })
    }

    const registration = await Registration.findOne({ registrationCode: code })
      .populate('student', 'name email collegeId')
      .populate('event', 'title date venue')

    if (!registration || !registration.student || !registration.event) {
      return res.status(404).json({ message: 'Invalid QR code. No registration found.' })
    }

    const details = {
      student: registration.student,
      event: registration.event,
    }

    if (registration.registrationStatus !== 'confirmed') {
      return res.status(400).json({
        message: 'This registration is not confirmed (payment pending).',
        ...details,
      })
    }

    if (registration.checkedIn) {
      return res.status(409).json({
        message: 'Already checked in',
        checkInTime: registration.checkInTime,
        ...details,
      })
    }

    // Succeeds only if nobody else checked this registration in a moment ago
    const updated = await Registration.findOneAndUpdate(
      { _id: registration._id, checkedIn: false },
      { checkedIn: true, checkInTime: new Date() },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({ message: 'Already checked in', ...details })
    }

    res.json({
      message: 'Check-in successful',
      checkInTime: updated.checkInTime,
      ...details,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}