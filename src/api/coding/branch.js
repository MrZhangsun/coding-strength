import axios from 'axios'

/**
 * 查询条件
 * @param {Object} conditions 查询条件
 */
export function queryByConditions (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/branches', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 根据主键查询
 * @param {Object} conditions 查询条件
 */
export function queryById (rowId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/branch/' + rowId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 根据仓库ID查询
 * @param {Integer} repositoryId 查询条件
 */
export function queryByRepositoryId (repositoryId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/branch/repository/' + repositoryId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
