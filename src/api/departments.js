import request from '@/utils/request'

/**
 * 获取组织架构的数据
 * @returns Promise
 */
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除组织架构的的部门
 * @returns Promise
 */
export function delDepartments(id) {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

/**
 * 新增部门
 * @returns Promise
 */
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: `/company/department`,
    data
  })
}

/**
 * 根据ID查询部门详情
 * @returns Promise
 */
export function getDepartDetail(id) {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 * @returns Promise
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
