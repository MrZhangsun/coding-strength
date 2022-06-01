import axios from 'axios'

/**
 * 根据发布历史ID查询发布历史详情
 *
 * @param {Integer} releaseId 发布历史ID
 * @returns Promise
 */
export function queryFeedbackUrl (feedbackType, releaseId, defaultInvest) {
  return new Promise((resolve, reject) => {
    axios.get('/feedback/link/' + feedbackType + '/' + releaseId, { params: { defaultInvest: defaultInvest } })
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
export function queryInvestigation (investigationId) {
  return new Promise((resolve, reject) => {
    axios.get('/feedback/investigation/' + investigationId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 查询反馈报告ID集合
 *
 * @param {Integer} objectId 反馈对象ID
 * @param {String} feedbackType 反馈对象类型
 * @returns Promise
 */
export function queryObjectFeedbacks (feedbackType, objectId) {
  return new Promise((resolve, reject) => {
    axios.get('/feedback/object/' + feedbackType + '/' + objectId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
