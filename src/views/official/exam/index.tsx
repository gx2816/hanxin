import React, { useState, useEffect } from "react";
import { Button, Icon, Table, Radio, Form, DatePicker, Modal } from "antd";
import moment from "moment";
import "./index.scss";
import ModelToExamInfo from "./form";
import officialService from "../../../service/officialService";
const { MonthPicker } = DatePicker;
const { confirm } = Modal;
export default () => {
  const [addVisible, setAddVisible] = useState(false);
  const [category, setCategory] = useState([{}]);
  const [mode, setMode] = useState("all");
  const [current, setCurrent] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState(0);
  const [schedule, setSchedule] = useState("");
  const [selectRow, setSelectRow] = useState({});
  const [puData, setPudata] = useState({});
  useEffect(() => {
    officialService.getCates({
      onSuccess: ({ data }: any) => {
        let arr: any = [];
        data.result.forEach((element: any) => {
          let key: { value: string; label: string }[] = [];
          if (element.second_category) {
            element.second_category.forEach((item: string) => {
              key.push({ value: item, label: item });
            });
          }
          arr.push({
            value: element.first_category,
            label: element.first_category,
            children: key
          });
        });
        setCategory(arr);
      }
    });
    officialService.getArtCount({
      params: { category: "news" },
      onSuccess: ({ data }: any) => {
        setPudata(data.result);
      }
    });
  }, []);
  useEffect(() => {
    officialService.getExam({
      params: {
        page: current,
        ...(mode === "hot" && { is_hot: 1 }),
        ...(schedule && { schedule })
      },
      onSuccess: ({ data }: any) => {
        if (data.result instanceof Array) {
          setTableData(data.result);
          setTotal(data.total_number);
        } else {
          setTableData([]);
          setTotal(0);
        }
      }
    });
  }, [step, current, schedule, mode]);
  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };
  const formOnValuesChange = (
    props: any,
    changedValues: any,
    allValues: any
  ) => {};
  const WrappedModelToExamInfo = Form.create({
    name: "modelToExamInfo",
    mapPropsToFields(props) {
      if (!props.selectRow.info_id) return;
      return {
        test_name: Form.createFormField({
          ...props.test_name,
          value: props.test_name
        }),
        "add-spin": Form.createFormField({
          ...props.is_hot,
          value: props.is_hot ? ["hot"] : []
        }),
        "choice-cate": Form.createFormField({
          ...props.first_category,
          value: [props.first_category, props.second_category]
        }),
        application_time: Form.createFormField({
          ...props.application_time,
          value: props.application_time
        }),
        test_time: Form.createFormField({
          ...props.test_time,
          value: props.test_time
        }),
        official_source: Form.createFormField({
          ...props.official_source,
          value: props.official_source
        }),
        application_entrance: Form.createFormField({
          ...props.application_entrance,
          value: props.application_entrance
        }),
        "data-schedule": Form.createFormField({
          ...props.schedule,
          value: moment(props.schedule, "YYYY-MM")
        }),
        register_guide: Form.createFormField({
          ...props.register_guide,
          value: props.register_guide
        })
      };
    },
    onValuesChange: formOnValuesChange
  })(ModelToExamInfo);
  const upExam = (index: number) => {
    let obj = tableData[index];
    setSelectRow(obj);
    setAddVisible(true);
  };
  const delExam = (index: number) => {
    let info_id = tableData[index]["info_id"];
    confirm({
      title: "提示",
      content: "你确定要删除此资讯吗",
      onOk() {
        officialService.delExam({
          params: {
            id: info_id
          },
          onSuccess: ({ data }: any) => {
            if (data.code === 200) {
              setStep(x => x + 1);
            }
          }
        });
      }
    });
  };
  const tableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setCurrent(pagination.current);
    setStep(x => x + 1);
  };
  const monthChange = (date: any, dateString: any) => {
    setCurrent(1);
    setSchedule(dateString);
  };
  return (
    <div className="exam">
      <div className="a-title">数据总览</div>
      <Preview puData={puData} />
      <div className="a-title">信息管理</div>
      <TableWrap
        handleModeChange={handleModeChange}
        mode={mode}
        addExamInfo={() => {
          setSelectRow({});
          setAddVisible(true);
        }}
        upExam={upExam}
        delExam={delExam}
        tableData={tableData}
        current={current}
        tableChange={tableChange}
        total={total}
        monthChange={monthChange}
      />
      <WrappedModelToExamInfo
        addVisible={addVisible}
        selectRow={selectRow}
        {...selectRow}
        category={category}
        closeForm={() => {
          setAddVisible(false);
        }}
        upForm={() => {
          setAddVisible(false);
          setStep(x => x + 1);
        }}
      />
    </div>
  );
};

const Preview = (props: any) => {
  return (
    <div className="a-preview">
      <div className="a-preview-item">
        <div className="num">{props.puData.total_uv}</div>
        <div className="desc">总点击人数</div>
        <div className="bo"></div>
      </div>
      <div className="a-preview-item-plus">
        <div className="num">{props.puData.day_pv}</div>
        <div className="desc">单日</div>
        <div className="bo-plus">
          <span className="lc">PV（累计）</span>
          <span className="rc">{props.puData.total_pv}</span>
        </div>
      </div>
      <div className="a-preview-item-plus">
        <div className="num">{props.puData.day_uv}</div>
        <div className="desc">单日</div>
        <div className="bo-plus">
          <span className="lc">UV（累计）</span>
          <span className="rc">{props.puData.total_uv}</span>
        </div>
      </div>
    </div>
  );
};
interface iTableWrap {
  handleModeChange: (e: any) => void;
  addExamInfo: (e: any) => void;
  mode: String;
  upExam: (index: number) => void;
  delExam: (index: number) => void;
  tableData: Array<Object>;
  current: number;
  tableChange: (pagination: any, filters: any, sorter: any, extra: any) => void;
  total: number;
  monthChange: (date: any, dateString: any) => void;
}
const TableWrap = (props: iTableWrap) => {
  const columns = [
    {
      title: "序号",
      render: (text: any, record: any, index: any) =>
        `${(props.current - 1) * 10 + index + 1}`,
      key: "index"
    },
    {
      title: "考试名称",
      dataIndex: "test_name"
    },
    {
      title: "报名时间",
      dataIndex: "application_time"
    },
    {
      title: "考试时间",
      dataIndex: "test_time"
    },
    {
      title: "官方来源",
      dataIndex: "official_source"
    },
    {
      title: "报名入口",
      dataIndex: "application_entrance"
    },
    {
      title: "考试指南",
      dataIndex: "register_guide",
      width: 200,
      ellipsis: true
    },
    {
      title: "操作",
      render: (text: any, record: any, index: any) => (
        <span style={{ color: "#1890FF" }}>
          <span
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={event => {
              props.upExam(index);
            }}
          >
            编辑
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={event => {
              props.delExam(index);
            }}
          >
            删除
          </span>
        </span>
      )
    }
  ];
  return (
    <div className="art-table-wrap" style={{ padding: "20px" }}>
      <div>
        <Radio.Group onChange={props.handleModeChange} value={props.mode}>
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="hot">热门</Radio.Button>
        </Radio.Group>
        <MonthPicker
          style={{ marginLeft: "20px" }}
          onChange={props.monthChange}
          placeholder="选择考试月份"
        />
        <Button
          style={{ marginLeft: "20px" }}
          type="primary"
          onClick={props.addExamInfo}
        >
          <Icon type="plus" className="big-icon-font" />
          新增信息
        </Button>
      </div>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={props.tableData}
        onChange={props.tableChange}
        pagination={{
          current: props.current,
          total: props.total,
          defaultPageSize: 10,
          showTotal: (total: number) => `总计:${total}条`
        }}
      ></Table>
    </div>
  );
};
