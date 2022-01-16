import axios from 'axios'

export function uploadFile (file, path, uniqueName) {
  const requestParams = new FormData()
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  requestParams.append('file', file)
  requestParams.append('path', path)
  requestParams.append('uniqueName', uniqueName)
  axios.post('https://gateway-test-a.vevor.net/bmp-pus-service/controller-uploadService/front/single/upload', requestParams, headers)
    .then(res => {
      if (res.data.code !== 200) {
        return new Error(res.data.message)
      }
      return res.data.data
    }).catch(error => {
      console.error(error)
      return error
    })
}

export function HelloFun (hi) {
  console.log(hi)
}
