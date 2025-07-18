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

/** 为markdown渲染的dom添加part属性 */
export function mdPartAttrPlugin(md) {
  // 保存原始的渲染函数
  const originalRenderToken = md.renderer.renderToken.bind(md.renderer);

  const prefix = 'md_';
  // 重写 renderToken
  md.renderer.renderToken = function (tokens, idx, options) {
    const token = tokens[idx];

    // 只给有标签的 token 加属性（如 paragraph_open、em_open、strong_open 等）
    if (token.nesting === 1 || token.nesting === 0) {
      // 避免重复添加
      if (!token.attrs) token.attrs = [];

      let partValue = token.type;
      // 针对 heading_open，使用 h1/h2/h3... 作为 part
      if (token.type === 'heading_open') {
        partValue = token.tag; // 'h1', 'h2', ...
      }

      // 添加 part 属性，值为 token.type
      token.attrs.push(['part', `${prefix}${partValue.replace(/_open$/, '')}`]);
    }

    // 调用原始的渲染函数
    return originalRenderToken(tokens, idx, options);
  };

  // 2. 覆盖 code_inline
  md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
    // 用 self.renderToken 生成 <code>，再加属性
    const token = tokens[idx];
    token.attrs = token.attrs || [];
    token.attrs.push(['part', `${prefix}code_inline`]);
    return `${self.renderToken(tokens, idx, options) + md.utils.escapeHtml(token.content)}</code>`;
  };

  // 3. 覆盖 code_block
  const origCodeBlock =
    md.renderer.rules.code_block ||
    function (tokens, idx, options, env, self) {
      return `${self.renderToken(tokens, idx, options) + md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`;
    };
  md.renderer.rules.code_block = function (tokens, idx, options, env, self) {
    // 先用原始渲染器生成 HTML
    let html = origCodeBlock(tokens, idx, options, env, self);
    // 给 <pre> 和 <code> 加 part 属性
    html = html.replace('<pre', `<pre part="${prefix}pre_block"`);
    html = html.replace('<code', `<code part="${prefix}code_block"`);
    return html;
  };

  // 4. 覆盖 fence
  const origFence =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return `${self.renderToken(tokens, idx, options) + md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`;
    };
  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    // 先用原始渲染器生成 HTML（会自动用 highlight 处理）
    let html = origFence(tokens, idx, options, env, self);
    // 给 <pre> 和 <code> 加 part 属性
    html = html.replace('<pre', `<pre part="${prefix}fence"`);
    html = html.replace('<code', `<code part="${prefix}code"`);
    return html;
  };
}
