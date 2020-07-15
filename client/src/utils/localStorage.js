export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export const storeUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const eraseUser = () => {
  localStorage.removeItem('user')
}

export const redirectPath = (path) => {
  localStorage.setItem('redirect', JSON.stringify(path))
}

export const getPath = () => {
  return JSON.parse(localStorage.getItem('redirect'))
}

export const erasePath = () => {
  localStorage.removeItem('redirect')
}
