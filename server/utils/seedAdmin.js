import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import { isCollegeEmail } from './validators.js'

dotenv.config()

const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env')
    process.exit(1)
  }

  if (!isCollegeEmail(ADMIN_EMAIL)) {
    console.error('ADMIN_EMAIL must be a college email like admin@bmsit.in')
    process.exit(1)
  }

  if (ADMIN_PASSWORD.length < 6) {
    console.error('ADMIN_PASSWORD must be at least 6 characters')
    process.exit(1)
  }

  await connectDB()

  const email = ADMIN_EMAIL.trim().toLowerCase()
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    existingUser.role = 'admin'
    await existingUser.save()
    console.log(`Existing user ${email} is now an admin`)
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await User.create({
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
      role: 'admin',
    })
    console.log(`Admin account created: ${email}`)
  }

  await mongoose.connection.close()
  process.exit(0)
}

seedAdmin()