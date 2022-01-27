import axios from 'axios'

/**
 * 文件上传
 * @param {File} file 上传文件
 * @param {String} path 文件服务器上的目录
 * @param {Boolean} uniqueName 是否生成唯一文件名称
 */
export function uploadFile (file, path, uniqueName) {
  return new Promise((resolve, reject) => {
    const requestParams = new FormData()
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    requestParams.append('file', file)
    requestParams.append('path', path)
    requestParams.append('uniqueName', uniqueName)
    axios.post('https://gateway-test-a.vevor.net/bmp-pus-service/controller-uploadService/front/single/upload', requestParams, headers)
      .then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error.data)
      })
  })
}
