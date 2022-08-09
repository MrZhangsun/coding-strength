import axios from 'axios'

/**
 * 查询所有项目指标项，并按照项目分组
 *
 */
export function indicators () {
  return new Promise((resolve, reject) => {
    axios.get('/statistic/indicators', {})
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
// 折线图
export function indicatorId (indicatorId, searchMessage) {
  return new Promise((resolve, reject) => {
    axios.get('chart/line/' + indicatorId, { params: searchMessage })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
// 柱状图
export function indicatorIdBar (indicatorId, searchMessage) {
  return new Promise((resolve, reject) => {
    axios.get('chart/bar/' + indicatorId, { params: searchMessage })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
// 柱状图
export function indicatorIdPie (indicatorId, searchMessage) {
  return new Promise((resolve, reject) => {
    axios.get('chart/pie/' + indicatorId, { params: searchMessage })
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}
