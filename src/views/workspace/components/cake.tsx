import React from 'react'
import { Card, Skeleton } from 'antd';
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  Legend,
} from "bizcharts";
const DataSet = require("@antv/data-set")

const cols = {
  percent: {
    formatter: (val: any) => {
      val = val * 100 + "%";
      return val;
    }
  }
};
const tooltipsDisplayTpl = `
        <p class="chart-tooptip">
            <span class="chart-tooptip-right">{name}</span>
            <span>{value}</span>
        </p>
    `;
interface binData {
  name: string,
  arr: Array<any>
}
interface IProps {
  binData: binData,
  index: number,
  loading: boolean
}
export default class right extends React.PureComponent<IProps, {}> {
  state = {
    dv: []
  }
  componentDidUpdate (prevProps:any, prevState:any) {
    if(prevProps.binData.arr !== this.props.binData.arr){
      const data = this.props.binData.arr;
      if (data !== undefined) {
        var dv = new DataSet.View().source(data);
        dv.source(data).transform({
          type: "percent",
          field: "sales",
          dimension: "name",
          as: "percent"
        });
        this.setState({
          dv: dv
        })
      }
    }
  }
  // componentWillReceiveProps(nextProps: any) {
  //   const data = nextProps.binData.arr;
  //   if (data !== undefined) {
  //     var dv = new DataSet.View().source(data);
  //     dv.source(data).transform({
  //       type: "percent",
  //       field: "sales",
  //       dimension: "name",
  //       as: "percent"
  //     });
  //     this.setState({
  //       dv: dv
  //     })
  //   }
  // }
  render() {
    return (
      <Card className="cake" style={{ height: '328px', marginLeft: (this.props.index % 2 !== 0) ? '6px' : '0', marginRight: (this.props.index % 2 === 0) ? '6px' : '0', marginTop: (this.props.index === 2 || this.props.index === 3) ? '12px' : '0' }}>
        <Skeleton loading={this.props.loading} active paragraph={{ rows: 8 }}>
          <div className="cake-font">{this.props.binData.name}</div>
          <Chart
            height={280}
            data={this.state.dv}
            scale={cols}
            padding={"auto"}
            forceFit
          >
            <Legend position="right-top" offsetX={-120} />
            <Coord type={"theta"} radius={0.6} innerRadius={0.6} />
            <Tooltip
              showTitle={false}
              itemTpl={tooltipsDisplayTpl}
            />
            <Geom
              type="intervalStack"
              position="percent"
              // color={['name', '#2C82BE-#DBECF8']}
              color={'name'}
              tooltip={[
                "name*percent",
                (name, percent) => {
                  percent = (percent * 100).toFixed(2) + "%";
                  return {
                    name: name,
                    value: percent
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  // val = val.substring(0,val.length-1);
                  // val = parseFloat(val).toFixed(2)+'%'
                  return item.point.sales === 0 ? '' : `${item.point.name}:${item.point.sales}`;
                }}

              />
            </Geom>
          </Chart>
        </Skeleton>
      </Card>
    )
  }
}