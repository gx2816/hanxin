import * as React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import { splid, slideFinishState, setErr, resetSuccess } from '../../tools/splid'
import particlesJS from '../../tools/particles.js'
import particlesJSon from '../../tools/particles.json'
import loginService from '../../service/loginService'
import { setCookie, getCookie, sessionStorage } from '../../utils/cookie'
import {isPc} from '../../utils/tool'
require('./login.css')
const bgsvg = require('../../assets/bg.svg')
var sectionStyle = {
  backgroundImage: `url(${bgsvg})`
};
interface UserFormProps extends FormComponentProps {
  username: string;
  password: string;
  remember: boolean;
  history: any;
  location: any;
}
class login extends React.PureComponent<UserFormProps, {}>{
  // constructor(props:any) {
  //   super(props);
  //   this.loadps();
  // }
  componentWillMount() {
    if(!isPc()){
      this.setState({
        isPC:false
      })
    }
    this.loginTip()
    this.isAutoLogin()
  }
  componentDidMount() {
    this.state.isPC && splid()
    this.loadpartJs()
    // particlesJS.load('particles', particlesJSon)
  }
  componentWillUnmount() {
    // this.rmps()
  }
  loginTip() {
    if (this.props.location.search === '?err=notLogin') {
      message.error('请先登陆');
    }
  }
  loadpartJs() {
    let token = getCookie('lq-data-token')
    !token && particlesJS.load('particles', particlesJSon)
  }
  loadps() {
    const el = document.createElement('script');
    el.src = './animation.js';
    document.body.appendChild(el);
  }
  rmps() {
    let arr = document.getElementsByTagName('script')
    let root = document.getElementsByTagName('body')[0]
    let canvas = document.getElementsByTagName('canvas')[0]
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].src.indexOf('animation') > -1) {
        // root.removeChild(arr[i])
        if (root.hasChildNodes()) {
          root.removeChild(arr[i])
          root.removeChild(canvas)
        }
      }
    }
  }
  isAutoLogin() {
    let token = getCookie('lq-data-token')
    token && this.goLogin(token)
  }
  goLogin(token: string) {
    sessionStorage('lq-data-token', token)
    this.props.history.push('/main')
  }
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(this.state.isPC && !slideFinishState()){
          setErr('请拖动滑块解锁')
          return
        }
        let remember = values.remember  //是否自动登陆
        loginService.login({
          params: {
            email: values.username, 
            password: values.password
          },
          onSuccess: ({ data }: any) => {
            if (remember) {
              //自动登陆
              setCookie('lq-data-token', data.access_token, 30)
            }
            resetSuccess()
            this.goLogin(data.access_token)
          },
          onError: ({ response }: any) => {
            console.log(response)
            setErr(response.data.message)
          }
        })
        
      }
    });
  }
  state = {
    isPC:true,
    username: '',
    password: '',
    remember: false,
    form() { },
  };
  loginForm: any = {}  //主要加这个
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="app" style={sectionStyle}>
        <div id="particles"></div>
        <div className="box">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <div className="title">
              {/* <h1>乐骐数据中心</h1> */}
              <Texty className="loginText">乐骐数据中心</Texty>
            </div>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item style={{ marginBottom: '6px', marginTop: '-10px' }}>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>一周内自动登录</Checkbox>)}
              {this.state.isPC &&
                <div className="drag">
                  <div className="bg"></div>
                  <div className="text">请拖动滑块解锁</div>
                  <div className="btn"></div>
                </div>
              }
            </Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
                登录
                </Button>
            <div className="errr"></div>
          </Form>
        </div>
      </div>
    )

  }

}

const WrappedRegistrationForm = Form.create()(login);
export default WrappedRegistrationForm;