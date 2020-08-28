import React from 'react'
import { Card ,Skeleton} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Label
} from "bizcharts";
interface IProps{
  appsPillarData:Array<any>,
  loading:boolean,
  mode:string
}
const tooltipsDisplayTpl = `
        <p class="chart-tooptip">
            <span class="chart-tooptip-right">收入</span>
            <span>{value}</span>
        </p>
    `;
export default class card3 extends React.PureComponent<IProps,{}> {
  render(){
    const cols = {
      
    };
    return(
      <Card style={{marginTop:'12px',height:'468px'}}>
        <Skeleton loading={this.props.loading} active title={false} paragraph={{ rows: 14 }}>
          <div className="chart-font">{this.props.mode==='current'?'各产品组今日收入':'各产品组昨日收入'}</div>
          <Chart height={380} padding={"auto"} data={this.props.appsPillarData} scale={cols} forceFit>
            <Axis name="appName" />
            <Axis name="sales" />
            <Tooltip
              itemTpl={ tooltipsDisplayTpl }
              showTitle={ false }
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="interval" position="appName*sales" color="appName">
            {/* <Geom type="interval" position="appName*sales" color="l(90) 1:#53A8E2 0:#76DDFB"> */}
              <Label content="sales" offset={10} />
            </Geom>
          </Chart>
          </Skeleton>
      </Card>
    )
  }
}