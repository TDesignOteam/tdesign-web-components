const chunks = [
  // 测试用例1 - 标题开头被截断
  {
    type: 'text',
    msg: '我是文案',
    // msg: ',**我是加粗文本,**我不应该加粗"**我应该加粗;**',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },
  {
    type: 'text',
    msg: '我是文案',
  },

  {
    type: 'suggestion',
    content:
      '  \n**是不是想提问：**  \n- [技术理想国项目的叙事设计特点是什么](#prompt:技术理想国项目的叙事设计特点是什么)  \n- [资本媾和地项目的技术应用有哪些](#prompt:资本媾和地项目的技术应用有哪些)  \n- [如影中还有哪些项目结合了技术创新](#prompt:如影中还有哪些项目结合了技术创新)  \n- [突破性叙事设计对项目的影响如何](#prompt:突破性叙事设计对项目的影响如何)  \n',
  },
];

export { chunks };
