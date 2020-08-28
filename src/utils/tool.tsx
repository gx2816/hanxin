export const getBeforeDay = (num:number) => {
  let date = +new Date()
  let before = date-1000*60*60*24*num;
  let beforeDate = new Date(before);
  let oYear = beforeDate.getFullYear();
  let oMoth = (beforeDate.getMonth() + 1).toString();
  if (oMoth.length <= 1) oMoth = '0' + oMoth;
  let oDay = beforeDate.getDate().toString();
  if (oDay.length <= 1) oDay = '0' + oDay;
  let formatDate = `${oYear}-${oMoth}-${oDay}`
  return formatDate
}

export const getMonthFirstDay = () => {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let oYear = firstDay.getFullYear();
  let oMoth = (firstDay.getMonth() + 1).toString();
  if (oMoth.length <= 1) oMoth = '0' + oMoth;
  let oDay = firstDay.getDate().toString();
  if (oDay.length <= 1) oDay = '0' + oDay;
  let formatDate = `${oYear}-${oMoth}-${oDay}`
  return formatDate
}

export const dateTime = (date: Date) => {
  var firstDay = new Date(date);
  let oYear = firstDay.getFullYear();
  let oMoth = (firstDay.getMonth() + 1).toString();
  if (oMoth.length <= 1) oMoth = '0' + oMoth;
  let oDay = firstDay.getDate().toString();
  if (oDay.length <= 1) oDay = '0' + oDay;
  let oHours = firstDay.getHours().toString();
  if (oHours.length <= 1) oHours = '0' + oHours;
  let oMinutes = firstDay.getMinutes().toString();
  if (oMinutes.length <= 1) oMinutes = '0' + oMinutes;
  let oSeconds = firstDay.getSeconds().toString();
  if (oSeconds.length <= 1) oSeconds = '0' + oSeconds;
  let formatDate = `${oYear}-${oMoth}-${oDay} ${oHours}:${oMinutes}:${oSeconds}`
  return formatDate
}
export const dateDay = (date: Date) => {
  var firstDay = new Date(date);
  let oYear = firstDay.getFullYear();
  let oMoth = (firstDay.getMonth() + 1).toString();
  if (oMoth.length <= 1) oMoth = '0' + oMoth;
  let oDay = firstDay.getDate().toString();
  if (oDay.length <= 1) oDay = '0' + oDay;
 
  let formatDate = `${oYear}-${oMoth}-${oDay}`
  return formatDate
}

export const getCurrentMonth = () => {
  var date = new Date();
  return date.getMonth() + 1
}

export const isPc = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
  var flag = true;  
  for (var v = 0; v < Agents.length; v++) {  
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
  }  
  return flag;
}