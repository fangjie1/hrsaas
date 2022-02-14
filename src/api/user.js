import request from '@/utils/request'

/**
 * 获取token
 * @returns Promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户基本资料
 * @returns Promise
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取员工基本信息
 * @returns Promise
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

