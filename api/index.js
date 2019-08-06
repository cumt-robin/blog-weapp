import { merge } from '../utils/index.js'
import Toast from "../utils/toast.js"

const BASE_URL = 'https://blog.wbjiang.cn/api'

const DEFAULT_OPTIONS = {
  header: {
    'accept': 'application/json'
  }
}

function request(url, data, options = {}) {
  let mergedOptions = merge(DEFAULT_OPTIONS, options)
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      data: data,
      ...mergedOptions,
      success: function(res) {
        if (res.data.code === '0') {
          resolve(res.data)
        } else {
          console.error(res)
          Toast.simple(res.msg)
          reject()
        }
      },
      fail: function(res) {
        Toast.simple('服务器正在升级')
        console.error(res)
        reject()
      }
    })
  })
}

// get请求
const get = (url, data, options = {}) => request(url, data, {...options, method: 'GET'})

// delete请求
const deletes = (url, data, options = {}) => request(url, data, { ...options, method: 'DELETE' })

// post请求
const post = (url, data, options = {}) => request(url, data, { ...options, method: 'POST' })

// put请求
const put = (url, data, options = {}) => request(url, data, { ...options, method: 'PUT' })

export default {
  get,
  deletes,
  post,
  put
}