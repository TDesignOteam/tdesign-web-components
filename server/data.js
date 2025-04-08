const chunks = [
  // { type: 'search', title: '开始获取资料…' },
  // { type: 'search', title: '找到 12 篇相关资料...', content: [{ title: 'AI推理模式研究', url: 'https://example.com/ref1' },{ title: 'SSE协议规范', url: 'https://example.com/ref2' }] },
  // { type: 'search', title: '找到 21 篇相关资料...', content: [] },
  { type: 'think', title: '思考中...', content: '嗯，' },
  { type: 'think', title: '思考中...', content: '我现在需' },
  { type: 'think', title: '思考中...', content: '要帮用' },
  { type: 'think', title: '思考中...', content: '户说明一下，' },
  { type: 'think', title: '思考中...', content: '让我先仔细想想，' },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock这是个mock，这是个mock，这是个mock这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  { type: 'think', title: '思考完成（耗时4秒）', content: '重要的事情说三遍' },
  // 自定义插件测试1
  {
    type: 'weather',
    id: 'w11',
    content: '{"temp": 1,"city": "北京","conditions": "多云"}',
  },
  // 图片测试
  {
    type: 'image',
    content:
      '{"url":"https://tdesign.gtimg.com/site/avatar.jpg","format":"png","width":1204,"height":1024,"size":1032}',
  },
  // 测试用例1 - 标题开头被截断
  {
    type: 'text',
    msg: '# Markdown功能测试 \n***加粗且斜体***  \n行内代码: `cons',
  },

  // 测试用例2 - 代码块中间截断
  {
    type: 'text',
    msg: "ole.log('Hello')`\n\n### 代码块测试\n```javascript\nfunction greet(name) {\n  console.log(`Hello, ${name}",
  },

  // 测试用例3 - 列表项截断
  {
    type: 'text',
    msg: "!`);\n}\ngreet('Markdown');\n```\n\n### 列表测试\n- 无序列表项1\n- 无序列表项2\n  - 嵌套列表项\n  - 嵌套列表项\n1. 有序列表项1\n2. 有",
  },

  // 测试用例4 - 表格截断
  {
    type: 'text',
    msg: '序列表项2\n\n### 表格测试\n| 左对齐 | 居中对齐 | 右对齐 |\n| :----- | :------: | -----: |\n| 单元格 |  单元格  | 单元',
  },

  // 测试用例5 - 混合内容截断
  {
    type: 'text',
    msg: '格 |\n| 长文本示例 | 中等长度 |  $100 |\n\n### 其他元素\n> 引用文本块  \n> 多行引用内容\n\n---\n\n分割线测试（上方）\n\n脚注测试[^1]\n\n[^1]: 这里',
  },

  // 测试用例6 - HTML标签截断
  {
    type: 'text',
    msg: '是脚注内容\n\n✅ 任务列表：\n- [ ] 未完成任务\n- [x] 已完成任务\n\nHTML混合测试：\n<br>（需要开启html选项）\n<small>辅助文',
  },
  // 测试用例7 - 链接测试（基本链接）
  {
    type: 'text',
    msg: '### 链接功能测试### \n普通链接示例：\n[【百度】](#promptId=baidu) 是一个常用搜索引擎\n\n带标题链接：\n[【谷歌】](',
  },
  {
    type: 'text',
    msg: '#promptId=google)搜索引擎\n',
  },
  // 测试用例8 - 链接分块测试（链接被截断）
  {
    type: 'text',
    msg: '分块链接测试：\n点击查看[【TDesign】](',
  },
  {
    type: 'text',
    msg: 'http://tdesign.tencent.com) 设计系统',
  },

  // 测试用例10 - 最终结束段
  {
    type: 'text',
    msg: '字</small>\n',
  },
  { type: 'text', msg: '(' },
  { type: 'text', msg: '截至' },
  { type: 'text', msg: '202' },
  { type: 'text', msg: '5' },
  { type: 'text', msg: '年' },
  { type: 'text', msg: '3' },
  { type: 'text', msg: '月' },
  { type: 'text', msg: ')\n\n' },
  { type: 'text', msg: '---\n\n' },
  { type: 'text', msg: ' **' },
  { type: 'text', msg: '三' },
  { type: 'text', msg: '、' },

  { type: 'text', msg: '行业' },

  { type: 'text', msg: '趋势' },

  { type: 'text', msg: '与' },

  { type: 'text', msg: '挑战' },

  { type: 'text', msg: '**\n' },

  { type: 'text', msg: '1' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' **' },

  { type: 'text', msg: '市场' },

  { type: 'text', msg: '分化' },

  { type: 'text', msg: '**' },

  { type: 'text', msg: '  \n' },

  { type: 'text', msg: '  ' },

  { type: 'text', msg: ' -' },

  { type: 'text', msg: ' **' },

  { type: 'text', msg: '流量' },

  { type: 'text', msg: '派' },

  { type: 'text', msg: ' vs' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '演技' },

  { type: 'text', msg: '派' },

  { type: 'text', msg: '**' },

  { type: 'weather', id: 'w3', content: '{"temp": 20,"city": "广州","conditions": "多云"}' },
];

export { chunks };
