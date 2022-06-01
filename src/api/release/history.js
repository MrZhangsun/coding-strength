import axios from 'axios'

/**
   * 根据发布历史ID查询发布历史详情
   *
   * @param {Integer} historyId 发布历史ID
   * @returns Promise
   */
export function queryHistoryById (historyId) {
  return new Promise((resolve, reject) => {
    axios.get('/release/history/' + historyId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
   * 根据发布历史ID删除发布历史
   *
   * @param {Integer} historyId 发布历史ID
   * @returns Promise
   */
export function deleteHistoryById (historyId) {
  return new Promise((resolve, reject) => {
    axios.delete('/release/history/' + historyId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加发布历史
 * @param {Object} addHistoryForm 发布历史信息
 * @returns Promise
 */
export function addHistory (addHistoryForm) {
  return new Promise((resolve, reject) => {
    axios.post('/release/history', addHistoryForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑发布历史
 * @param {Integer} historyId 发布历史ID
 * @param {Object} editHistoryForm 发布历史信息
 * @returns Promise
 */
export function editHistory (historyId, editHistoryForm) {
  return new Promise((resolve, reject) => {
    axios.put('/release/history/' + historyId, editHistoryForm)
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
    axios.get('/release/histories', { params: conditions })
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
export function queryHistoryFeedback (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/release/history/feedback', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 根据发布历史ID查询发布历史详情
 *
 * @param {Integer} releaseId 发布历史ID
 * @returns Promise
 */
export function checkInvestBinding (releaseId) {
  return new Promise((resolve, reject) => {
    axios.get('/release/history/investigation/check/' + releaseId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
