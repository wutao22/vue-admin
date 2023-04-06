import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('token')
}

export function setToken(token) {
  return localStorage.setItem('token', token)
}

export function removeToken() {
  return localStorage.removeItem('token')
}
