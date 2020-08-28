
export const setCookie = (name:string,value:string,days:number) => {
  var exp = new Date(); 
  exp.setTime(exp.getTime() + days*24*60*60*1000); 
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toUTCString(); 
}

export const getCookie = (name:string) => {
  var arr:any,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(document.cookie.match(reg)){
    arr=document.cookie.match(reg)
    return unescape(arr[2]); 
  }
  else 
    return null; 
}

export const delCookie = (name:string) => {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  document.cookie = name + "= '';expires=" + date.toUTCString()+";path=/"
}

export const sessionStorage = (key:string, value:any=undefined) => {
  var result;
  if (window.sessionStorage) {
    const sessionStorage = window.sessionStorage;
    if (value === undefined) {
      let temp:any = sessionStorage.getItem(key);
      try {
        const firstChar = temp.slice(0, 1);
        if (firstChar === '{' || firstChar === '[') {
          result = JSON.parse(temp);
        } else {
          result = temp;
        }
      } catch (evt) {
        result = temp;
      }
    } else {
      if (typeof value === 'string') {
        result = sessionStorage.setItem(key, value);
      } else {
        result = sessionStorage.setItem(key, JSON.stringify(value));
      }
    }
  }
  return result;
};

export const delSessionStorage = (key:string) => {
  const sessionStorage = window.sessionStorage;
  sessionStorage.removeItem(key)
}