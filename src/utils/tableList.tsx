import { Tooltip } from "antd";
import React from "react";

export const orderColumns = [
  {
    title: "日期",
    dataIndex: "date",
    key: "date",
    width: 130,
    fixed: "left"
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="第一次启动该应用的用户">
          新增用户
        </Tooltip>
      );
    },
    dataIndex: "added_users",
    key: "added_users",
    width: 100
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="新增用户当天支付电子单总数">
          日新增已付电子照单
        </Tooltip>
      );
    },
    dataIndex: "added_paid_orders",
    key: "added_paid_orders",
    width: 150
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="当天归属新增用户支付的订单金额总和">
          日新增用户收入
        </Tooltip>
      );
    },
    dataIndex: "added_income",
    key: "added_income",
    width: 130,
    render: (val: any) => <span>{val / 100}</span>
  },
  {
    title: () => {
      return (
        <Tooltip
          placement="top"
          title="当天新增用户下的订单的支付转化率，新增已支付订单数/新增总订单数"
        >
          新增已支付订单/新增用户数
        </Tooltip>
      );
    },
    dataIndex: "added_order_rate",
    key: "added_order_rate",
    width: 130,
    render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
  },
  {
    title: "日新增用户转化",
    children: [
      {
        title: () => {
          return (
            <Tooltip
              placement="top"
              title="当天新增用户中，下单的新增用户数占总新增用户的占比"
            >
              下单
            </Tooltip>
          );
        },
        dataIndex: "added_user_order_rate",
        key: "added_user_order_rate",
        width: 100,
        render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
      },
      {
        title: () => {
          return (
            <Tooltip
              placement="top"
              title="当天新增用户中，有付费的新增用户数占总新增用户的占比"
            >
              付费
            </Tooltip>
          );
        },
        dataIndex: "added_user_paid_rate",
        key: "added_user_paid_rate",
        width: 100,
        render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
      }
    ]
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="当天打开应用的独立用户数">
          活跃用户
        </Tooltip>
      );
    },
    dataIndex: "active_users",
    key: "active_users",
    width: 100
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="活跃用户当天支付单数">
          日活跃已付电子照单
        </Tooltip>
      );
    },
    dataIndex: "active_paid_orders",
    key: "active_paid_orders",
    width: 150
  },
  {
    title: "冲印订单",
    dataIndex: "print_order",
    key: "print_order",
    width: 100
  },
  {
    title: () => {
      return (
        <Tooltip placement="top" title="当天归属活跃用户支付的订单金额总和">
          日活跃用户收入
        </Tooltip>
      );
    },
    dataIndex: "active_income",
    key: "active_income",
    width: 130,
    render: (val: any) => <span>{val / 100}</span>
  },
  {
    title: () => {
      return (
        <Tooltip
          placement="top"
          title="当天活跃用户下的订单的支付转化率，活跃已支付订单数/活跃总订单数"
        >
          活跃已支付订单/活跃用户数
        </Tooltip>
      );
    },
    dataIndex: "active_order_rate",
    key: "active_order_rate",
    render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>,
    width: 130
  },
  {
    title: () => {
      return (
        <Tooltip
          placement="top"
          title="当天活跃用户中，下单的活跃用户数占总活跃用户的占比"
        >
          日活跃用户转化
        </Tooltip>
      );
    },
    // filterDropdown: true,
    // filterIcon: () => {
    //   return (
    //     <Tooltip placement="topRight">
    //         <Icon type="question-circle" theme="twoTone" />
    //     </Tooltip>
    //   )
    // },
    children: [
      {
        title: () => {
          return (
            <Tooltip
              placement="top"
              title="当天活跃用户中，下单的活跃用户数占总活跃用户的占比"
            >
              下单
            </Tooltip>
          );
        },
        dataIndex: "active_user_order_rate",
        key: "active_user_order_rate",
        render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>,
        width: 130
      },
      {
        title: () => {
          return (
            <Tooltip
              placement="top"
              title="当天活跃用户中，有付费的活跃用户数占总活跃用户的占比"
            >
              付费
            </Tooltip>
          );
        },
        dataIndex: "active_user_paid_rate",
        key: "active_user_paid_rate",
        render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
        // width: 'auto',
      }
    ]
  }
];
export const specColumns = [
  {
    title: "序号",
    render: (text: any, record: any, index: any) => `${index + 1}`,
    key: "index"
  },
  {
    title: "规格编号",
    dataIndex: "spec_id"
  },
  {
    title: "规格名称",
    dataIndex: "spec_name"
  },
  {
    title: "已付单数",
    dataIndex: "paid_order"
  },
  {
    title: "未付单数",
    dataIndex: "unpaid_order"
  },
  {
    title: "付费转化率",
    dataIndex: "paid_rate",
    render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
  },
  {
    title: "规格订单占比",
    dataIndex: "order_rate",
    render: (val: any) => <span>{(val * 100).toFixed(2) + "%"}</span>
  }
];

export const searchColumns = [
  {
    title: "序号",
    render: (text: any, record: any, index: any) => `${index + 1}`,
    key: "index"
  },
  {
    title: "搜索词",
    dataIndex: "search_name"
  },
  {
    title: "搜索次数",
    dataIndex: "search_number"
  }
];

export const apiColumns = [
  {
    title: "日期",
    dataIndex: "date"
  },
  {
    title: "收入",
    dataIndex: "active_income",
    render: (val: any) => <span>{val / 100}</span>
  }
];
/* export const InquireColumns = [
  {
    title: "产品组",
    dataIndex: "product"
  },
  {
    title: "产品名称",
    dataIndex: "app",
  },
  {
    title: "渠道",
    dataIndex: "channel"
  },
  {
    title: "订单号",
    dataIndex: "order_no"
  },
  {
    title: "订单状态",
    dataIndex: "state"
  },
  {
    title: "创建时间",
    dataIndex: "created_at"
  },
  {
    title: "支付时间",
    dataIndex: "paid_at"
  },
  {
    title: "支付方式",
    dataIndex: "pay_type"
  },
  {
    title: "优惠方式",
    dataIndex: "discount_name"
  },
  {
    title: "优惠金额",
    dataIndex: "discount_price"
  },
  {
    title: "实付价格",
    dataIndex: "price_total"
  },
  {
    title: "操作",
    render: () => (
      <span >
        <a > 详情</a>
      </span>
    ),
    
  }
]; */

export const posterColumns = [
  {
    title: "订单号",
    dataIndex: "order_id",
    key: "order_id"
  },
  {
    title: "支付时间",
    dataIndex: "payment_time"
  },
  {
    title: "手机号",
    dataIndex: "phone"
  },
  {
    title: "数量",
    dataIndex: "number"
  },
  {
    title: "海报编号",
    dataIndex: "poster_id"
  },
  {
    title: "物流公司",
    dataIndex: "express_company"
  },
  {
    title: "快递单号",
    dataIndex: "express_number"
  }
];

export const pocketShopColumns = [
  {
    title: "店铺名称",
    dataIndex: "shop_name",
    key: "shop_name"
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "来源",
    dataIndex: "origin"
  },
  {
    title: "订单数",
    dataIndex: "order_number",
    sorter: (a: any, b: any) => {}
  },
  {
    title: "可提现金额",
    dataIndex: "can_withdraw"
  }
];

export const pocketOrderColumns = [
  {
    title: "店铺名称",
    dataIndex: "shop_name"
  },
  {
    title: "订单号",
    dataIndex: "order_id",
    key: "order_id"
  },
  {
    title: "下单应用",
    dataIndex: "app_name"
  },
  {
    title: "订单状态",
    dataIndex: "order_state"
  },
  {
    title: "注册应用",
    dataIndex: "origin_app"
  }
];
export const financialManagement = [//财管管理
  {
    title: "全选",
    dataIndex: "shop_name",
    key: "order_id"
  },
  {
    title: "产品组",
    dataIndex: "product",
    key: "product"
  },
  {
    title: "产品名称",
    dataIndex: "app"
  },
  {
    title: "渠道",
    dataIndex: "channel"
  },
  {
    title: "订单号",
    dataIndex: "order_no"
  },
  {
    title: "交易号",
    dataIndex: "serial_no"
  },
  {
    title: "退款状态",
    dataIndex: "state"
  },
  {
    title: "创建时间",
    dataIndex: "created_at"
  },
  {
    title: "支付时间",
    dataIndex: "origin_app"
  },
  {
    title: "交易方式",
    dataIndex: "part_at"
  },
  {
    title: "实付金额",
    dataIndex: "price_total"
  },
  {
    title: "退款说明",
    dataIndex: "reason"
  },
  {
    title: "退款截图",
    dataIndex: "origin_app",
    render:() => (
      <span>图片</span>
    )
  },
  {
    title: "操作",
    dataIndex: "origin_app",
    render:() => (
      <span>退款</span>
    )
  },
];
