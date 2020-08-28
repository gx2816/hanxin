import c2s from '../utils/http';
const financeService = {    
  getApps (option:any) {
    return c2s({
      url:'/apps',
      ...option,
    });   
  },
  refundType (option:any) {
    return c2s({
      url:'/app/order/refund-type',
      ...option,
    });   
  },
  refundDaily (option:any) {
    return c2s({
      url:`/app/refund/daily`,
      ...option,
    });   
  },
  getRefund (option:any) {
    return c2s({
      url:`/app/refund`,
      ...option,
    });   
  },
  channels (option:any) {
    return c2s({
      url:'/channels',
      ...option,
    });   
  },
  refundOrder (option:any) {
    return c2s({
      url:'/app/refund-order',
      ...option,
    });   
  },
  refundOrders (option:any) {
    return c2s({
      url: '/app/orders',
      method:'post',
      ...option,

    });   
  },
  generateOrder(option:any) {
    return c2s({
      url: '/tasks/generate-reasons-order',
      method:'post',
      ...option,

    });   
  },
}

export default financeService;