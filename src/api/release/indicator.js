import axios from 'axios'

/**
   * 根据报告指标ID查询报告指标详情
   *
   * @param {Integer} indicatorId 报告指标ID
   * @returns Promise
   */
export function queryIndicatorById (indicatorId) {
  return new Promise((resolve, reject) => {
    axios.get('/release/indicator/' + indicatorId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
   * 根据报告指标ID删除报告指标
   *
   * @param {Integer} indicatorId 报告指标ID
   * @returns Promise
   */
export function deleteIndicatorById (indicatorId) {
  return new Promise((resolve, reject) => {
    axios.delete('/release/indicator/' + indicatorId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加报告指标
 * @param {Object} addIndicatorForm 报告指标信息
 * @returns Promise
 */
export function addIndicator (addIndicatorForm) {
  return new Promise((resolve, reject) => {
    axios.post('/release/indicator', addIndicatorForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑报告指标
 * @param {Integer} indicatorId 报告指标ID
 * @param {Object} editIndicatorForm 报告指标信息
 * @returns Promise
 */
export function editIndicator (indicatorId, editIndicatorForm) {
  return new Promise((resolve, reject) => {
    axios.put('/release/indicator/' + indicatorId, editIndicatorForm)
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
    axios.get('/release/indicators', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 绑定问题
 * @param {Integer} investigationId 报告ID
 * @param {*} indicatorIds 问题ID集合
 * @returns 绑定结果
 */
export function binding (investigationId, indicatorIds) {
  return new Promise((resolve, reject) => {
    axios.post('/release/indicator/bind/' + investigationId, indicatorIds)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 查询绑定问题
 * @param {Integer} investigationId 报告ID
 * @param {*} indicatorIds 问题ID集合
 * @returns 绑定结果
 */
export function findBindings (investigationId) {
  return new Promise((resolve, reject) => {
    axios.get('/release/indicator/bind/' + investigationId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
