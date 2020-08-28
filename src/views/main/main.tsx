import { Dropdown, Layout, Menu, Icon } from "antd";
import React from "react";
import RouterViewm from "../../utils/router";
import { Link } from "react-router-dom";
import { menuList } from "../../utils/menuList";
import { withRouter } from "react-router-dom";
import Texty from "rc-texty";
import "rc-texty/assets/index.css";
import { delCookie, delSessionStorage } from "../../utils/cookie";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
require("./main.css");
interface IHistory {
  push: (pathname: string) => void;
  replace: (pathname: string) => void;
}
interface ILocation {
  pathname: string;
}
interface IProps {
  location: ILocation;
  history: IHistory;
  handleTag: (item: IMenuItem) => void;
}
interface IMenuItem {
  label: string;
  url?: string;
  children?: IMenuItem[];
  icon: string;
  key: string;
}
class SiderDemo extends React.Component<IProps, {}> {
  state = {
    collapsed: false,
    defaultSelectedKeys: "0",
    openkey: [],
    sideStyle: false,
    currentHeight: 0
  };
  constructor(props: any) {
    super(props);
    let key = this.handleSelect();
    this.state = {
      collapsed: false,
      defaultSelectedKeys: key.select,
      openkey: key.open,
      sideStyle: false,
      currentHeight: document.documentElement.clientHeight
    };
  }
  componentDidMount() {
    this.setState({
      sideStyle: true
    });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  public handleSelect = () => {
    let url: string = this.props.location.pathname;
    let key = { select: "", open: [] };
    let o = this.chHandle(url, key, menuList);
    return o;
  };
  public chHandle = (
    url: any,
    key: { select: any; open: any },
    tab: any,
    temp?: any
  ) => {
    tab.forEach(
      (item: { children: any; url: any; key: any }, index: number) => {
        if (item.children) {
          this.chHandle(url, key, item.children, item);
        } else {
          if (item.url === url) {
            key.select = item.key;
            temp && key.open.push(temp.key);
          }
        }
      }
    );
    return key;
  };
  public handleTag = (item: IMenuItem) => {};
  public logOut = () => {
    delCookie("lq-data-token");
    delSessionStorage("lq-data-token");
    this.props.history.replace("/");
  };
  public onMenuItem = (item: IMenuItem) => {
    this.handleTag(item);
    this.setState({ key: item.key });
  };
  public renderMenu = (menuList: IMenuItem[]): any => {
    return menuList.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} className="big-icon-font" />
                <span>{item.label}</span>
              </span>
            }
          >
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} onClick={() => this.onMenuItem(item)}>
            <Link to={item.url || ""}>
              <Icon type={item.icon} className="big-icon-font" />
              <span>{item.label}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };
  render() {
    // const divStyle = {
    //   height:this.state.sideStyle? this.state.currentHeight:''
    // };
    const menu = (
      <Menu>
        <Menu.Item key="logout" onClick={this.logOut}>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout className="main">
        <Sider
          className="aaa"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo ant-pro-sider-menu-logo">
            <img src={require("../../assets/logo.svg")} alt="img" />
            {/* <h1>乐骐数据中心</h1> */}
            <Texty className="mainText" type={"bounce"} mode={"random"}>
              乐骐数据中心
            </Texty>
            {/* {!this.state.collapsed ? <h1>乐骐数据中心</h1>:<h1></h1>} */}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[this.props.location.pathname]}
            defaultOpenKeys={[...this.state.openkey]}
          >
            {this.renderMenu(menuList)}
          </Menu>
        </Sider>
        <Layout style={{ overflowX: "auto" }}>
          <Header style={{ background: "#fff", padding: 0 }} className="header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <Dropdown overlay={menu} placement="bottomLeft">
              <div className="user">
                <Icon type="user" style={{ marginRight: 5, fontSize: 20 }} />
                <span>用户</span>
              </div>
            </Dropdown>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              // background: '#fff',
              minHeight: 280,
              minWidth: 1000
            }}
          >
            <RouterViewm />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default withRouter(SiderDemo as any);
