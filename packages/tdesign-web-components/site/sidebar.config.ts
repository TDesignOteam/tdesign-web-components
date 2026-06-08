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
        path: '/web-components/getting-started',
        component: () => import('@docs/getting-started.md'),
      },
      {
        title: '自定义主题',
        titleEn: 'Theme Customization',
        name: 'custom-theme',
        path: '/web-components/custom-theme',
        component: () => import('@docs/theme.md'),
      },
      // {
      //   title: '最佳实践',
      //   titleEn: 'Starter Kit',
      //   name: 'quick-start',
      //   path: '/web-components/quick-start',
      //   component: () => import('@docs/starter.md'),
      // },
      {
        title: '更新日志',
        titleEn: 'CHANGELOG',
        name: 'changelog',
        path: '/web-components/changelog',
        component: () => import('../../../CHANGELOG.md'),
      },
      {
        title: '组件概览',
        titleEn: 'Overview',
        name: 'overview',
        path: '/web-components/overview',
        component: () => import('@common/docs/web/overview.md'),
      },
    ],
  },
  {
    title: '框架使用',
    name: 'frame',
    type: 'doc',
    children: [
      {
        title: 'React',
        name: 'react',
        path: '/web-components/react',
        component: () => import('@docs/react.md'),
      },
      {
        title: 'Vue',
        name: 'vue',
        path: '/web-components/vue',
        component: () => import('@docs/vue.md'),
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
        path: '/web-components/components/button',
        component: () => import('@tdesign/web-components/button/README.md'),
      },
      {
        title: 'Icon 图标',
        name: 'icon',
        path: '/web-components/components/icon',
        component: () => import('@tdesign/web-components/icon/README.md'),
      },
      {
        title: 'Link 链接',
        name: 'link',
        path: '/web-components/components/link',
        component: () => import('@tdesign/web-components/link/README.md'),
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
        path: '/web-components/components/divider',
        component: () => import('@tdesign/web-components/divider/README.md'),
      },
      {
        title: 'Space 间距',
        name: 'space',
        path: '/web-components/components/space',
        component: () => import('@tdesign/web-components/space/README.md'),
      },
      {
        title: 'Grid 栅格',
        name: 'grid',
        path: '/web-components/components/grid',
        component: () => import('@tdesign/web-components/grid/README.md'),
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
        title: 'Affix 固钉',
        name: 'menu',
        path: '/web-components/components/affix',
        component: () => import('@tdesign/web-components/affix/README.md'),
      },
      {
        title: 'Dropdown 下拉菜单',
        titleEn: 'Dropdown',
        name: 'dropdown',
        path: '/web-components/components/dropdown',
        component: () => import('@tdesign/web-components/dropdown/README.md'),
      },
      {
        title: 'Menu 导航菜单',
        name: 'menu',
        path: '/web-components/components/menu',
        component: () => import('@tdesign/web-components/menu/README.md'),
      },
      {
        title: 'Breadcrumb 面包屑',
        name: 'breadcrumb',
        path: '/web-components/components/breadcrumb',
        component: () => import('@tdesign/web-components/breadcrumb/README.md'),
      },
      {
        title: 'BackTop 回到顶部',
        name: 'backTop',
        path: '/web-components/components/backTop',
        component: () => import('@tdesign/web-components/back-top/README.md'),
      },
      {
        title: 'Tabs 选项卡',
        name: 'tabs',
        path: '/web-components/components/tabs',
        component: () => import('@tdesign/web-components/tabs/README.md'),
      },
    ],
  },
  {
    title: '输入',
    name: 'Forms',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Checkbox 多选框',
        name: 'checkbox',
        path: '/web-components/components/checkbox',
        component: () => import('@tdesign/web-components/checkbox/README.md'),
      },
      {
        title: 'DatePicker 日期选择器',
        name: 'date-picker',
        path: '/web-components/components/date-picker',
        component: () => import('@tdesign/web-components/date-picker/README.md'),
      },
      {
        title: 'Input 输入框',
        name: 'input',
        path: '/web-components/components/input',
        component: () => import('@tdesign/web-components/input/README.md'),
      },
      {
        title: 'InputNumber 数字输入框',
        name: 'input-number',
        path: '/web-components/components/input-number',
        component: () => import('@tdesign/web-components/input-number/README.md'),
      },
      {
        title: 'RangeInput 范围输入框',
        name: 'range-input',
        path: '/web-components/components/range-input',
        component: () => import('@tdesign/web-components/range-input/README.md'),
      },
      {
        title: 'Select 选择器',
        name: 'select',
        path: '/web-components/components/select',
        component: () => import('@tdesign/web-components/select/README.md'),
      },
      {
        title: 'SelectInput 筛选器输入框',
        name: 'select-input',
        path: '/web-components/components/select-input',
        component: () => import('@tdesign/web-components/select-input/README.md'),
      },
      {
        title: 'TagInput 标签输入框',
        name: ' tag-input',
        path: '/web-components/components/tag-input',
        component: () => import('@tdesign/web-components/tag-input/README.md'),
      },
      {
        title: 'Radio 单选框',
        name: 'radio',
        path: '/web-components/components/radio',
        component: () => import('@tdesign/web-components/radio/README.md'),
      },
      {
        title: 'Slider 滑块',
        name: 'slider',
        path: '/web-components/components/slider',
        component: () => import('@tdesign/web-components/slider/README.md'),
      },
      {
        title: 'Switch 开关',
        name: 'switch',
        path: '/web-components/components/switch',
        component: () => import('@tdesign/web-components/switch/README.md'),
      },
      {
        title: 'Textarea 文本框',
        name: 'textarea',
        path: '/web-components/components/textarea',
        component: () => import('@tdesign/web-components/textarea/README.md'),
      },
      {
        title: 'Upload 上传',
        name: 'upload',
        path: '/web-components/components/upload',
        component: () => import('@tdesign/web-components/upload/README.md'),
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
        path: '/web-components/components/avatar',
        component: () => import('@tdesign/web-components/avatar/README.md'),
      },
      {
        title: 'Badge 徽标',
        name: 'badge',
        path: '/web-components/components/badge',
        component: () => import('@tdesign/web-components/badge/README.md'),
      },
      {
        title: 'Card 卡片',
        name: 'card',
        path: '/web-components/components/card',
        component: () => import('@tdesign/web-components/card/README.md'),
      },
      {
        title: 'Collapse 折叠面板',
        name: 'Collapse',
        path: '/web-components/components/collapse',
        component: () => import('@tdesign/web-components/collapse/README.md'),
      },
      {
        title: 'Tag 标签',
        name: 'tag',
        path: '/web-components/components/tag',
        component: () => import('@tdesign/web-components/tag/README.md'),
      },
      {
        title: 'Image 图片',
        name: 'image',
        path: '/web-components/components/image',
        component: () => import('@tdesign/web-components/image/README.md'),
      },
      {
        title: 'List 列表',
        name: 'list',
        path: '/web-components/components/list',
        component: () => import('@tdesign/web-components/list/README.md'),
      },
      {
        title: 'Tooltip 文字提示',
        name: 'tooltip',
        path: '/web-components/components/tooltip',
        component: () => import('@tdesign/web-components/tooltip/README.md'),
      },
      {
        title: 'Loading 加载',
        name: 'loading',
        path: '/web-components/components/loading',
        component: () => import('@tdesign/web-components/loading/README.md'),
      },
      {
        title: 'Progress 进度条',
        name: 'progress',
        path: '/web-components/components/progress',
        component: () => import('@tdesign/web-components/progress/README.md'),
      },
      {
        title: 'Skeleton 骨架屏',
        name: 'skeleton',
        path: '/web-components/components/skeleton',
        component: () => import('@tdesign/web-components/skeleton/README.md'),
      },
      {
        title: 'Watermark 水印',
        name: 'watermark',
        path: '/web-components/components/watermark',
        component: () => import('@tdesign/web-components/watermark/README.md'),
      },
      {
        title: 'Swiper 轮播框',
        name: 'swiper',
        path: '/web-components/components/swiper',
        component: () => import('@tdesign/web-components/swiper/README.md'),
      },
    ],
  },
  {
    title: '消息提醒',
    name: 'Notifications',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Alert 警告提示',
        name: 'alert',
        path: '/web-components/components/alert',
        component: () => import('@tdesign/web-components/alert/README.md'),
      },
      {
        title: 'Dialog 对话框',
        name: 'dialog',
        path: '/web-components/components/dialog',
        component: () => import('@tdesign/web-components/dialog/README.md'),
      },
      {
        title: 'Message 全局提示',
        name: 'message',
        path: '/web-components/components/message',
        component: () => import('@tdesign/web-components/message/README.md'),
      },
      {
        title: 'Notification 消息通知',
        name: 'notification',
        path: '/web-components/components/notification',
        component: () => import('@tdesign/web-components/notification/README.md'),
      },
      {
        title: 'Popconfirm 气泡确认框',
        name: 'popconfirm',
        path: '/web-components/components/popconfirm',
        component: () => import('@tdesign/web-components/popconfirm/README.md'),
      },
      {
        title: 'Popup 弹出层',
        name: 'popup',
        path: '/web-components/components/popup',
        component: () => import('@tdesign/web-components/popup/README.md'),
      },
    ],
  },
];
