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
        path: '/webcomponents/getting-started',
        component: () => import('@docs/getting-started.md'),
      },
      {
        title: '自定义主题',
        titleEn: 'Theme Customization',
        name: 'custom-theme',
        path: '/webcomponents/custom-theme',
        component: () => import('@docs/theme.md'),
      },
      {
        title: '自定义样式',
        titleEn: 'Style Customization',
        name: 'style',
        path: '/webcomponents/style',
        component: () => import('@docs/style.md'),
      },
      // {
      //   title: '最佳实践',
      //   titleEn: 'Starter Kit',
      //   name: 'quick-start',
      //   path: '/webcomponents/quick-start',
      //   component: () => import('@docs/starter.md'),
      // },
      {
        title: '更新日志',
        titleEn: 'CHANGELOG',
        name: 'changelog',
        path: '/webcomponents/changelog',
        component: () => import('@/CHANGELOG.md'),
      },
      {
        title: '组件概览',
        titleEn: 'Overview',
        name: 'overview',
        path: '/webcomponents/overview',
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
        path: '/webcomponents/react',
        component: () => import('@docs/react.md'),
      },
      {
        title: 'Vue',
        name: 'vue',
        path: '/webcomponents/vue',
        component: () => import('@docs/vue.md'),
      },
    ],
  },
  {
    title: 'aigc',
    name: 'aigc',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Chatbot 智能对话',
        name: 'chatbot',
        path: '/webcomponents/components/chatbot',
        component: () => import('tdesign-web-components/chatbot/README.md'),
      },
      {
        title: 'ChatSender 对话输入框',
        name: 'chat-sender',
        path: '/webcomponents/components/chat-sender',
        component: () => import('tdesign-web-components/chat-sender/README.md'),
      },
      {
        title: 'ChatMessage 对话消息体',
        name: 'chat-message',
        path: '/webcomponents/components/chat-message',
        component: () => import('tdesign-web-components/chat-message/README.md'),
      },
      {
        title: 'ChatAction 对话操作',
        name: 'chat-action',
        path: '/webcomponents/components/chat-action',
        component: () => import('tdesign-web-components/chat-action/README.md'),
      },
      {
        title: 'ChatLoading 对话加载',
        name: 'chat-loading',
        path: '/webcomponents/components/chat-loading',
        component: () => import('tdesign-web-components/chat-loading/README.md'),
      },
      {
        title: 'Filecard 文件缩略卡片',
        name: 'filecard',
        path: '/webcomponents/components/filecard',
        component: () => import('tdesign-web-components/filecard/README.md'),
      },
      {
        title: 'Attachments 文件附件',
        name: 'attachments',
        path: '/webcomponents/components/attachments',
        component: () => import('tdesign-web-components/attachments/README.md'),
      },
    ],
    tag: '',
  },
  {
    title: '基础',
    name: 'base',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Button 按钮',
        name: 'button',
        path: '/webcomponents/components/button',
        component: () => import('tdesign-web-components/button/README.md'),
      },
      {
        title: 'Icon 图标',
        name: 'icon',
        path: '/webcomponents/components/icon',
        component: () => import('tdesign-web-components/icon/README.md'),
      },
      {
        title: 'Link 链接',
        name: 'link',
        path: '/webcomponents/components/link',
        component: () => import('tdesign-web-components/link/README.md'),
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
        path: '/webcomponents/components/divider',
        component: () => import('tdesign-web-components/divider/README.md'),
      },
      {
        title: 'Space 间距',
        name: 'space',
        path: '/webcomponents/components/space',
        component: () => import('tdesign-web-components/space/README.md'),
      },
      {
        title: 'Grid 栅格',
        name: 'grid',
        path: '/webcomponents/components/grid',
        component: () => import('tdesign-web-components/grid/README.md'),
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
        path: '/webcomponents/components/affix',
        component: () => import('tdesign-web-components/affix/README.md'),
      },
      {
        title: 'Dropdown 下拉菜单',
        titleEn: 'Dropdown',
        name: 'dropdown',
        path: '/webcomponents/components/dropdown',
        component: () => import('tdesign-web-components/dropdown/README.md'),
      },
      {
        title: 'Menu 导航菜单',
        name: 'menu',
        path: '/webcomponents/components/menu',
        component: () => import('tdesign-web-components/menu/README.md'),
      },
      {
        title: 'Breadcrumb 面包屑',
        name: 'breadcrumb',
        path: '/webcomponents/components/breadcrumb',
        component: () => import('tdesign-web-components/breadcrumb/README.md'),
      },
      {
        title: 'BackTop 回到顶部',
        name: 'backTop',
        path: '/webcomponents/components/backTop',
        component: () => import('tdesign-web-components/back-top/README.md'),
      },
      {
        title: 'Tabs 选项卡',
        name: 'tabs',
        path: '/webcomponents/components/tabs',
        component: () => import('tdesign-web-components/tabs/README.md'),
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
        path: '/webcomponents/components/checkbox',
        component: () => import('tdesign-web-components/checkbox/README.md'),
      },
      {
        title: 'DatePicker 日期选择器',
        name: 'date-picker',
        path: '/webcomponents/components/date-picker',
        component: () => import('tdesign-web-components/date-picker/README.md'),
      },
      {
        title: 'Input 输入框',
        name: 'input',
        path: '/webcomponents/components/input',
        component: () => import('tdesign-web-components/input/README.md'),
      },
      {
        title: 'InputNumber 数字输入框',
        name: 'input-number',
        path: '/webcomponents/components/input-number',
        component: () => import('tdesign-web-components/input-number/README.md'),
      },
      {
        title: 'RangeInput 范围输入框',
        name: 'range-input',
        path: '/webcomponents/components/range-input',
        component: () => import('tdesign-web-components/range-input/README.md'),
      },
      {
        title: 'Select 选择器',
        name: 'select',
        path: '/webcomponents/components/select',
        component: () => import('tdesign-web-components/select/README.md'),
      },
      {
        title: 'SelectInput 筛选器输入框',
        name: 'select-input',
        path: '/webcomponents/components/select-input',
        component: () => import('tdesign-web-components/select-input/README.md'),
      },
      {
        title: 'TagInput 标签输入框',
        name: ' tag-input',
        path: '/webcomponents/components/tag-input',
        component: () => import('tdesign-web-components/tag-input/README.md'),
      },
      {
        title: 'Radio 单选框',
        name: 'radio',
        path: '/webcomponents/components/radio',
        component: () => import('tdesign-web-components/radio/README.md'),
      },
      {
        title: 'Slider 滑块',
        name: 'slider',
        path: '/webcomponents/components/slider',
        component: () => import('tdesign-web-components/slider/README.md'),
      },
      {
        title: 'Switch 开关',
        name: 'switch',
        path: '/webcomponents/components/switch',
        component: () => import('tdesign-web-components/switch/README.md'),
      },
      {
        title: 'Textarea 文本框',
        name: 'textarea',
        path: '/webcomponents/components/textarea',
        component: () => import('tdesign-web-components/textarea/README.md'),
      },
      {
        title: 'Upload 上传',
        name: 'upload',
        path: '/webcomponents/components/upload',
        component: () => import('tdesign-web-components/upload/README.md'),
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
        path: '/webcomponents/components/avatar',
        component: () => import('tdesign-web-components/avatar/README.md'),
      },
      {
        title: 'Badge 徽标',
        name: 'badge',
        path: '/webcomponents/components/badge',
        component: () => import('tdesign-web-components/badge/README.md'),
      },
      {
        title: 'Card 卡片',
        name: 'card',
        path: '/webcomponents/components/card',
        component: () => import('tdesign-web-components/card/README.md'),
      },
      {
        title: 'Collapse 折叠面板',
        name: 'Collapse',
        path: '/webcomponents/components/collapse',
        component: () => import('tdesign-web-components/collapse/README.md'),
      },
      {
        title: 'Tag 标签',
        name: 'tag',
        path: '/webcomponents/components/tag',
        component: () => import('tdesign-web-components/tag/README.md'),
      },
      {
        title: 'Image 图片',
        name: 'image',
        path: '/webcomponents/components/image',
        component: () => import('tdesign-web-components/image/README.md'),
      },
      {
        title: 'List 列表',
        name: 'list',
        path: '/webcomponents/components/list',
        component: () => import('tdesign-web-components/list/README.md'),
      },
      {
        title: 'Tooltip 文字提示',
        name: 'tooltip',
        path: '/webcomponents/components/tooltip',
        component: () => import('tdesign-web-components/tooltip/README.md'),
      },
      {
        title: 'Loading 加载',
        name: 'loading',
        path: '/webcomponents/components/loading',
        component: () => import('tdesign-web-components/loading/README.md'),
      },
      {
        title: 'Progress 进度条',
        name: 'progress',
        path: '/webcomponents/components/progress',
        component: () => import('tdesign-web-components/progress/README.md'),
      },
      {
        title: 'Skeleton 骨架屏',
        name: 'skeleton',
        path: '/webcomponents/components/skeleton',
        component: () => import('tdesign-web-components/skeleton/README.md'),
      },
      {
        title: 'Watermark 水印',
        name: 'watermark',
        path: '/webcomponents/components/watermark',
        component: () => import('tdesign-web-components/watermark/README.md'),
      },
      {
        title: 'Swiper 轮播框',
        name: 'swiper',
        path: '/webcomponents/components/swiper',
        component: () => import('tdesign-web-components/swiper/README.md'),
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
        path: '/webcomponents/components/alert',
        component: () => import('tdesign-web-components/alert/README.md'),
      },
      {
        title: 'Dialog 对话框',
        name: 'dialog',
        path: '/webcomponents/components/dialog',
        component: () => import('tdesign-web-components/dialog/README.md'),
      },
      {
        title: 'Message 全局提示',
        name: 'message',
        path: '/webcomponents/components/message',
        component: () => import('tdesign-web-components/message/README.md'),
      },
      {
        title: 'Notification 消息通知',
        name: 'notification',
        path: '/webcomponents/components/notification',
        component: () => import('tdesign-web-components/notification/README.md'),
      },
      {
        title: 'Popconfirm 气泡确认框',
        name: 'popconfirm',
        path: '/webcomponents/components/popconfirm',
        component: () => import('tdesign-web-components/popconfirm/README.md'),
      },
      {
        title: 'Popup 弹出层',
        name: 'popup',
        path: '/webcomponents/components/popup',
        component: () => import('tdesign-web-components/popup/README.md'),
      },
    ],
  },
];
