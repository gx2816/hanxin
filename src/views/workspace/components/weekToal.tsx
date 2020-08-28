import React from 'react'
import { Card, Skeleton } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Label,
} from "bizcharts";
const DataSet = require("@antv/data-set")

interface IProps {
  appsAllSalesData: Array<any>,
  loading: boolean,
  mode:string
}
const tooltipsDisplayTpl = `
        <p class="chart-tooptip">
            <span class="chart-tooptip-right">{name}</span>
            <span>{value}</span>
        </p>
    `;


const scale = {
  // value: {
  //   tickInterval: 50000
  // }
};
export default class card3 extends React.PureComponent<IProps, {}> {
  state = {
    dv: []
  }
  componentDidUpdate (prevProps:any, prevState:any) {
    if(prevProps.appsAllSalesData !== this.props.appsAllSalesData){
      const data = this.props.appsAllSalesData
      var dv = new DataSet.View().source(data);
      dv.transform({
        type: "fold",
        fields: "sales",
      });
      this.setState({
        dv:dv
      })
    }
  }
  // static getDerivedStateFromProps(nextProps: any) {
  //   const data = nextProps.appsAllSalesData;
  //   var dv = new DataSet.View().source(data);
  //   dv.transform({
  //     type: "fold",
  //     fields: "sales",
  //   });
  //   return{
  //     dv:dv
  //   }
  // }
  render() {
    return (
      <Card style={{ height: '308px' }}>
        <Skeleton loading={this.props.loading} active title={false} paragraph={{ rows: 9 }}>
          <div className="chart-font">{this.props.mode==='current'?'今日收入趋势图':'七日总收入趋势图'}</div>
          <Chart height={220} padding={"auto"} data={this.state.dv} scale={scale} forceFit>
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
              showTitle={false}
              itemTpl={tooltipsDisplayTpl} />
            <Axis />
            <Geom type="area" position="date*value" color="#eaf5fc" shape="smooth"
               tooltip={false}></Geom>
            <Geom
              type="line"
              position="date*value"
              color="#53A8E2"
              shape="smooth"
              size={2}
              tooltip={['date*value', (date, value)=>{
                if(this.props.mode==='current'){
                  return {
                    name:date+'点',
                    value:value
                  }
                }
                return {
                  name:date,
                  value:value
                }
              }]}
            ><Label content="value" offset={10} /></Geom>
          </Chart>
        </Skeleton>
      </Card>
    )
  }
}