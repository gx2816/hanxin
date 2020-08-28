import axios from "axios";
import base from "./base";
import { getCookie, sessionStorage } from "./cookie";
import store from "../store/store";
import action from "../store/action";
import { delCookie, delSessionStorage } from "./cookie";
import { message } from "antd";
import React from "react";
let baseUrl = "";
let baseTest = "";
// if (process.env.NODE_ENV === 'development') {
//   baseUrl = base.dev
// } else{
//   baseUrl = base.pd
// } 
baseUrl = base.dev;
baseTest = base.test;
var instance = axios.create({ timeout: 1000 * 30 });
instance.interceptors.request.use(
  config => {
    //判断是否登陆
    let token = sessionStorage("lq-data-token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    } else {
      let ctoken = getCookie("lq-data-token");
      if (ctoken) {
        sessionStorage("lq-data-token", ctoken);
        config.headers["Authorization"] = "Bearer " + ctoken;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);
instance.interceptors.response.use(
  res => Promise.resolve(res),
  err => {
    return Promise.reject(err);
  }
);
interface Iajax {
  method: string;
  url: string;
  headers: Object;
  data: Object;
  onSuccess: () => void;
  onError: () => void;
}
interface IcustomOptions {
  mask: boolean;
  autoApplyUrlPrefix: boolean;
  silentError: boolean;
}
var ajaxSources = 0;

export default function c2s(ajaxOptions: any, customOptions: any = {}) {
  let onSuccess = ajaxOptions.onSuccess || (() => {});
  let onError = ajaxOptions.onError || (() => {});
  customOptions = convertCustom(customOptions);
  customOptions.autoApplyUrlPrefix &&
    (ajaxOptions.url = baseUrl + ajaxOptions.url);
  ajaxOptions.headers = ajaxOptions.headers || {};
  if (
    ajaxOptions.method === "post" ||
    ajaxOptions.method === "POST" ||
    ajaxOptions.method === "patch" ||
    ajaxOptions.method === "PATCH"
  ) {
   /*  {if (!(ajaxOptions.body instanceof FormData)) {
      ajaxOptions.headers = {
        Accept: "application/json",
        'Content-Type':'application/json;charset=utf-8',
        'token':getCookie("lq-data-token"),
        ...ajaxOptions.headers
      }
      ajaxOptions.body=JSON.stringify(ajaxOptions.body)
    } else {
      ajaxOptions.headers = {
        Accept: "application/json",
        'token': sessionStorage("lq-data-token"),
        ...ajaxOptions.headers
      }
    }
      } */
    ajaxOptions.data = ajaxOptions.params;
    ajaxOptions.params = {};
  }
  showMask(customOptions.mask);
  return new Promise((resolve, reject) => {
    instance(ajaxOptions)
      .then(res => {
        cleanMask(customOptions.mask);
        onSuccess(res);
        resolve(res);
      })
      .catch(err => {
        cleanMask(customOptions.mask);
        confirmLogin(err);
        errorTip(err);
        onError(err);
        reject(err);
      });
  });
}

const errorTip = (err: any) => {
  if (!err.response) {
    message.error("网络错误,请联系管理员");
    return;
  }
  if (err.response.status !== 401) {
    err.response.data.message
      ? message.error(err.response.data.message)
      : message.error("未知错误,请联系管理员");
  }
};

const confirmLogin = (err: any) => {
  if (err.response && err.response.status === 401) {
    //未获取到授权信息
    delCookie("lq-data-token");
    delSessionStorage("lq-data-token");
    window.location.href = "/?err=notLogin";
  }
};

let convertCustom = (customOptions: any) => {
  let tmp = customOptions;
  customOptions = {
    mask: true,
    autoApplyUrlPrefix: true,
    silentError: true
  };
  Object.keys(tmp).forEach((element: any) => {
    customOptions[element] = tmp[element];
  });
  return customOptions;
};
let showMask = (mask: any) => {
  if (mask) {
    ajaxSources++;
    store.dispatch(action.setLoading(true));
  }
};
let cleanMask = (mask: any) => {
  if (mask) {
    ajaxSources--;
    ajaxSources === 0 &&
      setTimeout(() => {
        store.dispatch(action.setLoading(false));
      }, 100);
  }
};
