import React from 'react'
import moment from 'moment';
import { Card,Tabs, Icon , Row, Col,Form, Button, DatePicker,Table,TreeSelect} from 'antd';
import {specColumns,searchColumns} from '../../utils/tableList'
import TweenOne from 'rc-tween-one';
import specService from '../../service/specService'
import {starTask} from '../../utils/task'
// import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
const { TreeNode } = TreeSelect;
const Children = require('rc-tween-one/lib/plugin/ChildrenPlugin')
TweenOne.plugins.push(Children);
require('./spec.css')
const { TabPane } = Tabs;
const {  RangePicker } = DatePicker;
interface IProps{
}
var treeCount = 0;
export default class SiderDemo extends React.Component<IProps,{}> {
  state = {
    value:'',
    // totalPay:{},
    noPay:{},
    rata:{},
    specData:[],
    searchData:[],
    noSearchData:[],
    apps:[],
    rangeDate:[],
    startDate:'',
    endDate:''
  }
  constructor(props:any){
    super(props)
    this.getSpecData=this.getSpecData.bind(this)
    this.getSearchData=this.getSearchData.bind(this)
    // this.getTotal=this.getTotal.bind(this)
    this.queryClick=this.queryClick.bind(this)
  }
  componentWillMount(){
    // this.getTotal()
    this.getApps()
    this.setDefaultDate()
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
      rangeDate:[moment(beforeDay),moment(beforeDay)],
      startDate:beforeDay,
      endDate:beforeDay
    },()=>{
      this.getSpecData()
      this.getSearchData()
      // this.getTotal()
    })
  }
  queryClick(){
    this.getSpecData()
    // this.getTotal()
  }
  //获取热搜词表格数据
  getSearchData(){
    specService.getSearchData({
      params:{
        app_id:this.state.value,
        start_date:this.state.startDate,
        end_date:this.state.endDate
      },
      onSuccess:({data}:any)=>{
        console.log(data)
        this.setState({
          searchData:data.result,
          noSearchData:data.no_result
        })
      }
    })
  }
  //获取规格表格数据
  getSpecData(){
    specService.getSpecData({
      params:{
        app_id:this.state.value,
        start_date:this.state.startDate,
        end_date:this.state.endDate
      },
      onSuccess:({data}:any)=>{
        console.log(data)
        this.setState({
          specData:data
        })
      }
    })
  }
  //获取三条总计信息
  // getTotal(){
  //   specService.getTotal({
  //     params:{
  //       app_id:this.state.value,
  //       start_date:this.state.startDate,
  //       end_date:this.state.endDate
  //     },
  //     onSuccess:({data}:any)=>{
  //       console.log(data)
  //       this.setState({
  //         totalPay:{
  //           Children: { 
  //             value: data.paid_order,
  //             floatLength: 0,
  //           }, 
  //           duration: 1000,
  //         },
  //         noPay:{
  //           Children: { 
  //             value: data.unpaid_order,
  //             floatLength: 0,
  //           }, 
  //           duration: 1000,
  //         },
  //         rata:{
  //           Children: { 
  //             value: data.total_rate*100,
  //             floatLength: 2,
  //           }, 
  //           duration: 1000,
  //         }
  //       })
  //     }
  //   })
  // }
  // 获取产品信息
  getApps(){
    specService.getApps({
      onSuccess:({data}:any)=>{
        console.log(data)
        this.setState({
          apps:data
        })
      }
    })
  }
  treeApps(apps:any,bol:any){
    treeCount++
    return apps.map((item:any,index:number) => {
      if (!item.app_id && !bol) {
        return (
          <TreeNode value={''} title={item.name} key='0-1'>
            {this.treeApps(apps.filter((i:any)=>i.app_id === item.id),true)}
          </TreeNode>
        )
      }
      if(bol && item.app_id){
        return (
          <TreeNode value={item.id} title={item.name} key={treeCount+'-'+index}>
            {this.treeApps(this.state.apps.filter((i:any)=>i.app_id === item.id),true)}
          </TreeNode>
        )
      }
      return(
        <div key="121"></div>
      )
    })
  }
  downSpec(){
    specService.downSpec({
      params:{a:'111'},
      onSuccess:({data}:any)=>{
        console.log(data)
        starTask(data.id)
      }
    })
  }
  downSearch(){
    specService.downSearch({
      params:{a:'111'},
      onSuccess:({data}:any)=>{
        console.log(data)
        starTask(data.id)
      }
    })
  }
  onValueChange = (value:any) => {
    console.log(value);
    this.setState({ value });
  };
  disabledDate = (time:any) => {
    if(!time){
			return false
		}else{
			return time > moment().add(-1, 'd')
		}
  };
  onChange = (date:any, dateString:any) => {
    console.log(date, dateString);
    this.setState({
      rangeDate:date,
      startDate:dateString[0],
      endDate:dateString[1]
    })
  }
  render() {
    return(
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="fire" theme="twoTone" />
              热门规格top20
            </span>
          }
          key="1"
        >
          {/* <Card key="demo1">
            <Row>
              <Col span={8} className="tipCol tipDivider">
                <div className="tip-div">
                  <span className="tip-font">总已付单数</span><br></br>
                  <TweenOne
                    animation={this.state.totalPay}
                    style={{ fontSize: 24,display:'inline-block' }}
                  ></TweenOne>
                </div>
              </Col>
              <Col span={8} className="tipCol tipDivider">
              <div className="tip-div">
                  <span className="tip-font">总未付单数</span><br></br>
                  <TweenOne
                    animation={this.state.noPay}
                    style={{ fontSize: 24 }}
                  ></TweenOne>
                </div>
              </Col>
              <Col span={8} className="tipCol">
                <div className="tip-div">
                  <span className="tip-font">总体付费转化率</span><br></br>
                  <TweenOne
                    animation={this.state.rata}
                    style={{ fontSize: 24,display:'inline-block' }}
                  ></TweenOne><span style={{fontSize: 24}}>%</span>
                </div>
              </Col>
            </Row>
          </Card> */}
          <Card style={{marginTop:'20px'}} key="demo2">
            <Form className="ant-advanced-search-form" layout="inline">
              <Row>
                <Col span={10}>
                  <Form.Item label='日期'>
                    <RangePicker value={this.state.rangeDate} disabledDate={this.disabledDate as any} onChange={this.onChange} style={{ marginLeft:'30px'}}/>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='产品'>
                    <TreeSelect
                      showSearch
                      style={{ width: 300 }}
                      value={this.state.value}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select"
                      treeNodeFilterProp={'title'}
                      allowClear
                      treeDefaultExpandAll={false}
                      onChange={this.onValueChange}
                    >
                      
                      {this.treeApps(this.state.apps,false)}
                    </TreeSelect>
                  </Form.Item>
                </Col>
                <Button type="primary" htmlType="submit" onClick={this.queryClick}>
                  查询
                </Button>
                <Button style={{ marginLeft: '20px' }} onClick={this.downSpec}>
                  下载表格
                </Button>
              </Row>
            </Form>
            <Table
              style={{marginTop:'20px'}}
              columns={specColumns as any}
              dataSource={this.state.specData}
              size="small"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="smile" theme="twoTone" />
              热门搜索词top20
            </span>
          }
          key="2"
        >
          <Card style={{marginTop:'20px'}}>
            <Form className="ant-advanced-search-form" layout="inline">
              <Row>
                <Col span={10}>
                  <Form.Item label='日期'>
                    <RangePicker value={this.state.rangeDate} disabledDate={this.disabledDate as any} onChange={this.onChange} style={{ marginLeft:'30px'}}/>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='产品'>
                    <TreeSelect
                      showSearch
                      style={{ width: 300 }}
                      value={this.state.value}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select"
                      allowClear
                      treeDefaultExpandAll={false}
                      onChange={this.onValueChange}
                    >
                      {this.treeApps(this.state.apps,false)}
                    </TreeSelect>
                  </Form.Item>
                </Col>
                <Button type="primary" htmlType="submit" onClick={this.getSearchData}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: '20px' }} onClick={this.downSearch}>
                    下载表格
                  </Button>
              </Row>
            </Form>
            <Row>
                <Col span={12} style={{display:'flex',justifyContent:'center'}}>
                  <Table
                    title={_=>{return '有搜索结果'}}
                    style={{marginTop:'20px',width:'80%'}}
                    columns={searchColumns as any}
                    dataSource={this.state.searchData}
                    size="small"
                    pagination={false}
                  />
                </Col>
                <Col span={12} style={{display:'flex',justifyContent:'center'}}>
                  <Table
                    title={_=>{return '无搜索结果'}}
                    style={{marginTop:'20px',width:'80%'}}
                    columns={searchColumns as any}
                    dataSource={this.state.noSearchData}
                    size="small"
                    pagination={false}
                  />
                </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    )
  }
}