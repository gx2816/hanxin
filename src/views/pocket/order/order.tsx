import React, { useState, useEffect } from "react";
import { Card, Table, Row, DatePicker, Button, Select } from "antd";
import { pocketOrderColumns } from "../../../utils/tableList";
import pocketService from "../../../service/pocketService";
import moment from "moment";
const { Option } = Select;
const { RangePicker } = DatePicker;
export default () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [selectApp, setSelectApp] = useState(""); //选中注册应用
  const [selectPayApp, setSelectPayApp] = useState(""); //选中下单应用
  const [tableData, setTableDate] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [appArr, setAppArr] = useState([]);
  const [payAppArr, setPayAppArr] = useState([]);
  const [step, setStep] = useState(0);
  const search = () => {
    pocketService.getOrders({
      params: {
        register_origin: selectApp,
        order_origin: selectPayApp,
        start_time: startDate,
        end_time: endDate,
        page: current
      },
      onSuccess: ({ data }: any) => {
        setTableDate(data.result);
        setTotal(data.total_num);
      }
    });
  };
  useEffect(() => {
    inintData();
  }, []);
  useEffect(() => {
    setCurrent(1);
  }, [selectApp, selectPayApp, startDate]);
  const inintData = () => {
    pocketService.getApps({
      onSuccess: ({ data }: any) => {
        setAppArr(data);
      }
    });
    pocketService.getPayApps({
      onSuccess: ({ data }: any) => {
        setPayAppArr(data);
      }
    });
  };
  const disabledDate = (time: any) => {
    if (!time) {
    } else {
      return time > moment().add(0, "d");
    }
  };
  const onChange = (date: any, dateString: any) => {
    setStartDate(dateString[0]);
    setendDate(dateString[1]);
  };
  useEffect(() => {
    search();
    // eslint-disable-next-line
  }, [step]);
  const tableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setCurrent(pagination.current);
    setStep(x => x + 1);
  };
  return (
    <Card style={{ height: "100%" }}>
      <Row>
        时间:
        <RangePicker
          showTime
          style={{ marginLeft: "12px", width: "400px", marginRight: "12px" }}
          disabledDate={disabledDate as any}
          onChange={onChange}
        />
        注册应用:
        <Select
          showSearch
          allowClear
          style={{ width: "200px", marginLeft: "12px", marginRight: "12px" }}
          placeholder="请选择注册应用"
          optionFilterProp="children"
          onChange={(value: string) => {
            setSelectApp(value);
          }}
          filterOption={(input, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {appArr.map((item: any, index) => {
            return (
              <Option value={item.origin} key={index}>
                {item.app_name}
              </Option>
            );
          })}
        </Select>
        下单应用:
        <Select
          showSearch
          allowClear
          style={{ width: "200px", marginLeft: "12px" }}
          placeholder="请选择下单应用"
          optionFilterProp="children"
          onChange={(value: string) => {
            setSelectPayApp(value);
          }}
          filterOption={(input, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {payAppArr.map((item: any, index) => {
            return (
              <Option value={item} key={index}>
                {item}
              </Option>
            );
          })}
        </Select>
        <Button
          style={{ marginLeft: "12px" }}
          icon="search"
          type="primary"
          onClick={_ => setStep(x => x + 1)}
        >
          查询
        </Button>
      </Row>
      <Table
        style={{ marginTop: "20px" }}
        columns={pocketOrderColumns as any}
        dataSource={tableData}
        bordered
        size="small"
        onChange={tableChange}
        pagination={{
          current: current,
          total: total,
          defaultPageSize: 20,
          showTotal: (total: number) => `总计:${total}条`
        }}
      ></Table>
    </Card>
  );
};
