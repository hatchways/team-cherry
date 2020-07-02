export const getUser = () => {
  return localStorage.getItem('user')
}

export const storeUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const eraseUser = () => {
  localStorage.removeItem('user')
}

