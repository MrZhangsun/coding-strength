import axios from 'axios'

/**
 * 根据账号ID查询账号详情
 *
 * @param {Integer} accountId 账号ID
 */
export function queryAccountById (accountId) {
  return new Promise((resolve, reject) => {
    axios.get('/system/account/' + accountId)
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
    axios.get('/system/accounts', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
