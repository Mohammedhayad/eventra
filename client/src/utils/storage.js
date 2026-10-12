const TOKEN_KEY = 'eventra_token'
const USER_KEY = 'eventra_user'

// "Remember me" ON  -> localStorage   (stays logged in after closing the browser)
// "Remember me" OFF -> sessionStorage (logged out when the tab is closed)

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)

export const getSavedUser = () => {
  try {
    const saved =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export const saveSession = (token, user, remember = true) => {
  clearSession()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
  storage.setItem(USER_KEY, JSON.stringify(user))
}

export const updateSavedUser = (user) => {
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
  storage.setItem(USER_KEY, JSON.stringify(user))
}