import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { isCollegeEmail, COLLEGE_EMAIL_MESSAGE } from '../utils/validators.js'

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  collegeId: user.collegeId,
})

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, collegeId } = req.body

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof password !== 'string' || !password
    ) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    if (!isCollegeEmail(email)) {
      return res.status(400).json({ message: COLLEGE_EMAIL_MESSAGE })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      collegeId,
    })

    res.status(201).json({
      message: 'Account created successfully',
      user: formatUser(user),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!isCollegeEmail(email)) {
      return res.status(400).json({ message: COLLEGE_EMAIL_MESSAGE })
    }

    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      user: formatUser(user),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}