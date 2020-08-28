export const menuList = [
  { label: "首页", url: "/main", icon: "home", key: "/main" },
  {
    children: [
      {
        icon: "snippets",
        key: "/main/order",
        label: "订单收入",
        url: "/main/order"
      },
      {
        icon: "snippets",
        key: "/main/api",
        label: "API",
        url: "/main/api"
      },
      {
        icon: "snippets",
        key: "/main/Inquire",
        label: "订单查询",
        url: "/main/Inquire"
      }
    ],
    icon: "book",
    key: "1",
    label: "订单"
  },
  {
    children: [
      {
        label: "财务管理",
        url: "/main/finance/direct",
        icon: "snippets",
        key: "/main/finance/direct"
      },
      {
        label: "退款分析",
        url: "/main/finance/analysis",
        icon: "snippets",
        key: "/main/finance/analysis"
      },
      
    ],
    icon: "dollar",
    key: "2",
    label: "财务"
  },
  {
    children: [
      {
        label: "热门规格",
        url: "/main/spec",
        icon: "snippets",
        key: "/main/spec"
      }
    ],
    icon: "import",
    key: "3",
    label: "规格"
  },
  {
    children: [
      {
        label: "海报订单",
        url: "/main/pocket/poster",
        icon: "snippets",
        key: "/main/pocket/poster"
      },
      {
        label: "店铺信息",
        url: "/main/pocket/shop",
        icon: "snippets",
        key: "/main/pocket/shop"
      },
      {
        label: "相馆订单",
        url: "/main/pocket/order",
        icon: "snippets",
        key: "/main/pocket/order"
      }
    ],
    icon: "shop",
    key: "4",
    label: "相馆"
  },
  {
    children: [
      {
        label: "热门文章",
        url: "/main/official/article",
        icon: "snippets",
        key: "/main/official/article"
      },
      {
        label: "报考资讯",
        icon: "unordered-list",
        key: "l1",
        children: [
          {
            label: "数据总览",
            url: "/main/official/exam",
            icon: "snippets",
            key: "/main/official/exam"
          },
          {
            label: "类目管理",
            url: "/main/official/category",
            icon: "snippets",
            key: "/main/official/category"
          }
        ]
      }
    ],
    icon: "desktop",
    key: "5",
    label: "官网"
  }
];
