import c2s from '../utils/http';
import c2s1 from '../utils/test';

const orderService = {  
  getPic(_urls:any,option:any) {
    return c2s1({
      url: _urls,
      method:'put',
      ...option,
    });   
  },
  postOrdersdetils(option:any) {
    return c2s({
      method:'post',
      url:'/app/orders',
      ...option,
    });   
  },
  getOrdersdetils(option:any) {
    return c2s({
      url:'/app/orders',
      ...option,
    });   
  },
  getRefund(option:any) {
    return c2s({
      url:'/app/order/refund-type',
      ...option,
    });   
  },
  getReasons(option:any) {
    return c2s({
      url:'/app/order/refund-reasons',
      ...option,
    });   
  },
  getImages(option:any) {
    return c2s({
      url:'/app/orders/image-url',
      method:'post',
      ...option,
    });   
  },
  getOrders (option:any) {        
    return c2s({
      url:'/order-stats',
      ...option,
    });   
  },
  getApps (option:any) {
    return c2s({
      url:'/apps',
      ...option,
    });   
  },
  getTotalOrders (option:any) {        
    return c2s({
      url:'/order-stats-summary',
      ...option,
    });   
  },
  getChannels (option:any) {        
    return c2s({
      url:'/channels',
      ...option,
    });   
  },
  download (option:any) {        
    return c2s({
      url:'/tasks/generate-order-stats',
      method:'post',
      ...option,
    });   
  },
  getApiData(option:any){
    return c2s({
      url:'/apps/25/order-stats',
      ...option,
    }); 
  },
  downloadApi(option:any) {        
    return c2s({
      url:'/tasks/generate-income',
      method:'post',
      ...option,
    });   
  },
  updateApi(option:any) {        
    return c2s({
      url:'/apps/25/order-stats',
      method:'patch',
      ...option,
    },{mask:false});
  },
}

export default orderService;