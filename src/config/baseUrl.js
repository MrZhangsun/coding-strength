let baseURL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = 'http://192.168.40.134:10110/api/'
    break
  case 'production':
    baseURL = 'http://gateway.vevor.net/tools-release-service/api/'
    break
}

export default baseURL
