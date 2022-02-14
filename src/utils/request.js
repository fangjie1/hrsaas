// import { config } from '@vue/test-utils'
import { getTimeStamp } from '@/utils/auth'
const TimeOut=3600//定义超时时间
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token ) {
    if (isCheckTimeOut()){
    // token超时了，删除token,跳转到登录页
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录时间过期了，请重新登录'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //  根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data&&error.response.data.code===10002){
    // 当code为10002时，表示token过期,跳转回登录页
    store.dispatch('user/logout')
    router.push('/login')
  }else{
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

function isCheckTimeOut(){
  let currentTime= Date.now() 
  let timeStamp = getTimeStamp ()
  return (currentTime - timeStamp)/1000>TimeOut
}
export default service
