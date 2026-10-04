const COLLEGE_EMAIL_REGEX = /^[^\s@]+@bmsit\.in$/i

export const COLLEGE_EMAIL_MESSAGE =
  'Please use your college mail id (example: name@bmsit.in) to login'

export const isCollegeEmail = (email) =>
  typeof email === 'string' && COLLEGE_EMAIL_REGEX.test(email.trim())