import React from "react";
import {
  Input,
  Row,
  Col,
  Form,
  Cascader,
  Checkbox,
  Modal,
  DatePicker
} from "antd";
import officialService from "../../../service/officialService";
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
export default (props: any) => {
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields((err: any, fieldsValue: any) => {
      if (err) {
        return;
      }
      //添加或者修改
      let params = {
        ...(props.selectRow.info_id && { id: props.selectRow.info_id }),
        first_category: fieldsValue["choice-cate"][0],
        second_category: fieldsValue["choice-cate"][1] || "",
        is_hot:
          fieldsValue["add-spin"] && fieldsValue["add-spin"].length === 1
            ? 1
            : 0,
        schedule: fieldsValue["data-schedule"].format("YYYY-MM"),
        ...fieldsValue
      };
      officialService.upExam({
        params,
        onSuccess: ({ data }: any) => {
          Modal.success({
            content: props.selectRow.info_id ? "资讯更新成功" : "资讯添加成功",
            onOk: () => {
              props.upForm();
            }
          });
        }
      });
    });
  };
  return (
    <Modal
      title="添加信息"
      width={800}
      visible={props.addVisible}
      onOk={handleSubmit}
      onCancel={props.closeForm}
    >
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Row>
          <Col span={12}>
            <Form.Item label={`考试名称`}>
              {getFieldDecorator(`test_name`, {
                rules: [
                  {
                    required: true,
                    message: "请输入考试名称!"
                  }
                ]
              })(<Input style={{ width: "200px" }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`添加标签`}>
              {getFieldDecorator(`add-spin`, {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <Checkbox.Group style={{ width: "100%" }}>
                  <Checkbox value="hot">热门</Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={`选择类目`}>
              {getFieldDecorator(`choice-cate`, {
                rules: [
                  {
                    required: true,
                    message: "请选择!"
                  }
                ]
              })(
                <Cascader style={{ width: "200px" }} options={props.category} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`报名时间`}>
              {getFieldDecorator(`application_time`, {
                rules: [
                  {
                    required: true,
                    message: "请输入报名时间!"
                  }
                ]
              })(<Input style={{ width: "200px" }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={`考试时间`}>
              {getFieldDecorator(`test_time`, {
                rules: [
                  {
                    required: true,
                    message: "请输入考试时间!"
                  }
                ]
              })(<Input style={{ width: "200px" }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`官方来源`}>
              {getFieldDecorator(`official_source`, {
                rules: [
                  {
                    required: true,
                    message: "请输入官方来源!"
                  }
                ]
              })(<Input style={{ width: "200px" }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={`报名入口`}>
              {getFieldDecorator(`application_entrance`, {
                rules: [
                  {
                    required: true,
                    message: "请输入报名入口!"
                  }
                ]
              })(<Input style={{ width: "200px" }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`所属月份`}>
              {getFieldDecorator(`data-schedule`, {
                rules: [
                  {
                    required: true,
                    message: "请选择月份"
                  }
                ]
              })(
                <MonthPicker
                  style={{ width: "200px" }}
                  format={"YYYY-MM"}
                  placeholder="选择考试月份"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 3 }} label={`考试指南`}>
              {getFieldDecorator(`register_guide`, {
                rules: [
                  {
                    required: true,
                    message: "请输入考试指南!"
                  }
                ]
              })(<TextArea style={{ width: "100%" }} rows={6} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
