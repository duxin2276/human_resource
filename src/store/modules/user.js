import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, userInfo, getUserDetailById } from '@/api/user'

const state = {
  token: getToken(), // 从本地获取token
  userInfo: {} // 用户信息
}

const mutations = {
  saveToken(state, token) {
    state.token = token
    // 更新本地token
    setToken(token)
  },
  deleteToken(state) {
    state.token = null

    // 同步到本地token
    removeToken()
  },

  // 设置用户信息
  setUserInfo(state, payLoad) {
    state.userInfo = payLoad
  },

  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 登录
  async toLogin({ commit }, payLoad) {
    const data = await login(payLoad)
    // 返回成功，将token进行保存
    commit('saveToken', data)

    // 将时间戳存入到本地
    setTimeStamp()
  },

  // 获取用户信息
  async getuserInfo({ commit }, payLoad) {
    const result = await userInfo()
    const baseInfo = await getUserDetailById(result.userId)
    result.staffPhoto = baseInfo.staffPhoto
    commit('setUserInfo', result)

    // 返回用户信息，后期分配权限管理
    return result
  },

  // 退出登录
  logOut({ commit }) {
    // 清除token
    commit('deleteToken')

    // 删除用户信息
    commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
