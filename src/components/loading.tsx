import React from 'react';
import { Spin } from 'antd';
// import store from '../store/store'
import actions from '../store/action';
import {connect} from 'react-redux';
function loading({loading}:any) {
  return(
    <div>
      {loading && <div>
        <div style={{position:'fixed',height:'100%',width:'100%',backgroundColor:'#e0e0e0',opacity:0.3,cursor:'not-allowed',zIndex:3}}>
        </div>
        <Spin size="large" style={{position:"fixed",left:'50%',marginLeft:'-27px',top:'50%',marginTop:'-29px',zIndex:4}} tip="加载中..."></Spin>
      </div>}
    </div>
  )
}
export default connect(
  store=>store,
  actions
)(loading);