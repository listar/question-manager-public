
/**
 * 生成字符串
 * @param strLength
 * @returns {string}
 */
exports.createRandomStr = function (strLength) {
  let strContent = '0123456789_qwertyuiopasdfghjklzxcvbnm';
  let str = new Date().getTime().toString();

  let forLen = strLength - str.length;
  for(let i = 0; i< forLen; i++){
    let _strIndex = parseInt(Math.random() * 100 % strContent.length);
    str += strContent.slice(_strIndex, _strIndex+1);
  }
  return str;
}
