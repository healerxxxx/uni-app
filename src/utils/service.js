import store from '../store'
let baseUrl = ''

// #ifdef MP-WEIXIN
baseUrl = process.env.NODE_ENV === 'development' ? 'https://test.hongcai.163.com' : 'https://test.hongcai.163.com'
// #endif

function template (temp, data) {
  return data ? temp.replace(/\{\{([^}]+)\}\}/g, function ($1, $2) {
    return data[$2] !== null || data[$2] !== undefined ? data[$2] : $1
  }) : temp
}

function getBrowserInfo () {
  let ua = window.navigator.userAgent
  let tem
  let M = ua.match(/(opera|chrome|safari|micromessenger|qq|firefox|msie|NewsApp|UCBrowser|YiXin|trident(?=\/))\/?\s*([.\d]+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+([.\d]+)/g.exec(ua) || []
    return {name: 'IE ', version: (tem[1] || '')}
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/([.\d]+)/)
    if (tem !== null) {
      return {name: 'Opera', version: tem[1]}
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/([.\d]+)/i)) !== null) {
    M.splice(1, 1, tem[1])
  }
  if (!/^[0-9.]{1,}$/.test(M[1])) {
    let _temp = M[1].match(/^[0-9.]{1,}/)
    M[1] = _temp[0] || M[1]
  }
  return {
    name: M[0],
    version: M[1]
  }
}

const service = (url, params) => {
  if (!url) return Promise.reject(new Error('url 不能为空'))
  params = !params ? {} : params
  params.method = params.method || 'get'
  params.url = baseUrl + url
  if (params.urlParams) {
    params.url = template(params.url, params.urlParams)
  }
  params.header = params.header || {}
  // 设置请求内容类型
  if (!params.header['content-type']) {
    params.header['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  // 获取浏览器信息
  let ua = ''
  let browserUA

  // #ifdef H5
  let browser = getBrowserInfo()
  ua = browser.name + '/' + browser.version
  browserUA = `RelotteryApp/9.7.0 WAP/9.7.0 (${ua})`
  // #endif
  
  // #ifdef MP-WEIXIN
  if (store && store.state.systemInfo) {
    ua = store.state.systemInfo.model.replace(/\(|\)/g, ' ') + '/' + store.state.systemInfo.system
  }
  browserUA = `RelotteryApp/9.7.0 WX_MINIPRO_EURO/1.0.0 (${ua})`
  if (store && store.state.cookie) {
    params.header['Cookie'] = store.state.cookie
  }
  // 自定义UA
  params.header['HONGCAI-UA'] = params.header['HONGCAI-UA'] || browserUA
  // 定义渠道
  params.header['Channel-Name'] = 'ozbwx'
  // #endif
  params.header['Login-Type'] = 'pc'
  
  return uni.request(params).then(res => {
    if (res && res[1]) {
      if (res[1].statusCode === 200 || res[1].statusCode === 304) {
        return Promise.resolve(res[1].data)
      } else {
        return Promise.reject(res[1])
      }
    } else {
      return Promise.reject(new Error('request is error'))
    }
  })
}

export default service
