//封装函数
// export function myrequest(options) {
//     return new Promise((resolve, reject) => {
//       wx.request({
//         ...options,
//         success: (res) => {
//             resolve(res.data)
//         },
//         fail: reject
                  
//       })
//     })
// }
//封装类
import {baseURL} from "./config"

class HYRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(options) {
    const {url} = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          console.log("err", err);
        }
      })
    })
  }
  get(options) {
    return this.request({...options, methods: "get"})
  }
  post(options) {
    return this.request({...options, methods:"post"})
  }
}

export const hyrequest = new HYRequest(baseURL)


