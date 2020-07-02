export const getToken = () => {
  return localStorage.getItem('token')
}

export const storeToken = (authToken) => {
  localStorage.setItem('token', authToken)
}

export const eraseToken = () => {
  localStorage.removeItem('token')
}

