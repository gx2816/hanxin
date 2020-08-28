import React, { useState, useEffect } from "react";
import BraftEditor from "braft-editor";
import { getBeforeDay } from "../../../utils/tool";
import officialService from "../../../service/officialService";
import { Input, Button, Row, Col, Modal, Checkbox, Icon } from "antd";
interface IProp {
  goback: () => void;
  spanArr: string[];
  selectRow: any;
}
export default (props: IProp) => {
  let [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(props.selectRow.content)
  );
  const [today] = useState(getBeforeDay(0));
  const [title, setTitle] = useState(props.selectRow.title || "");
  const [choiceSpan, setChoiceSpan] = useState(props.selectRow.tag || []);
  const [showView, setShowView] = useState(true);
  const excludeControls = [
    "letter-spacing",
    "line-height",
    "clear",
    "headings",
    "remove-styles",
    "superscript",
    "blockquote",
    "subscript",
    "hr",
    "emoji",
    "code"
  ];
  useEffect(() => {
    console.log(window.document.body.clientWidth);
    if (window.document.body.clientWidth < 1600) {
      console.log("屏幕太小展示不了");
      setShowView(false);
    }
  }, []);
  const handleChange = (editorState: any) => {
    setEditorState(editorState);
  };
  const buildPreviewHtml = () => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #fff;
            }
            .wrap{
              box-sizing: border-box;
              width: 1100px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              overflow: hidden;
              background-color: #fff;
            }
            .detail-tile {
              font-size: 26px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(32, 32, 32, 1);
            }
            .detail-snip {
              margin-top: 22px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(127, 129, 130, 1);
            }
            .detail-snip span {
              margin-right: 10px;
            }
            .container{
              margin-top: 37px;
              margin-bottom:20px;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
              margin-block-start: auto;
              margin-block-end: auto;
            }
            a{
              text-decoration: none;
              color:#1890ff;
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="detail-tile">${title}</div>
            <div class="detail-snip">
              <span>${today}</span>
              <span>###</span>
              <span>###</span>
              <span>###</span>
            </div>
            <div class="container">${editorState.toHTML()}</div>
          </div>
        </body>
      </html>
    `;
  };

  const fullPreview = () => {
    if ((window as any).previewWindow) {
      (window as any).previewWindow.close();
    }

    (window as any).previewWindow = window.open();
    (window as any).previewWindow.document.write(buildPreviewHtml());
    (window as any).previewWindow.document.close();
  };
  const submitArt = () => {
    //新增文章
    let content = editorState.toHTML();
    var reg = /<[^<>]+>/g;
    let filter_content = content.replace(reg, "");
    filter_content.length > 200 &&
      (filter_content = filter_content.substring(0, 199));
    officialService.upArt({
      params: {
        title: title,
        tag: choiceSpan,
        content: content,
        part_content: filter_content,
        id: props.selectRow.id ? props.selectRow.id : 0
      },
      onSuccess: ({ data }: any) => {
        if (data.code === 200) {
          Modal.success({
            content: props.selectRow.id ? "文章更新成功" : "文章添加成功",
            onOk: () => {
              props.goback();
            }
          });
        }
      }
    });
  };
  const checkOnChange = (checkedValues: any) => {
    setChoiceSpan(checkedValues);
  };
  return (
    <div className="add-preview">
      <Button
        type="primary"
        ghost
        style={{ marginBottom: "10px" }}
        onClick={props.goback}
      >
        <Icon type="left" />
        返回
      </Button>
      <Row>
        <Col span={showView ? 12 : 24}>
          <div className="add-title">
            标题:
            <Input
              placeholder="请输入文章标题"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: "400px", marginLeft: "20px" }}
            />
          </div>
          <div className="editor-wrapper">
            <BraftEditor
              value={editorState}
              onChange={handleChange as any}
              excludeControls={excludeControls as any}
              // contentStyle={{ height: "100%" }}
            />
          </div>
          <div className="add-title">
            <span style={{ marginRight: "10px" }}>添加标签:</span>
            <Checkbox.Group
              options={props.spanArr}
              defaultValue={choiceSpan}
              onChange={checkOnChange}
            />
          </div>
          <Button
            style={{ marginTop: "20px", marginRight: "20px" }}
            onClick={fullPreview}
          >
            全屏预览
          </Button>
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={submitArt}
          >
            {props.selectRow.id ? "确认修改" : "确认添加"}
          </Button>
        </Col>
        {showView && (
          <Col span={12}>
            <div>实时预览</div>
            <div className="container">
              <div className="detail-tile">{title}</div>
              <div className="detail-snip">
                <span>{today}</span>
                <span>###</span>
                <span>###</span>
                <span>###</span>
              </div>
              <div
                className="detail-wrap"
                dangerouslySetInnerHTML={{ __html: editorState.toHTML() }}
              ></div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};
