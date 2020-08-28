import React, { useState, useEffect, Fragment } from "react";
import { Input, Button, Icon, Table, Modal, message } from "antd";
import "braft-editor/dist/index.css";
import "./index.scss";
import officialService from "../../../service/officialService";
import AddPreview from "./editor";
const { Search } = Input;
const { confirm } = Modal;

export default () => {
  let [addFlag, setAddFlag] = useState(false);
  const [spanVisible, setSpanVisible] = useState(false);
  let [spanArr, setSpanArr] = useState([""]);
  let [tmpSpanArr, setTmpSpanArr] = useState([""]);
  const [step, setStep] = useState(0);
  const [tableData, settableData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectRow, setSelectRow] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [puData, setPudata] = useState({});
  useEffect(() => {
    officialService.getArtSpan({
      onSuccess: ({ data }: any) => {
        setSpanArr(data.result);
        setTmpSpanArr(data.result);
      }
    });
    officialService.getArtCount({
      params: { category: "article" },
      onSuccess: ({ data }: any) => {
        setPudata(data.result);
      }
    });
  }, []);
  useEffect(() => {
    officialService.getArts({
      params: { page: current, ...(searchKey && { key: searchKey }) },
      onSuccess: ({ data }: any) => {
        if (data.result instanceof Array) {
          settableData(data.result);
          setTotal(data.total_number);
        } else {
          settableData([]);
          setTotal(0);
        }
      }
    });
  }, [step, current, searchKey]);
  const addArt = () => {
    setSelectRow({});
    setAddFlag(true);
  };
  const upArt = (index: number) => {
    let obj = tableData[index];
    officialService.getArtById({
      params: { id: obj["article_id"] },
      onSuccess: ({ data }: any) => {
        let select = data.result;
        select.id = obj["article_id"];
        setSelectRow(data.result);
        setAddFlag(true);
      }
    });
  };
  const delArt = (index: number) => {
    let article_id = tableData[index]["article_id"];
    confirm({
      title: "提示",
      content: "你确定要删除此文章吗",
      onOk() {
        officialService.delArt({
          params: {
            id: article_id
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
  const addSpan = () => {
    setSpanVisible(true);
  };

  const handleOk = () => {
    let arr = spanArr.filter(item => item !== "");

    officialService.upArtSpan({
      params: {
        tags: arr
      },
      onSuccess: ({ data }: any) => {
        setSpanArr(arr);
        setTmpSpanArr(arr);
        setSpanVisible(false);
        message.success("标签修改成功");
      }
    });
  };
  const handelCancel = () => {
    setSpanArr(tmpSpanArr);
    setSpanVisible(false);
  };
  const spanDel = (index: number) => {
    console.log(index);
    let arr = [...spanArr];
    arr.splice(index, 1);
    setSpanArr(arr);
  };
  const addItem = () => {
    let arr = [...spanArr];
    arr.push("");
    setSpanArr(arr);
  };
  const changeSpan = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let arr = [...spanArr];
    arr[index] = e.target.value;
    setSpanArr(arr);
  };
  const goback = () => {
    setAddFlag(false);
    setStep(x => x + 1);
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
  const searchArt = (value: string) => {
    setCurrent(1);
    setSearchKey(value);
  };
  return (
    <div className="article">
      {!addFlag ? (
        <Fragment>
          <div className="a-title">数据总览</div>
          <Preview puData={puData} />
          <div className="a-title">文章管理</div>
          <TableWrap
            addArt={addArt}
            addSpan={addSpan}
            tableData={tableData}
            delArt={delArt}
            upArt={upArt}
            total={total}
            current={current}
            tableChange={tableChange}
            searchArt={searchArt}
          />
          <Modal
            title="添加搜索标签"
            visible={spanVisible}
            onOk={handleOk}
            onCancel={handelCancel}
          >
            {spanArr.map((item, index) => {
              return (
                <div style={{ marginBottom: "10px" }} key={index}>
                  <span style={{ lineHeight: "30px", marginRight: "10px" }}>
                    #标签
                  </span>
                  <Input
                    style={{ width: "60%" }}
                    addonAfter={
                      <Icon type="close" onClick={() => spanDel(index)} />
                    }
                    defaultValue={item}
                    onChange={e => changeSpan(e, index)}
                    value={item}
                  />
                </div>
              );
            })}
            <Button
              type="dashed"
              style={{ width: "60%", marginLeft: "46px" }}
              onClick={addItem}
            >
              <Icon type="plus" /> 新增标签
            </Button>
          </Modal>
        </Fragment>
      ) : (
        <Fragment>
          <div className="a-title">新增文章</div>
          <AddPreview goback={goback} spanArr={spanArr} selectRow={selectRow} />
        </Fragment>
      )}
    </div>
  );
};
const Preview = (props: any) => {
  return (
    <div className="a-preview">
      <div className="a-preview-item">
        <div className="num">{props.puData.total_uv}</div>
        <div className="desc">文章阅读人数</div>
        <div className="bo"></div>
      </div>
      <div className="a-preview-item">
        <div className="num">{props.puData.total_pv}</div>
        <div className="desc">文章阅读次数</div>
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
const TableWrap = (props: any) => {
  const columns = [
    {
      title: "序号",
      render: (text: any, record: any, index: any) =>
        `${(props.current - 1) * 5 + index + 1}`,
      key: "index"
    },
    {
      title: "标题",
      dataIndex: "title"
    },
    {
      title: "添加时间",
      dataIndex: "create_time"
    },
    {
      title: "标签",
      dataIndex: "tag",
      render: (text: any, record: any, index: any) => {
        let str = "";
        text.forEach((element: any) => {
          str += `#${element} `;
        });
        return str;
      }
    },
    {
      title: "操作",
      render: (text: any, record: any, index: any) => (
        <span style={{ color: "#1890FF" }}>
          <span
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={event => {
              props.upArt(index);
            }}
          >
            编辑
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={event => {
              props.delArt(index);
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
        <Search
          style={{ width: "224px" }}
          placeholder="关键字搜索"
          onSearch={value => props.searchArt(value)}
          enterButton
        />
        <Button
          style={{ marginLeft: "20px" }}
          type="primary"
          onClick={props.addSpan}
        >
          添加标签
        </Button>
        <Button
          style={{ marginLeft: "20px" }}
          type="primary"
          onClick={props.addArt}
        >
          <Icon type="plus" className="big-icon-font" />
          新增文章
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
          defaultPageSize: 5,
          showTotal: (total: number) => `总计:${total}条`
        }}
      ></Table>
    </div>
  );
};
