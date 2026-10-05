import crypto from 'crypto'
import mongoose from 'mongoose'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Payment from '../models/Payment.js'
import { getRazorpay } from '../config/razorpay.js'

export const createOrder = async (req, res) => {
  try {
    const { eventId } = req.body

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid event id' })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (event.date < today) {
      return res.status(400).json({ message: 'This event has already taken place' })
    }

    if (!(event.registrationFee > 0)) {
      return res.status(400).json({ message: 'This event is free. Use the normal registration.' })
    }

    let registration = await Registration.findOne({
      student: req.user._id,
      event: event._id,
    })

    if (registration && registration.registrationStatus === 'confirmed') {
      return res.status(409).json({ message: 'You are already registered for this event' })
    }

    const confirmedCount = await Registration.countDocuments({
      event: event._id,
      registrationStatus: 'confirmed',
    })
    if (confirmedCount >= event.maxCapacity) {
      return res.status(400).json({ message: 'Sorry, this event is full' })
    }

    // Reuse an unfinished (pending) registration, or create a new one
    if (!registration) {
      registration = await Registration.create({
        student: req.user._id,
        event: event._id,
        registrationCode: crypto.randomUUID(),
        paymentStatus: 'pending',
        registrationStatus: 'pending',
      })
    }

    // The amount comes from our database, never from the browser (Razorpay uses paise)
    const order = await getRazorpay().orders.create({
      amount: Math.round(event.registrationFee * 100),
      currency: 'INR',
      receipt: `rcpt_${registration._id}`,
    })

    await Payment.create({
      registration: registration._id,
      amount: event.registrationFee,
      razorpayOrderId: order.id,
    })

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      registrationId: registration._id,
      eventTitle: event.title,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Please try again' })
    }
    res.status(500).json({
      message: 'Could not create the payment order',
      error: error.error?.description || error.message,
    })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const fields = [razorpay_order_id, razorpay_payment_id, razorpay_signature]
    if (!fields.every((value) => typeof value === 'string' && value)) {
      return res.status(400).json({ message: 'Payment details are missing' })
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    }).populate('registration')

    if (!payment || !payment.registration) {
      return res.status(404).json({ message: 'Payment record not found' })
    }

    if (!payment.registration.student.equals(req.user._id)) {
      return res.status(403).json({ message: 'This payment does not belong to you' })
    }

    if (payment.status === 'paid') {
      return res.json({
        message: 'Payment already verified',
        registration: payment.registration,
      })
    }

    // Recreate the signature with our SECRET key and compare it with the one received
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const expectedBuffer = Buffer.from(expectedSignature)
    const receivedBuffer = Buffer.from(razorpay_signature)

    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer)

    if (!isValid) {
      payment.status = 'failed'
      await payment.save()
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    payment.status = 'paid'
    payment.razorpayPaymentId = razorpay_payment_id
    await payment.save()

    const registration = payment.registration
    registration.paymentStatus = 'paid'
    registration.registrationStatus = 'confirmed'
    await registration.save()

    res.json({
      message: 'Payment successful. Registration confirmed.',
      registration,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}