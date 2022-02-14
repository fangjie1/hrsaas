import request from '@/utils/request'
/**
 * 获取权限
 * @returns Promise
 */
export function getPermissionList(params) {
  return request({
    url: '/sys/permission',
    params
  })
}

/**
 * 新增权限
 * @returns Promise
 */
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @returns Promise
 */
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 根据ID删除权限
 * @returns Promise
 */
export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

/**
 * 根据ID获取权限详情
 * @returns Promise
 */
export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
