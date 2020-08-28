import c2s from '../utils/http';

const loginService = {    
  login (option:any) {        
      return c2s({
        url:'/tokens/staff',
        method:'post',
        ...option,
      },{silentError:false});    
  }
}

export default loginService;