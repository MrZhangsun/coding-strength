import axios from 'axios'

/**
 * 仓库排名
 * @param {Object} conditions
 */
export function repositoryTop (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/rank/repository/' + conditions.top, { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 分支排名
 * @param {Object} conditions
 */
export function branchTop (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/rank/branch/' + conditions.top, { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 作者排名
 * @param {Object} conditions
 */
export function authorTop (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/rank/author/' + conditions.top, { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
