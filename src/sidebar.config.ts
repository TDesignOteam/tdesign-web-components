export default [
  {
    title: '基础',
    name: 'base',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Button 按钮',
        name: 'button',
        path: '#/components/button',
        component: () => import('@/components/button/README.md'),
      },
      {
        title: 'Icon 图表',
        name: 'icon',
        path: '#/components/icon',
        component: () => import('@/components/icon/README.md'),
      },
    ],
    tag: '',
  },
  {
    title: '导航',
    name: 'navigation',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Menu 导航菜单',
        name: 'menu',
        path: '#/components/menu',
        component: () => import('@/components/menu/README.md'),
      },
      {
        title: 'Breadcrumb 面包屑',
        name: 'breadcrumb',
        path: '#/components/breadcrumb',
        component: () => import('@/components/breadcrumb/README.md'),
      },
    ],
  },
  {
    title: '输入',
    name: 'Forms',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Select 选择器',
        name: 'select',
        path: '#/components/select',
        component: () => import('@/components/select/README.md'),
      },
      {
        title: 'Switch 开关',
        name: 'switch',
        path: '#/components/switch',
        component: () => import('@/components/switch/README.md'),
      },
    ],
  },
  {
    title: '数据展示',
    name: 'Data',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Calendar 日历',
        name: 'calendar',
        path: '#/components/calendar',
        component: () => import('@/components/calendar/README.md'),
      },
      {
        title: 'Table 表格',
        name: 'table',
        path: '#/components/table',
        component: () => import('@/components/table/README.md'),
      },
      {
        title: 'Tag 标签',
        name: 'tag',
        path: '#/components/tag',
        component: () => import('@/components/tag/README.md'),
      },
    ],
  },
  {
    title: '消息提醒',
    name: 'Notifications',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Message 全局提示',
        name: 'message',
        path: '#/components/message',
        component: () => import('@/components/message/README.md'),
      },
    ],
  },
];
