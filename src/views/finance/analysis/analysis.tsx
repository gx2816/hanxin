import React, { useState, useEffect, Fragment, useRef } from "react";

import financeService from '../../../service/financeService'
import { Select, Card, DatePicker, Row, Button, Skeleton,TreeSelect } from "antd";
import {
  Chart, Axis, Tooltip, Geom, Legend, Coord ,Label,
} from "bizcharts";
import moment from "moment";
import { dateDay } from "../../../utils/tool";
import { any } from "prop-types";
const { Option } = Select;
const { TreeNode } = TreeSelect;
require('./analysis.scss')
const tooltipsDisplayTpl = `
        <p class="chart-tooptip">
          <span class="chart-tooptip-right">{name}</span>
          <span>{value}</span>
        </p>
    `;

export default () => {
  let [ apps, setApps] = useState();
  let [ appsarr, setAppsarr] = useState([]);
  let [ channelsarr, setchannelsArr] = useState([]);
  let [ selectValue, setSelectValue] = useState("");
  let [product, setProduct] = useState("");
  let [channel, setChannel] = useState("");
  let [loading, setLoading] = useState(false);
  let today = new Date()
  today=new Date(today.getTime() - 1 * 24 * 3600 * 1000)
  let start = new Date(today.getTime() - 6 * 24 * 3600 * 1000)
 /*  let today = new Date()
  let start = new Date(today.getTime() - 7 * 24 * 3600 * 1000); */

  let startDate = useRef(today); // 不能用useState 会导致数据更新不及时
  let lastDate = useRef(start);
  
  const onChangeTime = (date: any, dateString: any) => {//选择时间
    console.log(111, dateString, date._d)
    startDate.current= date._d
    lastDate.current=new Date(startDate.current.getTime() - 6 * 24 * 3600 * 1000)
/*     console.log(startDate)
    setStartDate(date._d);

    console.log(222,startDate)
    setLastDate(new Date(startDate.getTime() - 7 * 24 * 3600 * 1000))
 */

  };

  let [refund, setRefund] = useState([])//退款率
  const disabledDate = (time: any) => {
     
    if (!time) {
    } else {
      
      return time > moment().add(-1, "d");
    }
  };
  /* charts */
  const data = [
    
  ];
  const scale = {
    call: {
      min: 0
    },
    退款率: {
      formatter: (val:any) => {
        val=( val * 100).toFixed(2)+"%"
        return val
        },
    },
    退款金额: {
      min: 0
    },
    time: {
      alias: "日期",
      type: "timeCat",
      range: refund.length > 1 ? [0.15, 0.85] : [0.5,1]
    },
  
    
  };

/* 退款分析 */
  
  let [reason,setReason]=useState([])
  const cols = {
    percent: {
      formatter: (val:any) => (val = `${val * 100}%`)
    },
  };
  useEffect(() => {
    inintData();
    channels()
    onSearch()
  }, []);
  const inintData = () => {
    financeService.getApps({
      onSuccess: ({ data }: any) => {
        setAppsarr(data);
        console.log(+new Date())
      }
    });
  };
 
  const onValueChange = (value: any) => {
    setApps(value);
  }
  var treeCount = 0;
  const treeApps=(appsarrs: any, bol: any)=> {//产品
  treeCount++
  return appsarrs.map((item: any, index: number) => {
    if (!item.app_id && !bol) {
      return (
        <TreeNode value={''} title={item.name} key='0-1'>
          {treeApps(appsarrs.filter((i: any) => i.app_id === item.id), true)}
        </TreeNode>
      )
    }
    if (bol && item.app_id) {
      return (
        <TreeNode value={item.id} title={item.name} key={treeCount + '-' + index}>
          {treeApps(appsarr.filter((i: any) => i.app_id === item.id), true)}
        </TreeNode>
      )
    }
    return (
      <div key="121"></div>
    )
    })
  }
  const channels = () => {//渠道
    financeService.channels({
      onSuccess: ({ data }: any) => {
        setchannelsArr(data)
      }
    });
  };
  const getChannel = (value: any) => {
   console.log(value)
   setChannel(value)
  }
  const onSearch = () => {//查询
    financeService.refundDaily({//退款率
      params: {
        app_id:apps||null,
        channel_id: channel||null,
        start_date:dateDay(lastDate.current),
        end_date:`${dateDay(startDate.current)} 23:59:23`,
      },
      onSuccess: ({ data }: any) => {
        let arr:any=[]
        data.map((v: any,i: any)=> {
          let obj:any = {}
          obj["time"]=v.refund_dt
          obj["退款金额"]=v.refund_price/100
          obj["退款率"]=v.refund_rate
          arr.push(obj)
        })
        setRefund(arr)
        
      }
    });
    financeService.getRefund({//退款原因
      params: {
        app_id:apps||null,
        channel_id: channel||null,
        start_date:dateDay(lastDate.current),
        end_date:dateDay(startDate.current)+" 23:59:23",
      },
      onSuccess: ({ data }: any) => {
        let arr: any = []
        /* { item: '原因一', count: 40, percent: 0.4 } */
        data.map((v: any,i: any)=> {
          let obj:any = {}
          obj["item"]=v.reason
          obj["count"]=v.reason_rate*100
          obj["percent"]=v.reason_rate
          arr.push(obj)
        })
        setReason(arr)
      }
    });
  }
  return (
    
    <div style={{ position:'relative' }}>
      <Card style={{ height: '100%' }}>  
          <Row>
            产品:

                 <TreeSelect
                   style={{  marginLeft: "12px", width: "300px", marginRight: "30px" }}
                   className="TreeSelect"
                    showSearch
                    treeDefaultExpandAll={false}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="全部"
                    allowClear
                    treeNodeFilterProp={'title'}
                    onChange={(value: string) => { onValueChange(value) }}
                    //value={setApps}
                    >
                   {treeApps(appsarr, false)}
                  </TreeSelect>
                 
                
            渠道:
                <Select value={channel} style={{ marginLeft: "12px", width: "200px", marginRight: "30px" }} placeholder="请选择渠道" onChange={(value: string) => { getChannel(value) }}>
                  <Option value="">全部</Option>
                  {channelsarr.map((item: any, index) => {
                    return (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
                时间:
                <DatePicker 
                  defaultValue={moment(startDate.current)}
                  format="YYYY-MM-DD"
                  
                  style={{ marginLeft: "12px",  marginRight: "200px" }}
                  disabledDate={disabledDate as any}
                  onChange={onChangeTime}
                   />
                  <Button
                    style={{ marginLeft: "120px" }}
                    icon="search"
                    type="primary"
                    onClick={onSearch}
                  >
                    查询
                  </Button>
                  
            </Row>
         
      </Card>
      <Card style={{marginTop:'12px',  width:'800px', height:'668px'}}>
         <Skeleton loading={loading}  active title={false} paragraph={{ rows: 14 }}>
            <div className="chart-font">退款率</div>
            <Chart   scale={scale}  width={200} height={500} padding={"auto"} data={refund} forceFit>
            <Legend
            custom={true}
            allowAllCanceled={true}
            items={[
              {
                value: "退款金额",
                marker: {
                  symbol: "square",
                  fill: "#FFCC00",
                  radius: 5,
               
                }
              },
              {
                value: "退款率",
                marker: {
                  symbol: "hyphen",
                  stroke: "#CF6664",
                  radius: 5,
                  lineWidth: 3
                }
              }
            ]}
          />
          <Axis
            name="退款率"
            grid={null}
            label={{
              textStyle: {
                fill: "#CF6664"
              }
            }}
          />
          <Tooltip  itemTpl={ tooltipsDisplayTpl }
            showTitle={ false }
            crosshairs={{
              type: "y"
          }}/>
          <Geom  type="interval" position="time*退款金额" color="#FFCC00" />
          <Geom
            type="line"
            position="time*退款率*%"
            color="#CF6664"
            size={3}
            shape="smooth"
          />
          <Geom
            type="point"
            position="time*退款率*%"
            color="#CF6664"
            size={3}
            shape="circle"
          />
            </Chart>
        </Skeleton>
        
          </Card>
       
      <Card style={{ position:'absolute',top: '12.4%', right: '0%', width: '800px', height: '668px' }}>
         <Skeleton loading={loading}  active title={false} paragraph={{ rows: 14 }}>
            <div className="chart-font">退款原因</div>
            <Chart
          width={600}
         height={700}
          data={reason}
          scale={cols}
          //padding="auto"
          forceFit
         // 设置选中
          onPlotClick={(ev) => {
            console.log(ev);
          }}
        >
          <Coord type="theta" radius={0.65} />
          <Axis name="percent" />
          <Legend position="right" offsetY={-window.innerHeight / 2 + 320} offsetX={-100} />
          <Tooltip
           itemTpl={ tooltipsDisplayTpl }
           showTitle={ false }
          
            />
         
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = `${percent * 100}%`;
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth:1,
              stroke: '#fff',
            }}
            >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ': ' + val;
              }}
            />
          </Geom>
        </Chart>
        </Skeleton>
        
          </Card>

    </div>

  )
}