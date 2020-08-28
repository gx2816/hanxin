import React from 'react'
import { Card, Skeleton } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
interface IProps {
  appsSelfSalesData: Array<any>,
  loading: boolean,
  mode:string
}
const tooltipsDisplayTpl = `
        <p class="chart-tooptip">
            <span class="chart-tooptip-right">{name}</span>
            <span>{value}</span>
        </p>
    `;
export default class card3 extends React.PureComponent<IProps, {}> {
  componentWillMount() {
  }
  render() {
    const cols = {

    };
    return (
      <Card style={{ marginTop: '12px', height: '308px' }}>
        <Skeleton loading={this.props.loading} active title={false} paragraph={{ rows: 9 }}>
          <div className="chart-font" style={{ height: '20px' }}>{this.props.mode==='current'?'各产品今日收入趋势图':'各产品组七日收入趋势图'}</div>
          <Chart height={260} padding={"auto"} data={this.props.appsSelfSalesData} scale={cols} forceFit>
            <Axis
            />
            <Legend position="top" offsetY={10} offsetX={0} />
            <Tooltip
              showTitle={false}
              itemTpl={tooltipsDisplayTpl}
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="date*sales" size={2} color={'name'}/>
            <Geom
              type="point"
              position="date*sales"
              size={4}
              shape={'circle'}
              color={'name'}
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        </Skeleton>
      </Card>
    )
  }
}