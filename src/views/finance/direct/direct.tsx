import React, { useState, useEffect, Fragment } from "react";
import { Select, Card, DatePicker, Row, Button,Table,message } from "antd";
//import { financialManagement } from "../../../utils/tableList";
import { dateTime,dateDay } from "../../../utils/tool";
import orderService from '../../../service/orderService'
import financeService from '../../../service/financeService'
import { starTask } from '../../../utils/task'
import moment from "moment";
import { any } from "prop-types";
const { Option } = Select;
const { RangePicker } = DatePicker;
require('./direct.scss')
export default () => {
  let [ pay, setPay] = useState("");
  let [refund, setRefund] = useState("refunding");
  let [refunds, setRefunds] = useState("refunding");
  let today = new Date()
  let end=new Date(today.getTime() - 24 * 3600 * 1000);
  let start = new Date(today.getTime() - 30 * 24 * 3600 * 1000);
  const [startDate, setStartDate] = useState(end);
  const [selectionType, setSelectionType] = useState();
  const [endDate, setEndDate] = useState(start);
  const [tableData, setTableDate] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderSort, setOrderSort] = useState("");
  const [step, setStep] = useState(0);
  const [payAppArr, setPayAppArr] = useState([]);//支付方式
  const [rows, setRows] = useState([]);//支付方式
  const onChange = (date: any, dateString: any) => {
    console.log(dateString)
   // 
    setStartDate(dateString[1])
    dateString[0]=dateString[0]
    setEndDate(dateString[0]);
    console.log(dateString)
  };

  const financialManagement = [//财管管理
    {
      title: "产品组",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "产品名称",
      dataIndex: "app",
      key: "app",
    },
    {
      title: "渠道",
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "订单号",
      dataIndex: "order_no",
      key: "order_no",
    },
    {
      title: "交易号",
      dataIndex: "serial_no",
      key: "serial_no",
    },
    {
      title: "退款状态",
      dataIndex: "state",
      render: (val: any) => <span>{val != "refunding" ? "已退款" : "待退款"}</span>,
      key: "state",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "支付时间",
      dataIndex: "paid_at",
      key: "paid_at",
    },
    {
      title: "交易方式",
      dataIndex: "pay_type",
      render: (val: any) => <span>{val}</span>,
      key: "pay_type",
      
    },
    {
      title: "实付金额",
      dataIndex: "price_total",
      render: (val: any) => <span>{val/100}</span>,
      key: "price_total",
    },
    {
      title: "退款说明",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "退款截图",
      dataIndex: "image_url",
      render: (vals: any) => (
        <>
          {vals.map((v: any,index: any) => {
             
          return (
            <a  href={v} target="_blank" >图片{index+1}</a>
          );
          })
          }
     
        </>
      ),
      key: "image_url",
    },
    {
      title: "操作",
      dataIndex: "refund_no",
      render: (val: any, record: any, index: any) => {
      
        return (
          refunds==="refunding"?(
          <span id={val} data-msg={index} onClick={event => {
            reimburses(index)
          }}style={{ cursor: 'pointer', color: "#1890ff" }} > 退款</span>
          ):""
        )
         
      },
      key: "refund_no",          
    }
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
 
      setRows(selectedRows)
    },
    getCheckboxProps: (record: { name: any; }) => ({
      //disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
 
  const tableStatus = (datas: { forEach: (arg0: (v: any) => void) => void; }) => {//交易方式
  
    datas.forEach((v) => {
     // v.created_at = v.created_at.getMonthFirstDay()
      let a = new Date()
      v.created_at=dateTime(v.created_at)
      v.paid_at =dateTime(v.paid_at)
      switch(v.pay_type){
        case 'QQ':
          v.pay_type = "QQ支付";
        break;
        case 'wechat':
          v.pay_type = "微信支付";
        break;
        case 'alipay':
          v.pay_type = "支付宝支付";
        break;
        case 'huawei':
          v.pay_type = "华为支付";
        break;
        case 'baidu':
          v.pay_type = "百度支付";
        break;
        default:
          v.pay_type = "苹果支付";
        break;
      }
    })
  
  }
  function reimburses(idx: any) {
    financeService.refundOrders({
      params: {
        app_id:tableData[idx]["app_id"],
        order_no:tableData[idx]["order_no"],
        state:"refunded",
      },
      onSuccess: ({ data }: any) => {
        message.success('操作成功');
        Inquire()
      },
      onError: (err: any) => {
        message.success(err);
      }
    });

 
  }
  const queryReturn = (state: string) => {//一键操作
    if (rows.length < 1) {
      message.warning('请选择需要操作的订单');
    }
    for (let i = 0; i < rows.length; i++) {
      financeService.refundOrders({
        params: {
          app_id:rows[i]["app_id"],
          order_no:rows[i]["order_no"],
          state:state,
        },
        onSuccess: ({ data }: any) => {
          if (i == rows.length - 1) {
            message.success('操作成功');
          }
          Inquire()
        },
        onError: (err: any) => {
          message.success(err);
          return
        }
      });
    }
  }
  const allReturn = () => {//一键退款
    queryReturn("refunded")
  }
  const allRefunding = () => {//一键标记退款
    queryReturn("refunding")
  }
  const download = () => {//导出
    financeService.generateOrder({
      params: {
        payType: pay || "third_party",
        state: refund || "refunding",
        start_date:dateDay(endDate),
        end_date:dateDay(startDate)+" 23:59:23"

      },
      onSuccess: ({ data }: any) => {
        starTask(data.id)
      },
      onError: (err: any) => {
        
      }
    });
  }
  useEffect(() => {
    inintData();
    Inquire()
  }, []);
  const inintData = () => {//支付方式
   orderService.getRefund({
     onSuccess: ({ data }: any) => {
      setPayAppArr(data);
     }
   });
  };
  function checkTime(i: string | number){ if(i<10){ i='0'+i } return i }
  const Inquire = () => {//查询
    financeService.refundOrder({
      params: {
        pay_type: pay || "third_party",
        state: refund || "refunding",
        start_date:dateDay(endDate),
        end_date:dateDay(startDate)+" 23:59:23"
      },
      onSuccess: ({ data }: any) => {
        let datas=data
        tableStatus(datas)
        setTableDate(datas)
        setRefunds(refund)
      }
    });
  }
  const disabledDate = (time: any) => {
    if (!time) {
    } else {
      return time > moment().add(-1, "d");
    }
  };
  const tableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setOrderSort(sorter.order || "");
    setCurrent(pagination.current);
    setStep(x => x + 1);
  };
  return (
    <div>
        <Card style={{ height: '100%' }}>  
          <Row>
            支付方式:
                <Select
                placeholder="第三方支付"
                style={{ marginLeft: "12px", width: "200px", marginRight: "30px" }}  onChange={(value: string) => { setPay(value) }} className="thirdPay">
                  
                  {payAppArr.map((item: any,index) => {
                    return (
                      <Option value={item.value} key={item.value}>{item.key}</Option>
                    )
                  })}
                </Select>
            退款状态:
                <Select
                style={{  marginLeft: "12px", width: "200px", marginRight: "30px" }} placeholder="待退款"  onChange={(value: string) => { setRefund(value) }} className="thirdPay">
                  <Option value="refunding">待退款</Option>
                  <Option value="refunded">已退款</Option>
                </Select>
                时间:
                <RangePicker
                 defaultValue={[moment(endDate), moment(startDate)]}
                 format="YYYY-MM-DD"
                  showTime
                  style={{ marginLeft: "12px", width: "400px", marginRight: "30px" }}
                  disabledDate={disabledDate as any}
                  onChange={onChange}
                   />
                  <Button
                    style={{ marginLeft: "80px" }}
                    icon="search"
                    type="primary"
                    onClick={Inquire}
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: "12px" }}
                    onClick={download}
                  >
                    导出
                  </Button>
                  <Button
                   style={{ marginLeft: "12px" }}
                   onClick={allReturn}
                  >
                    一键退款
                  </Button>
                  <Button
                    style={{ marginLeft: "12px" }}
                    onClick={allRefunding}
                  >
                    一键标记退款
                  </Button>
            </Row>
          <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              style={{ marginTop: "20px" }}
              columns={financialManagement}
              dataSource={tableData}
              bordered
              size="small"
              onChange={tableChange}
              pagination={{
                current: current,
                total: total,
                defaultPageSize: 20,
                showTotal: (total: number) => `总计:${total}条`
              }}
            ></Table>
          </Card>

  
    </div>

  )
}         