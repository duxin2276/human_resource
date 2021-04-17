import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() // 从本地获取token
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
  }
}

const actions = {
  async toLogin({ commit }, payLoad) {
    const data = await login(payLoad)
    console.log(data)
    // 返回成功，将token进行保存
    commit('saveToken', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
