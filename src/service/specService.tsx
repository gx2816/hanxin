import c2s from '../utils/http';

const specService = {    
  getTotal (option:any) {        
    return c2s({
      url:'/specs-summary',
      ...option,
    });   
  },
  getSpecData (option:any) {        
    return c2s({
      url:'/specs',
      ...option,
    });   
  },
  getSearchData (option:any) {        
    return c2s({
      url:'/hot-words',
      ...option,
    });   
  },
  downSpec (option:any) {        
    return c2s({
      method:'post',
      url:'/tasks/generate-spec',
      ...option,
    });   
  },
  downSearch (option:any) {        
    return c2s({
      method:'post',
      url:'/tasks/generate-hot-words',
      ...option,
    });   
  },
  getApps (option:any) {
    return c2s({
      url:'/apps',
      ...option,
    });   
  },
}

export default specService;