export default [
  {
    path: '/',
    component: './home/index',
    title: '首页',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
  },
  { 
    path: '/login', 
    component: './login/index', 
    title: ' 登录' 
  },
  { path: '/sale', 
    title: '核销',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      {
        path: '/sale',
        title: '核销预约号',
        component: './sale/index',
      },
    ]
  },
  { path: '/orderlist', 
    title: '预约号清单',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      {
        path: '/orderlist',
        title: '预约号清单',
        component: './orderlist/index',
      },
    ]
  },
  { path: '/mailpay', 
    title: '付款信息',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      {
        path: '/mailpay',
        title: '付款信息',
        component: './mailpay/index',
      },
    ]
  },
  {
    title: 'exception',
    path: '/exception',
    routes: [
      // Exception
      {
        path: '/exception/403',
        title: 'not-permission',
        component: './exception/403',
      },
      {
        path: '/exception/404',
        title: 'not-find',
        component: './exception/404',
      },
      {
        path: '/exception/500',
        title: 'server-error',
        component: './exception/500',
      },
    ],
  },
  { path: '/404', component: '404' },
];
