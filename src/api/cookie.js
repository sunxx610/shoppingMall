//add cookie
export function setCookie(name,value,expireDays){
  var expDate = new Date();
  expDate.setDate(expDate.getDate() + expireDays);
  document.cookie = name + "=" + encodeURI(value) + ((expireDays == null) ? "" : ";expires=" + expDate.toGMTString());
}
//get cookie
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
//delete cookie
export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};