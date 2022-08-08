let baseURL = ''
switch (process.env.NODE_ENV) {
  case 'development':
    baseURL = 'http://172.30.10.37:10110/api/'
    break
  case 'production':
    baseURL = 'http://47.101.42.90:10110/api/'
    break
}

export default baseURL
