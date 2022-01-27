import axios from 'axios'

// 用户管理
/**
   * 根据用户ID查询用户详情
   *
   * @param {Integer} userId 用户ID
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
