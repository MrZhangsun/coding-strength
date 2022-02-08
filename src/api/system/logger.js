import axios from 'axios'

/**
 * 查询条件
 * @param {Object} conditions 查询条件
 */
export function queryByConditions (conditions) {
  return new Promise((resolve, reject) => {
    axios.get('/system/loggers', { params: conditions })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
