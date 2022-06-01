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
