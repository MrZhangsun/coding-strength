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

/**
 * 作者分析
 * @param {Object}} conditions 分析条件
 */
export function authorAnalysis (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/coding/rank/author/analysis', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
