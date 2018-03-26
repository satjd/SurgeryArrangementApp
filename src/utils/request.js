import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// create a axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // base_url of api
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // set token of requests
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
  /**
  * throw exception when code is not 20000
  */
    const resbody = response.data
    if (resbody.errcode) {
      Message({
        message: 'CODE ' + resbody.errcode + ': ' + resbody.errmsg || 'error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:invalid token 50012:login with other tokens  50014:token timeout
      if (resbody.errcode === 50008 || resbody.errcode === 50012 || resbody.errcode === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      Message({
        message: 'success',
        type: 'success',
        duration: 1 * 1000
      })
      return resbody
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
