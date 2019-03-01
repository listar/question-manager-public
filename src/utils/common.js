
/**
 * 格式化使用时间
 * @param useTime
 * @returns {string}
 */
export const useTimeFormat = (useTime) => {
  if(useTime < 60){
    return useTime + '秒';
  }
  if(useTime < 60*60){
    return parseInt(useTime/60) + '分钟';
  }
  return parseInt(useTime/3600) + '小时';
}


/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
}


/**
 *
 * @type {{get: (function(*=): *), set: CookieUtil.set, unset: CookieUtil.unset}}
 */
export const CookieUtil = {
  //读取cookie，判断某个cookie是否存在。
  //读取操作配合 unclekeith=21; sex=boy 这个cookie会更好理解读取cookie的操作。
  get: function (name) {
    var cookieName = encodeURIComponent(name) + "=",
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  //写入cookie。
  set: function (name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" +
      encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += "; expires=" + expires.toGMTString();
    }
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure";
    }
    document.cookie = cookieText;
  },
  //删除cookie
  unset: function (name, path, domain, secure) {
    this.set(name, "", new Date(0), path, domain, secure);
  }
};


/**
 * 时间格式化
 */
export const dateFilter = (time, type) => {
  let date = new Date(time * 1000)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let second = date.getSeconds()
  let format = (value) => {
    return value >= 10 ? value : '0' + value
  };
  let result
  switch (type) {
    case 0: // 01-05
      result = `${format(month)}月${format(day)}日`
      break
    case 1: // 11:12
      result = `${format(hours)}-${format(minutes)}`
      break
    case 2: // 2015-01-05
      result = `${year}-${format(month)}-${format(day)}`
      break
    case 3: // 2015-01-05 11:12
      result = `${year}-${format(month)}-${format(day)}  ${format(hours)}:${format(minutes)}`
      break
    case 4: // 2015-01-05 11:12:06
      result = `${year}.${month}.${day}  ${hours}:${minutes}`
      break
    case 5:
      result = `${year}年${format(month)}月${format(day)}日${format(hours)}时${format(minutes)}分`
      break
  }
  return result
};


/**
 * 获取距离当前时间的时间长度
 * @param {Number} timestamp     - 要转换的时间参数（单位为秒）
 * @returns {String}
 */
export function timeago(timestamp) {
  let currentUnixTime = Math.round((new Date()).getTime() / 1000);       // 当前时间的秒数
  let deltaSecond = currentUnixTime - parseInt(timestamp, 10);            // 当前时间与要转换的时间差（ s ）
  let result;
  if (deltaSecond < 60) {
    result = deltaSecond + '秒前';
  } else if (deltaSecond < 3600) {
    result = Math.floor(deltaSecond / 60) + '分钟前';
  } else if (deltaSecond < 86400) {
    result = Math.floor(deltaSecond / 3600) + '小时前';
  } else {
    result = Math.floor(deltaSecond / 86400) + '天前';
  }
  return result;
};