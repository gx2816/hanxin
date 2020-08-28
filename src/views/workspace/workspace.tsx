import React from "react";
import { Row, Col, DatePicker, Button, Radio } from "antd";
import moment from "moment";
import TotalDay from "./components/totalDay";
import TotalMonth from "./components/totalMonth";
import DayIncome from "./components/dayIncome";
import WeekToal from "./components/weekToal";
import WeekByApps from "./components/weekByApps";
import Cake1 from "./components/cake";
import orderService from "../../service/orderService";
import workService from "../../service/workService";
import { starTask } from "../../utils/task";
import { getBeforeDay, getMonthFirstDay } from "../../utils/tool";
const { RangePicker } = DatePicker;
require("./workspace.css");
interface IProps {
  history: any;
}
export default class SiderDemo extends React.Component<IProps, {}> {
  public timeTask: any = undefined;
  public taskFlag = false;
  state = {
    startDate: "",
    endDate: "",
    totalIncome: 0,
    dailyRate: 0,
    weeklyRate: 0,
    monthIncome: 0,
    appsPillarData: [],
    appsAllSalesData: [],
    appsSelfSalesData: [],
    appBinData: [{}, {}, {}, {}],
    loading: true,
    mode: "current",
    goodTime: ""
  };
  constructor(props: any) {
    super(props);
    this.download = this.download.bind(this);
  }
  componentDidMount() {
    this.connetReq();
  }
  componentWillUnmount() {
    clearInterval(this.timeTask);
  }
  timerStart = () => {
    this.timeTask = setInterval(() => {
      //判断是否是半点
      if (new Date().getMinutes() !== 30) {
        this.taskFlag = false;
        return;
      }
      if (this.taskFlag) {
        return;
      }
      this.taskFlag = true;
      if (this.state.mode === "current") {
        this.connetReq();
      }
    }, 1000);
  };
  timerEnd = () => {
    clearInterval(this.timeTask);
  };
  async connetReq() {
    Promise.all([
      this.getBeforeIncome(),
      this.getMonthIncome(),
      this.getAppsBeforeIncome(),
      this.getAppsSevenIncome()
    ])
      .then(res => {
        this.setState(
          {
            loading: false,
            goodTime: new Date(+new Date() - 1000 * 60 * 30).getHours()
          },
          () => {
            this.timerStart();
          }
        );
      })
      .catch(err => {
        this.setState({
          loading: false,
          goodTime: new Date(+new Date() - 1000 * 60 * 30).getHours()
        });
      });
  }
  async getBeforeIncome(): Promise<any> {
    return new Promise((res, rej) => {
      let dateParam =
        this.state.mode === "current" ? getBeforeDay(0) : getBeforeDay(1);
      workService.getBeforeIncome({
        params: {
          start_date: dateParam,
          end_date: dateParam
        },
        onSuccess: ({ data }: any) => {
          this.setState(
            {
              totalIncome: (data.total_income * 100) / 10000,
              dailyRate: data.daily_rate,
              weeklyRate: data.weekly_rate
            },
            () => {
              res(true);
            }
          );
        },
        onError: (err: any) => {
          res(true);
        }
      });
    });
  }
  async getMonthIncome(): Promise<any> {
    return new Promise((res, rej) => {
      let dateParam = getMonthFirstDay();
      workService.getBeforeIncome({
        params: {
          start_date: dateParam,
          end_date:
            this.state.mode === "current" ? getBeforeDay(0) : getBeforeDay(1)
        },
        onSuccess: ({ data }: any) => {
          this.setState(
            {
              monthIncome: (data.total_income * 100) / 10000
            },
            () => {
              res(true);
            }
          );
        },
        onError: (err: any) => {
          res(true);
        }
      });
    });
  }
  async getAppsBeforeIncome(): Promise<any> {
    let { mode } = this.state;
    let start_date = "",
      end_date = "";
    if (mode === "current") {
      start_date = getBeforeDay(0);
      end_date = getBeforeDay(0);
    }
    return new Promise((res, rej) => {
      workService.getAppsBeforeIncome({
        params: {
          start_date: start_date,
          end_date: end_date,
          interval: "day"
        },
        onSuccess: async ({ data }: any) => {
          let arr1 = await this.countPillar(data[0].products);
          let arr2: any = await this.countBin(data[0].products);
          if (arr1 && arr2) {
            this.setState(
              {
                appsPillarData: arr1,
                appBinData: arr2.length === 0 ? [{}, {}, {}, {}] : arr2
              },
              () => {
                res(true);
              }
            );
          }
        },
        onError: (err: any) => {
          res(true);
        }
      });
    });
  }
  async getAppsSevenIncome(): Promise<any> {
    let { mode } = this.state;
    let start_date = "",
      end_date = "";
    if (mode === "current") {
      start_date = getBeforeDay(0);
      let d1 = +new Date();
      let halfBefore = d1 - 1000 * 60 * 30;
      let halfBeforeDate = new Date(halfBefore);
      end_date = halfBeforeDate.toISOString();
    } else {
      start_date = getBeforeDay(7);
    }
    return new Promise((res, rej) => {
      workService.getAppsBeforeIncome({
        params: {
          start_date: start_date,
          end_date: end_date,
          interval: mode === "current" ? "hour" : "day"
        },
        onSuccess: async ({ data }: any) => {
          let arr1 = await this.countAll(data);
          let arr2 = await this.countApps(data);
          if (arr1 && arr2) {
            this.setState(
              {
                appsAllSalesData: arr1,
                appsSelfSalesData: arr2
              },
              () => {
                res(true);
              }
            );
          }
        },
        onError: (err: any) => {
        
           this.setState(
              {
                appsAllSalesData:[],
               appsSelfSalesData: []
              },
              () => {
                res(true);
              }
            );
        }
      });
    });
  }
  async countApps(data: Array<any>) {
    let { mode } = this.state;
    return new Promise((res, rej) => {
      let formatdata: any[] = [];
      data.forEach(item => {
        let date: any;
        if (mode === "current") {
          date = new Date(item.period_start).getHours();
        } else {
          date = item.period_start.slice(5);
        }
        item.products.forEach((it: any) => {
          let sales = 0;
          it.apps.forEach((at: any) => {
            sales += at.storage_income;
          });
          if (it.name === "线下产品组") {
            let printSales = 0;
            it.apps.forEach((ot: any) => {
              printSales += ot.print_income;
            });
            sales += printSales;
          }
          formatdata.push({
            date: date,
            sales: (sales * 100) / 10000,
            name: it.name
          });
        });
      });
      res(formatdata);
    });
  }
  async countAll(data: Array<any>) {
    let { mode } = this.state;
    return new Promise((res, rej) => {
      let formatdata: any[] = [];
      data.forEach(item => {
        let date;
        if (mode === "current") {
          date = new Date(item.period_start).getHours();
        } else {
          date = item.period_start.slice(5);
        }
        let sales = 0;
        item.products.forEach((it: any) => {
          it.apps.forEach((at: any) => {
            sales += at.storage_income;
          });
          if (it.name === "线下产品组") {
            let printSales = 0;
            it.apps.forEach((ot: any) => {
              printSales += ot.print_income;
            });
            sales += printSales;
          }
        });
        formatdata.push({ date: date, sales: (sales * 100) / 10000 });
      });
      res(formatdata);
    });
  }
  async countPillar(apps: Array<any>) {
    return new Promise((res, rej) => {
      let formatdata: any[] = [];
      apps.forEach(item => {
        if (item.apps.length === 0) {
          formatdata.push({ appName: item.name, sales: 0 });
        } else {
          let sales = 0;
          item.apps.forEach((i: any) => {
            sales += i.storage_income;
          });
          if (item.name === "线下产品组") {
            let printSales = 0;
            item.apps.forEach((ot: any) => {
              printSales += ot.print_income;
            });
            sales += printSales;
          }
          formatdata.push({ appName: item.name, sales: (sales * 100) / 10000 });
        }
      });
      res(formatdata);
    });
  }
  async countBin(apps: Array<any>) {
    return new Promise((res, rej) => {
      let formatdata: any[] = [];
      apps.forEach(item => {
        let arr: any[] = [];
        if (item.show_detailed_income) {
          if (item.name === "线下产品组") {
            item.apps.forEach((it: any) => {
              if (it.storage_income !== 0) {
                arr.push({
                  name: it.name,
                  sales: (it.storage_income * 100) / 10000
                });
              }
            });
            let printSales = 0;
            item.apps.forEach((it: any) => {
              printSales += it.print_income;
            });
            arr.push({ name: "冲印", sales: (printSales * 100) / 10000 });
          } else {
            item.apps.forEach((it: any) => {
              if (it.storage_income !== 0) {
                arr.push({
                  name: it.name,
                  sales: (it.storage_income * 100) / 10000
                });
              }
            });
          }
          formatdata.push({ name: item.name, arr: arr });
        }
      });
      res(formatdata);
    });
  }
  download() {
    orderService.downloadApi({
      params: {
        start_date: this.state.startDate,
        end_date: this.state.endDate
      },
      onSuccess: ({ data }: any) => {
        //创建定时任务
        starTask(data.id);
      }
    });
  }
  onChange = (date: any, dateString: any) => {
    this.setState({
      startDate: dateString[0],
      endDate: dateString[1]
    });
  };
  disabledDate = (time: any) => {
    if (!time) {
    } else {
      return time > moment().add(-1, "d");
    }
  };
  handleModeChange = (e: any) => {
    let mode = e.target.value;
    this.setState({ mode, loading: true }, () => {
      this.connetReq();
    });
  };
  render() {
    return (
      <div>
        <div className="work_download">
          <div className="download_label">
            <img
              src={require("../../assets/data@3x.png")}
              alt="img"
              style={{ height: "32px", width: "32px" }}
            />
            <div className="logo_font">乐骐数据中心</div>
            <div className="choice_mode">
              <Radio.Group
                onChange={this.handleModeChange}
                value={this.state.mode}
              >
                <Radio.Button value="current">实况</Radio.Button>
                <Radio.Button value="previous">昨日</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <div className="download_text">
            <RangePicker
              disabledDate={this.disabledDate as any}
              onChange={this.onChange}
              style={{ marginRight: "12px" }}
            />
            <Button type="primary" onClick={this.download}>
              下载表格
            </Button>
          </div>
        </div>
        <div className="work_tip">
          <div className="tip_font">收入概览</div>
        </div>
        <Row>
          <Col span={12} style={{ paddingRight: "6px" }}>
            <Row>
              <Col span={12}>
                <TotalDay
                  goodTime={this.state.goodTime}
                  mode={this.state.mode}
                  loading={this.state.loading}
                  totalIncome={this.state.totalIncome}
                  dailyRate={this.state.dailyRate}
                  weeklyRate={this.state.weeklyRate}
                />
              </Col>
              <Col span={12}>
                <TotalMonth
                  loading={this.state.loading}
                  monthIncome={this.state.monthIncome}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DayIncome
                  mode={this.state.mode}
                  loading={this.state.loading}
                  appsPillarData={this.state.appsPillarData}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ paddingLeft: "6px" }}>
            <Row>
              <Col span={24}>
                <WeekToal
                  mode={this.state.mode}
                  loading={this.state.loading}
                  appsAllSalesData={this.state.appsAllSalesData}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <WeekByApps
                  mode={this.state.mode}
                  loading={this.state.loading}
                  appsSelfSalesData={this.state.appsSelfSalesData}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="work_tip">
          <div className="tip_font">收入拆分</div>
        </div>
        <Row style={{ marginBottom: "20px" }}>
          {this.state.appBinData.map((item: any, index: number) => {
            return (
              <Col key={index} span={12}>
                <Cake1
                  loading={this.state.loading}
                  index={index}
                  binData={item}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
