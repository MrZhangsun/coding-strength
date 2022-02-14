let baseURL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = 'http://localhost:10110/api/'
    break
  case 'production':
    baseURL = 'http://192.168.1.1:10110/api/'
    break
}

export default baseURL
