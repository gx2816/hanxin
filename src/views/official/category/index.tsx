import React, { useState, useEffect } from "react";
import {
  Collapse,
  Tag,
  Button,
  Icon,
  Modal,
  Input,
  Upload,
  message
} from "antd";
import "./index.scss";
import officialService from "../../../service/officialService";
const { confirm } = Modal;
const { Panel } = Collapse;
export default () => {
  let [cateArr, setCateArr] = useState([{}]);
  const [cateOneName, setCateOneName] = useState("");
  const [cateTwoName, setCateTwoName] = useState("");
  const [cateVisible, setCateVisible] = useState(false);
  const [twoVisible, setTwoVisible] = useState(false);
  const [tempOneName, setTempOneName] = useState("");
  const [tempOneKey, setTempOneKey] = useState(0);
  const [step, setStep] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [upLoading, setUpLoading] = useState(false);
  useEffect(() => {
    officialService.getCates({
      onSuccess: ({ data }: any) => {
        setCateArr(data.result);
      }
    });
  }, [step]);
  const renderTags = (item: any) => {
    if (!item.second_category) return;
    return item.second_category.map((k: any, i: any) => {
      return (
        <Tag
          closable
          onClose={() => twoDel(i)}
          key={i}
          style={{
            height: "32px",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          {k}
        </Tag>
      );
    });
  };
  const twoDel = (removedTag: any) => {
    confirm({
      title: "提示",
      content: "你确定要删除此二级类目吗",
      onOk() {
        officialService.twoCates({
          params: {
            action: "del",
            first_category: (cateArr[tempOneKey] as any).first_category,
            second_category: (cateArr[tempOneKey] as any).second_category[
              removedTag
            ]
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
  const genExtra = (index: number) => (
    <span
      style={{ color: "#1890FF" }}
      onClick={event => {
        delOne(index);
        event.stopPropagation();
      }}
    >
      删除
    </span>
  );
  const delOne = (index: number) => {
    confirm({
      title: "提示",
      content: "你确定要删除此一级类目吗",
      onOk() {
        officialService.oneCates({
          params: {
            action: "del",
            category: (cateArr[index] as any).first_category
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
  const handleOk = () => {
    if (!cateOneName || !imageUrl) return;
    officialService.oneCates({
      params: {
        action: "add",
        category: cateOneName,
        icon: imageUrl
      },
      onSuccess: ({ data }: any) => {
        if (data.code === 200) {
          setCateVisible(false);
          setCateOneName("");
          setStep(x => x + 1);
        }
      }
    });
  };
  const handleTwo = () => {
    if (!cateTwoName) return;
    officialService.twoCates({
      params: {
        action: "add",
        first_category: tempOneName,
        second_category: cateTwoName
      },
      onSuccess: ({ data }: any) => {
        if (data.code === 200) {
          setTwoVisible(false);
          setCateTwoName("");
          setTempOneName("");
          setStep(x => x + 1);
        }
      }
    });
  };

  const showTwoModel = (index: number) => {
    console.log(1111)
    console.log((cateArr[index] as any).first_category)
   // setTempOneName((cateArr[index] as any).first_category);
    //setTwoVisible(true);
  };
  const collChange = (key: any) => {
    setTempOneKey(key);
  };
  const uploadButton = (
    <div>
      <Icon type={upLoading ? "loading" : "plus"} />
      <div className="ant-upload-text">上传</div>
    </div>
  );
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("图片格式必须是 JPG/PNG ");
    }
    const isLt2M = file.size / 1024 / 1024 < 0.0625;
    if (!isLt2M) {
      message.error("图片必须小于64kb");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setUpLoading(true);
      return;
    }
    if (info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setUpLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  return (
    <div className="category">
      <div className="a-title">类目管理</div>
      <div className="category-wrap">
        <div>
          <Button
            style={{ marginBottom: "12px" }}
            type="primary"
            ghost
            onClick={() => setCateVisible(true)}
          >
            <Icon type="plus" className="big-icon-font" />
            添加一级类目
          </Button>
          <Collapse accordion onChange={collChange}>
            {cateArr.map((item: any, index) => {
              return (
                <Panel
                  header={
                    <span>
                      <img
                        alt="alt"
                        src={item.icon}
                        style={{
                          width: "23px",
                          height: "23px",
                          marginRight: "10px"
                        }}
                      />
                      <div
                        style={{
                          height: "23px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                      >
                        <span>{item.first_category}</span>
                      </div>
                    </span>
                  }
                  key={index}
                  extra={genExtra(index)}
                >
                  {renderTags(item)}
                  <Button
                    style={{ height: "32px" }}
                    type="primary"
                    onClick={() => showTwoModel(index)}
                  >
                    <Icon type="plus" className="big-icon-font" />
                  </Button>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
      <Modal
        title="添加一级类目"
        visible={cateVisible}
        onOk={handleOk}
        onCancel={() => {
          setCateVisible(false);
          setCateOneName("");
        }}
      >
        <div>
          一级类目名称:
          <Input
            value={cateOneName}
            onChange={e => setCateOneName(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
        >
          <span style={{ marginRight: "40px" }}>类目图标:</span>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="#"
            beforeUpload={(file, fileList) => beforeUpload(file)}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </Modal>
      <Modal
        title="添加二级类目"
        visible={twoVisible}
        onOk={handleTwo}
        onCancel={() => {
          setTwoVisible(false);
          setCateTwoName("");
        }}
      >
        <div>
          二级类目名称:
          <Input
            value={cateTwoName}
            onChange={e => setCateTwoName(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          />
        </div>
      </Modal>
    </div>
  );
};
