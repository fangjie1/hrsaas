import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import Cookie from 'js-cookie'
// 状态
const state = {
  token: getToken() || null, // 设置token的共享状态
  userInfo: {},
  // lang: this.$i18n.locale = lang // 设置给本地的i18n插件
  lang: Cookie.get('language') || 'zh',
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除用户信息
  removeUserInfo(state, result) {
    state.userInfo = {}
  },
  changLang(state, lang) {
    Cookie.set('language', lang) // 切换多语言
    state.lang = lang // 设置给本地的i18n插件
  },
}
// 执行异步
const actions = {
  async login(context, data) {
    // 登录获取token
    const result = await login(data)
    context.commit('setToken', result)
    setTimeStamp() // 设置获取当前token的时间戳
    return result
  },
  async getUserInfo(context) {
    // 获取用户数据
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result
  },
  logout(context) {
    // 退出登录
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
