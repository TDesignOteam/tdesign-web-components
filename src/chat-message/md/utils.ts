import markdownIt from 'markdown-it';

export function markdownToTextWithParser(markdown) {
  // 初始化 markdown-it 解析器（禁用 HTML 标签解析）
  const md = markdownIt({ html: false, linkify: false });

  // 解析 Markdown 生成 Token 流
  const tokens = md.parse(markdown, {});

  // 提取纯文本
  let text = '';
  for (const token of tokens) {
    // 跳过非文本类 Token（如代码块、HTML 标签）
    if (token.type === 'inline' && token.children) {
      // 递归处理子 Token（如粗体、链接内部的文本）
      text += token.children
        .filter((t) => t.type === 'text' || t.type === 'code_inline')
        .map((t) => t.content)
        .join('');
    } else if (token.type === 'text' || token.type === 'code_block') {
      // 直接处理纯文本或代码块
      text += token.content;
    }

    // 添加段落换行
    if (token.type === 'paragraph_close') {
      text += '\n';
    }
  }

  // 清理多余换行和空格
  return text.replace(/\n{2,}/g, '\n').trim();
}
