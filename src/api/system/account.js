import axios from 'axios'

/**
   * 根据账户ID查询账户详情
   *
   * @param {Integer} accountId 账户ID
   * @returns Promise
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
   * 根据账户ID删除账户
   *
   * @param {Integer} accountId 账户ID
   * @returns Promise
   */
export function deleteAccountById (accountId) {
  return new Promise((resolve, reject) => {
    axios.delete('/system/account/' + accountId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加账户
 * @param {Object} addAccountForm 账户信息
 * @returns Promise
 */
export function addAccount (addAccountForm) {
  return new Promise((resolve, reject) => {
    axios.post('/system/account', addAccountForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑账户
 * @param {Integer} accountId 账户ID
 * @param {Object} editAccountForm 账户信息
 * @returns Promise
 */
export function editAccount (accountId, editAccountForm) {
  return new Promise((resolve, reject) => {
    axios.put('/system/account/' + accountId, editAccountForm)
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
