import React from 'react'
import {Card,Table,Row,DatePicker,Button,message,Icon,Upload,notification} from 'antd'
import {posterColumns} from '../../../utils/tableList'
import pocketService from '../../../service/pocketService'
import moment from 'moment';
const {  RangePicker } = DatePicker;
interface IProps{
}
export default class Poster extends React.Component<IProps,{}> {
  state={
    tableData:[],
    current: 1,
    total: 0,
    startDate:'',
    endDate:'',
  }
  componentWillMount(){
    this.inintData()
  }
  inintData(){
    pocketService.getPoster({
      params:{
        start_time:this.state.startDate,
        end_time:this.state.endDate,
        page:this.state.current
      },
      onSuccess:({data}:any)=>{
        if(data.code!==200){
          message.error(data.result);
          return
        }
        this.setState({
          total:data.total,
          tableData:data.result
        })
      }
    })
  }
  downloadOrder(){
    if(this.state.startDate===''){
      message.warning('请选择时间');
      return
    }
    pocketService.downloadPoster({
      params:{
        start_time:this.state.startDate,
        end_time:this.state.endDate
      },
      onSuccess:({data}:any)=>{
        if(data.code!==200){
          message.error(data.result);
          return
        }
        window.location.href = data.result
      }
    })
  }
  onChange(date:any, dateString:any){
    this.setState({
      startDate:dateString[0],
      endDate:dateString[1]
    })
  }
  tableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    this.setState({
      current: pagination.current
    }, () => {
      this.inintData()
    })
  }
  disabledDate = (time:any) => {
    if(!time){
		}else{
			return time > moment().add(0, 'd')
		}
  };
  render() {
    let key = ''
    const inintData = this.inintData.bind(this)
    const props = {
      name: 'file',
      action: 'https://photostudio.91pitu.com/api/express/upload',
      accept: ".xlsx,.xls",
      showUploadList:false,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info:any) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
          key = new Date().getTime()+''
          notification['info']({
              message: '上传提示',
              key:key,
              duration:null,
              description:
                '上传处理中,请稍后',
            });
        }
        if (info.file.status === 'done') {
          notification.close(key)
          if(info.file.response.code!==200){
            notification['error']({
              message: '上传提示',
              description:info.file.response.result,
            });
            return
          }
          notification['success']({
            message: '上传提示',
            description:`上传成功`,
          });
          setTimeout(_=>{
            inintData()
          },2000)
        } else if (info.file.status === 'error') {
          notification.close(key)
          notification['error']({
            message: '上传提示',
            description:`网络错误,上传失败,请联系管理员`,
          });
        }
      },
    };
    return(
      <Card style={{ height: '100%' }}>
          <Row>
            时间:<RangePicker showTime style={{marginLeft:'12px',width:'400px'}} disabledDate={this.disabledDate as any} onChange={this.onChange.bind(this)}/>
            <Button style={{marginLeft:'12px'}} icon="search" type="primary" onClick={this.inintData.bind(this)}>查询</Button>
            <Button style={{marginLeft:'12px'}} type="primary" ghost onClick={this.downloadOrder.bind(this)}>导出订单</Button>
            <Upload {...props}>
              <Button style={{marginLeft:'12px'}} ><Icon type="upload" />上传快递信息</Button>
            </Upload>
          </Row>
          <Table
            style={{ marginTop: '20px' }}
            columns={posterColumns as any}
            dataSource={this.state.tableData}
            bordered
            size="small"
            onChange={this.tableChange.bind(this)}
            pagination={{ current: this.state.current, total: this.state.total, defaultPageSize: 20 }}
          >
        </Table>
      </Card>
    )
  }
}