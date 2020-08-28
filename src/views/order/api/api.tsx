import React from 'react';
import moment from 'moment';
import {apiColumns} from '../../../utils/tableList'
import { Card, Table, Modal, Row, Col, Button, DatePicker,Input, Tooltip } from 'antd';
import orderService from '../../../service/orderService'
import {starTask} from '../../../utils/task'
const {  RangePicker } = DatePicker;
interface IProps{

}
export default class SiderDemo extends React.Component<IProps,{}> {
  state = {
    startDate:'',
    endDate:'',
    upDate:'',
    rangeDate:undefined,
    tableData:[],
    loading: false,
    visible: false,
    inputValue:'',
    current:1,
    total:0,
  }
  constructor(props:any){
    super(props)
    this.download=this.download.bind(this)
  }
  componentWillMount(){
    this.setDefaultDate()
    this.inintData()
  }
  inintData(){
    orderService.getApiData({
      params:{
        per_page:10,
        start_date:this.state.startDate,
        end_date:this.state.endDate,
        page:this.state.current
      },
      onSuccess:(r:any)=>{
        this.setState({
          tableData:r.data,
          total:+r.headers['x-total-items']
        })
      }
    })
  }
  download(){
    orderService.downloadApi({
      params:{
        app_id:25,
        start_date:this.state.startDate,
        end_date:this.state.endDate
      },
      onSuccess:({data}:any)=>{
        console.log(data)
        //创建定时任务
        starTask(data.id)
      }
    })
  }
  setDefaultDate(){
    let date = +new Date()
    let before = date-1000*60*60*24;
    let beforeDate = new Date(before);
    let oYear = beforeDate.getFullYear();
    let oMoth = (beforeDate.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    let oDay = beforeDate.getDate().toString();
    if (oDay.length <= 1) oDay = '0' + oDay;
    let beforeDay = `${oYear}-${oMoth}-${oDay}`
    this.setState({
      rangeDate:moment(beforeDay,'YYYY-MM-DD'),
      upDate:beforeDay
    },()=>{
      // this.getTotal()
    })
  }
  onChange = (date:any, dateString:any) => {
    this.setState({
      startDate:dateString[0],
      endDate:dateString[1]
    },()=>{
      this.inintData()
    })
  }
  upChange = (date:any, dateString:any) => {
    console.log(dateString)
    this.setState({
      rangeDate:date,
      upDate:dateString,
    })
  }
  disabledDate = (time:any) => {
    if(!time){
		}else{
			return time > moment().add(-1, 'd')
		}
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  tableChange = (pagination:any,filters:any,sorter:any,extra:any) => {
    this.setState({
      current:pagination.current
    },()=>{
      this.inintData()
    })
  }
  handleOk = () => {
    if(!this.state.inputValue){
      return
    }
    this.setState({ loading: true });
    orderService.updateApi({
      params:[{
        op:"add",
        path:`/${this.state.upDate}/active_income`,
        value:+this.state.inputValue*100
      }],
      onSuccess:({data}:any)=>{
        this.setState({ loading: false, visible: false });
        this.inintData()
      },
      onError:(err:any)=>{
        this.setState({ loading: false});
      }
    })
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  inputChange = (e:any) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        inputValue:value
      })
    }
  };
  render(){
    const { inputValue } = this.state;
    const title = inputValue ? (
      <span className="numeric-input-title">{inputValue}</span>
    ) : (
      'Input a number'
    );
    return(
      <Card style={{height:'100%'}}>
        <Row>
          时间:<RangePicker style={{marginLeft:'12px'}} disabledDate={this.disabledDate as any} onChange={this.onChange}/>
          <Button style={{marginLeft:'12px'}} type="primary" onClick={this.download}>导出收入</Button>
          <Button style={{marginLeft:'12px'}} onClick={this.showModal} >上传收入</Button>
        </Row>
        <Row>
          <Table
              style={{marginTop:'20px',width:'100%'}}
              columns={apiColumns as any}
              dataSource={this.state.tableData}
              size="small"
              onChange={this.tableChange}
              pagination={{current:this.state.current,total:this.state.total,defaultPageSize:10}}
            />
        </Row>
        <Modal
          visible={this.state.visible}
          title="上传收入"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          keyboard={false}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              上传
            </Button>,
          ]}
        >
          <Row>
            <Col span={12}>
              时间:<DatePicker allowClear={false} style={{marginLeft:'10px'}} disabledDate={this.disabledDate as any} value={this.state.rangeDate} onChange={this.upChange} />
            </Col>
            <Col span={12}>
              收入:
              <Tooltip
                trigger="focus"
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
              >
                <Input
                  onChange={this.inputChange}
                  // onBlur={this.onBlur}
                  placeholder="Input a number"
                  maxLength={25}
                  style={{width:'171px',marginLeft:'10px'}}
                />
              </Tooltip>
            </Col>
          </Row>
        </Modal>
      </Card>
    )
  }
}