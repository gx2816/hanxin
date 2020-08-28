import React from 'react';
import moment from 'moment';
import base from "../../../utils/base";
import orderService from '../../../service/orderService'
import c2s1 from '../../../utils/test'
import toZip from '../../../utils/jszip'
import { Form, Card, Table, Row, Col, TreeSelect, Select, Button, Input, Modal, Upload, Icon, message,Skeleton,  } from 'antd';


import { FormComponentProps } from 'antd/lib/form';
/* import { InquireColumns } from '../../../utils/tableList' */
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
require('./Inquire.scss')
let InquireImg = require('../../../assets/2.jpg')
var sectionStyle = {
  display:'block',
  height: '700px',
  width: '600px',
  top: '31px',
  right: '100px',
  background: `url(${InquireImg})no-repeat`
};
interface IHistory {
  push: (pathname: string) => void;
  replace: (pathname: string) => void;
 
}
interface IProps extends FormComponentProps{
  history: IHistory;
}


var treeCount = 0;
class SiderDemo extends React.Component<IProps, {}>{
  state = {
    value: '',
    productValue: 'order_no',
    channel: [],
    apps: [],
    searchIn: '',
    tableData: [],
    showMSg: true,
    refund: '',
    returns: '< 返回',
    /* 退款 */
    ModalText: '退款申请',
    visible: false,
    confirmLoading: false,
    form() { },
    TextRevalue: "",
    /* 上传 */
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    files: [],
    formDatas: {},
    reasonsValue: "1",//退款原因
    reasonsArr: [],//退款原因
    orderUrl: "",
    orderurlArr:[],
    imageKey: "",
    loading: true,
    imgload: 0,
    
  }
  InquireColumns: ({ title: string; dataIndex: string; key: string; render?: undefined; } | { title: string; dataIndex: string; render: (val: any) => JSX.Element; key: string; } | { title: string; render: () => JSX.Element; key: string; dataIndex?: undefined; })[];

  constructor(props: any) {
    super(props)
    this.searchChange = this.searchChange.bind(this)
    this.connetOrders = this.connetOrders.bind(this)
    this.InquireDetil = this.InquireDetil.bind(this)
   // this.beforeUpload = this.beforeUpload.bind(this)
    this.InquireColumns = [
      {
        title: "产品组",
        dataIndex: "product",
        key:"product"
      },
      {
        title: "产品名称",
        dataIndex: "app",
        key:"app"
      },
      {
        title: "渠道",
        dataIndex: "channel",
        key:"channel"
      },
      {
        title: "订单号",
        dataIndex: "order_no",
        key:"order_no"
      },
      {
        title: "订单状态",
        dataIndex: "state",
        key:"state"
      },
      {
        title: "创建时间",
        dataIndex: "created_at",
        key:"created_at"
      },
      {
        title: "支付时间",
        dataIndex: "paid_at",
        key:"paid_at"
      },
      {
        title: "支付方式",
        dataIndex: "pay_type",
        key:"pay_type"
      },
      {
        title: "优惠方式",
        dataIndex: "discount_name",
        key:"discount_name"
      },
      {
        title: "优惠金额",
        dataIndex: "discount_price",
        render: (val: any) => <span>{val/100}</span>,
        key:"discount_price"
      },
      {
        title: "实付价格",
        dataIndex: "price_total",
        render: (val: any) => <span>{val/100}</span>,
        key:"reason",  
      },
      {
        title: "操作",
        render: () => (
          <span >
            <a onClick={() => this.InquireDetil(false)}> 详情</a>
          </span>
        ),
        key:"serial_no"
      }
    ];
    
  }
  componentWillMount() {
    
    this.getApps()
    this.getReasons()
    
    // this.getChannels()
  }
  getApps() {//产品
    orderService.getApps({
      onSuccess: ({ data }: any) => {
        this.setState({
          apps: data
        })
      }
    })
  }
  getOrdersdetils = () => {//获取列表
    orderService.getOrdersdetils({
      params: {
        app_id: this.state.value,
        keyword_type: this.state.productValue,
        keyword: this.state.searchIn,
      /*   app_id:133,
        keyword_type:'order_no',
        keyword: 12020240172226728, */
      },
      onSuccess: ({ data }: any) => {
       // console.log(JSON.stringify(data))
        if (data.length === 0) {
          return
        }
        let tableArr=data
        let state=''
       
        state = tableArr[0]['state']
        switch(state){
          case 'waiting':
            state = "待支付";
          break;
          case 'paid':
            state = "已支付";
          break;
          case 'completed':
            state = "已完成";
          break;
          case 'refunding':
            state = "待退款";
          break;
          case 'refunded':
            state = "已退款";
          break;
          default:
            state = "已取消";
          break;
        }
        tableArr[0]['state'] = state
        
        let payType =''
        payType =tableArr[0]['pay_type']
        switch (payType) {
          
          case 'QQ':
            payType = "QQ支付";
          break;
          case 'wechat':
            payType = "微信支付";
          break;
          case 'alipay':
            payType = "支付宝支付";
          break;
          case 'huawei':
            payType = "华为支付";
          break;
          case 'baidu':
            payType = "百度支付";
          break;
          default:
            payType = "苹果支付";
          break;
        }
        tableArr[0]['pay_type'] = payType
        
        this.setState({
          orderUrl:tableArr[0]['order_url'][0]["single"],
          refund:state,
          tableData:tableArr
        })
      }
    })
  };
  getReasons = () => {//退款原因
    orderService.getReasons({
      onSuccess: ({ data }: any) => {
        console.log(data)
        this.setState({
          reasonsArr: data
        })
      }
    })
  };
  /* 申请退款 */
  showModal = () => {

    if (/* this.state.refund == '待支付' || */ this.state.refund ==' 已退款') {
      message.warning(this.state.refund+'订单不可退款');
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  handSure = () => {

    orderService.postOrdersdetils({
      params: {
        app_id:this.state.value,
        order_no:this.state.tableData[0]['order_no'],
        reason_id: this.state.reasonsValue,
        state: 'refunding',
        notes: this.state.TextRevalue,
        image_key: this.state.imageKey,
        image_count:this.state.fileList.length,
       
      },
      onSuccess: ({ data }: any) => {
        message.success('申请退款成功');
        this.setState({
          TextRevalue: "",
          fileList: [],
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          this.getOrdersdetils()
        },1000);
       
      },
      onError: (err: any) => {
        message.success(err);
      }
    })  
  }
  handleOk = (e: any) => {//确认
    e.preventDefault();
    
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.state.fileList.length > 0) {
          var File = new FormData();
          for (let i = 0; i < this.state.fileList.length; i++) {
            //this.putOss()
            var base64: any=this.state.fileList[i]["thumbUrl"]
            var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var bolb = new Blob([u8arr], {type:mime});
            File.append('file'+i, bolb);
          }
          orderService.getImages({
            params: File,
            onSuccess: ({ data }: any) => {
              this.setState({
                imageKey:data.image_key
              })
              this.handSure()
            },
          })
        } else {
          this.handSure()
        }
      
      } else {
        console.log(' of form: ', values);
        return
      }
     
    });
   
  };
  handleCancel = () => {//取消
    console.log('Clicked cancel button');
    this.setState({
      TextRevalue: "",
      fileList: [],
      visible: false,
    });
  };
  TextAreaChange = (e: any) => {
    const { value } = e.target;

    this.setState({
      TextRevalue: value
    })
   
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleSelectChange = (value: any) => {
    
    /*  this.props.form.initialValue({
       note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
     }); */
  };
  /* 上传 */
  getBase64(file: any) {
    return new Promise((resolve: any, reject) => {
        /*  */
      const reader = new FileReader();
      reader.readAsDataURL(file);
     
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  uploadCancel = () => this.setState({ previewVisible: false });

  uploadPreview = async (file: any) => {

    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("图片格式必须是 JPG/PNG ");
    }
    let formData=new FormData()
    formData.append('files', file);
  
    return isJpgOrPng;
    
   // 使用 beforeUpload 會失去在選擇圖片後馬上看到圖片的功能，因此利用FileReader方法來實現預覽效果
    /* let that=this
    that.setState(({fileList})=>({
    fileList:[...fileList,file],
    })) */
  };
  uploadChange = ({ fileList }: any) => {

 
   // console.log(fileList)
    fileList = fileList.filter((v: any, i: any) => {
      if (v.status === "error") {
        message.error('上传图片失败');
      }
      return v.status!=="error"
    })
   
    this.setState({ fileList })
    
  }


  searchChange = (e: any) => {//搜索框
    const { value } = e.target;
    this.setState({
      searchIn: value
    })

  }
  treeApps(apps: any, bol: any) {
    treeCount++
    return apps.map((item: any, index: number) => {
      if (!item.app_id && !bol) {
        return (
          <TreeNode value={''} title={item.name} key='0-1'>
            {this.treeApps(apps.filter((i: any) => i.app_id === item.id), true)}
          </TreeNode>
        )
      }
      if (bol && item.app_id) {
        return (
          <TreeNode value={item.id} title={item.name} key={treeCount + '-' + index}>
            {this.treeApps(this.state.apps.filter((i: any) => i.app_id === item.id), true)}
          </TreeNode>
        )
      }
      return (
        <div key="121"></div>
      )
    })
  }
  onValueChange = (value: any) => {
    this.setState({ value: value });
  }
  handleChange = (value: any) => {
    this.setState({
      productValue: value
    })
  }
  connetOrders = (value: any) => {//查询
    this.getOrdersdetils()
    /* this.setState({
      showMSg: false
    }) */
  }

  InquireDetil = (value: any) => {//详情
    this.setState({
      showMSg: false
    })
		var image = new Image()
		image.src = this.state.orderUrl
    image.onload = () => {
      this.setState({
        loading: false
      })
		}

   
  }
  InquireReturn = (value: any) => {//返回详情
    this.setState({
      showMSg: true
    })
  }


  stringPic = (value: any) => {//电子照
    this.setState({
     // loading: true,
      imgload:0
    })
    var image = new Image()
		image.src = this.state.orderUrl
    image.onload = () => {
      this.setState({
        loading: false,
        orderUrl: this.state.tableData[0]['order_url'][0]["single"],
        orderurlArr: this.state.tableData[0]['order_url'][0],
      })
		}

  }
  originalPic = (value: any) => {//原图
    this.setState({
     // loading: true,
      imgload:1
    })
    var image = new Image()
		image.src = this.state.orderUrl
    image.onload = () => {
      this.setState({
        loading: false,
        orderUrl: this.state.tableData[0]['order_url'][2]["original"],
        orderurlArr:this.state.tableData[0]['order_url'][2]
      })
		}
  }
  printPic = (value: any) => {//排版照

    this.setState({
     // loading: true,
      imgload:2
    })
    var image = new Image()
		image.src = this.state.orderUrl
    image.onload = () => {
      this.setState({
        loading: false,
        orderUrl: this.state.tableData[0]['order_url'][1]["print"],
        orderurlArr:this.state.tableData[0]['order_url'][1]
      })
		}
  }
  onCarousel=()=>{

  }


  uploadOriginal = () => {//下载
    let num = +new Date()

    let imgsrc = `${this.state.orderUrl}&keyword=${num}`
    console.log(num,imgsrc)
    toZip(imgsrc,num)

  }

  render() {
    const { visible, confirmLoading, previewVisible, previewImage, fileList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
   
    return (
  
      this.state.showMSg ? (
        <Card style={{ height: '100%' }}>
        
          <Form className="ant-advanced-search-form" layout="inline">
            <Row>
              <Col span={6}>
                <Form.Item label='产品'>
                  <TreeSelect
                    showSearch
                    treeDefaultExpandAll={false}
                    style={{ width: 300 }}
                    value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择产品"
                    allowClear
                    treeNodeFilterProp={'title'}
                    onChange={this.onValueChange}
                  >

                    {this.treeApps(this.state.apps, false)}
                  </TreeSelect>
                 
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label='查询方式'>
                  <Select
                    value={this.state.productValue}
                    size='default'
                    onChange={this.handleChange}
                    style={{ width: '200px' }}
                    placeholder="请选择查询方式"
                  >
                   
                    <Option value="order_no">订单号</Option>
                    <Option value="serial_no">交易单号</Option>
                    <Option value="user_id">用户id</Option>
                    
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='搜索'>
                  <Input
                    style={{ width: '200px' }}
                    value={this.state.searchIn}
                    onChange={this.searchChange}
                    placeholder="订单号/交易单号/用户id" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button type="primary" htmlType="submit"
                  onClick={this.connetOrders}
                >
                  查询
                </Button>
              
              </Col>
            </Row>
          </Form>
          <Table
            className="order-table"
            style={{ marginTop: '20px' }}
            /* columns={InquireColumns as any} */
            columns={this.InquireColumns}
            dataSource={this.state.tableData}
            bordered
            size="small"
            /*  onChange={this.tableChange} */
         
            scroll={{ x: '1700px' }}
          >
          </Table>
       
        </Card>
      ) :
        <div className="Inquire-less-wrappers">
          
          
          <Button type="primary" ghost className="Inquire-less-returns" onClick={this.InquireReturn}> {this.state.returns} </Button>
          <Card title=" 基本信息" style={{ width: 800, }}>
            <p > 产品组 <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["product"]}</span></p>
            <p>产品名称  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["app"]}</span></p>
            <p>渠道  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["channel"]}</span></p>
            <p>订单号  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["order_no"]}</span></p>
            <p>交易号  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["product"]}</span></p>
            <p>订单状态  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["state"]}</span></p>
            <p>创建时间  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["created_at"]}</span></p>
            <p>支付时间  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["paid_at"]}</span></p>
          </Card>
          <Card title="订单信息" /* extra={<a href="#" className="Inquire-extra">申请退款</a>} */ style={{ width: 800, marginTop: "10px" }}>

            <Button  disabled={this.state.tableData[0]['state'] !=="已支付" ?true:false }  className="Inquire-extra" type="primary" htmlType="submit" onClick={this.showModal}>申请退款 </Button>
            <Modal
              closable={false}
              maskClosable={false}
              title="退款申请"
              visible={visible}
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
            >
              <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} onSubmit={this.handleSubmit}>
                <Form.Item label="退款原因">
                  {getFieldDecorator('退款原因', {
                    rules: [{ required: true, message: '请选择退款的原因' }],
                  })(
                    <Select
                      //value={this.state.reasonsValue}
                      placeholder="请选择退款的原因"
                      onChange={this.handleSelectChange}
                    >
                
                      {this.state.reasonsArr.map((item: any) => {
                        return (
                          <Option value={item.id} key={item.id}>{item.description}</Option>
                        )
                      })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="备注说明">
                  <TextArea
                    value={this.state.TextRevalue}
                    onChange={this.TextAreaChange}
                    placeholder="请填写备注说明（非必填项）"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item> 
              </Form>
              <div className="clearfix">
                <span className="clearfixpic">上传图片</span>
                <Upload
                    multiple={true}
                     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={(file, fileList) => this.beforeUpload(file)}
                    onPreview={this.uploadPreview}
                    onChange={this.uploadChange}
                  >
                    {fileList.length >= 4 ? null : uploadButton}
                  </Upload>
                  <Modal visible={this.state.previewVisible} title={this.state.previewTitle} footer={null} onCancel={this.uploadCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
          
            </Modal>
            <span className="Inquire-extra-msg">{this.state.refund}</span>
            <p>规格 <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["description"]}</span></p>
            <p>增值服务  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["increment"]}</span></p>
            <p>优惠服务  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["discount"]}</span></p>
            <p>应付金额  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["price"]/100}</span></p>
            <p>优惠方式  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["discount_name"]}</span></p>
            <p>优惠金额  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["discount_price"]/100}</span></p>
            <p>实付金额  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["price_total"]/100}</span></p>
            <p>退款原因  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["reason"]}</span></p>
            <p>提取码  <span style={{ position: "absolute", left: "500px" }}> {this.state.tableData[0]["extract_code"]}</span></p>
          </Card>
          <Skeleton loading={this.state.loading} paragraph={{ rows: 20 }} >     
            <img  style={{ position: "absolute", top: "4%", width: 500 + "px", height: "auto", left: " 62%",display:this.state.imgload ===0 ?"block":"none"  }} src={this.state.tableData[0]['order_url'][0]["single"]} alt="电子照" />
            <img style={{ position: "absolute", top: "4%", width: 500+"px",height: "auto", left: " 62%",display:this.state.imgload ===1 ?"block":"none"  }} src={this.state.tableData[0]['order_url'][2]["original"]} alt="原图"/>
            <img style={{ position: "absolute", top: "10%", left: " 53%", width: 700 + "px", height: "auto",display:this.state.imgload ===2 ?"block":"none"  }} src={this.state.tableData[0]['order_url'][1]["print"]} alt="排版照" />
            
          </Skeleton>
         
           {/* (<Carousel style={{ position: "absolute", top: "4%", width: ' 30%', left: " 62%" }} afterChange={this.onCarousel} >
           {this.state.orderurlArr.map((item: any, index) => {
              return (
                <img src={item} alt="订单信息图"/>
              );
            })}           
          </Carousel>):<Carousel style={{ position: "absolute", top: "4%", left: " 62%" }} afterChange={this.onCarousel} >
           { {this.state.orderurlArr.map((item: any, index) => {
              return (
                <img src={item} alt="订单信息图"/>
              );
            })}       }     
          </Carousel> */} 
          <div className="Inquire-button">
            <Button  onClick={this.stringPic}>电子照</Button>
            <Button  onClick={this.originalPic}>原图</Button>
            <Button onClick={this.printPic}>排版照</Button>
            {this.state.orderUrl == this.state.tableData[0]['order_url'][2]["original"] ? (<Button  onClick={this.uploadOriginal} type="primary" htmlType="submit" >下载图片</Button>): <Button type="primary" htmlType="submit"> <a style={{color:' #fff'}} href="http://www.id-photo-verify.com/t2/" target="_blank" >下载图片</a> </Button>}
          
          </div>
          
       
  
        
 
        </div>
    )

  }
}


const WrappedRegistrationForm = Form.create()(SiderDemo);
export default WrappedRegistrationForm;