const KEY = 'auth_token'

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    // ignore storage errors
  }
}

export function clearAuthToken() {
  setAuthToken(null)
}
