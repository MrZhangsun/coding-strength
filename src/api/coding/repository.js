import axios from 'axios'

/**
   * 根据仓库ID查询仓库详情
   *
   * @param {Integer} repositoryId 仓库ID
   * @returns Promise
   */
export function queryRepositoryById (repositoryId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/repository/' + repositoryId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
/**
   * 根据仓库ID删除仓库
   *
   * @param {Integer} repositoryId 仓库ID
   * @returns Promise
   */
export function deleteRepositoryById (repositoryId) {
  return new Promise((resolve, reject) => {
    axios.delete('/coding/repository/' + repositoryId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 添加仓库
 * @param {Object} addRepositoryForm 仓库信息
 * @returns Promise
 */
export function addRepository (addRepositoryForm) {
  return new Promise((resolve, reject) => {
    axios.post('/coding/repository', addRepositoryForm)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 编辑仓库
 * @param {Integer} repositoryId 仓库ID
 * @param {Object} editRepositoryForm 仓库信息
 * @returns Promise
 */
export function editRepository (repositoryId, editRepositoryForm) {
  return new Promise((resolve, reject) => {
    axios.put('/coding/repository/' + repositoryId, editRepositoryForm)
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
    axios.get('/coding/repositories', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 查询所有仓库
 * @returns
 */
export function queryAll () {
  const conditions = {
    pageNum: 1,
    pageSize: 10000
  }

  return new Promise((resolve, reject) => {
    axios.get('/coding/repositories', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
