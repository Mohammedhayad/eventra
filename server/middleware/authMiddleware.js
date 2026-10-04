import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Checks that the request has a valid token (who are you?)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not logged in. Please login first.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired token. Please login again.' })
  }
}

// Checks that the logged-in user has an allowed role (are you allowed?)
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access this' })
  }
  next()
}