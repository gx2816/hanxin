import React from 'react';
import moment from 'moment';
import { Card, Table, Form, Row, Col, Select, Button, DatePicker, TreeSelect,Input } from 'antd';
import { orderColumns } from '../../utils/tableList'
import orderService from '../../service/orderService'
import { starTask } from '../../utils/task'
// import { classBody } from '@babel/types';
// const { Column, ColumnGroup } = Table;
const { TreeNode } = TreeSelect;
const { Option } = Select;
const { RangePicker } = DatePicker;
require('./order.css')
interface IProps {

}

var treeCount = 0;
export default class SiderDemo extends React.Component<IProps, {}> {
  state = {
    value: '',
    defaultValue: '',
    tableData: [],
    channel: [],
    apps: [],
    startDate: '',
    endDate: '',
    current: 1,
    total: 0,
 //  searchIn: '',
  }
  constructor(props: any) {
    super(props)
    this.connetOrders = this.connetOrders.bind(this)
    this.download = this.download.bind(this)
   // this.searchChange = this.searchChange.bind(this)
  }

  componentWillMount() {
    this.getApps()
    this.connetOrders()
    this.getChannels()
  }
  //获取渠道信息
  getChannels() {
    orderService.getChannels({
      onSuccess: ({ data }: any) => {
        console.log(data)
        this.setState({
          channel: data
        })
      }
    })
  }
  //连接表格数据
  async connetOrders() {
    let orders = await this.getOrders()
    let totalOrder = await this.getTotalOrders()
    if (JSON.stringify(totalOrder) !== '{}') {
      totalOrder.date = '全部'
      orders.splice(0, 0, totalOrder)
    }
    this.setState({
      tableData: orders
    })
  }
  // 获取订单信息
  async getOrders(): Promise<any> {
    return new Promise((res, rej) => {
      orderService.getOrders({
        params: {
          app_id: this.state.value,
          channel_id: this.state.defaultValue,
          start_date: this.state.startDate,
          end_date: this.state.endDate,
          page: this.state.current
        },
        onSuccess: (r: any) => {
          this.setState({
            total: +r.headers['x-total-items'] + this.state.current
          })
          res(r.data)
        },
        onError: (err: any) => {
          rej(err)
        }
      })
    })
  }
  async getTotalOrders(): Promise<any> {
    return new Promise((res, rej) => {
      orderService.getTotalOrders({
        params: {
          app_id: this.state.value,
          channel_id: this.state.defaultValue,
          start_date: this.state.startDate,
          end_date: this.state.endDate
        },
        onSuccess: ({ data }: any) => {
          res(data)
        }
      })
    })
  }
  // 获取产品信息
  getApps() {
    orderService.getApps({
      onSuccess: ({ data }: any) => {
      
        this.setState({
          apps: data
        })
      }
    })
  }
  treeApps(apps: any, bol: any) {
    treeCount++
    return apps.map((item: any, index: number) => {
      if (!item.app_id && !bol) {
        return (
          <TreeNode value={''} title={item.name} key='0-1'>
            {this.treeApps(apps.filter((i: any) => i.app_id === item.id), true)}
          </TreeNode>
        )
      }
      if (bol && item.app_id) {
        return (
          <TreeNode value={item.id} title={item.name} key={treeCount + '-' + index}>
            {this.treeApps(this.state.apps.filter((i: any) => i.app_id === item.id), true)}
          </TreeNode>
        )
      }
      return (
        <div key="121"></div>
      )
    })
  }
  //下载表格
  download() {
    orderService.download({
      params: {
        app_id: this.state.value,
        channel_id: this.state.defaultValue,
        start_date: this.state.startDate,
        end_date: this.state.endDate
      },
      onSuccess: ({ data }: any) => {
        console.log(data)
        //创建定时任务
        starTask(data.id)
      }
    })
  }
  tableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    this.setState({
      current: pagination.current
    }, () => {
      this.connetOrders()
    })
  }
  onChange = (date: any, dateString: any) => {
    console.log(dateString);
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    })
  }
  onValueChange = (value: any) => {
    console.log(value);
    this.setState({ value: value });
  }
  handleChange = (value: any) => {
    this.setState({
      defaultValue: value
    })
  }
  /* searchChange = (e: any) => {//搜索框
    const { value } = e.target;
    this.setState({
      searchIn: value
    })

  } */

  disabledDate = (time: any) => {
    if (!time) {
    } else {
      return time > moment().add(-1, 'd')
    }
  };
  render() {
    return (
      <Card style={{ height: '100%' }}>
        <Form className="ant-advanced-search-form" layout="inline">
          <Row>
            <Col span={16}>
              <Form.Item label='产品'>
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  style={{ width: 300 }}
                  value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="Please select"
                  allowClear
                  treeNodeFilterProp={'title'}
                  onChange={this.onValueChange}
                >

                  {this.treeApps(this.state.apps, false)}
                </TreeSelect>
              </Form.Item>
            </Col>

       {/*   {   <Col span={6}>
              <Form.Item label='搜索'>
                <Input
                  value={this.state.searchIn}
                  onChange={this.searchChange}
                  placeholder="请输入订单号" />

              </Form.Item>
            </Col>} */}

            <Col span={8}>
              <Form.Item label='渠道'>
                <Select
                  value={this.state.defaultValue}
                  size='default'
                  onChange={this.handleChange}
                  style={{ width: '200px' }}
                >
                  <Option value="">全部</Option>
                  {this.state.channel.map((item: any) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item label='时间'>
                <RangePicker disabledDate={this.disabledDate as any} onChange={this.onChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary" htmlType="submit" onClick={this.connetOrders}>
                查询
              </Button>
              <Button style={{ marginLeft: '20px' }} onClick={this.download}>
                下载表格
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          className="order-table"
          style={{ marginTop: '20px' }}
          columns={orderColumns as any}
          dataSource={this.state.tableData}
          bordered
          size="small"
          onChange={this.tableChange}
          pagination={{ current: this.state.current, total: this.state.total, defaultPageSize: 21 }}
          scroll={{ x: '1700px' }}
        >
        </Table>
      </Card>
    )
  }
}