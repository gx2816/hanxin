import c2s from '../utils/http';

const baseService = {    
  downLoad (option:any) {        
      return c2s({
        url:`/tasks/${option.task_id}`,
        ...option,
      },{mask:false,silentError:false});    
  }
}

export default baseService;