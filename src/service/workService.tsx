import c2s from '../utils/http';

const workService = {    
  getBeforeIncome (option:any) {        
    return c2s({
      url:'/total-income',
      ...option,
    },{mask:false});   
  },
  getAppsBeforeIncome(option:any){
    return c2s({
      url:'/income/daily',
      ...option,
    },{mask:false}); 
  }
}

export default workService;