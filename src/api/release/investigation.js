import axios from 'axios'

/**
   * 根据调研报告ID查询调研报告详情
   *
   * @param {Integer} investigationId 调研报告ID
   * @returns Promise
   */
export function queryInvestigationById (investigationId) {
  return new Promise((resolve, reject) => {
    axios.get('/release/investigation/' + investigationId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
   * 根据调研报告ID删除调研报告
   *
   * @param {Integer} investigationId 调研报告ID
   * @returns Promise
   */
export function deleteInvestigationById (investigationId) {
  return new Promise((resolve, reject) => {
    axios.delete('/release/investigation/' + investigationId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加调研报告
 * @param {Object} addInvestigationForm 调研报告信息
 * @returns Promise
 */
export function addInvestigation (addInvestigationForm) {
  return new Promise((resolve, reject) => {
    axios.post('/release/investigation', addInvestigationForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑调研报告
 * @param {Integer} investigationId 调研报告ID
 * @param {Object} editInvestigationForm 调研报告信息
 * @returns Promise
 */
export function editInvestigation (investigationId, editInvestigationForm) {
  return new Promise((resolve, reject) => {
    axios.put('/release/investigation/' + investigationId, editInvestigationForm)
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
    axios.get('/release/investigations', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
