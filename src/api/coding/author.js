import axios from 'axios'

/**
 * 查询条件
 * @param {Object} conditions 查询条件
 */
export function queryByConditions (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/authors', { params: conditions })
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
export function queryById (rowId) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/author/' + rowId)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}

/**
 * 关联作者和用户
 * @param {Object}} link 关联信息
 */
export function linkUser (link) {
  return new Promise((resolve, reject) => {
    axios.post('/coding/author/link/user', link)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
