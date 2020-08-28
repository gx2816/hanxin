import { notification } from 'antd';
import baseService from '../service/baseService'

export const starTask = (task_id:string) => {
	let key = new Date().getTime()+''
	notification['info']({
      message: '下载提示',
      key:key,
      duration:null,
      description:
        '下载处理中,请稍后',
    });
	let intervalId = setInterval(_=>{
	  baseService.downLoad({
	    task_id:task_id,
	    onSuccess:({data}:any)=>{
	      if(data.state==='failed'){
	      	notification.close(key)
	        notification['error']({
		      message: '下载提示',
		      description:
		        '下载处理失败',
		    });
	        clearInterval(intervalId);
	      }
	      else if (data.state==='completed'){
	      	notification.close(key)
	        window.location.href = data.result
	        clearInterval(intervalId);
	      }
	    }
	  })
	},3000)
}