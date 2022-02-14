import request from '@/utils/request'

/**
 * 获取所有角色列表
 * @returns Promise
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * @returns Promise
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * 删除角色
 * @returns Promise
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 *  获取角色详情
 * @returns Promise
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 修改角色信息
 * @returns Promise
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'PUT'
  })
}

/**
 * 新增角色信息
 * @returns Promise
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'POST'
  })
}

/**
 * 给角色分配权限
 * @returns Promise
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
