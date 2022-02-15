import axios from 'axios'

/**
 * 触发所有仓库统计
 */
export function scheduledCollections () {
  return new Promise((resolve, reject) => {
    axios.get('/coding/collections')
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 触发仓库统计
 * @param {Integer} repositoryId 仓库ID
 */
export function collectRepositoryById (repositoryId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/collect/repository/' + repositoryId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 触发分支统计
 * @param {Integer} branchId 分支ID
 */
export function collectBranchById (branchId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/collect/branch/' + branchId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
