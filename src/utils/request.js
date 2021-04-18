import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/'

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置基地址
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) config.headers['Authorization'] = `Bearer ${token}`
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
  Message.error(error)
  return Promise.reject(new Error(error))
})

export default service
