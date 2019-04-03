
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //Month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //min
    "s+": this.getSeconds(), //s
    "q+": Math.floor((this.getMonth() + 3) / 3), //Season
    "S": this.getMilliseconds() //ms
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

module.exports = {};
