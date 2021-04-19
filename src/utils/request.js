import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

// token失效时间
const tokenTimeStamp = 3600

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置基地址
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    if (isTokenTimeStamp()) {
      store.dispatch('user/logOut')
      router.push('/login')
      return Message.error('token已过期')
    }
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config // 必须返回
}, error => {
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  // 请求成功返回的数据
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message)) // 失败返回的信息
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当code === 10002时为token失效   后端返回过来
    store.dispatch('user/logOut')
    router.push('/login')
  } else {
    Message.error(error)
  }
  return Promise.reject(new Error(error))
})

// 判断token失效
function isTokenTimeStamp() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()

  return (currentTime - timeStamp) / 1000 > tokenTimeStamp
}

export default service
