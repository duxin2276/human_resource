import Cookies from 'js-cookie'

const TokenKey = 'resource_token'
const TimeStamp = 'timestamp_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeStamp)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeStamp, Date.now())
}
