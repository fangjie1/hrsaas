import request from '@/utils/request'

/**
 * 获取员工的简单列表
 * @returns Promise
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工综合列表
 * @returns Promise
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 删除员工
 * @returns Promise
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * 新增员工
 * @returns Promise
 */
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * 导入员工
 * @returns Promise
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 保存用户基本信息
 * @returns Promise
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 读取用户详情的基础信息
 * @returns Promise
 */
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 更新用户详情的基础信息
 * @returns Promise
 */
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
/**
 * 根据ID获取用户的岗位信息
 * @returns Promise
 */
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 *  保存岗位信息
 * @returns Promise
 */
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
/**
 *  分配角色
 * @returns Promise
 */
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'PUT'
  })
}
