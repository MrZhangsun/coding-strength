import axios from 'axios'

/**
 * 仓库排名
 * @param {Integer} top
 */
export function repositoryTop (top) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/dynamic/getRepositoryTop/' + top)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 分支排名
 * @param {Integer} top
 */
export function branchTop (top) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/dynamic/getBranchTop/' + top)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 作者排名
 * @param {Integer} top
 */
export function authorTop (top) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/dynamic/getAuthorTop/' + top)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
