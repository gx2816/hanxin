import React from 'react'
import { Card , Row,Col ,Skeleton} from 'antd';
import {getCurrentMonth} from '../../../utils/tool'
import TweenOne from 'rc-tween-one';
interface IProps{
  monthIncome:number,
  loading:boolean
}
export default class card1 extends React.Component<IProps,{}> {
  state={
    currentMonth:getCurrentMonth(),
    totalPay:{}
  }
  componentWillReceiveProps(nextProps: any) {
    const data = nextProps.monthIncome;
    if(data){
      this.setState({
        totalPay: {
          Children: { 
            value: data,
            floatLength: 2,
          }, 
          duration: 1000,
        }
      })
    }
  }
  render(){
    return(
      <Card className="work">
      <Skeleton loading={this.props.loading} active title={false} paragraph={{ rows: 4 }}>
        <Row style={{height:'100%',display:'flex',alignItems:'center',width:'100%',justifyContent:'center'}}>
          <div>
            <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                <div className="income">{this.state.currentMonth}月累计收入</div>
            </Col>
            <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                <div className="money">¥<TweenOne
                    animation={this.state.totalPay}
                    style={{ fontSize: 16,display:'inline-block' }}
                  ></TweenOne></div>
            </Col>
          </div>
        </Row>
        </Skeleton>
      </Card>
    )
  }
}