import React from 'react'
import { Card , Row,Col,Skeleton } from 'antd';
import TweenOne from 'rc-tween-one';
interface IProps{
  totalIncome:number,
  dailyRate:number,
  weeklyRate:number
  loading:boolean,
  mode:string,
  goodTime:string
}
export default class card1 extends React.PureComponent<IProps,{}> {
  state={
    totalPay:{}
  }
  componentDidUpdate (prevProps:any, prevState:any) {
    if(prevProps.totalIncome !== this.props.totalIncome){
      const data = this.props.totalIncome;
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
  }
  // componentWillReceiveProps(nextProps: any) {
  //   const data = nextProps.totalIncome;
  //   if(data){
  //     this.setState({
  //       totalPay: {
  //         Children: { 
  //           value: data,
  //           floatLength: 2,
  //         }, 
  //         duration: 1000,
  //       }
  //     })
  //   }
  // }
  render(){
    return(
      <Card className="work" style={{marginRight:'12px'}}>
        <Skeleton loading={this.props.loading} active title={false} paragraph={{ rows: 4 }}>
          <Row style={{height:'100%'}}>
            <Col span={12} style={{display:'flex',height:'100%',alignItems:'center'}}>
              <div style={{marginLeft:'20px'}}>
                <div className="income">{this.props.mode === 'current'?'今日收入':'昨日收入'}{this.props.mode === 'current'&&<span style={{fontSize:`12px`,color:'gray',marginLeft:'5px'}}>(截止{this.props.goodTime}点)</span>}</div>
                <div className="money">¥<TweenOne
                    animation={this.state.totalPay}
                    style={{ fontSize: 16,display:'inline-block' }}
                  ></TweenOne></div>
                
                {/* <div className="money">¥{this.props.totalIncome}</div> */}
              </div>
            </Col>
            <Col span={12} style={{display:'flex',justifyContent:'center',height:'100%',alignItems:'center'}}>
              <div>
                <div className="day">
                  日同比
                  <div className={(+this.props.dailyRate)>0?'increase':'negative'}>{(+this.props.dailyRate)>0?'+':''}{(+this.props.dailyRate*100).toFixed(2)+'%'}</div>
                </div>
                <div className="week">
                  周同比
                  <div className={(+this.props.weeklyRate)>0?'increase':'negative'}>{(+this.props.weeklyRate)>0?'+':''}{(+this.props.weeklyRate*100).toFixed(2)+'%'}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Skeleton>
      </Card>
    )
  }
}