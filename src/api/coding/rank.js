import axios from 'axios'

/**
 * 仓库排名
 * @param {Object} params
 */
export function repositoryTop (params) {
  return new Promise((resolve, reject) => {
    axios.post('/coding/rank/repository', params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 分支排名
 * @param {Object} params
 */
export function branchTop (params) {
  return new Promise((resolve, reject) => {
    axios.post('/coding/rank/branch', params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 作者排名
 * @param {Object} params
 */
export function authorTop (params) {
  return new Promise((resolve, reject) => {
    axios.post('/coding/rank/author', params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
