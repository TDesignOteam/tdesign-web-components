export default [
  {
    title: '开始',
    titleEn: 'Start',
    type: 'doc',
    children: [
      {
        title: '快速开始',
        titleEn: 'Getting Started',
        name: 'getting-started',
        path: '/getting-started',
        component: () => import('@docs/getting-started.md'),
      },
      {
        title: '最佳实践',
        titleEn: 'Starter Kit',
        name: 'quick-start',
        path: '/quick-start',
        component: () => import('@docs/starter.md'),
      },
      // 暂时注释
      // {
      //   title: '更新日志',
      //   titleEn: 'CHANGELOG',
      //   name: 'changelog',
      //   path: '/changelog',
      //   component: () => import('@/CHANGELOG.md'),
      // },
      {
        title: '组件概览',
        titleEn: 'Overview',
        name: 'overview',
        path: '/overview',
        component: () => import('@common/docs/web/overview.md'),
      },
    ],
  },
  {
    title: '基础',
    name: 'base',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Button 按钮',
        name: 'button',
        path: '/components/button',
        component: () => import('tdesign-web-components/button/README.md'),
      },
      {
        title: 'Icon 图标',
        name: 'icon',
        path: '/components/icon',
        component: () => import('tdesign-web-components/icon/README.md'),
      },
    ],
    tag: '',
  },
  {
    title: '布局',
    name: 'layout',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Divider 分割线',
        name: 'divider',
        path: '/components/divider',
        component: () => import('tdesign-web-components/divider/README.md'),
      },
      {
        title: 'Space 间距',
        name: 'space',
        path: '/components/space',
        component: () => import('tdesign-web-components/space/README.md'),
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
        path: '/components/menu',
        component: () => import('tdesign-web-components/menu/README.md'),
      },
      {
        title: 'Breadcrumb 面包屑',
        name: 'breadcrumb',
        path: '/components/breadcrumb',
        // component: () => import('tdesign-web-components/breadcrumb/README.md'),
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
        path: '/components/select',
        // component: () => import('tdesign-web-components/select/README.md'),
      },
      {
        title: 'Slider 滑块',
        name: 'slider',
        path: '/components/slider',
        component: () => import('tdesign-web-components/slider/README.md'),
      },
      {
        title: 'Switch 开关',
        name: 'switch',
        path: '/components/switch',
        component: () => import('tdesign-web-components/switch/README.md'),
      },
      {
        title: 'Textarea 文本框',
        name: 'textarea',
        path: '/components/textarea',
        component: () => import('tdesign-web-components/textarea/README.md'),
      },
    ],
  },
  {
    title: '数据展示',
    name: 'Data',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Avatar 头像',
        name: 'avatar',
        path: '/components/avatar',
        component: () => import('tdesign-web-components/avatar/README.md'),
      },
      {
        title: 'Calendar 日历',
        name: 'calendar',
        path: '/components/calendar',
        // component: () => import('tdesign-web-components/calendar/README.md'),
      },
      {
        title: 'Collapse 折叠面板',
        name: 'Collapse',
        path: '/components/collapse',
        component: () => import('tdesign-web-components/collapse/README.md'),
      },
      {
        title: 'Table 表格',
        name: 'table',
        path: '/components/table',
        // component: () => import('tdesign-web-components/table/README.md'),
      },
      {
        title: 'Tag 标签',
        name: 'tag',
        path: '/components/tag',
        // component: () => import('tdesign-web-components/tag/README.md'),
      },
      {
        title: 'Image 图片',
        name: 'image',
        path: '/components/image',
        component: () => import('tdesign-web-components/image/README.md'),
      },
      {
        title: 'Tooltip 文字提示',
        name: 'tooltip',
        path: '/components/tooltip',
        component: () => import('tdesign-web-components/tooltip/README.md'),
      },
      {
        title: 'Loading 加载',
        name: 'loading',
        path: '/components/loading',
        component: () => import('tdesign-web-components/loading/README.md'),
      },
    ],
  },
  {
    title: '消息提醒',
    name: 'Notifications',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Dialog 对话框',
        name: 'dialog',
        path: '/components/dialog',
        component: () => import('tdesign-web-components/dialog/README.md'),
      },
      {
        title: 'Message 全局提示',
        name: 'message',
        path: '/components/message',
        // component: () => import('tdesign-web-components/message/README.md'),
      },
      {
        title: 'Popup 弹出层',
        name: 'popup',
        path: '/components/popup',
        component: () => import('tdesign-web-components/popup/README.md'),
      },
    ],
  },
];
