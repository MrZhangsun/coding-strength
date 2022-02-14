let baseURL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = 'http://localhost:10110/api/'
    break
  case 'production':
    baseURL = 'http://172.19.225.151:10110/api/'
    break
}

export default baseURL
