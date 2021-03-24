export const matchStatus2CH = (val) => {
  const dict = {
    1: '未开始',
    2: '进行中',
    3: '已结束',
    4: '已取消',
    5: '已延期'
  }
  return dict[val] || '-'
}

export const formatDate = ([dt, fmt, symbol]) => {
  if (!dt) return symbol || ''
  if (typeof dt === 'string' && /-/.test(dt)) {
    dt = dt.replace(/-/g, '/')
  }
  let date = new Date(dt)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}




