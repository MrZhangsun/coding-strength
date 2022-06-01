import axios from 'axios'

/**
   * 根据技术分享ID查询技术分享详情
   *
   * @param {Integer} sharingId 技术分享ID
   * @returns Promise
   */
export function querySharingById (sharingId) {
  return new Promise((resolve, reject) => {
    axios.get('/performance/sharing/' + sharingId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
   * 根据技术分享ID删除技术分享
   *
   * @param {Integer} sharingId 技术分享ID
   * @returns Promise
   */
export function deleteSharingById (sharingId) {
  return new Promise((resolve, reject) => {
    axios.delete('/performance/sharing/' + sharingId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加技术分享
 * @param {Object} addSharingForm 技术分享信息
 * @returns Promise
 */
export function addSharing (addSharingForm) {
  return new Promise((resolve, reject) => {
    axios.post('/performance/sharing', addSharingForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑技术分享
 * @param {Integer} sharingId 技术分享ID
 * @param {Object} editSharingForm 技术分享信息
 * @returns Promise
 */
export function editSharing (sharingId, editSharingForm) {
  return new Promise((resolve, reject) => {
    axios.put('/performance/sharing/' + sharingId, editSharingForm)
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
    axios.get('/performance/shares', { params: conditions })
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
export function querySharingFeedback (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/performance/sharing/feedback', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 检查技术分享是否绑定了反馈报告
 * @param {Integer} conditions 分享ID
 */
export function checkSharingInvestBinding (sharingId) {
  return new Promise((resolve, reject) => {
    axios.get('/performance/sharing/invest/check/' + sharingId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
