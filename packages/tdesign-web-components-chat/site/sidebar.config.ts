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
        path: '/pro-webcomponents/getting-started',
        component: () => import('@docs/getting-started.md'),
      },
      {
        title: '组件概览',
        titleEn: 'Overview',
        name: 'overview',
        path: '/pro-webcomponents/overview',
        component: () => import('@common/docs/web/overview.md'),
      },
    ],
  },
  {
    title: 'AI 对话组件',
    name: 'aigc',
    type: 'component', // 组件文档
    children: [
      {
        title: 'Chatbot 智能对话',
        name: 'chatbot',
        path: '/pro-webcomponents/components/chatbot',
        component: () => import('@tdesign/web-components-chat/chatbot/README.md'),
      },
      {
        title: 'ChatSender 对话输入框',
        name: 'chat-sender',
        path: '/pro-webcomponents/components/chat-sender',
        component: () => import('@tdesign/web-components-chat/chat-sender/README.md'),
      },
      {
        title: 'ChatMessage 对话消息体',
        name: 'chat-message',
        path: '/pro-webcomponents/components/chat-message',
        component: () => import('@tdesign/web-components-chat/chat-message/README.md'),
      },
      {
        title: 'ChatAction 对话操作',
        name: 'chat-action',
        path: '/pro-webcomponents/components/chat-action',
        component: () => import('@tdesign/web-components-chat/chat-action/README.md'),
      },
      {
        title: 'ChatLoading 对话加载',
        name: 'chat-loading',
        path: '/pro-webcomponents/components/chat-loading',
        component: () => import('@tdesign/web-components-chat/chat-loading/README.md'),
      },
      {
        title: 'Filecard 文件缩略卡片',
        name: 'filecard',
        path: '/pro-webcomponents/components/filecard',
        component: () => import('@tdesign/web-components-chat/filecard/README.md'),
      },
      {
        title: 'Attachments 文件附件',
        name: 'attachments',
        path: '/pro-webcomponents/components/attachments',
        component: () => import('@tdesign/web-components-chat/attachments/README.md'),
      },
    ],
    tag: '',
  },
];
