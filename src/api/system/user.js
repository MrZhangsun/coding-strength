import axios from 'axios'

/**
   * 根据用户ID查询用户详情
   *
   * @param {Integer} userId 用户ID
   * @returns Promise
   */
export function queryUserById (userId) {
  return new Promise((resolve, reject) => {
    axios.get('/system/user/' + userId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
   * 根据用户ID删除用户
   *
   * @param {Integer} userId 用户ID
   * @returns Promise
   */
export function deleteUserById (userId) {
  return new Promise((resolve, reject) => {
    axios.delete('/system/user/' + userId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加用户
 * @param {Object} addUserForm 用户信息
 * @returns Promise
 */
export function addUser (addUserForm) {
  return new Promise((resolve, reject) => {
    axios.post('/system/user', addUserForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑用户
 * @param {Integer} userId 用户ID
 * @param {Object} editUserForm 用户信息
 * @returns Promise
 */
export function editUser (userId, editUserForm) {
  return new Promise((resolve, reject) => {
    axios.put('/system/user/' + userId, editUserForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 查询条件
 * @param {Object} conditions 查询条件
 */
export function queryByConditions (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/system/users', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
